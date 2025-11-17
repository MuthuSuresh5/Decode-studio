import React from 'react'
import './components.css'

const AboutPage = () => {
  return (
    <>
      <section className="about-hero">
        <div className="container hero-inner">
          <h1>About Decode Studio</h1>
          <p className="hero-sub">Your trusted partner for innovative digital solutions</p>
        </div>
      </section>

      <section className="our-story">
        <div className="container story-inner">
          <h2>Our Story</h2>
          <div className="story-content">
            <p>
              Decode Studio was founded with a simple yet powerful vision: to help businesses navigate the complex digital landscape and achieve their goals through innovative technology and creative design.
            </p>
            <p>
              What started as a small team of passionate developers and designers has grown into a full-service digital agency serving clients across industries. Our journey has been driven by our commitment to excellence, continuous learning, and staying ahead of technological trends.
            </p>
            <p>
              Today, we're proud to have helped numerous businesses establish their online presence, increase their reach, and achieve measurable results. Every project we undertake is approached with the same enthusiasm and dedication, regardless of size or scope.
            </p>
          </div>
        </div>
      </section>

      <section className="mvv-section">
        <div className="container mvv-grid">
          <div className="mvv-card">
            <div className="mvv-icon">🎯</div>
            <h3>Mission</h3>
            <p>To empower businesses with innovative digital solutions that drive growth and success in the digital age.</p>
          </div>
          <div className="mvv-card">
            <div className="mvv-icon">👁️</div>
            <h3>Vision</h3>
            <p>To be the leading digital agency recognized for creativity, excellence, and outstanding client satisfaction.</p>
          </div>
          <div className="mvv-card">
            <div className="mvv-icon">❤️</div>
            <h3>Values</h3>
            <p>Integrity, innovation, collaboration, and commitment to delivering exceptional results for every client.</p>
          </div>
        </div>
      </section>
    </>
  )
}

export default AboutPage