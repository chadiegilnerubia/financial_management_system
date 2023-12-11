import React, { useState } from 'react'
import { CAlert } from '@coreui/react'

const useAlert = () => {
  const [isVisible, setIsVisible] = useState(false)
  const [message, setMessage] = useState('')

  const showAlert = (msg) => {
    setMessage(msg)
    setIsVisible(true)

    setTimeout(() => {
      hideAlert()
    }, 3000)
  }

  const hideAlert = () => {
    setIsVisible(false)
    setMessage('')
  }

  const AlertComponent = ({ message }) => (
    <CAlert color="success" onClose={hideAlert}>
      {message}
    </CAlert>
  )

  return { isVisible, showAlert, hideAlert, AlertComponent }
}

export default useAlert
