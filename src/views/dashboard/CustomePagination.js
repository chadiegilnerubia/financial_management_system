// CustomPagination.js
import React from 'react'
import { CPagination, CPaginationItem } from '@coreui/react'
const CustomPagination = ({ totalPages, activePage, handlePageChange }) => {
  const renderPaginationItems = () => {
    const paginationItems = []

    for (let i = 1; i <= totalPages; i++) {
      if (
        i <= 3 ||
        i >= totalPages - 2 || // Always show the first 3 and last 2 pages
        (i >= activePage - 2 && i <= activePage + 2) // Show 5 pages around the active page
      ) {
        paginationItems.push(
          <CPaginationItem key={i} active={i === activePage} onClick={() => handlePageChange(i)}>
            {i}
          </CPaginationItem>,
        )
      } else if ((i === activePage - 3 && i > 1) || (i === activePage + 3 && i < totalPages)) {
        paginationItems.push(
          <CPaginationItem key={i} disabled>
            {'...'}
          </CPaginationItem>,
        )
      }
    }
    return paginationItems
  }

  return (
    <CPagination aria-label="Page navigation example">
      <CPaginationItem
        aria-label="Previous"
        disabled={activePage === 1}
        onClick={() => handlePageChange(activePage - 1)}
      >
        <span aria-hidden="true">Previous</span>
      </CPaginationItem>

      {renderPaginationItems()}

      <CPaginationItem
        aria-label="Next"
        disabled={activePage === totalPages}
        onClick={() => handlePageChange(activePage + 1)}
      >
        <span aria-hidden="true">Next</span>
      </CPaginationItem>
    </CPagination>
  )
}

export default CustomPagination
