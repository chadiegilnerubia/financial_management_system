// UserContext.js
import React, { createContext, useContext, useState } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  const login = (userData) => {
    console.log('Login called with user data:', userData)
    setUser(userData)
  }

  const logout = () => {
    console.log('Logout called')
    setUser(null)
  }

  return <UserContext.Provider value={{ user, login, logout }}>{children}</UserContext.Provider>
}

UserProvider.propTypes = {
  children: PropTypes.node,
}

export const useUser = () => {
  const context = useContext(UserContext)
  if (!context) {
    throw new Error('useUser must be used within a UserProvider')
  }
  console.log('useUser context:', context)
  return context
}
