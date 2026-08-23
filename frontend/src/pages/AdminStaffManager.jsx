import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';
import { useAuth } from '../context/AuthContext';

const AdminStaffManager = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const [staff, setStaff] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', role: 'receptionist' });

  // Only super admin can access this page
  useEffect(() => {
    if (user && user.role !== 'admin') {
      navigate('/admin/dashboard');
    }
  }, [user, navigate]);

  const fetchStaff = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/staff.php', { withCredentials: true });
      if (res.data.status === 'success') {
        setStaff(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch staff records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchStaff();
  }, []);

  const handleCreate = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/staff.php', form, { withCredentials: true });
      if (res.data.status === 'success') {
        setShowModal(false);
        setForm({ username: '', password: '', role: 'receptionist' });
        fetchStaff();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to create staff account.');
    }
  };

  const handleDelete = async (id, username) => {
    if (!window.confirm(`Are you sure you want to delete staff account: ${username}?`)) return;
    try {
      const res = await axios.delete(`/api/admin/staff.php?id=${id}`, { withCredentials: true });
      if (res.data.status === 'success') {
        fetchStaff();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to delete account.');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Staff Management</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Manage Receptionist and Instructor accounts (RBAC).</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Add Staff
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading staff records...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>ID</th>
                <th>Username</th>
                <th>Role</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {staff.length > 0 ? staff.map(s => (
                <tr key={s.id}>
                  <td>{s.id}</td>
                  <td style={{ fontWeight: 600 }}>{s.username}</td>
                  <td>
                    <span style={{ 
                      background: s.role === 'admin' ? 'rgba(244, 63, 94, 0.1)' : s.role === 'instructor' ? 'rgba(59, 130, 246, 0.1)' : 'rgba(16, 185, 129, 0.1)', 
                      color: s.role === 'admin' ? '#f43f5e' : s.role === 'instructor' ? '#3b82f6' : '#10b981', 
                      padding: '0.3rem 0.6rem', 
                      borderRadius: '4px', 
                      fontSize: '0.8rem', 
                      fontWeight: 'bold',
                      textTransform: 'capitalize'
                    }}>
                      {s.role}
                    </span>
                  </td>
                  <td>
                    <button 
                      onClick={() => handleDelete(s.id, s.username)} 
                      className="btn btn-danger" 
                      style={{ padding: '0.4rem', borderRadius: '4px' }}
                      disabled={s.id == user?.id}
                      title={s.id == user?.id ? "Cannot delete yourself" : "Delete Account"}
                    >
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="4" style={{ textAlign: 'center', padding: '2rem' }}>No staff records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '400px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Create Staff Account</h3>
            <form onSubmit={handleCreate} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Username</label>
                <input type="text" className="form-control" value={form.username} onChange={e => setForm({...form, username: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Password</label>
                <input type="password" className="form-control" value={form.password} onChange={e => setForm({...form, password: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Role</label>
                <select className="form-control" value={form.role} onChange={e => setForm({...form, role: e.target.value})} required>
                  <option value="receptionist">Receptionist (Leads & Fees)</option>
                  <option value="instructor">Instructor (Education & Exams)</option>
                  <option value="admin">Super Admin (Full Access)</option>
                </select>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Account</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStaffManager;
