import React, { useState } from 'react'
import { useUser } from '../../context/UserContext' // Adjust the path as per your project structure

const EmpDashboard = () => {
  const { user } = useUser() // Assuming you have a function named useUser in your UserContext

  const [formData, setFormData] = useState({
    user_id: user ? user.id : '', // Populate user.id in user_id
    amount: 0,
    budget_name: '', // Added the budget_name field
    description: '', // Added the description field
  })

  const handleInputChange = (e) => {
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch('http://localhost:3005/budget-proposals/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })

      if (response.ok) {
        console.log('Budget proposal submitted successfully')
      } else {
        console.error('Failed to submit budget proposal')
      }
    } catch (error) {
      console.error('Error submitting budget proposal:', error)
    }
  }

  return (
    <>
      <div className="card container-sm" style={{ width: '50%', padding: '20px' }}>
        <form onSubmit={handleSubmit}>
          <h3 className="text-center m-2">Propose a budget</h3>
          <div className="mb-3">
            <label className="form-label">Budget Name</label>
            <input
              type="text"
              className="form-control"
              id="budget_name"
              value={formData.budget_name}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Amount</label>
            <input
              type="number"
              className="form-control"
              id="amount"
              value={formData.amount}
              onChange={handleInputChange}
            />
          </div>
          <div className="mb-3">
            <label className="form-label">Description</label>
            <textarea
              className="form-control"
              id="description"
              value={formData.description}
              onChange={handleInputChange}
            />
          </div>

          <button type="submit" className="btn btn-primary">
            Submit
          </button>
        </form>
      </div>
    </>
  )
}

export default EmpDashboard
