import React, { useState } from 'react'
import { CAlert } from '@coreui/react'

const useFormValidation = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')
  const [type, setType] = useState('danger') // Default type is 'success'

  const showAlert = (msg, alertType = 'danger') => {
    setMessage(msg)
    setType(alertType)
    setIsVisible(true)

    setTimeout(() => {
      hideAlert()
    }, 3000)
  }

  const hideAlert = () => {
    setIsVisible(false)
    setMessage('')
    setType('success') // Reset type to 'success' when hiding the alert
  }

  const AlertComponent = ({ message }) => (
    <CAlert color={type} fade onClose={hideAlert}>
      {message}
    </CAlert>
  )

  return { isVisible, showAlert, hideAlert, AlertComponent }
}

export default useFormValidation
