import React from 'react'
import Hero from './Hero'
import About from './About'
import Services from './Services'
import WhyChoose from './WhyChoose'
import Reviews from './Reviews'
import CTA from './CTA'
import './components.css'

const Home = () => {
  return (
    <>
      <Hero />
      <About />
      <Services />
      <WhyChoose />
      <Reviews />
      <CTA />
    </>
  )
}

export default Home
