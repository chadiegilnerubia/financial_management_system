//EmpDashboard.js
import { useHistory } from 'react-router-dom'
import React, { useState, useEffect } from 'react'
import {
  CButton,
  CModal,
  CModalBody,
  CModalHeader,
  CModalTitle,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import { useUser } from '../../context/UserContext'
import EditBudgetModal from './EditBudgetModal'
import DeleteBudgetModal from './DeleteButtonModal'

const EmpDashboard = () => {
  const [empUsers, setEmpUsers] = useState([])
  const { user } = useUser()
  const [addBudget, setAddBudget] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(new Array(empUsers.length).fill(false))
  const [deleteBudget, setDeleteBudget] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState(null)
  const [budgetToEdit, setBudgetToEdit] = useState(null)
  const [formData, setFormData] = useState({
    budget_proposal_amount: 0,
    budget_proposal_name: '',
    budget_proposal_description: '',
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        setEmpUsers(userResponse.data)
        console.log(userResponse.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user])

  const formatTimestamp = (timestamp) => {
    const date = new Date(timestamp)
    return date.toLocaleDateString('en-US', {
      month: 'numeric',
      day: 'numeric',
      year: 'numeric',
      hour: 'numeric',
      minute: 'numeric',
      second: 'numeric',
      hour12: true,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()

    try {
      const response = await fetch(
        `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        },
      )
      if (response.ok) {
        console.log('Budget proposal submitted successfully')
        // Refetch data after successful submission
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        setEmpUsers(userResponse.data)
        // Clear input fields
        setFormData({
          budget_proposal_amount: 0,
          budget_proposal_name: '',
          budget_proposal_description: '',
        })
        // Close the modal
        setAddBudget(false)
      } else {
        console.error('Failed to submit budget proposal')
      }
    } catch (error) {
      console.error('Error submitting budget proposal:', error)
    }
  }
  const handleInputChange = (e) => {
    e.stopPropagation()
    const { id, value } = e.target
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }

  const handleEditModalClose = (index) => {
    setEditModalVisible((prev) => {
      const newState = [...prev]
      newState[index] = false
      return newState
    })
    setFormData({
      budget_proposal_amount: 0,
      budget_proposal_name: '',
      budget_proposal_description: '',
    })
  }

  const handleDelete = async () => {
    try {
      if (!budgetToDelete) {
        console.error('No budget selected for deletion')
        return
      }

      const { userId, budgetId } = budgetToDelete

      // Perform the delete action by making a DELETE request
      const response = await axios.delete(
        `http://localhost:3005/proposals/user/${userId}/budget-proposal/${budgetId}`,
      )
      console.log(response)
      if (response.status === 200) {
        console.log('Budget deleted successfully')

        // Refetch data after successful deletion
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        setEmpUsers(userResponse.data)

        // Close the modal after successful deletion
        setDeleteBudget(false)
      } else {
        console.error('Failed to delete budget')
      }
    } catch (error) {
      console.error('Error deleting budget:', error)
    }
  }

  const handleUpdate = async () => {
    try {
      const response = await axios.put(
        `http://localhost:3005/proposals/user/${user.id}/budget-proposal/${budgetToEdit}`,
        formData,
      )
      if (response.status === 200) {
        console.log('Budget updated successfully')
        // Refetch data after successful update
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        setEmpUsers(userResponse.data)
        setEditModalVisible(false)
      } else {
        console.error('Failed to update budget')
      }
    } catch (error) {
      console.error('Error updating budget:', error)
    }
  }
  const handleEditClick = (editedData, index) => {
    setEditModalVisible((prev) => {
      const newState = [...prev]
      newState[index] = true
      return newState
    })
    setFormData(editedData)
    setBudgetToEdit(editedData.id)
  }
  const handleDeleteClick = (budget) => {
    // Set the budget to be deleted and show the modal
    setBudgetToDelete(budget)
    setDeleteBudget(true)
  }

  return (
    <>
      <CButton className="mb-3" onClick={() => setAddBudget(!addBudget)}>
        Propose new Budgeta
      </CButton>
      <CModal
        visible={addBudget}
        onClose={() => setAddBudget(false)}
        aria-labelledby="LiveDemoExampleLabel"
      >
        <CModalHeader onClose={() => setAddBudget(false)}>
          <CModalTitle id="LiveDemoExampleLabel">Add New Budget</CModalTitle>
        </CModalHeader>
        <CModalBody>
          <div className="card container-sm" style={{ width: '100%', padding: '20px' }}>
            <form onSubmit={handleSubmit}>
              <h3 className="text-center m-2">Propose a budget</h3>
              <div className="mb-3">
                <label className="form-label">Budget Name</label>
                <input
                  type="text"
                  className="form-control"
                  id="budget_proposal_name"
                  value={formData.budget_proposal_name}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Amount</label>
                <input
                  type="number"
                  className="form-control"
                  id="budget_proposal_amount"
                  value={formData.budget_proposal_amount}
                  onChange={handleInputChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Description</label>
                <textarea
                  className="form-control"
                  id="budget_proposal_description"
                  value={formData.budget_proposal_description}
                  onChange={handleInputChange}
                />
              </div>

              <button type="submit" className="btn btn-primary">
                Submit
              </button>
            </form>
          </div>
        </CModalBody>
      </CModal>

      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">Status</CTableHeaderCell>
            <CTableHeaderCell scope="col">Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Amount</CTableHeaderCell>
            <CTableHeaderCell scope="col">Description</CTableHeaderCell>
            <CTableHeaderCell scope="col">Created At</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {empUsers.map((user, index) => (
            <CTableRow key={index}>
              <CTableDataCell>
                {user.budget_proposal_status === '' ? 'No status' : 'Pending'}
              </CTableDataCell>
              <CTableDataCell>{user.budget_proposal_name}</CTableDataCell>
              <CTableDataCell>{user.budget_proposal_amount}</CTableDataCell>
              <CTableDataCell>{user.budget_proposal_description}</CTableDataCell>
              <CTableDataCell>{formatTimestamp(user.createdAt)}</CTableDataCell>
              <CTableDataCell>
                <div className="d-flex">
                  <CButton
                    className="mb-3"
                    style={{ marginRight: '20px' }}
                    onClick={() => handleEditClick(user, index)}
                  >
                    Edit
                  </CButton>
                  {editModalVisible[index] && (
                    <EditBudgetModal
                      visible={editModalVisible[index]}
                      onClose={() => handleEditModalClose(index)}
                      formData={formData}
                      handleInputChange={handleInputChange}
                      handleSubmit={handleSubmit}
                      handleUpdate={handleUpdate}
                    />
                  )}
                  <>
                    <CButton
                      className="mb-3 text-white"
                      color="danger"
                      onClick={() => {
                        handleDeleteClick({ userId: user.user_id, budgetId: user.id })
                      }}
                    >
                      Delete
                    </CButton>
                    <DeleteBudgetModal
                      visible={deleteBudget}
                      onClose={() => setDeleteBudget(false)}
                      handleDelete={handleDelete}
                    />
                  </>
                </div>
              </CTableDataCell>
            </CTableRow>
          ))}
        </CTableBody>
      </CTable>
    </>
  )
}

export default EmpDashboard
