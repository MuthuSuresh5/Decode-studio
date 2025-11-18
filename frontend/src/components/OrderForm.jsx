import React, { useState, useEffect } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './components.css'

const OrderForm = () => {
  const { user } = useAuth()
  const { success, error } = useToast()
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const serviceId = searchParams.get('service')
  
  const [service, setService] = useState(null)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: '',
    projectDescription: '',
    deadline: '',
    budget: ''
  })

  useEffect(() => {
    if (serviceId) {
      fetchService()
    }
  }, [serviceId])

  const fetchService = async () => {
    try {
      const response = await fetch(`https://decode-studio.onrender.com/api/v1/service/${serviceId}`)
      const data = await response.json()
      if (data.success) {
        setService(data.service)
      }
    } catch (error) {
      console.error('Error fetching service:', error)
    }
  }

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://decode-studio.onrender.com/api/v1/order/new', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          service: service?.name,
          phoneNumber: formData.phone,
          description: formData.projectDescription,
          deadline: formData.deadline,
          budget: formData.budget
        })
      })

      const data = await response.json()
      
      if (data.success) {
        success('Order submitted successfully!')
        navigate('/dashboard')
      } else {
        error(data.message || 'Failed to submit order')
      }
    } catch (err) {
      error('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="page-wrap">
      <div className="container">
        <div className="order-form-container">
          <div className="form-header">
            <h1>Book Service</h1>
            {service && <p>Service: {service.name}</p>}
          </div>

          <form className="order-form" onSubmit={handleSubmit}>
            <div className="form-row">
              <div className="form-group">
                <label>Name *</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>
              <div className="form-group">
                <label>Email *</label>
                <input
                  type="email"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>
            </div>

            <div className="form-group">
              <label>Phone Number *</label>
              <input
                type="text"
                name="phone"
                value={formData.phone}
                onChange={handleChange}
                placeholder="+91 XXXXX XXXXX"
                required
              />
            </div>

            <div className="form-group">
              <label>Project Description *</label>
              <textarea
                name="projectDescription"
                value={formData.projectDescription}
                onChange={handleChange}
                rows="5"
                placeholder="Tell us about your project requirements..."
                required
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label>Deadline *</label>
                <select name="deadline" value={formData.deadline} onChange={handleChange} required>
                  <option value="">Select deadline</option>
                  <option value="Within 1 week">Within 1 week</option>
                  <option value="Within 2 weeks">Within 2 weeks</option>
                  <option value="Within 1 month">Within 1 month</option>
                  <option value="Within 2 months">Within 2 months</option>
                  <option value="flexible">Flexible</option>
                </select>
              </div>
              <div className="form-group">
                <label>Budget *</label>
                <input
                  type="text"
                  name="budget"
                  value={formData.budget}
                  onChange={handleChange}
                  placeholder="Enter your budget (e.g., ₹50,000 or 50000)"
                  required
                />
                <small style={{color: '#666', fontSize: '12px'}}>You can enter amount with or without ₹ symbol</small>
              </div>
            </div>

            <button type="submit" className="submit-button" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Order'}
            </button>
          </form>
        </div>
      </div>
    </main>
  )
}

export default OrderForm