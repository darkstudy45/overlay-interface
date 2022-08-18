import {useState, useEffect} from 'react'
import styled from 'styled-components'
import {useCookies} from 'react-cookie'
import {useModalOpen, useTermsOfServiceModalToggle} from '../../state/application/hooks'
import {ApplicationModal} from '../../state/application/actions'
import {SolidColorButton} from '../Button/Button'
import {TEXT} from '../../theme/theme'
import {FlexRow} from '../Container/Container'
import {useTermsOfServiceStatusManager} from '../../state/application/hooks'
import {UserTermsOfServiceStatus} from '../../state/application/actions'
import Modal from '../Modal/Modal'

const ModalContent = styled.div`
  display: flex;
  flex-direction: column;
  padding: 16px;
  width: 100%;
  background: #0b0f1c;
`

// @TO-DO: Combine UserAcceptButton and UserDeclineButton
const UserAcceptButton = styled(SolidColorButton)`
  width: 150px;
  padding: 4px;
  color: #12b4ff;
  font-size: 14px;
  margin-right: 8px;
  background: transparent;
  border: 2px solid #12b4ff;

  :hover {
    box-shadow: 0 0px 5px #12b4ff;
    text-decoration: underline;
  }
`

const UserDeclineButton = styled(SolidColorButton)`
  width: 150px;
  padding: 4px;
  color: #d0d0d2;
  font-size: 14px;
  background: transparent;
  border: 1px solid #d0d0d2;

  :hover {
    box-shadow: 0 0px 5px #d0d0d2;
    text-decoration: underline;
  }
`

export default function TermsOfServiceModal() {
  const [userAgreementStatus, setUserAgreementStatus] = useTermsOfServiceStatusManager()

  // const [userHasAccepted, setUserHasAccepted] = useState<boolean | null>(null)
  const [cookies, setCookie] = useCookies(['userHasAcceptedServiceAgreement'])
  const termsOfServiceModalOpen = useModalOpen(ApplicationModal.TERMS_OF_SERVICE)
  const toggleTermsOfServiceModal = useTermsOfServiceModalToggle()

  useEffect(() => {
    const {userHasAcceptedServiceAgreement} = cookies

    console.log(userHasAcceptedServiceAgreement)
    if (!userHasAcceptedServiceAgreement && !termsOfServiceModalOpen) {
      toggleTermsOfServiceModal()
    }
    if (userHasAcceptedServiceAgreement) {
      setUserAgreementStatus(UserTermsOfServiceStatus.ACCEPTED)
    }
  }, [
    cookies,
    userAgreementStatus,
    setUserAgreementStatus,
    termsOfServiceModalOpen,
    toggleTermsOfServiceModal,
  ])
  // maxAge in seconds
  // 1 mo = 2628000 seconds
  function acceptTermsOfService() {
    setCookie('userHasAcceptedServiceAgreement', 'true', {path: '/', maxAge: 7884000})
  }

  function declineTermsOfService() {
    setUserAgreementStatus(UserTermsOfServiceStatus.REJECTED)
  }

  return (
    <Modal
      isOpen={termsOfServiceModalOpen}
      onDismiss={toggleTermsOfServiceModal}
      minHeight={false}
      maxHeight={90}
    >
      <ModalContent>
        <TEXT.BoldSmallBody lineHeight={1.5} m={'auto'}>
          Please carefully read through the Terms of Service Agreement. By clicking "Accept", the
          user is acknowledging to abide by the Terms of Service.
        </TEXT.BoldSmallBody>
        <FlexRow m={'16px auto 8px'}>
          <UserAcceptButton onClick={acceptTermsOfService}>Accept</UserAcceptButton>
          <UserDeclineButton onClick={declineTermsOfService}>Decline</UserDeclineButton>
        </FlexRow>
      </ModalContent>
    </Modal>
  )
}
