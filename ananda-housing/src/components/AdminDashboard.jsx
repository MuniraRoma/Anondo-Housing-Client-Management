import { useEffect, useState } from 'react'
import api from '../services/api'

function AdminDashboard({ token, onLogout }) {
  const [clients, setClients] = useState([])
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  // Change Password state
  const [showChangePassword, setShowChangePassword] = useState(false)
  const [cpOld, setCpOld] = useState('')
  const [cpNew, setCpNew] = useState('')
  const [cpConfirm, setCpConfirm] = useState('')
  const [cpError, setCpError] = useState('')
  const [cpSuccess, setCpSuccess] = useState('')
  const [cpLoading, setCpLoading] = useState(false)
  const [cpShow, setCpShow] = useState(false)

  // Change Email state
  const [showChangeEmail, setShowChangeEmail] = useState(false)
  const [ceOldEmail, setCeOldEmail] = useState('')
  const [cePassword, setCePassword] = useState('')
  const [ceNewEmail, setCeNewEmail] = useState('')
  const [ceConfirmEmail, setCeConfirmEmail] = useState('')
  const [ceError, setCeError] = useState('')
  const [ceSuccess, setCeSuccess] = useState('')
  const [ceLoading, setCeLoading] = useState(false)
  const [ceShowPass, setCeShowPass] = useState(false)

  useEffect(() => {
    fetchClients()
  }, [])

  const fetchClients = async () => {
    try {
      const res = await api.get('/clients', {
        headers: { Authorization: `Bearer ${token}` },
      })
      setClients(res.data)
    } catch (err) {
      setError(err.response?.data?.message || 'Failed to load clients')
    } finally {
      setLoading(false)
    }
  }

  // ---------- Change Password handler ----------
  const handleChangePassword = async (e) => {
    e.preventDefault()
    setCpLoading(true)
    setCpError('')
    setCpSuccess('')

    try {
      const res = await api.post(
        '/auth/change-password',
        {
          oldPassword: cpOld,
          newPassword: cpNew,
          confirmPassword: cpConfirm,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setCpSuccess(res.data.message || '✅ Password পরিবর্তন হয়েছে')
      setCpOld('')
      setCpNew('')
      setCpConfirm('')

      setTimeout(() => {
        setShowChangePassword(false)
        setCpSuccess('')
      }, 2000)
    } catch (err) {
      setCpError(err.response?.data?.message || 'Password change failed')
    } finally {
      setCpLoading(false)
    }
  }

  // ---------- Change Email handler ----------
  const handleChangeEmail = async (e) => {
    e.preventDefault()
    setCeLoading(true)
    setCeError('')
    setCeSuccess('')

    try {
      const res = await api.post(
        '/auth/change-email',
        {
          oldEmail: ceOldEmail,
          password: cePassword,
          newEmail: ceNewEmail,
          confirmEmail: ceConfirmEmail,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      )

      setCeSuccess(res.data.message || '✅ Email পরিবর্তন হয়েছে')

      // নতুন token save
      if (res.data.token) {
        localStorage.setItem('adminToken', res.data.token)
      }

      setCeOldEmail('')
      setCePassword('')
      setCeNewEmail('')
      setCeConfirmEmail('')

      setTimeout(() => {
        setShowChangeEmail(false)
        setCeSuccess('')
      }, 2500)
    } catch (err) {
      setCeError(err.response?.data?.message || 'Email change failed')
    } finally {
      setCeLoading(false)
    }
  }

  // ---------- Search filter ----------
  const filtered = clients.filter((c) => {
    const q = search.toLowerCase()
    return (
      c.clientName?.toLowerCase().includes(q) ||
      c.mobile?.includes(search) ||
      c.plotNumber?.toLowerCase().includes(q) ||
      c.projectName?.toLowerCase().includes(q) ||
      c.salesPersonName?.toLowerCase().includes(q) ||
      c.clientStatus?.toLowerCase().includes(q)
    )
  })

  // ---------- Excel (CSV) Download ----------
  const downloadCSV = () => {
    const headers = [
      'ID',
      'Client Name',
      'Phone',
      'Sales Person',
      'Plot Number',
      'Project Name',
      'Visit Date',
      'Client Status',
      'Photo URL',
      'Created At',
    ]

    const rows = filtered.map((c) => [
      c.id,
      c.clientName,
      c.mobile,
      c.salesPersonName,
      c.plotNumber,
      c.projectName,
      c.visitDate || '',
      c.clientStatus || '',
      c.photoUrl ? `http://localhost:5000${c.photoUrl}` : '',
      c.created_at || '',
    ])

    const csvContent = [
      headers.join(','),
      ...rows.map((row) => row.map((cell) => `"${cell ?? ''}"`).join(',')),
    ].join('\n')

    const blob = new Blob(['\uFEFF' + csvContent], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `ananda_clients_${new Date().toISOString().slice(0, 10)}.csv`
    document.body.appendChild(link)
    link.click()
    document.body.removeChild(link)
    URL.revokeObjectURL(url)
  }

  // ---------- Single Image Download ----------
  const downloadImage = async (photoUrl, clientName) => {
    try {
      const fullUrl = photoUrl.startsWith('http')
        ? photoUrl
        : `http://localhost:5000${photoUrl}`
      const response = await fetch(fullUrl)
      const blob = await response.blob()
      const url = URL.createObjectURL(blob)
      const link = document.createElement('a')
      const ext = photoUrl.split('.').pop() || 'jpg'
      link.href = url
      link.download = `${clientName || 'client'}_${Date.now()}.${ext}`
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      URL.revokeObjectURL(url)
    } catch (err) {
      alert('ছবি download করা যায়নি')
    }
  }

  // ---------- Status Badge ----------
  const getStatusStyle = (status) => {
    if (status === 'New Client') {
      return {
        background: '#dcfce7',
        color: '#166534',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
      }
    }
    if (status === 'Old Client') {
      return {
        background: '#fef3c7',
        color: '#92400e',
        padding: '4px 10px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
        display: 'inline-block',
      }
    }
    return {}
  }

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          flexWrap: 'wrap',
          gap: '10px',
        }}
      >
        <h2 style={{ color: '#1e3a8a' }}>Admin Dashboard</h2>
        <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          <button onClick={downloadCSV} style={{ background: '#16a34a' }}>
            📥 Download Excel (CSV)
          </button>
          <button
            onClick={() => {
              setShowChangeEmail(true)
              setCeError('')
              setCeSuccess('')
            }}
            style={{ background: '#8b5cf6' }}
          >
            ✉️ Change Email
          </button>
          <button
            onClick={() => {
              setShowChangePassword(true)
              setCpError('')
              setCpSuccess('')
            }}
            style={{ background: '#f59e0b' }}
          >
            🔑 Change Password
          </button>
          <button onClick={onLogout} style={{ background: '#dc2626' }}>
            Logout
          </button>
        </div>
      </div>

      {/* Search */}
      <div className="form-group">
        <input
          type="text"
          placeholder="Search by name, phone, plot, project, sales person, status..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {loading && <p>Loading...</p>}
      {error && <div className="message error">{error}</div>}

      {!loading && !error && (
        <>
          <p style={{ marginBottom: '10px', color: '#475569', fontSize: '14px' }}>
            Total {filtered.length} client{filtered.length !== 1 ? 's' : ''}
          </p>

          <div style={{ overflowX: 'auto' }}>
            <table>
              <thead>
                <tr>
                  <th>Photo</th>
                  <th>Name</th>
                  <th>Phone</th>
                  <th>Sales Person</th>
                  <th>Plot No</th>
                  <th>Project</th>
                  <th>Visit Date</th>
                  <th>Client Status</th>
                  <th>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filtered.length === 0 ? (
                  <tr>
                    <td colSpan="9" style={{ textAlign: 'center', padding: '20px' }}>
                      No clients found.
                    </td>
                  </tr>
                ) : (
                  filtered.map((c) => (
                    <tr key={c.id}>
                      <td>
                        {c.photoUrl ? (
                          <img
                            src={c.photoUrl.startsWith('http') ? c.photoUrl : `http://localhost:5000${c.photoUrl}`}
                            alt={c.clientName}
                            width="55"
                            height="55"
                            style={{ borderRadius: '6px', objectFit: 'cover', cursor: 'pointer' }}
                            onClick={() =>
                              window.open(
                                c.photoUrl.startsWith('http') ? c.photoUrl : `http://localhost:5000${c.photoUrl}`,
                                '_blank'
                              )
                            }
                          />
                        ) : '—'}
                      </td>
                      <td>{c.clientName}</td>
                      <td>{c.mobile}</td>
                      <td>{c.salesPersonName}</td>
                      <td>{c.plotNumber}</td>
                      <td>{c.projectName}</td>
                      <td>{c.visitDate || '—'}</td>
                      <td>
                        {c.clientStatus ? (
                          <span style={getStatusStyle(c.clientStatus)}>{c.clientStatus}</span>
                        ) : '—'}
                      </td>
                      <td>
                        {c.photoUrl && (
                          <button
                            style={{ padding: '6px 10px', fontSize: '12px', background: '#0891b2' }}
                            onClick={() => downloadImage(c.photoUrl, c.clientName)}
                          >
                            ⬇ Image
                          </button>
                        )}
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </>
      )}

      {/* ========== Change Password Modal ========== */}
      {showChangePassword && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px',
          }}
          onClick={() => setShowChangePassword(false)}
        >
          <div
            className="form-box"
            style={{ maxWidth: '420px', width: '100%', margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>🔑 Change Password</h2>
            <form onSubmit={handleChangePassword}>
              <div className="form-group">
                <label>পুরনো Password</label>
                <input
                  type={cpShow ? 'text' : 'password'}
                  value={cpOld}
                  onChange={(e) => setCpOld(e.target.value)}
                  required
                />
              </div>

              <div className="form-group">
                <label>নতুন Password</label>
                <input
                  type={cpShow ? 'text' : 'password'}
                  value={cpNew}
                  onChange={(e) => setCpNew(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div className="form-group">
                <label>নতুন Password আবার লিখুন</label>
                <input
                  type={cpShow ? 'text' : 'password'}
                  value={cpConfirm}
                  onChange={(e) => setCpConfirm(e.target.value)}
                  required
                  minLength={6}
                />
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '15px', fontSize: '14px' }}>
                <input
                  type="checkbox"
                  checked={cpShow}
                  onChange={(e) => setCpShow(e.target.checked)}
                  style={{ width: 'auto' }}
                />
                <label style={{ fontWeight: 'normal', margin: 0 }}>Show Password</label>
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={cpLoading}>
                  {cpLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangePassword(false)
                    setCpError('')
                    setCpSuccess('')
                  }}
                  style={{ background: '#dc2626' }}
                >
                  Cancel
                </button>
              </div>

              {cpError && <div className="message error">{cpError}</div>}
              {cpSuccess && <div className="message success">{cpSuccess}</div>}
            </form>
          </div>
        </div>
      )}

      {/* ========== Change Email Modal ========== */}
      {showChangeEmail && (
        <div
          style={{
            position: 'fixed', top: 0, left: 0, width: '100%', height: '100%',
            background: 'rgba(0, 0, 0, 0.5)', display: 'flex',
            justifyContent: 'center', alignItems: 'center', zIndex: 1000, padding: '20px',
          }}
          onClick={() => setShowChangeEmail(false)}
        >
          <div
            className="form-box"
            style={{ maxWidth: '440px', width: '100%', margin: 0 }}
            onClick={(e) => e.stopPropagation()}
          >
            <h2>✉️ Change Email</h2>
            <p style={{ fontSize: '13px', color: '#64748b', marginBottom: '15px' }}>
              পুরনো email ও password যাচাই করে নতুন email সেট করুন।
            </p>
            <form onSubmit={handleChangeEmail}>
              <div className="form-group">
                <label>পুরনো Email</label>
                <input
                  type="email"
                  value={ceOldEmail}
                  onChange={(e) => setCeOldEmail(e.target.value)}
                  placeholder="admin@anandahousing.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>Password</label>
                <div style={{ position: 'relative' }}>
                  <input
                    type={ceShowPass ? 'text' : 'password'}
                    value={cePassword}
                    onChange={(e) => setCePassword(e.target.value)}
                    required
                    style={{ paddingRight: '55px' }}
                  />
                  <button
                    type="button"
                    onClick={() => setCeShowPass(!ceShowPass)}
                    style={{
                      position: 'absolute', right: '8px', top: '50%',
                      transform: 'translateY(-50%)', background: 'transparent',
                      color: '#1e3a8a', padding: '4px 8px', fontSize: '14px', fontWeight: '600',
                    }}
                  >
                    {ceShowPass ? '🙈' : '👁️'}
                  </button>
                </div>
              </div>

              <div className="form-group">
                <label>নতুন Email</label>
                <input
                  type="email"
                  value={ceNewEmail}
                  onChange={(e) => setCeNewEmail(e.target.value)}
                  placeholder="newemail@anandahousing.com"
                  required
                />
              </div>

              <div className="form-group">
                <label>নতুন Email আবার লিখুন</label>
                <input
                  type="email"
                  value={ceConfirmEmail}
                  onChange={(e) => setCeConfirmEmail(e.target.value)}
                  required
                />
              </div>

              <div style={{ display: 'flex', gap: '10px' }}>
                <button type="submit" disabled={ceLoading}>
                  {ceLoading ? 'Saving...' : 'Save'}
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setShowChangeEmail(false)
                    setCeError('')
                    setCeSuccess('')
                  }}
                  style={{ background: '#dc2626' }}
                >
                  Cancel
                </button>
              </div>

              {ceError && <div className="message error">{ceError}</div>}
              {ceSuccess && <div className="message success">{ceSuccess}</div>}
            </form>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard