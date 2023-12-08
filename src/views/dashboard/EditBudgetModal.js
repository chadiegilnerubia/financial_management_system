//EditBudgetModal.js
import React from 'react'
import { CButton, CModal, CModalHeader, CModalTitle, CModalBody } from '@coreui/react'

const EditBudgetModal = ({ visible, onClose, formData, handleInputChange, handleUpdate }) => {
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
            <h3 className="text-center m-2">Edit Budget</h3>
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
              Update {/* Change the button text to indicate it's for updating */}
            </button>
          </form>
        </div>
      </CModalBody>
    </CModal>
  )
}

export default EditBudgetModal
