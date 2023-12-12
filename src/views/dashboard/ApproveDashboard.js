//ApproveDashboard.js
import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import { FaPen, FaTrash } from 'react-icons/fa'
import {
  CButton,
  CForm,
  CFormInput,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
  CDropdown,
  CDropdownToggle,
  CDropdownMenu,
  CDropdownItem,
} from '@coreui/react'
import axios from 'axios'
import { useUser } from '../../context/UserContext'
import EditBudgetModal from './EditBudgetModal'
import DeleteBudgetModal from './DeleteButtonModal'
import { Pagination } from 'react-bootstrap'
import useAlert from './useAlert'
import CustomPagination from './CustomePagination'
const PAGE_SIZE = 6

const ApproveDashboard = () => {
  const [empUsers, setEmpUsers] = useState([])
  const { user } = useUser()
  const [addBudget, setAddBudget] = useState(false)
  const [editModalVisible, setEditModalVisible] = useState(new Array(empUsers.length).fill(false))
  const [deleteBudget, setDeleteBudget] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState(null)
  const [budgetToEdit, setBudgetToEdit] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [refreshProposals, setRefreshProposals] = useState(false)
  const [budgetProposal, setBudgetProposals] = useState([])
  const [pendingProposalsCount, setPendingProposalsCount] = useState([])
  const [approvedProposalsCount, setApprovedProposalsCount] = useState([])
  const [userAproveDashboard, setUserAproveDashboard] = useState('')
  const { id: paramId } = useParams()
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

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get(
          `http://localhost:3005/proposals/user/${user.id}/budget-proposal`,
        )
        const budgetProposalResponse = await axios.get(
          'http://localhost:3005/proposals/budget-proposals',
        )
        const userId = parseInt(paramId, 10)
        const userAproveDashboard = await axios.get(`http://localhost:3005/users/${userId}`)
        const userBudgetProposals = userResponse.data.filter((proposal) => {
          return proposal.user_id === userId
        })
        setUserAproveDashboard(userAproveDashboard.data.username)
        // const userId = user.id
        const allBudgetProposals = budgetProposalResponse.data
        const pendingProposals = allBudgetProposals.filter(
          (proposal) => proposal.user_id === userId && !proposal.budget_proposal_status,
        )
        const approvedProposals = allBudgetProposals.filter(
          (proposal) => proposal.user_id === userId && proposal.budget_proposal_status,
        )
        const userBudgetProposalsCount = userResponse.data.filter(
          (proposal) => proposal.user_id === userId,
        )
        setPendingProposalsCount(pendingProposals.length)
        setApprovedProposalsCount(approvedProposals.length)
        setBudgetProposals(userBudgetProposalsCount)
        setEmpUsers(userBudgetProposals)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [paramId, user, refreshProposals])

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
        setRefreshProposals((prev) => !prev)
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
        setRefreshProposals((prev) => !prev)
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

  const handleApproveClick = async (budgetId) => {
    try {
      // Make a request to your backend to approve the budget
      const userId = parseInt(paramId, 10)
      const response = await axios.put(
        `http://localhost:3005/proposals/user/${userId}/budget-proposal/approve/${budgetId}`,
      )
      console.log('Approve btn click!')
      console.log('budgeId', budgetId)
      if (response.status === 200) {
        // Budget approved successfully, update the UI or perform any necessary actions
        setRefreshProposals((prev) => !prev)
        console.log('Budget approved successfully')
      } else {
        console.error('Failed to approve budget')
      }
    } catch (error) {
      console.error('Error approving budget:', error)
    }
  }
  function capitalizeFirstLetter(inputString) {
    if (typeof inputString !== 'string' || inputString.length === 0) {
      return inputString
    }
    return inputString.charAt(0).toUpperCase() + inputString.slice(1)
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
      // Handle other cases if needed
    })
    .slice(startIndex, startIndex + PAGE_SIZE)
  return (
    <>
      {isVisible && <AlertComponent message="Budget proposal submitted successfully!" />}
      {updateAlertVisible && (
        <UpdateAlertComponent message="Budget proposal updated successfully!" />
      )}
      {deleteAlertVisible && (
        <DeleteAlertComponent message="Budget proposal deleted successfully!" />
      )}
      <div className="d-flex justify-content-between align-item-center">
        {user !== null ? (
          <h4>User's employee Dashboard: {capitalizeFirstLetter(userAproveDashboard)}</h4>
        ) : null}
      </div>
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
      <CForm className="mb-5">
        <CFormInput
          type="text"
          id="searchBudgetProposal"
          label="Search Budget Proposal"
          placeholder="Enter budget name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </CForm>

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
          <>
            {filteredEmpUsers.length === 0 && (
              <p
                className="text-center m-2"
                style={{
                  width: '67.1%',
                  position: 'absolute',
                  fontWeight: 'Bold',
                  fontSize: '30px',
                }}
              >
                No Data
              </p>
            )}
            {filteredEmpUsers.map((user, index) => (
              <CTableRow key={index}>
                <CTableDataCell>
                  {user.budget_proposal_status === true ? 'Approved' : 'Pending'}
                </CTableDataCell>
                <CTableDataCell>{user.budget_proposal_name}</CTableDataCell>
                <CTableDataCell>{user.budget_proposal_amount}</CTableDataCell>
                <CTableDataCell>{user.budget_proposal_description}</CTableDataCell>
                <CTableDataCell>{formatTimestamp(user.createdAt)}</CTableDataCell>
                <CTableDataCell>
                  <div className="d-flex">
                    <>
                      <CButton
                        className="mb-3 text-white"
                        color={user.budget_proposal_status ? 'success' : 'warning'}
                        style={{ marginRight: '20px', width: '97px' }}
                        onClick={() => handleApproveClick(user.id)}
                      >
                        {user.budget_proposal_status ? 'Approved' : 'Pending'}
                      </CButton>
                      <DeleteBudgetModal
                        visible={deleteBudget}
                        onClose={() => setDeleteBudget(false)}
                        handleDelete={handleDelete}
                      />
                    </>
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
          </>
        </CTableBody>
      </CTable>
      <div className="d-flex justify-content-center mt-3">
        {/* <Pagination>
          {Array.from({ length: Math.ceil(empUsers.length / PAGE_SIZE) }).map((_, index) => (
            <Pagination.Item
              key={index + 1}
              active={index + 1 === activePage}
              onClick={() => handlePageChange(index + 1)}
            >
              {index + 1}
            </Pagination.Item>
          ))}
        </Pagination> */}
        <CustomPagination
          totalPages={Math.ceil(empUsers.length / PAGE_SIZE)}
          activePage={activePage}
          handlePageChange={handlePageChange}
        />
      </div>
    </>
  )
}

export default ApproveDashboard
