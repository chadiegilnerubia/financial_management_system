import React, { createContext, useContext, useState, useEffect } from 'react'
import PropTypes from 'prop-types'

const UserContext = createContext(null)

export const UserProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [budgetPosts, setBudgetPosts] = useState([])

  // Load user data from localStorage on component mount
  useEffect(() => {
    const storedUser = localStorage.getItem('user')
    const storedBudgetPosts = localStorage.getItem('budgetPosts')

    if (storedUser) {
      setUser(JSON.parse(storedUser))
    }
    if (storedBudgetPosts) {
      setBudgetPosts(JSON.parse(storedBudgetPosts))
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
  const addBudgetPost = (newBudgetPost) => {
    console.log('Adding new budget post:', newBudgetPost)
    const updatedBudgetPosts = [...budgetPosts, newBudgetPost]

    // Update state
    setBudgetPosts(updatedBudgetPosts)

    // Save updated budgetPosts to localStorage
    localStorage.setItem('budgetPosts', JSON.stringify(updatedBudgetPosts))
  }

  // Handle new budget post from WebSocket
  const handleNewBudgetPost = (newPost) => {
    console.log('Adding new budget post:', newPost)
    const updatedBudgetPosts = [...budgetPosts, newPost]

    // Update state
    setBudgetPosts(updatedBudgetPosts)

    // Save updated budgetPosts to localStorage
    localStorage.setItem('budgetPosts', JSON.stringify(updatedBudgetPosts))
  }
  return (
    <UserContext.Provider
      value={{ user, login, logout, budgetPosts, addBudgetPost, handleNewBudgetPost }}
    >
      {children}
    </UserContext.Provider>
  )
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
