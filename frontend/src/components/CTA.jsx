import React from 'react'
import { Link } from 'react-router-dom'
import './components.css'

const CTA = () => {
  return (
    <section className="home-cta" id="cta">
      <div className="container cta-inner">
        <h2>Ready to Transform Your Digital Presence?</h2>
        <p>Let's discuss your project and create something amazing together</p>
        <div className="cta-buttons">
          <Link className="primary-btn" to="/services">Get Started Now</Link>
          <Link className="secondary-btn" to="/contact">Contact Us</Link>
        </div>
      </div>
    </section>
  )
}

export default CTA