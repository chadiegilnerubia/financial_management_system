import React, { useState, useEffect } from 'react'
import { Pagination } from 'react-bootstrap'
import {
  CButton,
  CCard,
  CCardBody,
  CCardHeader,
  CCol,
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
const PAGE_SIZE = 10
const Dashboard = () => {
  const [loggedInUser, setLoggedInUser] = useState(null)
  const [combinedData, setCombinedData] = useState([])
  const [activePage, setActivePage] = useState(1)
  const [visibleMap, setVisibleMap] = useState({})
  const [approve, setApprove] = useState(false)
  const [addBudget, setAddBudget] = useState(false)
  const { user } = useUser()

  const [formData, setFormData] = useState({
    amount: 0,
    budget_name: '', // Added the budget_name field
    description: '', // Added the description field
  })

  useEffect(() => {
    const fetchData = async () => {
      try {
        // Fetch user data
        const userResponse = await axios.get('http://localhost:3005/users')
        const initialVisibleMap = userResponse.data.reduce((acc, user) => {
          acc[user.id] = false // Initialize visibility status for each user
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

  console.log(combinedData)

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
    setVisibleMap({}) // Reset visibility status when changing the page
    setApprove(false)
  }

  const startIndex = (activePage - 1) * PAGE_SIZE
  const usersToShow = combinedData.slice(startIndex, startIndex + PAGE_SIZE)

  // Filter usersToShow based on the role of the logged-in user
  const filteredUsersToShow = usersToShow.filter((user) => {
    if (loggedInUser && loggedInUser.role === 'manager') {
      // Manager can view all data
      return true
    } else if (loggedInUser && loggedInUser.role === 'employee') {
      // Employee can only view their own data
      return user.id === loggedInUser.id
    }
    return false
  })

  const toggleVisible = (userId) => {
    setVisibleMap((prevVisibleMap) => ({
      ...prevVisibleMap,
      [userId]: !prevVisibleMap[userId],
    }))
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
            <CCardHeader>Traffic {' & '} Sales</CCardHeader>
            <CCardBody>
              <br />

              <CTable align="middle" className="mb-0 border" hover responsive>
                <CTableHead color="light">
                  <CTableRow>
                    <CTableHeaderCell>Budget Status</CTableHeaderCell>
                    <CTableHeaderCell>User</CTableHeaderCell>
                    <CTableHeaderCell>Email</CTableHeaderCell>
                    <CTableHeaderCell>User Type</CTableHeaderCell>
                    <CTableHeaderCell>Action</CTableHeaderCell>
                  </CTableRow>
                </CTableHead>
                <CTableBody>
                  {filteredUsersToShow.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div>{user.budget_proposal_status === true ? 'Approved' : 'Pending'}</div>
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
                      <CTableDataCell>
                        {user.budget_proposal_status === true ? (
                          <>
                            <CButton
                              className="bg-success border-0"
                              onClick={() => setApprove(!approve)}
                            >
                              <span>Approved</span>
                              {console.log(user.budget_proposal_status)}
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
                                  <form>
                                    <div className="mb-3">
                                      <label htmlFor="exampleInputEmail1" className="form-label">
                                        ID: {user.id}
                                      </label>
                                      <br />
                                      <label htmlFor="exampleInputEmail1" className="form-label">
                                        Name: {user.username}
                                      </label>
                                      <p>
                                        Amount:{' '}
                                        {user.budget_proposal_amount ?? 'No amount available'}
                                        <br />
                                        Description:{' '}
                                        {user.budget_proposal_description ??
                                          'No description available'}
                                        <br />
                                        Status:{' '}
                                        {user.budget_proposal_status === 1
                                          ? 'Pending'
                                          : 'Not Pending'}
                                      </p>
                                    </div>
                                  </form>
                                </>
                              </CModalBody>
                              <CModalFooter className="d-flex align-items-center justify-content-between">
                                <CButton color="danger" className="text-white">
                                  Reject
                                </CButton>
                                <CButton color="primary" className="text-white">
                                  Approve
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
                                {console.log(user)}
                                <CButton
                                  className="bg-warning border-0"
                                  onClick={() => toggleVisible(user.id)}
                                >
                                  <span>Pending</span>
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
                                      <form>
                                        <div className="mb-3">
                                          <label
                                            htmlFor="exampleInputEmail1"
                                            className="form-label"
                                          >
                                            ID: {user.id}
                                          </label>
                                          <br />
                                          <label
                                            htmlFor="exampleInputEmail1"
                                            className="form-label"
                                          >
                                            Name: {user.username}
                                          </label>
                                          <p>
                                            Amount:{' '}
                                            {user.budget_proposal_amount === ''
                                              ? 'No value'
                                              : user.budget_proposal_amount}
                                            <br />
                                            Description:{' '}
                                            {user.budget_proposal_description === ''
                                              ? 'No Description'
                                              : user.budget_proposal_description}
                                            <br />
                                            Proposal name:{' '}
                                            {user.budget_proposal_name === ''
                                              ? 'No proposal name'
                                              : user.budget_proposal_name}
                                            <br />
                                            Proposal status:{' '}
                                            {user.budget_proposal_status !== false
                                              ? 'No Status'
                                              : 'Pending'}
                                          </p>
                                        </div>
                                      </form>
                                    </>
                                  </CModalBody>
                                  <CModalFooter className="d-flex align-items-center justify-content-between">
                                    <CButton color="danger" className="text-white">
                                      Reject
                                    </CButton>
                                    <CButton color="primary" className="text-white">
                                      Approve
                                    </CButton>
                                  </CModalFooter>
                                </CModal>
                              </>
                            )}
                          </>
                        )}
                      </CTableDataCell>
                    </CTableRow>
                  ))}
                </CTableBody>
              </CTable>
              <div className="d-flex justify-content-center mt-3">
                <Pagination>
                  {Array.from({ length: Math.ceil(combinedData.length / PAGE_SIZE) }).map(
                    (_, index) => (
                      <Pagination.Item
                        key={index + 1}
                        active={index + 1 === activePage}
                        onClick={() => handlePageChange(index + 1)}
                      >
                        {index + 1}
                      </Pagination.Item>
                    ),
                  )}
                </Pagination>
              </div>
            </CCardBody>
          </CCard>
        </CCol>
      </CRow>
    </>
  )
}

export default Dashboard
