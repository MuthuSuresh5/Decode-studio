import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './components.css'

const AdminDashboard = ({ sidebarOpen, setSidebarOpen }) => {
  const { user, logout } = useAuth()
  const { success, error, info } = useToast()
  const [activeTab, setActiveTab] = useState('dashboard')
  const [stats, setStats] = useState({ totalUsers: 0, totalOrders: 0, totalReviews: 0, totalServices: 0, totalMessages: 0 })
  const [users, setUsers] = useState([])
  const [orders, setOrders] = useState([])
  const [reviews, setReviews] = useState([])
  const [services, setServices] = useState([])
  const [messages, setMessages] = useState([])
  const [loading, setLoading] = useState(true)
  const [showModal, setShowModal] = useState(false)
  const [modalType, setModalType] = useState('')
  const [editItem, setEditItem] = useState(null)

  useEffect(() => {
    fetchAllData()
  }, [])

  // Handle body scroll when sidebar is open on mobile
  useEffect(() => {
    if (window.innerWidth <= 768) {
      if (sidebarOpen) {
        document.body.classList.add('sidebar-open')
      } else {
        document.body.classList.remove('sidebar-open')
      }
    }
    
    return () => {
      document.body.classList.remove('sidebar-open')
    }
  }, [sidebarOpen])

  const fetchAllData = async () => {
    setLoading(true)
    await Promise.all([
      fetchUsers(),
      fetchOrders(),
      fetchReviews(),
      fetchServices(),
      fetchMessages()
    ])
    setLoading(false)
  }

  const fetchUsers = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/admin/users', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) setUsers(data.users)
    } catch (error) {
      // Silent error handling for production
    }
  }

  const fetchOrders = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/admin/orders', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) setOrders(data.orders)
    } catch (error) {
      // Silent error handling for production
    }
  }

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/reviews')
      const data = await response.json()
      if (data.success) setReviews(data.reviews)
    } catch (error) {
      // Silent error handling for production
    }
  }

  const fetchServices = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/services')
      const data = await response.json()
      if (data.success) setServices(data.services)
    } catch (error) {
      // Silent error handling for production
    }
  }

  const fetchMessages = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/admin/contacts', {
        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
      })
      const data = await response.json()
      if (data.success) setMessages(data.contacts)
    } catch (error) {
      // Silent error handling for production
    }
  }

  const handleLogout = () => {
    logout()
    window.location.href = '/'
  }

  const openModal = (type, item = null) => {
    setModalType(type)
    setEditItem(item)
    setShowModal(true)
  }

  const closeModal = () => {
    setShowModal(false)
    setEditItem(null)
    setModalType('')
  }

  const handleSave = async (e) => {
    e.preventDefault()
    
    const form = document.querySelector('.admin-form')
    const formData = new FormData(form)
    let data = Object.fromEntries(formData.entries())
    
    // Handle service data structure
    if (modalType === 'service') {
      // Handle price structure
      if (data.priceFrom && data.priceTo) {
        data.price = [{
          from: parseInt(data.priceFrom),
          to: parseInt(data.priceTo)
        }]
        delete data.priceFrom
        delete data.priceTo
      }
      
      // Handle features array
      if (data.features) {
        data.features = data.features.split(',').map(f => f.trim()).filter(f => f.length > 0)
      } else {
        data.features = []
      }
    }
    
    try {
      const endpoints = {
        user: editItem ? `https://decode-studio.onrender.com/api/admin/user/${editItem._id}` : 'https://decode-studio.onrender.com/api/admin/user',
        order: editItem ? `https://decode-studio.onrender.com/api/v1/admin/order/${editItem._id}` : 'https://decode-studio.onrender.com/api/v1/order/new',
        service: editItem ? `https://decode-studio.onrender.com/api/v1/service/${editItem._id}` : 'https://decode-studio.onrender.com/api/v1/service/new'
      }
      
      const method = editItem ? 'PUT' : 'POST'
      
      const response = await fetch(endpoints[modalType], {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify(data)
      })
      
      if (response.ok) {
        success(editItem ? 'Item updated successfully!' : 'Item created successfully!')
        closeModal()
        fetchAllData()
      } else {
        const errorData = await response.json()
        error('Failed to save: ' + (errorData.message || 'Unknown error'))
      }
    } catch (err) {
      error('Error saving item: ' + err.message)
    }
  }

  const handleDelete = async (type, id) => {
    if (!confirm('Are you sure you want to delete this item?')) return
    
    try {
      const endpoints = {
        user: `https://decode-studio.onrender.com/api/admin/user/${id}`,
        order: `https://decode-studio.onrender.com/api/v1/admin/order/${id}`,
        review: `https://decode-studio.onrender.com/api/v1/reviews/${id}`,
        service: `https://decode-studio.onrender.com/api/v1/service/${id}`,
        message: `https://decode-studio.onrender.com/api/admin/contact/${id}`
      }
      
      const response = await fetch(endpoints[type], {
        method: 'DELETE',
        headers: { 
          'Authorization': `Bearer ${localStorage.getItem('token')}`,
          'Content-Type': 'application/json'
        }
      })
      
      if (response.ok) {
        success('Item deleted successfully!')
        fetchAllData()
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }))
        error('Failed to delete: ' + (errorData.message || `HTTP ${response.status}`))
      }
    } catch (err) {
      error('Network error: ' + err.message)
    }
  }

  const updateStats = () => {
    setStats({
      totalUsers: users.length,
      totalOrders: orders.length,
      totalReviews: reviews.length,
      totalServices: services.length,
      totalMessages: messages.length
    })
  }

  useEffect(() => {
    updateStats()
  }, [users, orders, reviews, services, messages])

  return (
    <div className="admin-layout">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div 
          className="mobile-overlay" 
          onClick={() => setSidebarOpen(false)}
        ></div>
      )}
      
      <aside className={`admin-sidebar ${!sidebarOpen ? 'closed' : ''} ${sidebarOpen ? 'open' : ''}`}>
        <button className="admin-sidebar-close-btn" onClick={() => setSidebarOpen(false)}>×</button>
        
        <div className="admin-sidebar-header">
          <div className="admin-profile">
            <div className="admin-avatar">{user?.name?.charAt(0).toUpperCase()}</div>
            <div className="admin-details">
              <h3>{user?.name}</h3>
              <p>Administrator</p>
            </div>
          </div>
        </div>

        <nav className="admin-nav">
          <button className={`admin-nav-item ${activeTab === 'dashboard' ? 'active' : ''}`} onClick={() => setActiveTab('dashboard')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <rect x="3" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="3" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="14" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
              <rect x="3" y="14" width="7" height="7" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Dashboard
          </button>

          <button className={`admin-nav-item ${activeTab === 'users' ? 'active' : ''}`} onClick={() => setActiveTab('users')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
              <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Users <span className="nav-badge">{users.length}</span>
          </button>

          <button className={`admin-nav-item ${activeTab === 'orders' ? 'active' : ''}`} onClick={() => setActiveTab('orders')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Orders <span className="nav-badge">{orders.length}</span>
          </button>

          <button className={`admin-nav-item ${activeTab === 'services' ? 'active' : ''}`} onClick={() => setActiveTab('services')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Services <span className="nav-badge">{services.length}</span>
          </button>

          <button className={`admin-nav-item ${activeTab === 'reviews' ? 'active' : ''}`} onClick={() => setActiveTab('reviews')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Reviews <span className="nav-badge">{reviews.length}</span>
          </button>

          <button className={`admin-nav-item ${activeTab === 'messages' ? 'active' : ''}`} onClick={() => setActiveTab('messages')}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Messages <span className="nav-badge">{messages.length}</span>
          </button>
        </nav>

        <div className="admin-sidebar-footer">
          <button className="admin-logout-btn" onClick={handleLogout}>
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" stroke="currentColor" strokeWidth="2"/>
              <polyline points="16,17 21,12 16,7" stroke="currentColor" strokeWidth="2"/>
              <line x1="21" y1="12" x2="9" y2="12" stroke="currentColor" strokeWidth="2"/>
            </svg>
            Logout
          </button>
        </div>
      </aside>

      <main className={`admin-main ${!sidebarOpen ? 'sidebar-closed' : ''}`}>
        {activeTab === 'dashboard' && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Admin Dashboard</h1>
              <p>Manage your business operations</p>
              {user?.role !== 'admin' && (
                <button 
                  className="admin-add-btn" 
                  onClick={async () => {
                    try {
                      const response = await fetch(`https://decode-studio.onrender.com/api/admin/make-admin/${user._id}`, {
                        method: 'PUT',
                        headers: { 'Authorization': `Bearer ${localStorage.getItem('token')}` }
                      })
                      if (response.ok) {
                        success('User role updated to admin! Please refresh the page.')
                        setTimeout(() => window.location.reload(), 1500)
                      } else {
                        error('Failed to update user role')
                      }
                    } catch (err) {
                      error('Network error: ' + err.message)
                    }
                  }}
                >
                  Make Me Admin
                </button>
              )}
            </div>

            <div className="admin-stats-grid">
              <div className="admin-stat-card">
                <div className="stat-icon users">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" stroke="currentColor" strokeWidth="2"/>
                    <circle cx="12" cy="7" r="4" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalUsers}</h3>
                  <p>Total Users</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon orders">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalOrders}</h3>
                  <p>Total Orders</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon services">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalServices}</h3>
                  <p>Services</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon reviews">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <polygon points="12,2 15.09,8.26 22,9.27 17,14.14 18.18,21.02 12,17.77 5.82,21.02 7,14.14 2,9.27 8.91,8.26" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalReviews}</h3>
                  <p>Reviews</p>
                </div>
              </div>

              <div className="admin-stat-card">
                <div className="stat-icon messages">
                  <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                    <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" stroke="currentColor" strokeWidth="2"/>
                  </svg>
                </div>
                <div className="stat-content">
                  <h3>{stats.totalMessages}</h3>
                  <p>Messages</p>
                </div>
              </div>
            </div>

            <div className="admin-overview-grid">
              <div className="admin-panel">
                <h3>Recent Orders</h3>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Service</th>
                        <th>Status</th>
                        <th>Date</th>
                      </tr>
                    </thead>
                    <tbody>
                      {orders.slice(0, 5).map(order => (
                        <tr key={order._id}>
                          <td>{order.user?.name || 'N/A'}</td>
                          <td>{order.service}</td>
                          <td><span className={`status-badge ${order.Orderstatus?.toLowerCase().replace(' ', '')}`}>{order.Orderstatus}</span></td>
                          <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              <div className="admin-panel">
                <h3>Recent Reviews</h3>
                <div className="admin-table-container">
                  <table className="admin-table">
                    <thead>
                      <tr>
                        <th>User</th>
                        <th>Rating</th>
                        <th>Comment</th>
                      </tr>
                    </thead>
                    <tbody>
                      {reviews.slice(0, 5).map(review => (
                        <tr key={review._id}>
                          <td>{review.user?.name || 'N/A'}</td>
                          <td>{'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}</td>
                          <td>{review.comment.substring(0, 50)}...</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Users Tab */}
        {activeTab === 'users' && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Users Management</h1>
              <button className="admin-add-btn" onClick={() => openModal('user')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Add User
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Role</th>
                    <th>Joined</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {users.map(user => (
                    <tr key={user._id}>
                      <td>{user.name}</td>
                      <td>{user.email}</td>
                      <td><span className="role-badge">{user.role}</span></td>
                      <td>{new Date(user.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => openModal('user', user)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete('user', user._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Orders Tab */}
        {activeTab === 'orders' && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Orders Management</h1>
              <button className="admin-add-btn" onClick={() => openModal('order')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Add Order
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Service</th>
                    <th>Description</th>
                    <th>Status</th>
                    <th>Budget</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map(order => (
                    <tr key={order._id}>
                      <td>{order.user?.name || 'N/A'}</td>
                      <td>{order.service}</td>
                      <td>{order.description?.substring(0, 30)}...</td>
                      <td><span className={`status-badge ${order.Orderstatus?.toLowerCase().replace(' ', '')}`}>{order.Orderstatus}</span></td>
                      <td>{order.budget}</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => openModal('order', order)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete('order', order._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Services Tab */}
        {activeTab === 'services' && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Services Management</h1>
              <button className="admin-add-btn" onClick={() => openModal('service')}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none">
                  <path d="M12 5v14m-7-7h14" stroke="currentColor" strokeWidth="2"/>
                </svg>
                Add Service
              </button>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Description</th>
                    <th>Price Range</th>
                    <th>Status</th>
                    <th>Orders/Limit</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {services.map(service => (
                    <tr key={service._id}>
                      <td>{service.name}</td>
                      <td>{service.description?.substring(0, 40)}...</td>
                      <td>
                        {service.price && service.price[0] ? 
                          `₹${service.price[0].from} - ₹${service.price[0].to}` : 
                          'Contact for pricing'
                        }
                      </td>
                      <td>
                        <span className={`status-badge ${service.status}`}>{service.status}</span>
                        {service.limit && !service.isAvailable && (
                          <span className="status-badge limitreached" style={{marginLeft: '5px'}}>Limit Reached</span>
                        )}
                      </td>
                      <td>
                        {service.orderCount || 0}
                        {service.limit ? `/${service.limit}` : '/∞'}
                        {service.limit && !service.isAvailable && (
                          <span style={{color: '#dc2626', fontSize: '12px', display: 'block'}}>Limit reached</span>
                        )}
                      </td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => openModal('service', service)}>Edit</button>
                          <button className="delete-btn" onClick={() => handleDelete('service', service._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Reviews Tab */}
        {activeTab === 'reviews' && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Reviews Management</h1>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>User</th>
                    <th>Rating</th>
                    <th>Comment</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {reviews.map(review => (
                    <tr key={review._id}>
                      <td>{review.user?.name || 'N/A'}</td>
                      <td>
                        <div className="rating-display">
                          {'★'.repeat(review.rating)}{'☆'.repeat(5-review.rating)}
                          <span className="rating-number">({review.rating}/5)</span>
                        </div>
                      </td>
                      <td className="comment-cell">{review.comment}</td>
                      <td>{new Date(review.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="delete-btn" onClick={() => handleDelete('review', review._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Messages Tab */}
        {activeTab === 'messages' && (
          <div className="admin-content">
            <div className="admin-header">
              <h1>Messages Management</h1>
            </div>

            <div className="admin-table-container">
              <table className="admin-table">
                <thead>
                  <tr>
                    <th>Name</th>
                    <th>Email</th>
                    <th>Phone</th>
                    <th>Message</th>
                    <th>Date</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {messages.map(message => (
                    <tr key={message._id}>
                      <td>{message.name}</td>
                      <td>{message.email}</td>
                      <td>{message.phone}</td>
                      <td className="comment-cell">{message.message?.substring(0, 50)}...</td>
                      <td>{new Date(message.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="action-buttons">
                          <button className="edit-btn" onClick={() => openModal('message', message)}>View</button>
                          <button className="delete-btn" onClick={() => handleDelete('message', message._id)}>Delete</button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </main>

      {/* Modal for Add/Edit Operations */}
      {showModal && (
        <div className="admin-modal">
          <div className="modal-overlay" onClick={closeModal}></div>
          <div className="modal-content">
            <div className="modal-header">
              <h3>{editItem ? 'Edit' : 'Add'} {modalType.charAt(0).toUpperCase() + modalType.slice(1)}</h3>
              <button className="modal-close" onClick={closeModal}>×</button>
            </div>
            <div className="modal-body">
              {modalType === 'user' && (
                <form className="admin-form">
                  <div className="form-group">
                    <label>Name</label>
                    <input type="text" name="name" defaultValue={editItem?.name || ''} required />
                  </div>
                  <div className="form-group">
                    <label>Email</label>
                    <input type="email" name="email" defaultValue={editItem?.email || ''} required />
                  </div>
                  {!editItem && (
                    <div className="form-group">
                      <label>Password</label>
                      <input type="password" name="password" required />
                    </div>
                  )}
                  <div className="form-group">
                    <label>Role</label>
                    <select name="role" defaultValue={editItem?.role || 'user'}>
                      <option value="user">User</option>
                      <option value="admin">Admin</option>
                    </select>
                  </div>
                </form>
              )}
              
              {modalType === 'order' && (
                <form className="admin-form" id="orderForm">
                  <div className="form-group">
                    <label>Service</label>
                    <input type="text" name="service" defaultValue={editItem?.service || ''} />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" defaultValue={editItem?.description || ''}></textarea>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Budget</label>
                      <input type="text" name="budget" defaultValue={editItem?.budget || ''} />
                    </div>
                    <div className="form-group">
                      <label>Deadline</label>
                      <input type="text" name="deadline" defaultValue={editItem?.deadline || ''} />
                    </div>
                  </div>
                  <div className="form-group">
                    <label>Order Status</label>
                    <select name="Orderstatus" defaultValue={editItem?.Orderstatus || 'Processing'}>
                      <option value="Processing">Processing</option>
                      <option value="In Progress">In Progress</option>
                      <option value="Delivered">Delivered</option>
                      <option value="Cancelled">Cancelled</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label>Phone Number</label>
                    <input type="text" name="phoneNumber" defaultValue={editItem?.phoneNumber || ''} />
                  </div>
                </form>
              )}
              
              {modalType === 'service' && (
                <form className="admin-form">
                  <div className="form-group">
                    <label>Service Name</label>
                    <input type="text" name="name" defaultValue={editItem?.name || ''} required />
                  </div>
                  <div className="form-group">
                    <label>Description</label>
                    <textarea name="description" defaultValue={editItem?.description || ''} required></textarea>
                  </div>
                  <div className="form-group">
                    <label>Features (comma-separated)</label>
                    <textarea 
                      name="features" 
                      placeholder="e.g. Responsive Design, SEO Optimization, Fast Loading"
                      defaultValue={editItem?.features?.join(', ') || ''} 
                      required
                    ></textarea>
                    <small>Enter features separated by commas</small>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Price From (₹)</label>
                      <input type="number" name="priceFrom" defaultValue={editItem?.price?.[0]?.from || ''} required />
                    </div>
                    <div className="form-group">
                      <label>Price To (₹)</label>
                      <input type="number" name="priceTo" defaultValue={editItem?.price?.[0]?.to || ''} required />
                    </div>
                  </div>
                  <div className="form-row">
                    <div className="form-group">
                      <label>Status</label>
                      <select name="status" defaultValue={editItem?.status || 'active'}>
                        <option value="active">Active</option>
                        <option value="inactive">Inactive</option>
                      </select>
                    </div>
                    <div className="form-group">
                      <label>Order Limit</label>
                      <input 
                        type="number" 
                        name="limit" 
                        min="0" 
                        placeholder="Leave empty for unlimited"
                        defaultValue={editItem?.limit || ''} 
                      />
                      <small>Maximum number of orders allowed</small>
                    </div>
                  </div>
                </form>
              )}
              
              {modalType === 'message' && editItem && (
                <div className="message-view">
                  <div className="message-detail">
                    <strong>Name:</strong> {editItem.name}
                  </div>
                  <div className="message-detail">
                    <strong>Email:</strong> {editItem.email}
                  </div>
                  <div className="message-detail">
                    <strong>Phone:</strong> {editItem.phone}
                  </div>
                  <div className="message-detail">
                    <strong>Message:</strong>
                    <p>{editItem.message}</p>
                  </div>
                  <div className="message-detail">
                    <strong>Date:</strong> {new Date(editItem.createdAt).toLocaleString()}
                  </div>
                </div>
              )}
            </div>
            <div className="modal-footer">
              <button className="btn-cancel" onClick={closeModal}>Cancel</button>
              {modalType !== 'message' && (
                <button className="btn-save" onClick={handleSave}>Save</button>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

export default AdminDashboard