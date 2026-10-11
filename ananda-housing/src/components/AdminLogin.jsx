import { useState } from 'react'
import api from '../services/api'

function AdminLogin({ onLogin }) {
  const [view, setView] = useState('login') // 'login' | 'forgot'
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [rememberMe, setRememberMe] = useState(false)
  const [showPassword, setShowPassword] = useState(false)

  // Forgot password fields
  const [forgotEmail, setForgotEmail] = useState('')
  const [oldPassword, setOldPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showForgotOld, setShowForgotOld] = useState(false)
  const [showForgotNew, setShowForgotNew] = useState(false)

  const [error, setError] = useState('')
  const [success, setSuccess] = useState('')
  const [loading, setLoading] = useState(false)

  // ---------- LOGIN ----------
  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.post('/auth/login', { email, password })

      // Remember Me
      if (rememberMe) {
        localStorage.setItem('rememberedEmail', email)
      } else {
        localStorage.removeItem('rememberedEmail')
      }

      onLogin(res.data.token)
    } catch (err) {
      setError(err.response?.data?.message || 'Login failed')
    } finally {
      setLoading(false)
    }
  }

  // ---------- FORGOT PASSWORD ----------
  const handleForgotPassword = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')
    setSuccess('')

    try {
      const res = await api.post('/auth/forgot-password', {
        email: forgotEmail,
        oldPassword,
        newPassword,
        confirmPassword,
      })

      setSuccess(res.data.message || '✅ Password সফলভাবে রিসেট হয়েছে')
      setForgotEmail('')
      setOldPassword('')
      setNewPassword('')
      setConfirmPassword('')
      setTimeout(() => {
        setView('login')
        setSuccess('')
      }, 3000)
    } catch (err) {
      setError(err.response?.data?.message || 'Password reset failed')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Auto-fill remembered email ----------
  useState(() => {
    const savedEmail = localStorage.getItem('rememberedEmail')
    if (savedEmail) {
      setEmail(savedEmail)
      setRememberMe(true)
    }
  }, [])

  return (
    <div className="form-box" style={{ maxWidth: '420px', margin: '0 auto' }}>
      {/* ============ LOGIN VIEW ============ */}
      {view === 'login' && (
        <>
          <h2>Super Admin Login</h2>
          <form onSubmit={handleLogin}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    color: '#1e3a8a',
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {showPassword ? ' Hide' : ' Show'}
                </button>
              </div>
            </div>

            {/* Remember Me + Forgot Password */}
            <div
              style={{
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center',
                marginBottom: '15px',
                fontSize: '14px',
              }}
            >
              <label
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  gap: '6px',
                  cursor: 'pointer',
                  fontWeight: 'normal',
                }}
              >
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                Remember Me
              </label>
              <button
                type="button"
                onClick={() => {
                  setView('forgot')
                  setError('')
                  setSuccess('')
                  setForgotEmail(email)
                }}
                style={{
                  background: 'transparent',
                  color: '#1e3a8a',
                  padding: 0,
                  textDecoration: 'underline',
                  fontSize: '14px',
                  fontWeight: '500',
                }}
              >
                Forgot Password?
              </button>
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Logging in...' : 'Login'}
            </button>

            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
          </form>
        </>
      )}

      {/* ============ FORGOT PASSWORD VIEW ============ */}
      {view === 'forgot' && (
        <>
          <h2>Reset Password</h2>
          <p
            style={{
              fontSize: '13px',
              color: '#64748b',
              marginBottom: '20px',
            }}
          >
            পুরনো password যাচাই করে নতুন password সেট করুন।
          </p>
          <form onSubmit={handleForgotPassword}>
            <div className="form-group">
              <label>Email</label>
              <input
                type="email"
                value={forgotEmail}
                onChange={(e) => setForgotEmail(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label>পুরনো Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showForgotOld ? 'text' : 'password'}
                  value={oldPassword}
                  onChange={(e) => setOldPassword(e.target.value)}
                  required
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowForgotOld(!showForgotOld)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    color: '#1e3a8a',
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {showForgotOld ? '' : ''}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>নতুন Password</label>
              <div style={{ position: 'relative' }}>
                <input
                  type={showForgotNew ? 'text' : 'password'}
                  value={newPassword}
                  onChange={(e) => setNewPassword(e.target.value)}
                  required
                  minLength={6}
                  style={{ paddingRight: '45px' }}
                />
                <button
                  type="button"
                  onClick={() => setShowForgotNew(!showForgotNew)}
                  style={{
                    position: 'absolute',
                    right: '8px',
                    top: '50%',
                    transform: 'translateY(-50%)',
                    background: 'transparent',
                    color: '#1e3a8a',
                    padding: '4px 8px',
                    fontSize: '14px',
                    fontWeight: '600',
                  }}
                >
                  {showForgotNew ? '' : ''}
                </button>
              </div>
            </div>

            <div className="form-group">
              <label>নতুন Password আবার লিখুন</label>
              <input
                type={showForgotNew ? 'text' : 'password'}
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
                minLength={6}
              />
            </div>

            <button type="submit" disabled={loading}>
              {loading ? 'Resetting...' : 'Reset Password'}
            </button>

            <button
              type="button"
              onClick={() => {
                setView('login')
                setError('')
                setSuccess('')
              }}
              style={{
                background: 'transparent',
                color: '#1e3a8a',
                marginTop: '10px',
                padding: 0,
                textDecoration: 'underline',
                fontSize: '14px',
                fontWeight: '500',
              }}
            >
              ← Back to Login
            </button>

            {error && <div className="message error">{error}</div>}
            {success && <div className="message success">{success}</div>}
          </form>
        </>
      )}
    </div>
  )
}

export default AdminLogin