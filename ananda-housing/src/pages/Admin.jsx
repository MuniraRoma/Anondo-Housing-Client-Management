import { useState } from 'react'
import AdminLogin from '../components/AdminLogin'
import AdminDashboard from '../components/AdminDashboard'

function Admin() {
  const [token, setToken] = useState(localStorage.getItem('adminToken') || '')

  const handleLogin = (newToken) => {
    localStorage.setItem('adminToken', newToken)
    setToken(newToken)
  }

  const handleLogout = () => {
    localStorage.removeItem('adminToken')
    setToken('')
  }

  return (
    <div className="container">
      {token ? (
        <AdminDashboard token={token} onLogout={handleLogout} />
      ) : (
        <AdminLogin onLogin={handleLogin} />
      )}
    </div>
  )
}

export default Admin