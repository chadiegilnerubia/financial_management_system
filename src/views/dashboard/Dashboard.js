import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Pagination } from 'react-bootstrap'
import { cilArrowCircleRight } from '@coreui/icons'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
  CForm,
  CFormInput,
  CModal,
  CModalBody,
  CModalFooter,
  CModalHeader,
  CModalTitle,
  CRow,
  CTable,
  CTableBody,
  CTableDataCell,
  CTableHead,
  CTableHeaderCell,
  CTableRow,
} from '@coreui/react'
import axios from 'axios'
import WidgetsBrand from '../widgets/WidgetsBrand'
import { useUser } from '../../context/UserContext'
import IncomeStatementDashboard from './IncomeStatementDashboard'
import CustomPagination from './CustomePagination'

const PAGE_SIZE = 3

const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [combinedData, setCombinedData] = useState([])
  const [activePage, setActivePage] = useState(1)
  const [visibleMap, setVisibleMap] = useState({})
  const [approve, setApprove] = useState(false)
  const [addBudget, setAddBudget] = useState(false)
  const [searchQuery, setSearchQuery] = useState('')
  const { user } = useUser()
  const navigate = useNavigate()
  const [formData, setFormData] = useState({
    amount: 0,
    budget_name: '', // Added the budget_name field
    description: '', // Added the description field
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userResponse = await axios.get('http://localhost:3005/users')
        const initialVisibleMap = userResponse.data.reduce((acc, user) => {
          acc[user.id] = false
          return acc
        }, {})
        setCombinedData(userResponse.data)
        setLoggedInUser(user)
        setVisibleMap(initialVisibleMap)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }
    fetchData()
  }, [user])
  console.log(user)
  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
    setVisibleMap({})
    setApprove(false)
  }

  const startIndex = (activePage - 1) * PAGE_SIZE
  const usersToShow = combinedData.slice(startIndex, startIndex + PAGE_SIZE)

  // const filteredEmpUsers = combinedData.filter(
  //   (user) =>
  //     user.budget_proposal_name &&
  //     typeof user.budget_proposal_name === 'string' &&
  //     user.budget_proposal_name.toLowerCase().includes(searchQuery.toLowerCase()),
  // )
  const filteredEmpUsers = combinedData
    .filter((user) => user.username.toLowerCase().includes(searchQuery.toLowerCase()))
    .slice(startIndex, startIndex + PAGE_SIZE)

  console.log(searchQuery)

  const toggleVisible = (userId) => {
    setVisibleMap((prevVisibleMap) => ({
      ...prevVisibleMap,
      [userId]: !prevVisibleMap[userId],
    }))
  }

  const handleSearchInputChange = (e) => {
    setSearchQuery(e.target.value)
    setActivePage(1)
  }

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
      const response = await fetch(`http://localhost:3005/users/${user.id}/budget`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
      })
      console.log('form-data', formData)
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
      <WidgetsBrand withCharts />
      <>
        <CForm className="mb-5">
          <CFormInput
            type="text"
            id="searchBudgetProposal"
            label="Search User"
            placeholder="Enter User name"
            value={searchQuery}
            onChange={handleSearchInputChange}
          />
        </CForm>

        {loggedInUser && loggedInUser.role === 'employee' && (
          <>
            <CButton className="mb-3" onClick={() => setAddBudget(!addBudget)}>
              Propose new Budget
            </CButton>
            <CModal
              visible={addBudget}
              onClose={() => setAddBudget(false)}
              aria-labelledby="LiveDemoExampleLabel"
            >
              <CModalHeader onClose={() => setAddBudget(false)}>
                <CModalTitle id="LiveDemoExampleLabel">Modal title</CModalTitle>
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
              </CModalBody>
            </CModal>
          </>
        )}
      </>

      <CRow>
        <CCol xs>
          <CCard className="mb-4">
            <CCardHeader>
              <h3>User's table</h3>
            </CCardHeader>
            <CCardBody>
              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Budget Status</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>User Type</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredEmpUsers.map((user, index) => (
                    <CTableRow key={index}>
                      {/* <CTableDataCell>
                        <div>{user.budget_proposal_status === true ? 'Approved' : 'Pending'}</div>
                      </CTableDataCell> */}
                      <CTableDataCell>
                        {user.budget_proposal_status === true ? (
                          <>
                            <CButton
                              className="bg-success border-0"
                              onClick={() => setApprove(!approve)}
                            >
                              <span>Approve</span>
                            </CButton>
                            <CModal
                              visible={approve}
                              onClose={() => setApprove(false)}
                              aria-labelledby="approvedStatus"
                            >
                              <CModalHeader onClose={() => setApprove(false)}>
                                <CModalTitle id="approvedStatus">Approve Budget?</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <>
                                  <p>{`You want to navigate to ${user.username} budget table?`}</p>
                                </>
                              </CModalBody>
                              <CModalFooter className="d-flex align-items-center justify-content-between">
                                <div></div>
                                <CButton
                                  color="primary"
                                  className="text-white"
                                  size="sm"
                                  onClick={() => navigate(`/dashboard-employee/${user.id}`)}
                                >
                                  Yes
                                </CButton>
                              </CModalFooter>
                            </CModal>
                          </>
                        ) : (
                          <>
                            {user.budget_proposal_status === null ? (
                              'No status'
                            ) : (
                              <>
                                <CButton
                                  className="bg-warning border-0"
                                  onClick={() => toggleVisible(user.id)}
                                >
                                  <span>Approve</span>
                                </CButton>
                                <CModal
                                  visible={visibleMap[user.id] || false}
                                  onClose={() => toggleVisible(user.id)}
                                  aria-labelledby={`pendingStatus-${user.id}`}
                                >
                                  <CModalHeader onClose={() => toggleVisible(false)}>
                                    <CModalTitle id="pendingStatus">Approve Budget?</CModalTitle>
                                  </CModalHeader>
                                  <CModalBody>
                                    <>
                                      <p>
                                        {`You want to navigate to ${user.username} budget table?`}
                                      </p>
                                    </>
                                  </CModalBody>
                                  <CModalFooter className="d-flex align-items-center justify-content-between">
                                    <div></div>
                                    <CButton
                                      color="primary"
                                      className="text-white"
                                      onClick={() => navigate(`/dashboard-employee/${user.id}`)}
                                    >
                                      Yes
                                    </CButton>
                                  </CModalFooter>
                                </CModal>
                              </>
                            )}
                          </>
                        )}
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.username}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.email}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.role}</div>
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>

              <div className="d-flex justify-content-center mt-3">
                <CustomPagination
                  totalPages={Math.ceil(combinedData.length / PAGE_SIZE)}
                  activePage={activePage}
                  handlePageChange={handlePageChange}
                />
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
      <div>
        <hr />
      </div>
      <IncomeStatementDashboard />
    </>
  )
}

export default Dashboard
