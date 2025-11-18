import React, { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useToast } from '../context/ToastContext'
import './components.css'

const ReviewForm = ({ onClose, onReviewSubmitted }) => {
  const { user } = useAuth()
  const { success, error: showError } = useToast()
  const [rating, setRating] = useState(5)
  const [comment, setComment] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError('')

    try {
      const token = localStorage.getItem('token')
      const response = await fetch('https://decode-studio.onrender.com/api/v1/review', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ rating, comment })
      })

      const data = await response.json()

      if (data.success) {
        success('Review submitted successfully!')
        onReviewSubmitted()
        onClose()
      } else {
        showError(data.message || 'Failed to submit review')
      }
    } catch (err) {
      showError('Network error. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="modal open">
      <div className="modal-overlay" onClick={onClose}></div>
      <div className="modal-panel review-form-modal">
        <button className="modal-close" onClick={onClose}>×</button>
        
        <div className="form-header">
          <h2>Write a Review</h2>
          <p className="muted">Share your experience with our services</p>
        </div>

        <form onSubmit={handleSubmit} className="review-form">
          <div className="form-group">
            <label>Rating</label>
            <div className="rating-input">
              {[1, 2, 3, 4, 5].map((star) => (
                <button
                  key={star}
                  type="button"
                  className={`star-btn ${rating >= star ? 'active' : ''}`}
                  onClick={() => setRating(star)}
                >
                  ★
                </button>
              ))}
              <span className="rating-text">({rating} star{rating !== 1 ? 's' : ''})</span>
            </div>
          </div>

          <div className="form-group">
            <label>Your Review</label>
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell us about your experience..."
              rows="4"
              required
            />
          </div>



          <div className="modal-actions">
            <button type="button" className="btn-ghost" onClick={onClose}>
              Cancel
            </button>
            <button type="submit" className="primary" disabled={loading}>
              {loading ? 'Submitting...' : 'Submit Review'}
            </button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ReviewForm