import React, { useState } from 'react'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CFormSelect,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import { useUser } from 'src/context/UserContext'

const Register = () => {
  const [username, setUsername] = useState('')
  const [user_type, setUser_type] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [repeatPassword, setRepeatPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useUser()
  const handleRegister = async () => {
    try {
      console.log(email + '-' + username + '-' + password + '-' + user_type)

      // Validate that all fields are non-empty
      if (!username || !email || !password || !repeatPassword || !user_type) {
        setError('Invalid input. All fields are required.')
        return
      }

      // Validate that the password and repeatPassword match
      if (password !== repeatPassword) {
        setError('Passwords do not match')
        return
      }

      const response = await axios.post('http://localhost:3005/auth/register', {
        username,
        email,
        password,
        user_type,
      })

      if (response.data.user) {
        login(response.data.user)

        const userType = response.data.user.user_type

        if (userType === 'manager') {
          navigate('/dashboard')
        } else if (userType === 'employee') {
          navigate('/dashboard-employee')
        } else {
          // Handle other user types or navigate to a default route
          console.warn('Unknown user type:', userType)
          navigate('/dashboard') // Change this to your default route
        }

        console.log('Registration successful!')
        // Optionally, you can redirect the user to the login page or any other page
      } else {
        console.error('Registration failed.')
        console.log(response.data)
        setError('Registration failed. Please check your input.')
      }
    } catch (error) {
      console.error('An error occurred during registration:', error.message)
      setError('An error occurred during registration. Please try again later.')
    }
  }

  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={9} lg={7} xl={6}>
            <CCard className="mx-4">
              <CCardBody className="p-4">
                <CForm>
                  <h1>Register</h1>
                  <p className="text-medium-emphasis">Create your account</p>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormInput
                      placeholder="Username"
                      autoComplete="username"
                      value={username}
                      onChange={(e) => setUsername(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>@</CInputGroupText>
                    <CFormInput
                      placeholder="Email"
                      autoComplete="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilUser} />
                    </CInputGroupText>
                    <CFormSelect
                      custom
                      value={user_type}
                      onChange={(e) => setUser_type(e.target.value)}
                    >
                      <option value="">Select user type</option>
                      <option value="manager">Manager</option>
                      <option value="employee">Employee</option>
                    </CFormSelect>
                  </CInputGroup>
                  <CInputGroup className="mb-3">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Password"
                      autoComplete="new-password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </CInputGroup>
                  <CInputGroup className="mb-4">
                    <CInputGroupText>
                      <CIcon icon={cilLockLocked} />
                    </CInputGroupText>
                    <CFormInput
                      type="password"
                      placeholder="Repeat password"
                      autoComplete="new-password"
                      value={repeatPassword}
                      onChange={(e) => setRepeatPassword(e.target.value)}
                    />
                  </CInputGroup>
                  {error && <div className="text-danger mb-3">{error}</div>}
                  <div className="d-grid">
                    <CButton color="success" onClick={handleRegister}>
                      Create Account
                    </CButton>
                  </div>
                </CForm>
              </CCardBody>
            </CCard>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Register
