import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './components.css'

const ServicesPage = () => {
  const { isAuthenticated } = useAuth()
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/v1/services')
      const data = await response.json()
      
      if (data.success) {
        setServices(data.services.filter(service => service.status === 'active'))
      } else {
        setError('Failed to fetch services')
      }
    } catch (error) {
      setError('Network error')
    } finally {
      setLoading(false)
    }
  }

  const getServiceIcon = (name) => {
    const iconMap = {
      'Web Development': '💻',
      'Web Design': '🎨',
      'Branding': '🏅',
      'Digital Marketing': '📣',
      'Video Editing': '🎥',
      'Poster Design': '📰'
    }
    return iconMap[name] || '⚡'
  }

  const formatPrice = (priceArray) => {
    if (priceArray && priceArray.length > 0) {
      const { from, to } = priceArray[0]
      return `₹${from.toLocaleString()} – ₹${to.toLocaleString()}`
    }
    return 'Contact for pricing'
  }

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading">Loading services...</div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="error-container">
        <div className="error-message">{error}</div>
      </div>
    )
  }

  return (
    <>
      <section className="contact-hero">
        <div className="container">
          <h1>Our Services</h1>
          <p>Comprehensive digital solutions to help your business grow and succeed online</p>
        </div>
      </section>

      <section className="services-grid">
        {services.length > 0 ? (
          services.map((service) => (
            <div key={service._id} className="service-card">
              <div className="icon">{getServiceIcon(service.name)}</div>
              <h2>{service.name}</h2>
              <p>{service.description}</p>
              <h3>Key Features:</h3>
              <ul className="features">
                {service.features.map((feature, index) => (
                  <li key={index}>{feature}</li>
                ))}
              </ul>
              <div className="price">Starting from <span>{formatPrice(service.price)}</span></div>
              {isAuthenticated ? (
                <Link to={`/order?service=${service._id}`} className="book-btn">Book Service →</Link>
              ) : (
                <Link to="/login" className="book-btn login-required">
                  Login to Book →
                </Link>
              )}
            </div>
          ))
        ) : (
          <div className="no-services">
            <h3>No services available at the moment</h3>
            <p>Please check back later or contact us for more information.</p>
          </div>
        )}
      </section>
    </>
  )
}

export default ServicesPage