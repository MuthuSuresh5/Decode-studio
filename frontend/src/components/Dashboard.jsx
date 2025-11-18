import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import ReviewForm from './ReviewForm'
import './components.css'

const Dashboard = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth()
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('overview')
  const [showReviewForm, setShowReviewForm] = useState(false)
  
  useEffect(() => {
    fetchOrders()
    fetchReviews()
  }, [])

  const fetchOrders = async () => {
    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://decode-studio.onrender.com/api/v1/myorders', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      })
      const data = await response.json()
      if (data.success) {
        setOrders(data.orders)
      }
    } catch (error) {
      console.error('Error fetching orders:', error)
    } finally {
      setLoading(false)
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/reviews')
      const data = await response.json()
      if (data.success) {
        // Filter reviews to show only current user's reviews
        const userReviews = data.reviews.filter(review => review.user._id === user._id)
        setReviews(userReviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    }
  }
  
  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const handleReviewSubmitted = () => {
    fetchReviews()
  }

  const openReviewForm = () => {
    setShowReviewForm(true)
  }

  const closeReviewForm = () => {
    setShowReviewForm(false)
  }

  const getOrderStats = () => {
    const total = orders.length
    const processing = orders.filter(o => o.Orderstatus === 'Processing').length
    const completed = orders.filter(o => o.Orderstatus === 'Delivered').length
    const inProgress = orders.filter(o => o.Orderstatus === 'In Progress').length
    return { total, processing, completed, inProgress }
  }

  const stats = getOrderStats()
  const hasDeliveredOrder = orders.some(order => order.Orderstatus === 'Delivered')

  return (
    <div className="dashboard-layout">
      {/* Sidebar */}
      <aside className={`sidebar ${!sidebarOpen ? 'closed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <button 
          className="sidebar-close-btn"
          onClick={() => setSidebarOpen(false)}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
            <line x1="18" y1="6" x2="6" y2="18" stroke="currentColor" strokeWidth="2"/>
            <line x1="6" y1="6" x2="18" y2="18" stroke="currentColor" strokeWidth="2"/>
          </svg>
        </button>
        <div className="sidebar-header">
          <div className="user-profile">
            <div className="user-avatar">
              <span>{user?.name?.charAt(0).toUpperCase()}</span>
            </div>
            <div className="user-details">
              <h3>{user?.name}</h3>
              <p>{user?.email}</p>
            </div>
          </div>
        </div>

        <nav className="sidebar-nav">
          <button 
            className={`nav-item ${activeTab === 'overview' ? 'active' : ''}`}
            onClick={() => setActiveTab('overview')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Overview</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'orders' ? 'active' : ''}`}
            onClick={() => setActiveTab('orders')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>My Orders</span>
            <span className="badge">{orders.length}</span>
          </button>

          <button 
            className={`nav-item ${activeTab === 'reviews' ? 'active' : ''}`}
            onClick={() => setActiveTab('reviews')}
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>My Reviews</span>
            <span className="badge">{reviews.length}</span>
          </button>

          <Link to="/services" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>New Order</span>
          </Link>

          <Link to="/contact" className="nav-item">
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Support</span>
          </Link>
        </nav>

        <div className="sidebar-footer">
          <button className="logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            <span>Logout</span>
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className={`main-content ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {activeTab === 'overview' && (
          <div className="content-section">
            <div className="page-header">
              <h1>Dashboard Overview</h1>
              <p>Welcome back, {user?.name}! Here's what's happening with your account.</p>
            </div>

            <div className="stats-grid">
              <div className="stat-card">
                <div className="stat-icon total">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.total}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon processing">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.processing}</h3>
                  <p>Processing</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon progress">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.inProgress}</h3>
                  <p>In Progress</p>
                </div>
              </div>

              <div className="stat-card">
                <div className="stat-icon completed">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <polyline points="22,4 12,14.01 9,11.01" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.completed}</h3>
                  <p>Completed</p>
                </div>
              </div>
            </div>

            <div className="content-grid">
              <div className="content-card">
                <h3>Recent Orders</h3>
                <div className="recent-orders">
                  {orders.slice(0, 5).map(order => (
                    <div key={order._id} className="order-item">
                      <div className="order-info">
                        <h4>{order.service}</h4>
                        <p>{order.description.substring(0, 50)}...</p>
                        <span className="order-date">{new Date(order.createdAt).toLocaleDateString()}</span>
                      </div>
                      <span className={`status-badge ${order.Orderstatus?.toLowerCase().replace(' ', '')}`}>
                        {order.Orderstatus}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="content-card">
                <h3>Quick Actions</h3>
                <div className="quick-actions">
                  <Link to="/services" className="action-btn primary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Place New Order
                  </Link>
                  
                  {hasDeliveredOrder && (
                    <button className="action-btn secondary" onClick={openReviewForm}>
                      <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Write Review
                    </button>
                  )}
                  
                  <Link to="/contact" className="action-btn secondary">
                    <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                      <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                    Contact Support
                  </Link>
                </div>
              </div>
            </div>
          </div>
        )}

        {activeTab === 'orders' && (
          <div className="content-section">
            <div className="page-header">
              <h1>My Orders</h1>
              <p>Track and manage all your service orders</p>
            </div>

            {loading ? (
              <div className="loading-state">Loading orders...</div>
            ) : orders.length > 0 ? (
              <div className="orders-table-container">
                <table className="orders-table">
                  <thead>
                    <tr>
                      <th>Service</th>
                      <th>Description</th>
                      <th>Status</th>
                      <th>Budget</th>
                      <th>Date</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map(order => (
                      <tr key={order._id}>
                        <td><strong>{order.service}</strong></td>
                        <td>{order.description.substring(0, 60)}...</td>
                        <td>
                          <span className={`status-badge ${order.Orderstatus?.toLowerCase().replace(' ', '')}`}>
                            {order.Orderstatus}
                          </span>
                        </td>
                        <td><strong>{order.budget}</strong></td>
                        <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="empty-state">
                <div className="empty-icon">📦</div>
                <h3>No orders yet</h3>
                <p>Start by placing your first order</p>
                <Link to="/services" className="action-btn primary">Browse Services</Link>
              </div>
            )}
          </div>
        )}

        {activeTab === 'reviews' && (
          <div className="content-section">
            <div className="page-header">
              <div className="header-with-action">
                <div>
                  <h1>My Reviews</h1>
                  <p>Reviews you have submitted for our services</p>
                </div>
                {hasDeliveredOrder && (
                  <button className="review-btn" onClick={openReviewForm}>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                      <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" fill="currentColor"/>
                    </svg>
                    Write Review
                  </button>
                )}
              </div>
            </div>

            {hasDeliveredOrder ? (
              reviews.length > 0 ? (
                <div className="dashboard-reviews-section">
                  <div className="reviews-stats-mini">
                    <div className="stat-mini">
                      <span className="stat-number">{reviews.length}</span>
                      <span className="stat-label">Total Reviews</span>
                    </div>
                    <div className="stat-mini">
                      <span className="stat-number">{(reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length).toFixed(1)}</span>
                      <span className="stat-label">Average Rating</span>
                    </div>
                  </div>
                  
                  <div className="dashboard-reviews-grid">
                    {reviews.map(review => (
                      <div key={review._id} className="dashboard-review-card">
                        <div className="review-card-header">
                          <div className="rating-section">
                            <div className="stars-display">
                              {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                            </div>
                            <span className="rating-text">({review.rating}/5)</span>
                          </div>
                          <span className="review-timestamp">{new Date(review.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' })}</span>
                        </div>
                        
                        <div className="review-content-section">
                          <p className="review-text">"{review.comment}"</p>
                        </div>
                        
                        <div className="review-card-footer">
                          <div className="author-badge">
                            <div className="author-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
                            <span className="author-name">You</span>
                          </div>
                          <span className="verified-tag">✓ Verified</span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ) : (
                <div className="empty-state-modern">
                  <div className="empty-illustration">
                    <div className="empty-circle">
                      <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                        <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2" fill="none"/>
                      </svg>
                    </div>
                  </div>
                  <h3>No reviews yet</h3>
                  <p>Share your experience with our services</p>
                  {hasDeliveredOrder && (
                    <button className="action-btn primary" onClick={openReviewForm} style={{marginTop: '20px'}}>
                      <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                        <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                      </svg>
                      Write Your First Review
                    </button>
                  )}
                </div>
              )
            ) : (
              <div className="empty-state-modern">
                <div className="empty-illustration">
                  <div className="empty-circle locked">
                    <svg width="48" height="48" viewBox="0 0 24 24" fill="none">
                      <rect x="3" y="11" width="18" height="11" rx="2" ry="2" stroke="currentColor" strokeWidth="2"/>
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" stroke="currentColor" strokeWidth="2"/>
                    </svg>
                  </div>
                </div>
                <h3>Reviews Locked</h3>
                <p>Complete your first order to unlock the ability to write reviews</p>
                <Link to="/services" className="action-btn secondary" style={{marginTop: '20px'}}>
                  Browse Services
                </Link>
              </div>
            )}
          </div>
        )}
      </main>
      
      {showReviewForm && (
        <ReviewForm 
          onClose={closeReviewForm}
          onReviewSubmitted={handleReviewSubmitted}
        />
      )}
    </div>
  )
}

export default Dashboard