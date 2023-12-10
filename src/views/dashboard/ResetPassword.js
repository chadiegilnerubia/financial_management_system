import React, { useState } from 'react'
import { useUser } from 'src/context/UserContext'
import { useNavigate } from 'react-router-dom'
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
import useFormValidation from './useFormValidation'

const ResetPassword = () => {
  const [email, setEmail] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [error, setError] = useState('')
  const navigate = useNavigate()
  const { login } = useUser()
  const [errorReset, setErrorReset] = useState(false)

  const { isVisible, showAlert, hideAlert, AlertComponent } = useFormValidation()
  const handleResetPassword = async () => {
    try {
      const response = await axios.post('http://localhost:3005/users/reset-password', {
        email,
        newPassword,
        confirmPassword,
      })

      console.log('Response data:', response.data)

      if (response.status) {
        login(response.data.user)
        setErrorReset(false)
        console.log(errorReset)
        navigate('/login')
      } else {
        console.error('Reset password failed.')
        setErrorReset(true)
        console.log(errorReset)
        showAlert('Budget proposal submitted successfully!')
        setTimeout(() => {
          setErrorReset(false)
        }, 3000)
        setError('Reset password failed. Please check your credentials.')
      }
    } catch (error) {
      console.error('An error occurred during password reset:', error.message)
      setErrorReset(true)
      setTimeout(() => {
        setErrorReset(false)
      }, 3000)
      setError('An error occurred during password reset. Please try again later.')
    }
  }

  const handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      handleResetPassword()
    }
  }

  console.log(errorReset)
  return (
    <div className="bg-light min-vh-70 d-flex flex-row align-items-center justify-content-center">
      <CContainer>
        <CRow className="justify-content-center">
          <CCol md={5}>
            {errorReset && <AlertComponent message="Make sure the inputs are correct." />}
            <CCardGroup>
              <CCard className="p-4 mx-auto">
                <CCardBody>
                  <CForm onKeyPress={handleKeyPress}>
                    <h1>Reset Password</h1>
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
                        placeholder="New password"
                        autoComplete="new-password"
                        value={newPassword}
                        onChange={(e) => setNewPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CInputGroup className="mb-4">
                      <CInputGroupText>
                        <CIcon icon={cilLockLocked} />
                      </CInputGroupText>
                      <CFormInput
                        type="password"
                        placeholder="Confirm password"
                        autoComplete="new-password"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                      />
                    </CInputGroup>
                    <CRow>
                      <CCol xs={6}>
                        <CButton color="primary" className="px-4" onClick={handleResetPassword}>
                          Reset
                        </CButton>
                      </CCol>
                      <CCol xs={6} className="text-right">
                        <CButton color="link" className="px-0">
                          Forgot password?
                        </CButton>
                      </CCol>
                    </CRow>
                  </CForm>
                </CCardBody>
              </CCard>
            </CCardGroup>
          </CCol>
        </CRow>
      </CContainer>
    </div>
  )
}

export default ResetPassword
