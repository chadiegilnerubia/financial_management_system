//EmpDashboard.js
import CustomPagination from './CustomePagination' // Adjust the path as needed
import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect } from 'react'
import { CPagination, CPaginationItem } from '@coreui/react' // Assuming you are using CoreUI components
import { FaPen, FaTrash } from 'react-icons/fa'
import {
  CButton,
  CDropdown,
  CDropdownItem,
  CDropdownMenu,
  CDropdownToggle,
  CForm,
  CFormInput,
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
import { Pagination } from 'react-bootstrap'
import { CAlert } from '@coreui/react'
import useAlert from './useAlert'
const PAGE_SIZE = 6

const EmpDashboard = () => {
  const [empUsers, setEmpUsers] = useState([])
  const { user } = useUser()
  const [addBudget, setAddBudget] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(new Array(empUsers.length).fill(false))
  const [deleteBudget, setDeleteBudget] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState(null)
  const [budgetToEdit, setBudgetToEdit] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [budgetProposal, setBudgetProposals] = useState([])
  const [pendingProposalsCount, setPendingProposalsCount] = useState([])
  const [approvedProposalsCount, setApprovedProposalsCount] = useState([])
  const [budgetProposalErr, setBudgetProposalErr] = useState('')
  const [IncomeStatementErr, setIncomeStatementErr] = useState('')
  const [error, setError] = useState(false)
  const {
    isVisible: updateAlertVisible,
    showAlert: showUpdateAlert,
    hideAlert: hideUpdateAlert,
    AlertComponent: UpdateAlertComponent,
  } = useAlert()
  const {
    isVisible: deleteAlertVisible,
    showAlert: showDeleteAlert,
    hideAlert: hideDeleteAlert,
    AlertComponent: DeleteAlertComponent,
  } = useAlert()
  const { isVisible, showAlert, hideAlert, AlertComponent } = useAlert()

  const [formData, setFormData] = useState({
    budget_proposal_amount: 0,
    budget_proposal_name: '',
    budget_proposal_description: '',
  })
  const [activePage, setActivePage] = useState(1)
  const [searchQuery, setSearchQuery] = useState('')
  const [submitIncomeStatement, setSubmitIncomeStatement] = useState(false)
  const [incomeStatementFormData, setIncomeStatementFormData] = useState({
    revenue: 0,
    total_income: 0,
    income_tax: 0,
    net_income: 0,
    comments: '',
    submitter: '',
    position: '',
    company_id: 0,
    company_name: '',
  })
  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        const budgetProposalResponse = await axios.get(
          'http://localhost:3005/proposals/budget-proposals',
        )
        const userId = user.id
        const allBudgetProposals = budgetProposalResponse.data
        const approvedProposals = allBudgetProposals.filter(
          (proposal) => proposal.user_id === userId && proposal.budget_proposal_status,
        )
        const userBudgetProposals = userResponse.data.filter(
          (proposal) => proposal.user_id === user.id,
        )
        const userPendingProposals = allBudgetProposals.filter(
          (proposal) => proposal.user_id === userId && !proposal.budget_proposal_status,
        )
        // Set the user's pending proposals count to state
        setPendingProposalsCount(userPendingProposals.length)
        setApprovedProposalsCount(approvedProposals.length)
        setBudgetProposals(userBudgetProposals)
        setEmpUsers(userBudgetProposals)
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
    // Check if all required fields are filled
    if (
      !formData.budget_proposal_amount ||
      !formData.budget_proposal_name ||
      !formData.budget_proposal_description
    ) {
      setBudgetProposalErr('Please fill in all required fields')
      setError(true)
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setError(false)
        setBudgetProposalErr('')
      }, 3000)
      return
    }

    // Trim the string values if they exist, otherwise use an empty string
    const trimmedName = formData.budget_proposal_name.trim()
    const trimmedDescription = formData.budget_proposal_description.trim()

    try {
      const response = await fetch(
        `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...formData,
            budget_proposal_name: trimmedName,
            budget_proposal_description: trimmedDescription,
          }),
        },
      )
      if (response.ok) {
        console.log('Budget proposal submitted successfully')
        // // Refetch data after successful submission
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        const userBudgetProposals = userResponse.data.filter(
          (proposal) => proposal.user_id === user.id,
        )
        setEmpUsers(userBudgetProposals)
        // Clear input fields
        setFormData({
          budget_proposal_amount: 0,
          budget_proposal_name: '',
          budget_proposal_description: '',
        })
        // Close the modal
        setAddBudget(false)
        showAlert('Budget proposal submitted successfully!')
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

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
    setActivePage(1)
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
        const userBudgetProposals = userResponse.data.filter(
          (proposal) => proposal.user_id === user.id,
        )
        setEmpUsers(userBudgetProposals)
        // Close the modal after successful deletion
        setDeleteBudget(false)
        showDeleteAlert('Budget proposal deleted successfully!')
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
        const userBudgetProposals = userResponse.data.filter(
          (proposal) => proposal.user_id === user.id,
        )
        setEmpUsers(userBudgetProposals)

        setFormData({
          budget_proposal_amount: 0,
          budget_proposal_name: '',
          budget_proposal_description: '',
        })
        setEditModalVisible(false)
        showUpdateAlert('Budget proposal updated successfully!')
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
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
  }
  // Handlers for Submit Income Statement
  const handleIncomeStatementInputChange = (e) => {
    const { id, value } = e.target
    setIncomeStatementFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }))
  }
  const handleIncomeStatementSubmit = async (e) => {
    e.preventDefault()

    // Check if any of the fields are empty
    const hasEmptyField = Object.values(incomeStatementFormData).some(
      (value) => value === 0 || value === '' || value === null,
    )
    if (hasEmptyField) {
      setIncomeStatementErr('Please fill in all fields')
      setError(true)
      // Clear the error message after 3 seconds
      setTimeout(() => {
        setIncomeStatementErr('')
        setError(false)
      }, 3000)

      return
    }

    try {
      const response = await fetch('http://localhost:3005/income-statements/', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          user_id: user.id,
          ...incomeStatementFormData,
        }),
      })

      if (response.ok) {
        console.log('Income statement submitted successfully')

        // Clear input fields
        setIncomeStatementFormData({
          revenue: 0,
          company_id: 0,
          total_income: 0,
          income_tax: 0,
          net_income: 0,
          comments: '',
          company_name: '',
          submitter: '', // Add the submitter's details here
          position: '', // Add the submitter's position here
          // Add other fields as needed
        })

        // Close the modal
        setSubmitIncomeStatement(false)
        showAlert('Income statement submitted successfully!')
      } else {
        console.error('Failed to submit income statement')
      }
    } catch (error) {
      console.error('Error submitting income statement:', error)
    }
  }
  const startIndex = (activePage - 1) * PAGE_SIZE
  const filteredEmpUsers = empUsers
    .filter((user) => user.budget_proposal_name.toLowerCase().includes(searchQuery.toLowerCase()))
    .filter((user) => {
      if (selectedStatus === '') {
        return true
      } else if (selectedStatus === 'true') {
        return user.budget_proposal_status === true
      } else if (selectedStatus === 'false') {
        return user.budget_proposal_status === false
      }
    })
    .slice(startIndex, startIndex + PAGE_SIZE)

  return (
    <>
      {isVisible && <AlertComponent message="Submitted successfully!" />}
      {updateAlertVisible && (
        <UpdateAlertComponent message="Budget proposal updated successfully!" />
      )}
      {deleteAlertVisible && (
        <DeleteAlertComponent message="Budget proposal deleted successfully!" />
      )}
      <div className="d-flex justify-content-between align-item-center">
        {user !== null && user.username != null && <h4>Employee's Dashboard: {user.username}</h4>}
        <CButton
          className="mb-3 m-1"
          style={{ marginLeft: '100px' }}
          onClick={() => setSubmitIncomeStatement(!submitIncomeStatement)}
        >
          Submit Income Statement
        </CButton>
        <CModal
          visible={submitIncomeStatement}
          onClose={() => setSubmitIncomeStatement(false)}
          aria-labelledby="submitIncomeStatementLabel"
        >
          <CModalHeader onClose={() => setSubmitIncomeStatement(false)}>
            <CModalTitle id="submitIncomeStatementLabel" className="text-center m-2">
              Submit Income Statement
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="card container-sm" style={{ width: '100%', padding: '20px' }}>
              {error && (
                <p className="text-white" style={{ backgroundColor: 'red', padding: '10px' }}>
                  {IncomeStatementErr}
                </p>
              )}
              <form onSubmit={handleIncomeStatementSubmit}>
                <div className="mb-3">
                  <label className="form-label">Company name</label>
                  <input
                    type="text"
                    className="form-control"
                    id="company_name"
                    value={incomeStatementFormData.company_name}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Revenue</label>
                  <input
                    type="number"
                    className="form-control"
                    id="revenue"
                    value={incomeStatementFormData.revenue}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Company Id</label>
                  <input
                    type="number"
                    className="form-control"
                    id="company_id"
                    value={incomeStatementFormData.company_id}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Total Income</label>
                  <input
                    type="number"
                    className="form-control"
                    id="total_income"
                    value={incomeStatementFormData.total_income}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Income Tax</label>
                  <input
                    type="number"
                    className="form-control"
                    id="income_tax"
                    value={incomeStatementFormData.income_tax}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Net Income</label>
                  <input
                    type="number"
                    className="form-control"
                    id="net_income"
                    value={incomeStatementFormData.net_income}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Comments</label>
                  <textarea
                    className="form-control"
                    id="comments"
                    value={incomeStatementFormData.comments}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Submitter</label>
                  <input
                    type="text"
                    className="form-control"
                    id="submitter"
                    value={incomeStatementFormData.submitter}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>

                <div className="mb-3">
                  <label className="form-label">Position</label>
                  <input
                    type="text"
                    className="form-control"
                    id="position"
                    value={incomeStatementFormData.position}
                    onChange={handleIncomeStatementInputChange}
                  />
                </div>

                {/* Add other fields for income statement as needed */}
                <button type="submit" className="btn btn-primary">
                  Submit
                </button>
              </form>
            </div>
          </CModalBody>
        </CModal>
        <CButton className="mb-3" onClick={() => setAddBudget(!addBudget)}>
          Propose new Budget
        </CButton>
        <CModal
          visible={addBudget}
          onClose={() => setAddBudget(false)}
          aria-labelledby="addBudgetLabel"
        >
          <CModalHeader onClose={() => setAddBudget(false)}>
            <CModalTitle id="addBudgetLabel" className="text-center m-2">
              Propose a budget
            </CModalTitle>
          </CModalHeader>
          <CModalBody>
            <div className="card container-sm" style={{ width: '100%', padding: '20px' }}>
              {error && (
                <p className="text-white" style={{ backgroundColor: 'red', padding: '10px' }}>
                  {budgetProposalErr}
                </p>
              )}
              <form onSubmit={handleSubmit}>
                {/* <h3 className="text-center m-2">Propose a budget</h3> */}
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
      </div>
      <CForm className="mb-4">
        <CFormInput
          type="text"
          id="searchBudgetProposal"
          label="Search Budget Proposal"
          placeholder="Enter budget name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </CForm>
      <div className="d-flex align-items-center justify-content-between">
        <CDropdown className="mb-4">
          <CDropdownToggle color="primary">Filter by Status</CDropdownToggle>
          <CDropdownMenu>
            <CDropdownItem onClick={() => setSelectedStatus('')}>All</CDropdownItem>
            <CDropdownItem onClick={() => setSelectedStatus('true')}>Approved</CDropdownItem>
            <CDropdownItem onClick={() => setSelectedStatus('false')}>Pending</CDropdownItem>
          </CDropdownMenu>
        </CDropdown>
        <div>
          <CButton className="mb-3 text-white m-1" color="warning" style={{ width: '97px' }}>
            Pending {pendingProposalsCount}
          </CButton>
          <CButton className="mb-3 text-white m-1" color="success" style={{ width: '97px' }}>
            Approved {approvedProposalsCount}
          </CButton>
          <CButton className="mb-3 text-white m-1" color="secondary" style={{ width: '97px' }}>
            Proposals {budgetProposal.length}
          </CButton>
        </div>
      </div>
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
          {filteredEmpUsers.map((user, index) => (
            <CTableRow key={index}>
              <CTableDataCell>
                {user.budget_proposal_status === true ? (
                  <>
                    <CButton className="mb-3 text-white" color="success">
                      Approved
                    </CButton>
                  </>
                ) : (
                  <CButton className="mb-3 text-white" color="warning" style={{ width: '97px' }}>
                    Pending
                  </CButton>
                )}
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
                    <FaPen />
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
                      <FaTrash />
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
      <div className="d-flex justify-content-center mt-3">
        <CustomPagination
          totalPages={Math.ceil(empUsers.length / PAGE_SIZE)}
          activePage={activePage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default EmpDashboard
