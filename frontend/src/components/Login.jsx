import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './components.css'

const Login = () => {
  const [activeTab, setActiveTab] = useState('login')
  const [showForgotModal, setShowForgotModal] = useState(false)
  const [loading, setLoading] = useState(false)
  const { login, register } = useAuth()
  const { error, info } = useToast()
  const navigate = useNavigate()

  const handleTabSwitch = (tab) => {
    setActiveTab(tab)
  }

  const handleLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    const email = e.target.email.value
    const password = e.target.password.value
    
    const result = await login(email, password)
    
    if (result.success) {
      // Redirect based on user role
      if (result.user?.role === 'admin') {
        navigate('/admin')
      } else {
        navigate('/dashboard')
      }
    } else {
      // Error already shown by AuthContext
    }
    setLoading(false)
  }

  const handleSignUp = async (e) => {
    e.preventDefault()
    setLoading(true)
    const name = e.target.fullname.value
    const email = e.target.email.value
    const password = e.target.password.value
    const budget = e.target.budget.value
    
    const result = await register(name, email, password, budget)
    
    if (result.success) {
      // New users are always regular users, redirect to user dashboard
      navigate('/dashboard')
    } else {
      // Error already shown by AuthContext
    }
    setLoading(false)
  }

  const handleForgotPassword = (e) => {
    e.preventDefault()
    const email = e.target.email.value.trim()
    if (!email) {
      alert('Please enter your email address.')
      return
    }
    info(`If an account exists for ${email}, you will receive a password reset link shortly.`)
    e.target.reset()
    setShowForgotModal(false)
  }

  return (
    <>
      <section className="page-hero"></section>
      
      <main className="main-wrap">
        <div className="auth-card">
          <h1>Customer Portal</h1>

          <div className="tabs">
            <button 
              className={`tab ${activeTab === 'login' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('login')}
            >
              Login
            </button>
            <button 
              className={`tab ${activeTab === 'signup' ? 'active' : ''}`}
              onClick={() => handleTabSwitch('signup')}
            >
              Sign Up
            </button>
          </div>

          {activeTab === 'login' && (
            <form className="form active" onSubmit={handleLogin}>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" name="password" placeholder="Password" required />
              </label>
              <div className="form-row between">
                <button className="primary" type="submit" disabled={loading}>
                  {loading ? 'Logging in...' : 'Login'}
                </button>
              </div>
              <div className="helper-row">
                <button 
                  type="button"
                  className="muted link padding"
                  onClick={() => setShowForgotModal(true)}
                >
                  Forgot password?
                </button>
              </div>
            </form>
          )}

          {activeTab === 'signup' && (
            <form className="form active" onSubmit={handleSignUp}>
              <label>
                Full name
                <input type="text" name="fullname" placeholder="Your full name" required />
              </label>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <label>
                Password
                <input type="password" name="password" placeholder="Create a password" required />
              </label>
              <label>
                Budget (Optional)
                <input type="text" name="budget" placeholder="Your budget for services (e.g., 50000)" />
              </label>
              <button className="primary" type="submit" disabled={loading}>
                {loading ? 'Creating account...' : 'Sign Up'}
              </button>
              <div className="helper">
                <span className="muted">By signing up you agree to our terms.</span>
              </div>
            </form>
          )}
        </div>
      </main>

      {showForgotModal && (
        <div className="modal open">
          <div className="modal-overlay" onClick={() => setShowForgotModal(false)}></div>
          <div className="modal-panel">
            <button 
              className="modal-close" 
              onClick={() => setShowForgotModal(false)}
            >
              &times;
            </button>
            <h2>Reset your password</h2>
            <p className="muted">Enter the email address associated with your account. We'll send a link to reset your password.</p>
            <form className="fp-form" onSubmit={handleForgotPassword}>
              <label>
                Email
                <input type="email" name="email" placeholder="you@example.com" required />
              </label>
              <div className="modal-actions">
                <button 
                  type="button" 
                  className="btn-ghost"
                  onClick={() => setShowForgotModal(false)}
                >
                  Cancel
                </button>
                <button type="submit" className="primary">Send reset link</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  )
}

export default Login