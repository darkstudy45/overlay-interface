import React from 'react'
import styled from 'styled-components/macro'
import {NavLink} from 'react-router-dom'
import {TableBody, TableContainer, TableHead, Paper} from '@material-ui/core'
import {Trans} from '@lingui/macro'
import {useTotalMarketsData} from '../../state/markets/hooks'
import {PageContainer} from '../../components/Container/Container'
import {FlexRow} from '../../components/Container/Container'
import {StyledTable, StyledHeaderCell, StyledTableHeaderRow} from '../../components/Table/Table'
import Loader from '../../components/Loaders/Loaders'
import {useMarketDetails, AdditionalMarketData} from '../../hooks/useMarketDetails'
import {useCurrentMarketState, MarketStateResults, ParsedMarketStateDetails} from '../../hooks/useCurrentMarketState'
import {InfoTip} from '../../components/InfoTip/InfoTip'
import MarketsRow from './MarketsRow'

const activeClassName = 'INACTIVE'

export const StyledNavLink = styled(NavLink).attrs({activeClassName})`
  color: ${({theme}) => theme.text1};
  font-weight: 500;
  text-decoration: none;

  :hover {
    font-weight: 700;
  }
  :focus {
    font-weight: 700;
  }
`

const infoTipDescriptions = {
  openInterest: (
    <React.Fragment>
      <div>Open Interest (OI) refers to </div>
      <div>the total available outstanding</div>
      <div>positions that have not been settled,</div>
      <div>per market, denoted in OVL.</div>
      <br />
      <div>Shows the current percent (%)</div>
      <div>balance between shorts (red)</div>
      <div>and longs (green).</div>
    </React.Fragment>
  ),
  fundingRate: (
    <React.Fragment>
      <div>Funding Rate per Market</div>
      <br />
      <div>24 hour funding rate.</div>
      <div>Positive funding rates suggests</div>
      <div>users are bullish and long positions</div>
      <div>pay funding to short positions. </div>
      <br />
      <div>Negative funding rates suggest</div>
      <div>users are bearish and short positions</div>
      <div>pay funding to long positions.</div>
    </React.Fragment>
  ),
}

const Markets = () => {
  const {markets, isLoading, refetch} = useTotalMarketsData()
  const marketDetails: AdditionalMarketData[] = useMarketDetails(markets)
  const {loading, error, markets: marketsData}: MarketStateResults = useCurrentMarketState(marketDetails)
  return (
    <PageContainer>
      <TableContainer component={Paper}>
        <StyledTable>
          <TableHead>
            <StyledTableHeaderRow>
              <StyledHeaderCell>
                <Trans> # </Trans>
              </StyledHeaderCell>
              <StyledHeaderCell>
                <Trans> Market </Trans>
              </StyledHeaderCell>
              <StyledHeaderCell>
                <Trans> Price </Trans>
              </StyledHeaderCell>
              <StyledHeaderCell>
                <Trans> 7d </Trans>
              </StyledHeaderCell>
              <StyledHeaderCell align="right">
                <Trans> Funding Rate </Trans>
                <InfoTip children={infoTipDescriptions.fundingRate} tipFor="Market Funding Rate" />
              </StyledHeaderCell>
              <StyledHeaderCell>
                <Trans> OI Balance </Trans>
                <InfoTip children={infoTipDescriptions.openInterest} tipFor="Market Open Interest" />
              </StyledHeaderCell>
              <StyledHeaderCell>
                <Trans> Oracle </Trans>
              </StyledHeaderCell>
            </StyledTableHeaderRow>
          </TableHead>
          <TableBody>
            {marketsData.length > 0 &&
              marketsData
                ?.filter(market => market.marketAddress !== '0x909d893d5e7f250659fa56c2ca2920760eebb17f')
                .map((market: ParsedMarketStateDetails, index: number) => (
                  <MarketsRow
                    marketId={market.marketAddress}
                    marketName={market.marketName}
                    midPrice={market.parsedMid}
                    oiLong={market.parsedOiLong}
                    oiShort={market.parsedOiShort}
                    capOi={market.parsedCapOi}
                    dailyFundingRate={market.parsedDailyFundingRate}
                    annualFundingRate={market.parsedAnnualFundingRate}
                  />
                ))}
          </TableBody>
        </StyledTable>
      </TableContainer>
      {marketsData.length === 0 && (
        <FlexRow marginTop="32px" justifyContent="center !important" width="100%">
          <Loader stroke="white" size="21px" />
        </FlexRow>
      )}
    </PageContainer>
  )
}

export default Markets
