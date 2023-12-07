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

import WidgetsBrand from '../widgets/WidgetsBrand'
import axios from 'axios'
const PAGE_SIZE = 10

const Dashboard = () => {
  const [combinedData, setCombinedData] = useState([])
  const [activePage, setActivePage] = useState(1)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const fetchData = async () => {
      try {
        const budgetResponse = await axios.get('http://localhost:3005/budget-proposals/')
        const userResponse = await axios.get('http://localhost:3005/users')
        console.log(budgetResponse)
        // Group budget entries by user_id
        // Combine data based on user_id
        const combinedData = userResponse.data.map((user) => {
          // eslint-disable-next-line array-callback-return
          const status = budgetResponse.data.find((budget) => {
            if (budget.id === user.id) {
              return budget
            }
          })
          return {
            ...user,
            budgetProposals: status,
          }
        })
        setCombinedData(combinedData)
      } catch (error) {
        console.error('Error fetching data:', error)
      }
    }

    fetchData()
  }, [])

  const handlePageChange = (pageNumber) => {
    setActivePage(pageNumber)
  }

  const startIndex = (activePage - 1) * PAGE_SIZE
  const usersToShow = combinedData.slice(startIndex, startIndex + PAGE_SIZE)
  console.log(combinedData)

  return (
    <>
      <WidgetsBrand withCharts />
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
                  {usersToShow.map((user, index) => (
                    <CTableRow key={index}>
                      <CTableDataCell>
                        <div>
                          {user.budgetProposals?.status === undefined ? 'No Status' : 'Pending'}
                        </div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.username}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.email}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        <div>{user.user_type}</div>
                      </CTableDataCell>
                      <CTableDataCell>
                        {user.budgetProposals?.status === false ? (
                          <button type="button" className="btn btn-success text-white">
                            Approved
                          </button>
                        ) : (
                          <>
                            <CButton
                              className="bg-warning border-0"
                              onClick={() => setVisible(!visible)}
                            >
                              <span>Pending</span>
                            </CButton>
                            <CModal
                              visible={visible}
                              onClose={() => setVisible(false)}
                              aria-labelledby="pendingStatus"
                            >
                              <CModalHeader onClose={() => setVisible(false)}>
                                <CModalTitle id="pendingStatus">Approve Budget?</CModalTitle>
                              </CModalHeader>
                              <CModalBody>
                                <>
                                  <form>
                                    <div className="mb-3">
                                      <label htmlFor="exampleInputEmail1" className="form-label">
                                        {user.username}
                                      </label>
                                    </div>
                                  </form>
                                </>
                              </CModalBody>
                              <CModalFooter>
                                <CButton color="success text-white">Approve</CButton>
                              </CModalFooter>
                            </CModal>
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
