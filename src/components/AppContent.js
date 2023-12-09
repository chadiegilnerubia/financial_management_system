import React, { Suspense } from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import { CContainer, CSpinner } from '@coreui/react'
import { useUser } from 'src/context/UserContext' // Make sure to provide the correct path to UserContext
import routes from '../routes'

const AppContent = () => {
  const { user } = useUser()

  return (
    <CContainer lg>
      <Suspense fallback={<CSpinner color="primary" />}>
        <Routes>
          {routes.map((route, idx) => {
            return (
              route.element &&
              (user !== null ? (
                <Route
                  key={idx}
                  path={route.path}
                  exact={route.exact}
                  name={route.name}
                  element={<route.element />}
                />
              ) : (
                <Route key={idx} path={route.path} element={<Navigate to="/login" replace />} />
              ))
            )
          })}
          <Route path="/*" element={<Navigate to="/404" replace />} />
        </Routes>
      </Suspense>
    </CContainer>
  )
}

export default React.memo(AppContent)
