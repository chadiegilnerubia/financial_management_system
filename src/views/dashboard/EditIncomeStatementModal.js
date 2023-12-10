// EditIncomeStatementModal.js
import React from 'react'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody } from '@coreui/react'

const EditIncomeStatementModal = ({
  visible,
  onClose,
  formData,
  handleInputChange,
  handleUpdate,
}) => {
  return (
    <CModal visible={visible} onClose={onClose} aria-labelledby="EditBudgetModalLabel">
      <CModalHeader onClose={onClose}>
        <CModalTitle id="EditBudgetModalLabel">Edit Budget</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <div className="card container-sm" style={{ width: '100%', padding: '20px' }}>
          <form
            onSubmit={(e) => {
              e.preventDefault()
              handleUpdate() // Call the handleUpdate function when the form is submitted
            }}
          >
            <h3 className="text-center m-2">Edit Income</h3>
            <div className="mb-3">
              <label className="form-label">Company name</label>
              <input
                type="text"
                className="form-control"
                id="company_name"
                value={formData.company_name}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Revenue</label>
              <input
                type="number"
                className="form-control"
                id="revenue"
                value={formData.revenue}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Company Id</label>
              <input
                type="number"
                className="form-control"
                id="company_id"
                value={formData.company_id}
                onChange={handleInputChange}
              />
            </div>
            <div className="mb-3">
              <label className="form-label">Total Income</label>
              <input
                type="number"
                className="form-control"
                id="total_income"
                value={formData.total_income}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Income Tax</label>
              <input
                type="number"
                className="form-control"
                id="income_tax"
                value={formData.income_tax}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Net Income</label>
              <input
                type="number"
                className="form-control"
                id="net_income"
                value={formData.net_income}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Comments</label>
              <textarea
                className="form-control"
                id="comments"
                value={formData.comments}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Submitter</label>
              <input
                type="text"
                className="form-control"
                id="submitter"
                value={formData.submitter}
                onChange={handleInputChange}
              />
            </div>

            <div className="mb-3">
              <label className="form-label">Position</label>
              <input
                type="text"
                className="form-control"
                id="position"
                value={formData.position}
                onChange={handleInputChange}
              />
            </div>
            <button type="submit" className="btn btn-primary">
              Update {/* Change the button text to indicate it's for updating */}
            </button>
          </form>
        </div>
      </CModalBody>
    </CModal>
  )
}

export default EditIncomeStatementModal
