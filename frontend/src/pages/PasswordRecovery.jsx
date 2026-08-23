import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const PasswordRecovery = () => {
  const [email, setEmail] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [simulatedData, setSimulatedData] = useState(null);
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setSimulatedData(null);
    setIsSubmitting(true);

    try {
      const response = await axios.post('/api/auth/recover-password.php', { email });
      const resData = response.data;
      
      if (resData.status === 'success') {
        setSuccess(resData.message || 'Password sent successfully!');
        if (resData.data && resData.data.simulated) {
          setSimulatedData(resData.data);
        }
      } else {
        setError(resData.message || 'Verification failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '440px', padding: '2.5rem' }}>
        <div style={{ textAlign: 'center', marginBottom: '2rem' }}>
          <h2 style={{ fontSize: '1.75rem', fontWeight: 700, marginBottom: '0.5rem' }}>Recover Password</h2>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.925rem' }}>Enter your registered email address to retrieve your password</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '0.75rem 1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        {simulatedData && (
          <div style={{ backgroundColor: 'rgba(79, 70, 229, 0.08)', border: '1px solid var(--accent-primary)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.9rem', color: 'var(--text-primary)' }}>
            <p style={{ fontWeight: 600, marginBottom: '0.25rem', color: 'var(--accent-primary)' }}>Development Environment Notice:</p>
            <p>Your password is: <strong style={{ fontSize: '1.1rem', letterSpacing: '0.5px' }}>{simulatedData.password}</strong></p>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group" style={{ marginBottom: '1.5rem' }}>
            <label className="form-label" htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              className="form-control"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Retrieving...' : 'Send Password'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem' }}>
          <Link to="/login" style={{ fontWeight: 600 }}>Return to Login</Link>
        </div>
      </div>
    </div>
  );
};

export default PasswordRecovery;
