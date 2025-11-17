import React from 'react'
import './components.css'
import { Link } from 'react-router-dom'

const About = () => {
  return (
    <section className="home-about" id="about">
      <div className="container">
        <h2>About Decode Studio</h2>
        <p className="lead">
          We are a passionate team of designers, developers, and digital strategists committed to helping businesses succeed online.
          With expertise in modern technologies and creative design, we deliver solutions that drive real results.
        </p>
        <div className="center">
          <Link to="/about" className="outline-btn">Learn More About Us</Link>
        </div>
      </div>
    </section>
  )
}

export default About