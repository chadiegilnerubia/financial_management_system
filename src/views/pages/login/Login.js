import React, { useState } from 'react'
import { useUser } from '../../../context/UserContext'
import { useNavigate, Link } from 'react-router-dom'
import axios from 'axios'
import {
  CButton,
  CCard,
  CCardBody,
  CCardGroup,
  CCol,
  CContainer,
  CForm,
  CFormInput,
  CInputGroup,
  CInputGroupText,
  CRow,
} from '@coreui/react'
import CIcon from '@coreui/icons-react'
import { cilLockLocked, cilUser } from '@coreui/icons'
import useFormValidation from 'src/views/dashboard/useFormValidation'

const Login = () => {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('') // Add this line
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useUser()
  const { isVisible, showAlert, hideAlert, AlertComponent } = useFormValidation()
  const [errorReset, setErrorReset] = useState(false)

  const handleLogin = async () => {
    try {
      const response = await axios.post('http://localhost:3005/users/login', {
        email,
        password,
      })

      console.log('Response data:', response.data)
      setErrorReset(false)
      if (response.data.user) {
        login(response.data.user)
        setErrorReset(false)
        const userType = response.data.user.role
        if (userType === 'manager') {
          navigate('/dashboard')
        } else if (userType === 'employee') {
          navigate('/dashboard-employee')
        } else {
          navigate('/dashboard') // Change this to your default route
        }
      } else {
        console.error('Login failed.')
        setError('Login failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('An error occurred during login:', error.message)
      setErrorReset(true)
      setError('An error occurred during login. Please try again later.')
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleLogin()
    }
  }
  return (
    <div className="bg-light min-vh-100 d-flex flex-row align-items-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={8}>
            {errorReset && (
              <AlertComponent message="Make sure to login your correct credentials." />
            )}
            <CCardGroup>
              <CCard className="p-4">
                <CCardBody>
                  <CForm onKeyPress={handleKeyPress}>
                    <h1>Login</h1>
                    <p className="text-medium-emphasis">Sign In to your account</p>
                    <CInputGroup className="mb-3">
                      <CInputGroupText>
                        <CIcon icon={cilUser} />
                      </CInputGroupText>
                      <CFormInput
                        placeholder="Email"
                        autoComplete="email"
                        value={email}
                        onChange={(e) => setEmail(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Password"
                        autoComplete="current-password"
                        value={password} // Add this line
                        onChange={(e) => setPassword(e.target.value)} // Add this line
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleLogin}>
                          Login
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
              <CCard className="text-white bg-primary py-5" style={{ width: '44%' }}>
                <CCardBody className="text-center">
                  <div>
                    <h2>Sign up</h2>
                    <p>
                      Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod
                      tempor incididunt ut labore et dolore magna aliqua.
                    </p>
                    <Link to="/register">
                      <CButton color="primary" className="mt-3" active tabIndex={-1}>
                        Register Now!
                      </CButton>
                    </Link>
                  </div>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default Login
