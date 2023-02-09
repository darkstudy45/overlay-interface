import {useState} from 'react'
import styled from 'styled-components'
import {TEXT} from '../../theme/theme'
import {useActiveWeb3React} from '../../hooks/web3'
import {FlexRow, FlexColumn} from '../../components/Container/Container'
import {shortenAddress} from '../../utils/web3'
import {ExternalLink} from '../../components/ExternalLink/ExternalLink'
import {TriggerActionButton} from '../../components/Button/Button'
import {useWalletModalToggle} from '../../state/application/hooks'
import {useUserClaimData, useClaimCallback} from '../../state/claim/hooks'
import {useUserHasSubmittedClaim} from '../../state/transactions/hooks'

const BridgeContainer = styled.div`
  display: flex;
  flex-direction: column;
  margin: auto;
  max-width: 400px;
  margin-top: 64px;
  color: white;
`

const ClaimModalContainer = styled.div`
  display: flex;
  flex-direction: column;
  background: #1b2131;
  border: 1px solid #71ceff;
  box-shadow: 0 0 12px #5b60a4;
  border-radius: 8px;
`

const ClaimModal = () => {
  const {account, chainId, error} = useActiveWeb3React()
  const toggleWalletModal = useWalletModalToggle()
  return (
    <ClaimModalContainer>
      <FlexColumn padding="16px" borderBottom="1px solid #71CEFF">
        <FlexRow marginBottom="8px">
          <TEXT.SmallBody marginRight="16px">Claim OVL</TEXT.SmallBody>
          <TEXT.SmallBody>{account ? shortenAddress(account) : 'Not connected'}</TEXT.SmallBody>
        </FlexRow>
        <TEXT.AdjustableSize fontSize="34px" marginRight="auto">
          {account ? '10 OVL' : '0 OVL'}
        </TEXT.AdjustableSize>
      </FlexColumn>
      <FlexColumn padding="16px">
        <TEXT.SmallBody>
          As a member of the Overlay community, you may claim OVL to be used for voting and
          governance, and to interact with the Overlay protocol.
        </TEXT.SmallBody>
        <ExternalLink
          href=""
          style={{
            color: '#71CEFF',
            textDecoration: 'underline',
            fontSize: '14px',
            margin: '16px auto 16px 0',
          }}
        >
          Read more about OVL
        </ExternalLink>
        {account ? (
          <TriggerActionButton isDisabled={true}>Claim OVL</TriggerActionButton>
        ) : (
          <TriggerActionButton onClick={toggleWalletModal} active={true}>
            Connect Wallet
          </TriggerActionButton>
        )}
      </FlexColumn>
    </ClaimModalContainer>
  )
}
const Claim = () => {
  const {account, chainId, error} = useActiveWeb3React()
  const userClaimData = useUserClaimData(account)

  // monitor the status of the claim from contracts and txns
  const {claimCallback} = useClaimCallback(account)

  // used for UI loading states
  const [attempting, setAttempting] = useState<boolean>(false)

  const {claimSubmitted, claimTxn} = useUserHasSubmittedClaim(account ?? undefined)
  const claimConfirmed = Boolean(claimTxn?.receipt)

  function onClaim() {
    setAttempting(true)
    claimCallback()
      // reset modal and log error
      .catch(error => {
        setAttempting(false)
        console.log(error)
      })
  }

  console.log('userClaimData: ', userClaimData)
  return (
    <BridgeContainer>
      <ClaimModal></ClaimModal>
    </BridgeContainer>
  )
}

export default Claim
