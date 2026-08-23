import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminManageUsers = () => {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [error, setError] = useState('');
  
  const location = useLocation();
  const navigate = useNavigate();

  // Extract range filter from URL query params
  const queryParams = new URLSearchParams(location.search);
  const range = queryParams.get('range') || '';

  const fetchUsers = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`/api/admin/users.php?range=${range}&search=${encodeURIComponent(search)}`);
      if (response.data.status === 'success') {
        setUsers(response.data.data);
      } else {
        setError(response.data.message || 'Failed to retrieve student records');
      }
    } catch (err) {
      console.error('Failed to load user records', err);
      setError('Server error occurred while loading students.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, [range, search]);

  const handleDelete = async (uid, name) => {
    if (window.confirm(`Are you absolutely sure you want to delete ${name}? This action cannot be undone.`)) {
      try {
        const response = await axios.delete(`/api/admin/users.php?uid=${uid}`);
        if (response.data.status === 'success') {
          alert('User deleted successfully.');
          fetchUsers();
        } else {
          alert(response.data.message || 'Failed to delete student');
        }
      } catch (err) {
        console.error('Deletion request error', err);
        alert('Server error occurred during deletion.');
      }
    }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Manage Students</h1>
            <p style={{ color: 'var(--text-secondary)' }}>
              {range ? `Displaying users filtered by: ${range.toUpperCase()}` : 'Complete student registry database'}
            </p>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/admin/users/add')} className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="12" y1="5" x2="12" y2="19"/><line x1="5" y1="12" x2="19" y2="12"/></svg>
              New Student Registration
            </button>
          </div>
          
          <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
            <input 
              type="text" 
              className="form-control" 
              placeholder="Search by name, email, reg no..." 
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              style={{ width: '280px', padding: '0.6rem 1rem' }}
            />
            {range && (
              <button onClick={() => navigate('/admin/users')} className="btn btn-secondary" style={{ padding: '0.6rem 1rem' }}>
                Clear Filters
              </button>
            )}
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        <div className="table-container">
          {loading ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              Loading student registry data...
            </div>
          ) : users.length === 0 ? (
            <div style={{ padding: '3rem', textAlign: 'center', color: 'var(--text-secondary)' }}>
              No student records matched your filters.
            </div>
          ) : (
            <table className="custom-table" style={{ whiteSpace: 'normal', wordWrap: 'break-word' }}>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '15%' }}>Enrollment & Course</th>
                  <th style={{ width: '15%' }}>Student Name</th>
                  <th style={{ width: '20%' }}>Contact Info</th>
                  <th style={{ width: '10%' }}>Admission Date</th>
                  <th style={{ textAlign: 'center', width: '35%' }}>Actions</th>
                </tr>
              </thead>
              <tbody>
                {users.map((student, index) => (
                  <tr key={student.id}>
                    <td>{index + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600, color: 'var(--text-primary)' }}>NITS_{student.reg_number}</div>
                      <div style={{ fontSize: '0.75rem', fontWeight: 500, color: 'var(--accent-primary)', marginTop: '0.2rem' }}>{student.course}</div>
                    </td>
                    <td style={{ fontWeight: 500 }}>{student.fname} {student.lname}</td>
                    <td>
                      <div style={{ wordBreak: 'break-all', lineHeight: '1.2' }}>{student.email}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)', marginTop: '0.2rem' }}>{student.contactno}</div>
                    </td>
                    <td style={{ fontSize: '0.85rem' }}>{student.posting_date}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.4rem', justifyContent: 'center', flexWrap: 'wrap' }}>
                        
                        <div style={{ position: 'relative', display: 'inline-block' }}>
                          <Link to={`/admin/users/view/${student.id}`} className="btn btn-secondary" style={{ padding: '0.35rem 0.6rem', fontSize: '0.75rem' }} title="View Profile">
                            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ marginRight: '4px' }}><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"></path><circle cx="12" cy="12" r="3"></circle></svg>
                            View
                          </Link>
                        </div>

                        {/* Marksheet Group (Print) */}
                        <div style={{ display: 'flex', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <span style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-tertiary)', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)', borderLeft: '1px solid var(--border-color)' }}>
                            Marks:
                          </span>
                          <Link to={`/admin/users/marksheet/${student.id}/basic`} style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', textDecoration: 'none', borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }} title="Print Basic Marksheet">3M</Link>
                          <Link to={`/admin/users/marksheet/${student.id}/six`} style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', textDecoration: 'none', borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }} title="Print Tally Marksheet">6M</Link>
                          <Link to={`/admin/users/marksheet/${student.id}/year`} style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', textDecoration: 'none', borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }} title="Print DCA Marksheet">1Yr</Link>
                        </div>

                        {/* Certificate Group (Print) */}
                        <div style={{ display: 'flex', borderRadius: 'var(--border-radius-sm)', overflow: 'hidden', boxShadow: '0 2px 5px rgba(0,0,0,0.05)' }}>
                          <span style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center' }}>
                            Cert:
                          </span>
                          <Link to={`/admin/users/certificate/${student.id}/basic`} style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', textDecoration: 'none', borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>3M</Link>
                          <Link to={`/admin/users/certificate/${student.id}/six`} style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', textDecoration: 'none', borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>6M</Link>
                          <Link to={`/admin/users/certificate/${student.id}/year`} style={{ padding: '0.35rem 0.4rem', fontSize: '0.7rem', backgroundColor: 'var(--bg-secondary)', color: 'var(--text-primary)', textDecoration: 'none', borderRight: '1px solid var(--border-color)', borderTop: '1px solid var(--border-color)', borderBottom: '1px solid var(--border-color)' }}>1Yr</Link>
                        </div>

                        <button onClick={() => handleDelete(student.id, `${student.fname} ${student.lname}`)} className="btn btn-danger" style={{ padding: '0.35rem', borderRadius: 'var(--border-radius-sm)' }} title="Delete Student">
                          <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminManageUsers;
