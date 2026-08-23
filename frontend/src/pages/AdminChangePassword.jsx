import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminChangePassword = () => {
  const [currentpassword, setCurrentpassword] = useState('');
  const [newpassword, setNewpassword] = useState('');
  const [confirmpassword, setConfirmpassword] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    if (newpassword !== confirmpassword) {
      setError('Password and Confirm Password Field do not match !!');
      return;
    }

    setIsSubmitting(true);
    try {
      const response = await axios.post('/api/auth/admin-change-password.php', {
        currentpassword,
        newpassword
      });

      if (response.data.status === 'success') {
        setSuccess('Password Changed Successfully !!');
        setCurrentpassword('');
        setNewpassword('');
        setConfirmpassword('');
      } else {
        setError(response.data.message || 'Failed to change password');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Change Password</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Update your administrator account password</p>
        </div>

        <div className="glass-card" style={{ maxWidth: '600px', margin: '0 auto', width: '100%' }}>
          {error && (
            <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {error}
            </div>
          )}

          {success && (
            <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
              {success}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label className="form-label">Current Password</label>
              <input
                type="password"
                className="form-control"
                value={currentpassword}
                onChange={(e) => setCurrentpassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">New Password</label>
              <input
                type="password"
                className="form-control"
                value={newpassword}
                onChange={(e) => setNewpassword(e.target.value)}
                required
              />
            </div>

            <div className="form-group">
              <label className="form-label">Confirm Password</label>
              <input
                type="password"
                className="form-control"
                value={confirmpassword}
                onChange={(e) => setConfirmpassword(e.target.value)}
                required
              />
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', marginTop: '2rem' }}>
              <button 
                type="submit" 
                className="btn btn-primary" 
                style={{ width: '100%' }}
                disabled={isSubmitting}
              >
                {isSubmitting ? 'Changing...' : 'Change Password'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminChangePassword;
