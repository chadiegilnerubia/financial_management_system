//IncomeStatementDashboard.js
import 'react-toastify/dist/ReactToastify.css'
import React, { useState, useEffect } from 'react'
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
import EditIncomeStatementModal from './EditIncomeStatementModal'
import DeleteIncomeModal from './DeleteIncomeModal'
import CustomPagination from './CustomePagination'
const PAGE_SIZE = 6

const IncomeStatementDashboard = () => {
  //old states
  const [empUsers, setEmpUsers] = useState([])
  const { user } = useUser()
  const [addBudget, setAddBudget] = useState(false)

  const [deleteBudget, setDeleteBudget] = useState(false)
  const [budgetToDelete, setBudgetToDelete] = useState(null)
  const [budgetToEdit, setBudgetToEdit] = useState(null)
  const [selectedStatus, setSelectedStatus] = useState('')
  const [budgetProposal, setBudgetProposals] = useState([])
  const [pendingProposalsCount, setPendingProposalsCount] = useState([])
  const [approvedProposalsCount, setApprovedProposalsCount] = useState([])
  const [incomeStatementDate, setIncomeStatementDate] = useState([])
  const [totalRevenue, setTotalRevenue] = useState(0)
  const [totalIncome, setTotalIncome] = useState(0)
  const [totalNetIncome, setTotalNetIncome] = useState(0)
  const [totalIncomeTax, setTotalIncomeTax] = useState(0)
  const [editModalVisible, setEditModalVisible] = useState(
    new Array(incomeStatementDate?.length || 0).fill(false),
  )
  //old states
  //old functions
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
    user_id: 0,
    company_id: 0,
    revenue: 0,
    total_income: 0,
    income_tax: 0,
    net_income: 0,
    comments: '',
    submitter: '',
    position: '',
    company_name: '',
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
        const allBudgetProposals = budgetProposalResponse.data
        const pendingProposals = allBudgetProposals.filter(
          (proposal) => !proposal.budget_proposal_status,
        )
        const approvedProposals = allBudgetProposals.filter(
          (proposal) => proposal.budget_proposal_status,
        )
        const userBudgetProposals = userResponse.data.filter(
          (proposal) => proposal.user_id === user.id,
        )

        setEmpUsers(userBudgetProposals)
        setBudgetProposals(allBudgetProposals)
        setPendingProposalsCount(pendingProposals.length)
        setApprovedProposalsCount(approvedProposals.length)
        console.log(userBudgetProposals)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [user])
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('http://localhost:3005/income-statements')
        console.log(response)
        setIncomeStatementDate(response.data)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])
  useEffect(() => {
    // Calculate totals when incomeStatementDate changes
    let revenueTotal = 0
    let incomeTotal = 0
    let netIncomeTotal = 0
    let incomeTaxTotal = 0

    incomeStatementDate.forEach((incomeStatement) => {
      revenueTotal += incomeStatement.revenue
      incomeTotal += incomeStatement.total_income
      netIncomeTotal += incomeStatement.net_income
      incomeTaxTotal += incomeStatement.income_tax
    })

    setTotalRevenue(revenueTotal)
    setTotalIncome(incomeTotal)
    setTotalNetIncome(netIncomeTotal)
    setTotalIncomeTax(incomeTaxTotal)
  }, [incomeStatementDate])
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
  const formatNumberWithCommas = (number) => {
    return number.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ',')
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
  useEffect(() => {
    setEditModalVisible(new Array(incomeStatementDate.length).fill(false))
  }, [incomeStatementDate])

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
        console.error('No income statement selected for deletion')
        return
      }
      const { id } = budgetToDelete
      // Perform the delete action by making a DELETE request
      const response = await axios.delete(`http://localhost:3005/income-statements/${id}`)
      if (response.status === 200) {
        console.log('Income statement deleted successfully')
        // Refetch data after successful deletion
        const updatedIncomeStatements = await axios.get('http://localhost:3005/income-statements')
        setIncomeStatementDate(updatedIncomeStatements.data)
        // Close the modal after successful deletion
        setDeleteBudget(false)
        showDeleteAlert('Income statement deleted successfully!')
      } else {
        console.error('Failed to delete income statement')
      }
    } catch (error) {
      console.error('Error deleting income statement:', error)
    }
  }

  const handleUpdate = async () => {
    // localhost:3005/income-statements/4
    try {
      const response = await axios.put(
        `http://localhost:3005/income-statements/${budgetToEdit}`,
        formData,
      )
      if (response.status === 200) {
        console.log('Income statement updated successfully')
        // Refetch data after successful update
        // const userResponse = await axios.get(`http://localhost:3005/proposals/${budgetToEdit}`)
        // const userBudgetProposals = userResponse.data.filter(
        //   (proposal) => proposal.user_id === user.id,
        // )
        // setEmpUsers(userBudgetProposals)
        const response = await axios.get('http://localhost:3005/income-statements')
        setIncomeStatementDate(response.data)
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
    // Use the editedData (comp) to set the correct formData
    setFormData({
      company_name: editedData.company_name,
      revenue: editedData.revenue,
      company_id: editedData.company_id,
      total_income: editedData.total_income,
      income_tax: editedData.income_tax,
      net_income: editedData.net_income,
      comments: editedData.comments,
      submitter: editedData.submitter,
      position: editedData.position,
    })
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
        const response = await axios.get('http://localhost:3005/income-statements')
        setIncomeStatementDate(response.data)
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
  const filteredEmpUsers = incomeStatementDate
    .filter((comp) => comp.company_name.toLowerCase().includes(searchQuery.toLowerCase()))
    // .filter((comp) => {
    //   if (selectedStatus === '') {
    //     return true
    //   } else if (selectedStatus === 'true') {
    //     return comp.budget_proposal_status === true
    //   } else if (selectedStatus === 'false') {
    //     return comp.budget_proposal_status === false
    //   }
    // })
    .slice(startIndex, startIndex + PAGE_SIZE)
  //old functions

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
        {user !== null && user.username != null && <h4>Statement's Income Dashboard</h4>}
        <CButton
          className="mb-3 m-1"
          style={{ marginLeft: '500px' }}
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
          placeholder="Enter company name"
          value={searchQuery}
          onChange={handleSearchInputChange}
        />
      </CForm>
      <div className="d-flex justify-content-between">
        <CButton color="success" className="mb-3 text-white">
          Total Revenue: {formatNumberWithCommas(totalRevenue)}
        </CButton>
        <CButton color="success" className="mb-3 text-white">
          Total Income: {formatNumberWithCommas(totalIncome)}
        </CButton>
        <CButton color="success" className="mb-3 text-white">
          Total Net Income: {formatNumberWithCommas(totalNetIncome)}
        </CButton>
        <CButton color="success" className="mb-3 text-white">
          Total Income Tax: {formatNumberWithCommas(totalIncomeTax)}
        </CButton>
      </div>
      <CTable>
        <CTableHead>
          <CTableRow>
            <CTableHeaderCell scope="col">ID</CTableHeaderCell>
            <CTableHeaderCell scope="col">Company Name</CTableHeaderCell>
            <CTableHeaderCell scope="col">Revenue</CTableHeaderCell>
            <CTableHeaderCell scope="col">Total Income</CTableHeaderCell>
            <CTableHeaderCell scope="col">Net Income</CTableHeaderCell>
            <CTableHeaderCell scope="col">Income Tax</CTableHeaderCell>
            <CTableHeaderCell scope="col">Actions</CTableHeaderCell>
          </CTableRow>
        </CTableHead>
        <CTableBody>
          {filteredEmpUsers.map((comp, index) => (
            <CTableRow key={index}>
              <CTableDataCell>{comp.id}</CTableDataCell>
              <CTableDataCell>{comp.company_name}</CTableDataCell>
              <CTableDataCell>{formatNumberWithCommas(comp.revenue)}</CTableDataCell>
              <CTableDataCell>{formatNumberWithCommas(comp.total_income)}</CTableDataCell>
              <CTableDataCell>{formatNumberWithCommas(comp.net_income)}</CTableDataCell>
              <CTableDataCell>{formatNumberWithCommas(comp.income_tax)}</CTableDataCell>
              <CTableDataCell>
                <div className="d-flex">
                  <CButton
                    className="mb-3"
                    style={{ marginRight: '20px' }}
                    onClick={() => handleEditClick(comp, index)}
                  >
                    <FaPen />
                  </CButton>
                  {editModalVisible[index] && (
                    <EditIncomeStatementModal
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
                      onClick={() => handleDeleteClick(comp)}
                    >
                      <FaTrash />
                    </CButton>
                    <DeleteIncomeModal
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

export default IncomeStatementDashboard
