import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminEnquiries = () => {
  const [enquiries, setEnquiries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchEnquiries = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/enquiries.php', { withCredentials: true });
      if (res.data.status === 'success') {
        setEnquiries(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch enquiries.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEnquiries();
  }, []);

  const handleUpdateStatus = async (id, newStatus) => {
    try {
      const res = await axios.put(`/api/admin/enquiries.php?id=${id}`, { status: newStatus }, { withCredentials: true });
      if (res.data.status === 'success') {
        setSuccess('Status updated successfully.');
        fetchEnquiries();
        setTimeout(() => setSuccess(''), 3000);
      }
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  const handleConvertToStudent = async (id) => {
    if (!window.confirm("Are you sure you want to convert this lead into an enrolled student?")) return;
    try {
      const res = await axios.post(`/api/admin/enquiries.php?id=${id}`, {}, { withCredentials: true });
      if (res.data.status === 'success') {
        setSuccess(res.data.message);
        fetchEnquiries();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert(err.response?.data?.message || 'Failed to convert lead.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'New': return <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: '#3b82f6', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>New</span>;
      case 'Contacted': return <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Contacted</span>;
      case 'Converted': return <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Converted</span>;
      case 'Closed': return <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Closed</span>;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Lead Management (Enquiries)</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage prospective students and convert them into enrollments.</p>
        </div>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading enquiries...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Date</th>
                <th>Name</th>
                <th>Contact Details</th>
                <th>Course Interest</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {enquiries.length > 0 ? enquiries.map(enq => (
                <tr key={enq.id}>
                  <td>{new Date(enq.created_at).toLocaleDateString()}</td>
                  <td>{enq.name}</td>
                  <td>
                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.2rem' }}>
                      <span><i className="fas fa-phone-alt" style={{ width: '16px', color: 'var(--text-muted)' }}></i> {enq.phone}</span>
                      {enq.email && <span><i className="fas fa-envelope" style={{ width: '16px', color: 'var(--text-muted)' }}></i> {enq.email}</span>}
                    </div>
                  </td>
                  <td>{enq.course_interest || 'N/A'}</td>
                  <td>{getStatusBadge(enq.status)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      {enq.status === 'New' && (
                        <button onClick={() => handleUpdateStatus(enq.id, 'Contacted')} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', background: 'var(--bg-tertiary)' }}>Mark Contacted</button>
                      )}
                      {enq.status !== 'Converted' && enq.status !== 'Closed' && (
                        <button onClick={() => handleConvertToStudent(enq.id)} className="btn btn-primary" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}>Convert to Student</button>
                      )}
                      {enq.status !== 'Closed' && enq.status !== 'Converted' && (
                        <button onClick={() => handleUpdateStatus(enq.id, 'Closed')} className="btn" style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem', color: 'var(--accent-danger)' }}>Close Lead</button>
                      )}
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No enquiries found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminEnquiries;
