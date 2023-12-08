import React, { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
  }, [])

  const login = (userData) => {
    console.log('Login called with user data:', userData)
    setUser(userData)

    // Save user data to localStorage
    localStorage.setItem('user', JSON.stringify(userData))
  }

  const logout = () => {
    console.log('Logout called')
    setUser(null)

    // Remove user data from localStorage on logout
    localStorage.removeItem('user')
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
