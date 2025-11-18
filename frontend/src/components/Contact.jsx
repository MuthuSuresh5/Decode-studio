import React, { useState } from 'react'
import { useToast } from '../context/ToastContext'
import './components.css'

const Contact = () => {
  const { success: showSuccess, error: showError } = useToast()
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    message: ''
  })
  const [loading, setLoading] = useState(false)

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
      const response = await fetch('https://decode-studio.onrender.com/api/v1/contact', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(formData)
      })
      
      const data = await response.json()
      
      if (data.success) {
        showSuccess('Message sent successfully! We\'ll get back to you soon.')
        setFormData({ name: '', email: '', phone: '', message: '' })
      } else {
        showError(data.message || 'Failed to send message')
      }
    } catch (error) {
      showError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container">
          <h1>Get In Touch</h1>
          <p>Ready to start your project? Let's discuss how we can help bring your vision to life</p>
        </div>
      </section>

      <section className="contact-info-section">
        <div className="container">
          <div className="contact-info-grid">
            <div className="contact-info-card">
              <div className="info-icon email-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  <polyline points="22,6 12,13 2,6" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Email Us</h3>
              <p>muthusuresh@gmail.com</p>
              <span className="contact-subtitle">We'll respond within 24 hours</span>
            </div>
            
            <div className="contact-info-card">
              <div className="info-icon phone-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72 12.84 12.84 0 0 0 .7 2.81 2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45 12.84 12.84 0 0 0 2.81.7A2 2 0 0 1 22 16.92z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Call Us</h3>
              <p>+91 8610710063</p>
              <span className="contact-subtitle">Mon-Fri, 9AM-6PM IST</span>
            </div>
            
            <div className="contact-info-card">
              <div className="info-icon location-icon">
                <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z" stroke="currentColor" strokeWidth="2"/>
                  <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </div>
              <h3>Visit Us</h3>
              <p>Thiruvallur, Tamil Nadu</p>
              <span className="contact-subtitle">India</span>
            </div>
          </div>
        </div>
      </section>

      <section className="contact-form-section">
        <div className="container">
          <div className="form-container">
            <div className="form-header">
              <h2>Any Query Contact</h2>
            </div>

            <form className="modern-form" onSubmit={handleSubmit}>
              <div className="form-group">
                <input 
                  type="text" 
                  name="name" 
                  placeholder="Name" 
                  value={formData.name}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="email" 
                  name="email" 
                  placeholder="Email" 
                  value={formData.email}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <input 
                  type="text" 
                  name="phone" 
                  placeholder="Phone Number" 
                  value={formData.phone}
                  onChange={handleChange}
                  required 
                />
              </div>
              <div className="form-group">
                <textarea 
                  name="message" 
                  rows="5" 
                  placeholder="Send Message" 
                  value={formData.message}
                  onChange={handleChange}
                  required
                ></textarea>
              </div>
              <button type="submit" className="submit-button" disabled={loading}>
                <span>{loading ? 'Sending...' : 'Send Message'}</span>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                  <path d="M22 2L11 13" stroke="currentColor" strokeWidth="2"/>
                  <path d="M22 2L15 22L11 13L2 9L22 2Z" stroke="currentColor" strokeWidth="2"/>
                </svg>
              </button>
            </form>
          </div>
        </div>
      </section>
    </>
  )
}

export default Contact