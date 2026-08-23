import React, { useState } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentChangePassword = () => {
  const [passwords, setPasswords] = useState({
    currentpassword: '',
    newpassword: '',
    confirmpassword: ''
  });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setPasswords(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (passwords.newpassword !== passwords.confirmpassword) {
      setError('New password and confirm password fields do not match.');
      setIsSubmitting(false);
      return;
    }

    try {
      const response = await axios.post('/api/auth/change-password.php', {
        currentpassword: passwords.currentpassword,
        newpassword: passwords.newpassword
      });

      if (response.data.status === 'success') {
        setSuccess('Password changed successfully!');
        setPasswords({ currentpassword: '', newpassword: '', confirmpassword: '' });
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <StudentLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Account Security</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update your portal login password</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', maxWidth: '500px', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', maxWidth: '500px', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        <div className="glass-card" style={{ width: '100%', maxWidth: '500px', padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label" htmlFor="currentpassword">Current Password</label>
              <input
                id="currentpassword"
                name="currentpassword"
                type="password"
                className="form-control"
                placeholder="Enter current password"
                value={passwords.currentpassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label" htmlFor="newpassword">New Password</label>
              <input
                id="newpassword"
                name="newpassword"
                type="password"
                className="form-control"
                placeholder="Enter new password"
                value={passwords.newpassword}
                onChange={handleChange}
                required
              />
            </div>

            <div className="form-group" style={{ marginBottom: '2rem' }}>
              <label className="form-label" htmlFor="confirmpassword">Confirm New Password</label>
              <input
                id="confirmpassword"
                name="confirmpassword"
                type="password"
                className="form-control"
                placeholder="Confirm new password"
                value={passwords.confirmpassword}
                onChange={handleChange}
                required
              />
            </div>

            <button
              type="submit"
              className="btn btn-primary"
              style={{ width: '100%', padding: '0.85rem' }}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Updating...' : 'Change Password'}
            </button>
          </form>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentChangePassword;
