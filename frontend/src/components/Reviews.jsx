import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import './components.css'

const Reviews = () => {
  const [reviews, setReviews] = useState([])
  const [totalReviews, setTotalReviews] = useState(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchReviews()
  }, [])

  const fetchReviews = async () => {
    try {
      const response = await fetch('https://decode-studio.onrender.com/api/v1/reviews')
      const data = await response.json()
      if (data.success) {
        setTotalReviews(data.reviews.length)
        setReviews(data.reviews.slice(0, 3))
      }
    } catch (error) {
      // Silent error handling for production
    } finally {
      setLoading(false)
    }
  }

  const renderStars = (rating) => {
    return '★'.repeat(rating) + '☆'.repeat(5 - rating)
  }

  return (
    <section className="home-reviews" id="reviews">
      <div className="container">
        <h2>Client Reviews</h2>
        <p className="sub">Don't just take our word for it - hear from our satisfied clients</p>
        <div className="reviews-row">
          {loading ? (
            <div className="loading">Loading reviews...</div>
          ) : reviews.length > 0 ? (
            reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="stars">{renderStars(review.rating)}</div>
                <p className="rev-text">"{review.comment}"</p>
                <strong className="author">{review.user.name}</strong>
                <div className="muted">{new Date(review.createdAt).toLocaleDateString()}</div>
              </div>
            ))
          ) : (
            <div className="review-card">
              <p className="rev-text">No reviews available yet.</p>
            </div>
          )}
        </div>
        {totalReviews >= 7 && (
          <div className="center">
            <Link to="/reviews" className="outline-btn">View All Reviews</Link>
          </div>
        )}
      </div>
    </section>
  )
}

export default Reviews