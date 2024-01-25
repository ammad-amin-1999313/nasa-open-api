import React from 'react'
import {Route, Navigate} from 'react-router-dom'

function ProtectedRoute({children, isAuthenticated}) {
  console.log(isAuthenticated)
  return isAuthenticated ? children : <Navigate to="/" />
}

export default ProtectedRoute
