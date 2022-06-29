import { useMemo } from "react";
import styled from "styled-components/macro";
import Loader from "react-loader-spinner";
import { utils, BigNumber } from "ethers";
import { Button } from "rebass";
import { useActiveWeb3React } from "../../hooks/web3";
import { MarketCard } from "../../components/Card/MarketCard";
import { useAccountPositions } from "../../state/positions/hooks";
import { useUnwindActionHandlers } from "../../state/unwind/hooks";
import { PositionCard, PositionTableHeader } from "./PositionCard";
import { useWalletModalToggle } from "../../state/application/hooks";
import { shortenAddress } from "../../utils/web3";
import { formatWeiToParsedString, formatWeiToParsedNumber } from "../../utils/formatWei";
import { useSingleContractMultipleData } from "../../state/multicall/hooks";
import { useV1PeripheryContract } from "../../hooks/useContract";
import { useBlockNumber } from "../../state/application/hooks";
import { useMarketNames } from "../../hooks/useMarketName";
import { usePositionValues } from "../../hooks/usePositionValue";
import { usePositionCosts } from "../../hooks/usePositionCost";

const Container = styled.div`
  display: flex;
  flex-direction: column;
  max-width: 350px;
  margin: 0 auto 32px;
  position: static;
  z-index: 0;
`;

const PageHeader = styled.div`
  font-size: 20px;
  text-align: center;
  margin-bottom: 48px;
  font-weight: 700;
  color: white;
  padding-top: 16px;

  ${({theme}) => theme.mediaWidth.minSmall`
    padding-top: 0px;
  `}
`;

const PositionsContainer = styled.div`
  display: flex;
  flex-direction: column;
`;

const LoadingContainer = styled.div`
  display: flex;
  margin: 8px auto auto auto;

  ${({theme}) => theme.mediaWidth.minSmall`
    margin-top: 44px;
  `}
`;

const ConnectWalletToggleText = styled(Button)`
  cursor: pointer;
  font-weight: 700;
  background: none;
  border: 1px solid #12B4FF !important;
  border-radius: 8px !important;
  padding: 16px 60px !important;
  color: white;
  margin-top: 16px !important;

  :hover {
    color: #12B4FF;
    box-shadow: 0 0px 5px #12B4FF;
  }
`;

export const Positions = () => {
  const toggleWalletModal = useWalletModalToggle();
  const blockNumber = useBlockNumber();
  const { onResetUnwindState } = useUnwindActionHandlers();
  const { account } = useActiveWeb3React();
  const { isLoading, positions } = useAccountPositions(account ? account : undefined);
  
  const feedAddresses = useMemo(() => {
    if (positions === undefined) return [];

    return positions.map((position) => position.market.feedAddress)
  }, [positions]);

  const { baseTokens, quoteTokens } = useMarketNames(feedAddresses);

  const positionsCallData = useMemo(() => {
    if (!positions || positions === undefined || !account || !blockNumber) return [];

    return positions.map((position) => [position.market.id, account, position.positionId])
  }, [positions, account, blockNumber])

  const peripheryContract = useV1PeripheryContract();

  const values = usePositionValues(positionsCallData);
  const costs = usePositionCosts(positionsCallData);

  const fetchLiquidationPrices = useSingleContractMultipleData(peripheryContract, 'liquidationPrice', positionsCallData);
  const fetchPositionOis = useSingleContractMultipleData(peripheryContract, "oi", positionsCallData);

  const liquidationPrices = useMemo(() => {
    return fetchLiquidationPrices.map((position, index) => {
      if (position.loading === true || position === undefined || blockNumber === undefined) return undefined;

      return position?.result?.liquidationPrice_;
    })
  }, [fetchLiquidationPrices, blockNumber]);


    const positionOis = useMemo(() => {
    return fetchPositionOis.map((position, index) => {
      if (position.loading === true || position === undefined || blockNumber === undefined) return undefined;

      return position?.result?.oi_;
    })
  }, [fetchPositionOis, blockNumber]);

  return (
    <MarketCard>
      {onResetUnwindState()}
      <Container>
        <PageHeader> Positions </PageHeader>
        
        {account ? (
          <>
            <PositionTableHeader />
            <PositionsContainer>
              {isLoading ? (
                <LoadingContainer>
                  <Loader
                    type="TailSpin"
                    color="#f2f2f2"
                    height={33}
                    width={33}
                  />
                </LoadingContainer>
              ):(
                positions?.map((index, key) => {
                  let position = index;
                  return (
                    <PositionCard
                      key={key.toString()}
                      id={position.id}
                      positionId={position.positionId}
                      marketId={position.market.id}
                      baseToken={`${baseTokens[key]}`}
                      quoteToken={`${quoteTokens[key]}`}
                      isLong={position.isLong}
                      leverage={position.leverage}
                      positionValue={values[key] !== undefined ? values[key] : null}
                      positionCost={costs[key] !== undefined ? costs[key] : null}
                      positionOi={positionOis !== undefined ? formatWeiToParsedNumber(positionOis[key], 18 , 5) : null}
                      collateralToken={"OVL"}
                      quotePrice={"-"}
                      quoteCurrency={"-"}
                      estLiquidationPrice={liquidationPrices !== undefined ? formatWeiToParsedString(liquidationPrices[key], 2) : 'loading...'}
                      navigate={true}
                      hasBorder={true}
                    />
                  )})
              )}
            </PositionsContainer>
          </>
        ):(
          <LoadingContainer>
            <ConnectWalletToggleText onClick={toggleWalletModal}>
              Connect to a wallet
            </ConnectWalletToggleText>
          </LoadingContainer>
        )}
      </Container>
    </MarketCard>
  );
};

export default Positions;
