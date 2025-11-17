import React, { useState, useEffect, useRef } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import './components.css'

const Header = ({ onSidebarToggle }) => {
  const { isAuthenticated, isAdmin, user, logout } = useAuth()
  const [showDropdown, setShowDropdown] = useState(false)
  const [reviewCount, setReviewCount] = useState(0)
  const dropdownRef = useRef(null)
  const location = useLocation()
  const isDashboard = location.pathname === '/dashboard' || location.pathname === '/admin'

  const handleLogout = () => {
    logout()
    setShowDropdown(false)
  }

  const toggleDropdown = () => {
    setShowDropdown(!showDropdown)
  }

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setShowDropdown(false)
      }
    }

    const fetchReviewCount = async () => {
      try {
        const response = await fetch('http://localhost:5000/api/v1/reviews')
        const data = await response.json()
        if (data.success) {
          setReviewCount(data.reviews.length)
        }
      } catch (error) {
        console.error('Error fetching review count:', error)
      }
    }

    fetchReviewCount()
    document.addEventListener('mousedown', handleClickOutside)
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
  }, [])

  return (
    <header className="navbar">
      {isDashboard && (
        <button 
          className="navbar-sidebar-toggle"
          onClick={onSidebarToggle}
          title="Toggle Sidebar"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
            <path d="M3 12h18M3 6h18M3 18h18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
      )}
      <Link to="/" className="logo">Decode<span>Studio</span></Link>
      <nav className="menu">
        <Link to="/">Home</Link>
        <Link to="/about">About</Link>
        <Link to="/services">Services</Link>
        {reviewCount >= 7 && <Link to="/reviews">Reviews</Link>}
        <Link to="/contact">Contact</Link>
      </nav>
      <div className="nav-right">
        
        {isAuthenticated ? (
          <div className="user-menu" ref={dropdownRef}>
            <button className="user-profile-btn" onClick={toggleDropdown}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
              </svg>
            </button>
            {showDropdown && (
              <div className="user-dropdown">
                <div className="dropdown-header">
                  <p className="user-name">{user?.name}</p>
                  <p className="user-email">{user?.email}</p>
                </div>
                <div className="dropdown-menu">
                  <Link 
                    to={isAdmin ? "/admin" : "/dashboard"} 
                    className="dropdown-item"
                    onClick={() => setShowDropdown(false)}
                  >
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                      <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    {isAdmin ? 'Admin Panel' : 'Dashboard'}
                  </Link>
                  <button className="dropdown-item logout-item" onClick={handleLogout}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
                      <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
                      <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Logout
                  </button>
                </div>
              </div>
            )}
          </div>
        ) : (
          <Link className="login-btn" to="/login">Login</Link>
        )}
      </div>
    </header>
  )
}

export default Header
