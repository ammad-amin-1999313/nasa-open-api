import './App.css'
import Header from './Components/Header.jsx'
import Login from './pages/Login.jsx'
import SignUp from './pages/SignUp.jsx'
import {BrowserRouter, Routes, Route} from 'react-router-dom'
import {getAuth, onAuthStateChanged} from 'firebase/auth'
import React, {useEffect, useState} from 'react'
import ProtectedRoute from './Components/ProtectedRoute.jsx'
function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false)

  useEffect(() => {
    const auth = getAuth()

    onAuthStateChanged(auth, user => {
      if (user) {
        setIsAuthenticated(true)
      } else {
        setIsAuthenticated(false)
      }
    })
  }, [])
  return (
    <BrowserRouter>
      <Routes>
        <Route
          path="/home"
          element={
            <ProtectedRoute isAuthenticated={isAuthenticated}>
              <Header />
            </ProtectedRoute>
          }
        />
        {/* <Route path="/home" Component={Header} /> */}
        <Route path="/" Component={Login} />
        <Route path="/signup" Component={SignUp} />
      </Routes>
    </BrowserRouter>
  )
}

export default App
