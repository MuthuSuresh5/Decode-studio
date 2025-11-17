import React from 'react'
import './components.css'

const WhyChoose = () => {
  return (
    <section className="why-choose">
      <div className="container">
        <h2>Why Choose Decode Studio?</h2>
        <p className="sub">We're committed to excellence and your success</p>
        <div className="features-grid">
          <div className="feature">
            <div className="check">✔</div>
            <p>Expert team with 5+ years experience</p>
          </div>
          <div className="feature">
            <div className="check">✔</div>
            <p>100% client satisfaction rate</p>
          </div>
          <div className="feature">
            <div className="check">✔</div>
            <p>On-time project delivery</p>
          </div>
          <div className="feature">
            <div className="check">✔</div>
            <p>Affordable pricing packages</p>
          </div>
          <div className="feature">
            <div className="check">✔</div>
            <p>Free consultation & support</p>
          </div>
          <div className="feature">
            <div className="check">✔</div>
            <p>Modern tech stack</p>
          </div>
        </div>
      </div>
    </section>
  )
}

export default WhyChoose