import {useState, useEffect} from 'react'
import {NavLink, useLocation, useHistory} from 'react-router-dom'
import styled from 'styled-components/macro'
import {Trans} from '@lingui/macro'
import {Image} from 'rebass'
import {useDarkModeManager} from '../../state/user/hooks'
import {FlexRow} from '../Container/Container'
import {enableLock, disableLock} from '../../utils/scrollLock'
import {TEXT} from '../../theme/theme'
import More from '../More/More'
import Burger from '../Hamburger/Hamburger'
import SlideMenu from '../SlideMenu/SlideMenu'
import Web3Status from '../Web3Status/Web3Status'
import OverlayLogo from '../../assets/images/overlay-logo.png'
import LightOverlayLogo from '../../assets/images/overlay-logo-light.png'
import UpdatedOverlayLogo from '../../assets/images/updated-overlay-icon.png'
import OverlayLogoDark from '../../assets/images/overlay-logo-dark.png'
import OverlayLogoOnlyDark from '../../assets/images/overlay-logo-only-no-background.png'

export const HeaderContainer = styled.div`
  color: ${({theme}) => theme.text1};
  display: flex;
  flex-direction: row;
  width: auto;
  max-width: 1200px;
  margin: auto;
  padding: 24px 16px 24px;
  position: sticky;
  z-index: 420;

  ${({theme}) => theme.mediaWidth.minSmall`
    width: auto;
    padding: 24px 16px;
  `};
`

export const LogoContainer = styled.div`
  height: 30px;
  width: 30px;
  margin: auto 16px auto 0px;
`

export const AccountContainer = styled(FlexRow)`
  width: auto;
  margin-left: auto;
`

const activeClassName = 'ACTIVE'

export const StyledLink = styled(NavLink).attrs({
  activeClassName,
})`
  color: ${({theme}) => theme.text1};
  font-size: 14px;
  font-weight: 700;
  text-decoration: none;
  margin: auto 16px;
  display: none;

  &.${activeClassName} {
    color: ${({theme}) => theme.text4};
  }

  ${({theme}) => theme.mediaWidth.minSmall`
    display: flex;
  `};
`

export default function Header() {
  const [darkMode] = useDarkModeManager()
  const [open, setOpen] = useState(false)
  const history = useHistory()
  const menuId = 'main-menu'

  let location = useLocation().pathname

  // close menu when at new route
  useEffect(() => {
    if (open) {
      setOpen(open => false)
    }
  }, [location])

  // disable scroll when mobile menu open
  useEffect(() => {
    if (open) {
      enableLock()
    } else {
      disableLock()
    }
  }, [open])

  const returnHome = () => {
    history.push(`/markets`)
  }

  return (
    <HeaderContainer>
      <LogoContainer onClick={returnHome}>
        {darkMode ? (
          <Image src={OverlayLogoOnlyDark} alt={'Overlay Logo Light'} height={'100%'} width={'100%'} minHeight={'30px'} minWidth={'30px'} />
        ) : (
          <Image src={OverlayLogoOnlyDark} alt={'Overlay Logo'} height={'100%'} width={'100%'} minHeight={'30px'} minWidth={'30px'} />
        )}
      </LogoContainer>

      <StyledLink to={'/markets'}>
        <Trans>
          <TEXT.BoldSmallBody>Markets</TEXT.BoldSmallBody>
        </Trans>
      </StyledLink>

      <StyledLink to={'/positions'}>
        <Trans>
          <TEXT.BoldSmallBody>Positions</TEXT.BoldSmallBody>
        </Trans>
      </StyledLink>

      <StyledLink to={'/bridge'}>
        <Trans>
          <TEXT.BoldSmallBody>Bridge</TEXT.BoldSmallBody>
        </Trans>
      </StyledLink>

      {/* <StyledLink to={'/claimpage'}>
        <Trans>
          <TEXT.BoldSmallBody>Claim</TEXT.BoldSmallBody>
        </Trans>
      </StyledLink> */}

      <AccountContainer>
        <Web3Status />
        <More />
        <Burger open={open} setOpen={setOpen} aria-controls={menuId} />
      </AccountContainer>

      <SlideMenu open={open} setOpen={setOpen} />
    </HeaderContainer>
  )
}
