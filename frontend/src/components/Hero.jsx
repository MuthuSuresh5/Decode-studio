import React from 'react'
import { Link } from 'react-router-dom'
import './components.css'

const Hero = () => {
  return (
    <section className="hero">
      <div className="hero-content">
        <h1>We Decode Digital Problems<br />Into Smart Solutions</h1>
        <p>Transform your business with cutting-edge web development, stunning design, and strategic digital marketing.</p>
        <div className="hero-btns">
          <Link className="primary-btn" to="/services">Get a Quote</Link>
          <Link className="secondary-btn" to="/services">View Services</Link>
        </div>
      </div>
    </section>
  )
}

export default Hero