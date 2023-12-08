import React from 'react'
import { CButton, CModal, CModalBody, CModalFooter, CModalHeader, CModalTitle } from '@coreui/react'

const DeleteBudgetModal = ({ visible, onClose, handleDelete }) => {
  return (
    <CModal visible={visible} onClose={onClose} size="sm">
      <CModalHeader closeButton>
        <CModalTitle>Delete Budget</CModalTitle>
      </CModalHeader>
      <CModalBody>
        <p>Are you sure you want to delete this budget?</p>
      </CModalBody>
      <CModalFooter>
        <CButton color="secondary" onClick={onClose}>
          Cancel
        </CButton>
        <CButton color="danger" onClick={handleDelete}>
          Delete
        </CButton>
      </CModalFooter>
    </CModal>
  )
}

export default DeleteBudgetModal
