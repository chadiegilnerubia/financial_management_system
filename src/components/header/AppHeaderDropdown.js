import React from 'react'
import { useUser } from '../../context/UserContext'
import {
  CAvatar,
  CDropdown,
  CDropdownDivider,
  CDropdownHeader,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
} from '@coreui/react'
import { cilSettings, cilUser } from '@coreui/icons'
import CIcon from '@coreui/icons-react'
import avatar8 from './../../assets/images/avatars/8.jpg'
import { Link, useNavigate } from 'react-router-dom'

const AppHeaderDropdown = () => {
  const navigate = useNavigate()
  const { user, logout } = useUser()
  console.log(user)
  const handleLogout = () => {
    logout()
    navigate('#/login')
  }
  return (
    <CDropdown variant="nav-item">
      <CDropdownToggle placement="bottom-end" className="py-0" caret={false}>
        <CAvatar src={avatar8} size="md" />
      </CDropdownToggle>
      <CDropdownMenu className="pt-0" placement="bottom-end">
        <CDropdownHeader className="bg-light fw-semibold py-2">
          {user != null ? user.username : 'No user'}
        </CDropdownHeader>
        <CDropdownItem>
          {user !== null && <CDropdownItem>Role: {user.role}</CDropdownItem>}
        </CDropdownItem>
        <CDropdownItem>
          <CIcon icon={cilUser} className="me-2" />
          Profile
        </CDropdownItem>
        <CDropdownItem href="#/reset-password" onClick={() => navigate(`/reset-password`)}>
          <CIcon icon={cilSettings} className="me-2" />
          Reset Password
        </CDropdownItem>
        {user !== null ? (
          <CDropdownItem href="#/logout" onClick={handleLogout}>
            <CIcon icon={cilUser} className="me-2" />
            Logout
          </CDropdownItem>
        ) : (
          <CDropdownItem href="#/login">
            <CIcon icon={cilUser} className="me-2" />
            Login
          </CDropdownItem>
        )}
        <CDropdownDivider />
      </CDropdownMenu>
    </CDropdown>
  )
}

export default AppHeaderDropdown
