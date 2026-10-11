import { useState } from 'react'
import api from '../services/api'

function ClientForm() {
  const [formData, setFormData] = useState({
    clientName: '',
    mobile: '',
    salesPersonName: '',
    plotNumber: '',
    projectName: '',
    visitDate: '', // নতুন যোগ করা হয়েছে
    clientStatus: '', // নতুন যোগ করা হয়েছে
  })
  const [photo, setPhoto] = useState(null)
  const [message, setMessage] = useState({ type: '', text: '' })
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value })
  }

  const handleFileChange = (e) => {
    setPhoto(e.target.files[0])
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setMessage({ type: '', text: '' })

    try {
      const data = new FormData()
      Object.keys(formData).forEach((key) => data.append(key, formData[key]))
      if (photo) data.append('photo', photo)

      const res = await api.post('/clients', data, {
        headers: { 'Content-Type': 'multipart/form-data' },
      })

      setMessage({ type: 'success', text: res.data.message || 'Client saved successfully!' })
      setFormData({
        clientName: '',
        mobile: '',
        salesPersonName: '',
        plotNumber: '',
        projectName: '',
        visitDate: '', // রিসেট
        clientStatus: '', // রিসেট
      })
      setPhoto(null)
      document.querySelector('input[type="file"]').value = ''
    } catch (err) {
      setMessage({
        type: 'error',
        text: err.response?.data?.message || 'Something went wrong. Try again.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="form-box">
      <h2>Client Information Upload</h2>
      <form onSubmit={handleSubmit}>
        {/* Client Picture */}
        <div className="form-group">
          <label>Client Picture *</label>
          <input type="file" accept="image/*" onChange={handleFileChange} required />
        </div>

        {/* Client Name */}
        <div className="form-group">
          <label>Client Name *</label>
          <input
            type="text"
            name="clientName"
            value={formData.clientName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Client Phone Number */}
        <div className="form-group">
          <label>Client Phone Number *</label>
          <input
            type="text"
            name="mobile"
            value={formData.mobile}
            onChange={handleChange}
            required
          />
        </div>

        {/* Sales Person's Name */}
        <div className="form-group">
          <label>Sales Person's Name *</label>
          <input
            type="text"
            name="salesPersonName"
            value={formData.salesPersonName}
            onChange={handleChange}
            required
          />
        </div>

        {/* Plot Number */}
        <div className="form-group">
          <label>Plot Number *</label>
          <input
            type="text"
            name="plotNumber"
            value={formData.plotNumber}
            onChange={handleChange}
            required
          />
        </div>

        {/* Project Name (Dropdown) */}
        <div className="form-group">
          <label>Project Name *</label>
          <select
            name="projectName"
            value={formData.projectName}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Project --</option>
            <option value="Anondo Housing Society">Anondo Housing Society</option>
            <option value="Anondo Bhuban">Anondo Bhuban</option>
          </select>
        </div>

        {/* Visit Date */}
        <div className="form-group">
          <label>Visit Date *</label>
          <input
            type="date"
            name="visitDate"
            value={formData.visitDate}
            onChange={handleChange}
            required
          />
        </div>

        {/* Client Status (নতুন) */}
        <div className="form-group">
          <label>Client Status *</label>
          <select
            name="clientStatus"
            value={formData.clientStatus}
            onChange={handleChange}
            required
          >
            <option value="">-- Select Status --</option>
            <option value="New Client">New Client</option>
            <option value="Old Client">Old Client</option>
          </select>
        </div>

        <button type="submit" disabled={loading}>
          {loading ? 'Uploading...' : 'Save Client'}
        </button>

        {message.text && <div className={`message ${message.type}`}>{message.text}</div>}
      </form>
    </div>
  )
}

export default ClientForm