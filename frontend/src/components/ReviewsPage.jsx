import React, { useState, useEffect } from 'react'
import './components.css'

const ReviewsPage = () => {
  const [reviews, setReviews] = useState([])
  const [loading, setLoading] = useState(true)
  const [stats, setStats] = useState({ average: 0, total: 0, breakdown: {} })

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/reviews')
      const data = await response.json()
      if (data.success) {
        setReviews(data.reviews)
        calculateStats(data.reviews)
      }
    } catch (error) {
      console.error('Error fetching reviews:', error)
    } finally {
      setLoading(false)
    }
  }

  const calculateStats = (reviewsData) => {
    const total = reviewsData.length
    const sum = reviewsData.reduce((acc, review) => acc + review.rating, 0)
    const average = total > 0 ? (sum / total).toFixed(1) : 0
    
    const breakdown = {}
    for (let i = 1; i <= 5; i++) {
      breakdown[i] = reviewsData.filter(review => review.rating === i).length
    }
    
    setStats({ average, total, breakdown })
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  const getTimeAgo = (date) => {
    const now = new Date()
    const reviewDate = new Date(date)
    const diffTime = Math.abs(now - reviewDate)
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    
    if (diffDays === 1) return '1 day ago'
    if (diffDays < 30) return `${diffDays} days ago`
    if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`
    return `${Math.floor(diffDays / 365)} years ago`
  }

  return (
    <>
      <section className="reviews-hero">
        <div className="container">
          <div className="hero-content">
            <h1>Client Reviews & Testimonials</h1>
            <p>Discover what our clients say about their experience working with Decode Studio</p>
            
            {!loading && reviews.length > 0 && (
              <div className="reviews-stats">
                <div className="overall-rating">
                  <div className="rating-number">{stats.average}</div>
                  <div className="rating-details">
                    <div className="stars-large">{renderStars(Math.round(stats.average))}</div>
                    <p>Based on {stats.total} reviews</p>
                  </div>
                </div>
                
                <div className="rating-breakdown">
                  {[5, 4, 3, 2, 1].map(star => (
                    <div key={star} className="breakdown-row">
                      <span>{star} ★</span>
                      <div className="progress-bar">
                        <div 
                          className="progress-fill" 
                          style={{ width: `${stats.total > 0 ? (stats.breakdown[star] / stats.total) * 100 : 0}%` }}
                        ></div>
                      </div>
                      <span>{stats.breakdown[star]}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </section>

      <section className="reviews-content">
        <div className="container">
          {loading ? (
            <div className="loading-state">
              <div className="loading-spinner"></div>
              <p>Loading reviews...</p>
            </div>
          ) : reviews.length > 0 ? (
            <div className="reviews-masonry">
              {reviews.map((review) => (
                <div key={review._id} className="review-card-professional">
                  <div className="review-top">
                    <div className="reviewer-info">
                      <div className="avatar">
                        {review.user.name.charAt(0).toUpperCase()}
                      </div>
                      <div className="reviewer-details">
                        <h4>{review.user.name}</h4>
                        <span className="review-time">{getTimeAgo(review.createdAt)}</span>
                      </div>
                    </div>
                    <div className="rating-display">
                      <div className="stars">{renderStars(review.rating)}</div>
                      <span className="rating-number">({review.rating}/5)</span>
                    </div>
                  </div>
                  
                  <div className="review-content">
                    <p>"{review.comment}"</p>
                  </div>
                  
                  <div className="review-footer">
                    <span className="verified-badge">✓ Verified Client</span>
                  </div>
                </div>
              ))}
            </div>
          ) : (
            <div className="empty-reviews">
              <div className="empty-icon">⭐</div>
              <h3>No Reviews Yet</h3>
              <p>Be the first to share your experience with Decode Studio!</p>
            </div>
          )}
        </div>
      </section>
    </>
  )
}

export default ReviewsPage