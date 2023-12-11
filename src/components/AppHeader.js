import React from 'react'
import { NavLink } from 'react-router-dom'
import { useSelector, useDispatch } from 'react-redux'
import {
  CContainer,
  CHeader,
  CHeaderBrand,
  CHeaderDivider,
  CHeaderNav,
  CHeaderToggler,
  CNavLink,
  CNavItem,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilBell, cilEnvelopeOpen, cilList, cilMenu } from '@coreui/icons'
import { AppHeaderDropdown } from './header/index'
import { logo } from 'src/assets/brand/logo'
import { useUser } from 'src/context/UserContext'
const AppHeader = () => {
  const dispatch = useDispatch()
  const sidebarShow = useSelector((state) => state.sidebarShow)
  const { user, budgetPosts } = useUser()
  return (
    <CHeader position="sticky" className="mb-4">
      <CContainer fluid>
        <CHeaderToggler
          className="ps-1"
          onClick={() => dispatch({ type: 'set', sidebarShow: !sidebarShow })}
        >
          <CIcon icon={cilMenu} size="lg" />
        </CHeaderToggler>
        <CHeaderBrand className="mx-auto d-md-none" to="/">
          <CIcon icon={logo} height={48} alt="Logo" />
        </CHeaderBrand>
        <CHeaderNav className="d-none d-md-flex me-auto">
          <CNavItem>
            {user && user.role === 'manager' ? (
              <CNavLink to="/dashboard" component={NavLink}>
                Dashboard
              </CNavLink>
            ) : (
              <CNavLink to="/dashboard-employee" component={NavLink}>
                Dashboard
              </CNavLink>
            )}
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav>
          <CNavItem>
            {/* <CIcon icon={cilBell} size="lg" /> New Post: {budgetPosts.length} */}
            <CIcon icon={cilBell} size="lg" />
            <span
              style={{
                marginTop: '7.5px',
                color: 'red',
                borderRadius: '50%',
                width: '20px',
                height: '20px',
                display: 'inline-block',
              }}
            >
              {budgetPosts.length}
            </span>
          </CNavItem>
          <CNavItem>
            <CNavLink>
              <CIcon icon={cilEnvelopeOpen} size="lg" />
            </CNavLink>
          </CNavItem>
        </CHeaderNav>
        <CHeaderNav className="ms-3">
          <AppHeaderDropdown />
        </CHeaderNav>
      </CContainer>
      <CHeaderDivider />
    </CHeader>
  )
}

export default AppHeader
