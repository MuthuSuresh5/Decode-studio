import React, { useState, useEffect } from 'react'
import './components.css'
import { Link } from 'react-router-dom'

const Services = () => {
  const [services, setServices] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchServices()
  }, [])

  const fetchServices = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/services')
      const data = await response.json()
      if (data.success) {
        setServices(data.services.filter(service => service.status === 'active').slice(0, 4))
      }
    } catch (error) {
      // Silent error handling for production
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

  return (
    <section className="home-services" id="services">
      <div className="container">
        <h2>Our Services</h2>
        <p className="sub">Comprehensive digital solutions tailored to your business needs</p>
        <div className="services-row">
          {loading ? (
            <div className="loading">Loading services...</div>
          ) : services.length > 0 ? (
            services.map((service) => (
              <article key={service._id} className="service-card small">
                <div className="icon">{getServiceIcon(service.name)}</div>
                <h3>{service.name}</h3>
                <p>{service.description}</p>
              </article>
            ))
          ) : (
            <div className="no-services">
              <p>No services available at the moment.</p>
            </div>
          )}
        </div>
        <div className="center">
          <Link to="/services" className="outlines-btn">View All Services</Link>
        </div>
      </div>
    </section>
  )
}

export default Services