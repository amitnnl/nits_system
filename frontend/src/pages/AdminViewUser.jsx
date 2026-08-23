import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminViewUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get(`/api/admin/users.php?uid=${id}`);
        if (response.data.status === 'success') {
          setProfile(response.data.data);
        } else {
          setError(response.data.message || 'Failed to fetch student profile.');
        }
      } catch (err) {
        console.error(err);
        setError('Server error while loading profile.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, [id]);

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading student profile...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center' }}>
          <p style={{ color: 'var(--accent-danger)' }}>{error}</p>
          <button onClick={() => navigate('/admin/users')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Back to Manage Users</button>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Top Action Bar */}
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>{profile.fname}'s Profile</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Detailed view of student records</p>
          </div>
          <div style={{ display: 'flex', gap: '0.75rem', flexWrap: 'wrap' }}>
            <Link to={`/admin/users/edit/${id}`} className="btn btn-primary" style={{ padding: '0.6rem 1.25rem' }}>
              Edit Profile
            </Link>
            <Link to={`/admin/users/result/${id}/basic`} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
              Computer Basic Marks
            </Link>
            <Link to={`/admin/users/result/${id}/six`} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
              Tally Accounting Marks
            </Link>
            <Link to={`/admin/users/result/${id}/year`} className="btn btn-secondary" style={{ padding: '0.6rem 1.25rem' }}>
              DCA Marks
            </Link>
          </div>
        </div>

        {/* Profile Details Card */}
        <div className="glass-card no-print" style={{ padding: '2.5rem' }}>
          <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap' }}>
            {/* Photo Column */}
            <div style={{ flexShrink: 0 }}>
              {profile.image ? (
                <img 
                  src={`http://localhost/loginsystem/${profile.image}`} 
                  alt="Student profile" 
                  style={{ width: '150px', height: '180px', objectFit: 'cover', borderRadius: 'var(--border-radius-sm)', border: '2px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}
                />
              ) : (
                <div style={{ width: '150px', height: '180px', backgroundColor: 'var(--bg-tertiary)', borderRadius: 'var(--border-radius-sm)', border: '2px dashed var(--border-color)', display: 'flex', justifyContent: 'center', alignItems: 'center', color: 'var(--text-muted)' }}>
                  No Photo
                </div>
              )}
            </div>

            {/* Details Table */}
            <div style={{ flex: 1, minWidth: '300px' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.95rem' }}>
                <tbody>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', width: '35%', fontWeight: 500 }}>First Name</th>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{profile.fname}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Last Name</th>
                    <td style={{ padding: '0.75rem 0', fontWeight: 600 }}>{profile.lname}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Date of Birth</th>
                    <td style={{ padding: '0.75rem 0' }}>{profile.dob}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Gender</th>
                    <td style={{ padding: '0.75rem 0' }}>{profile.gender}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Father Name</th>
                    <td style={{ padding: '0.75rem 0' }}>{profile.father}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Email ID</th>
                    <td style={{ padding: '0.75rem 0' }}>{profile.email}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Contact No.</th>
                    <td style={{ padding: '0.75rem 0' }}>{profile.contactno}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Reg. Date</th>
                    <td style={{ padding: '0.75rem 0' }}>{profile.posting_date}</td>
                  </tr>
                  <tr style={{ borderBottom: '1px solid rgba(0,0,0,0.03)' }}>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Course</th>
                    <td style={{ padding: '0.75rem 0', color: 'var(--accent-primary)', fontWeight: 600 }}>{profile.course}</td>
                  </tr>
                  <tr>
                    <th style={{ textAlign: 'left', padding: '0.75rem 0', color: 'var(--text-muted)', fontWeight: 500 }}>Address</th>
                    <td style={{ padding: '0.75rem 0', fontSize: '0.9rem' }}>{profile.address}</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Identity Card Block */}
        <div className="glass-card print-area" style={{ 
          padding: '2rem',
          color: '#1e293b',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          backgroundColor: 'var(--bg-secondary)',
          marginTop: '2rem'
        }}>
          <div style={{ width: '100%', display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }} className="no-print">
            <div>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>Student Identity Card</h3>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>Official Digital ID</p>
            </div>
            <button onClick={() => window.print()} className="btn btn-primary no-print" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
              Print ID Card
            </button>
          </div>

          {/* Dual ID Card Layout for Print/View */}
          <div className="id-card-print-layout" style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            
            {/* --- FRONT SIDE (HORIZONTAL) --- */}
            <div className="id-card-container" style={{
              width: '540px',
              height: '340px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              {/* Header */}
              <div style={{ 
                background: 'linear-gradient(90deg, #1e3a8a, #3b82f6)', 
                color: 'white', 
                padding: '0.6rem 1rem', 
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: '0.75rem',
                borderBottom: '4px solid #facc15'
              }}>
                <img src="/images/nits-logo.png" alt="Logo" style={{ height: '35px', filter: 'drop-shadow(0 2px 4px rgba(0,0,0,0.2))' }} />
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, letterSpacing: '0.5px' }}>NITS COMPUTER EDUCATION CENTER</h3>
              </div>

              {/* Body */}
              <div style={{ display: 'flex', flex: 1, padding: '1rem', gap: '1rem' }}>
                {/* Left Column (Photo & Reg) */}
                <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '130px', borderRight: '1px dashed #cbd5e1', paddingRight: '1rem' }}>
                  {profile?.image ? (
                    <img 
                      src={`http://localhost/loginsystem/${profile.image}`} 
                      alt="ID photo" 
                      style={{ 
                        width: '110px', 
                        height: '130px', 
                        objectFit: 'cover', 
                        borderRadius: '8px',
                        border: '3px solid white',
                        boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                        marginBottom: '1rem'
                      }}
                    />
                  ) : (
                    <div style={{ 
                      width: '110px', 
                      height: '130px', 
                      background: '#e2e8f0',
                      borderRadius: '8px',
                      border: '3px solid white',
                      boxShadow: '0 4px 8px rgba(0,0,0,0.1)',
                      marginBottom: '1rem',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      color: '#94a3b8'
                    }}>
                      <svg width="40" height="40" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
                    </div>
                  )}
                  <span style={{ fontSize: '0.75rem', color: '#64748b', fontWeight: 600 }}>ID No.</span>
                  <strong style={{ fontSize: '0.9rem', color: '#0f172a' }}>NITS_{profile?.reg_number}</strong>
                </div>

                {/* Right Column (Details) */}
                <div style={{ flex: 1, display: 'flex', flexDirection: 'column', justifyContent: 'center' }}>
                  <h2 style={{ margin: '0 0 0.2rem', fontSize: '1.4rem', fontWeight: 700, color: '#1e293b' }}>
                    {profile?.fname} {profile?.lname}
                  </h2>
                  <span style={{ 
                    background: 'rgba(59, 130, 246, 0.1)', 
                    color: '#3b82f6', 
                    padding: '0.2rem 0.6rem', 
                    borderRadius: '12px', 
                    fontSize: '0.75rem', 
                    fontWeight: 600,
                    marginBottom: '1rem',
                    display: 'inline-block',
                    width: 'max-content'
                  }}>
                    {profile?.course}
                  </span>

                  <table style={{ width: '100%', fontSize: '0.85rem', borderCollapse: 'separate', borderSpacing: '0 0.5rem' }}>
                    <tbody>
                      <tr>
                        <td style={{ color: '#64748b', width: '35%', fontWeight: 500 }}>D.O.B</td>
                        <td style={{ color: '#0f172a', fontWeight: 600 }}>: {profile?.dob}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#64748b', fontWeight: 500 }}>Gender</td>
                        <td style={{ color: '#0f172a', fontWeight: 600 }}>: {profile?.gender}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#64748b', fontWeight: 500 }}>Father</td>
                        <td style={{ color: '#0f172a', fontWeight: 600 }}>: {profile?.father}</td>
                      </tr>
                      <tr>
                        <td style={{ color: '#64748b', fontWeight: 500 }}>Contact</td>
                        <td style={{ color: '#0f172a', fontWeight: 600 }}>: {profile?.contactno}</td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Footer */}
              <div style={{ 
                background: '#f8fafc', 
                borderTop: '1px solid #e2e8f0', 
                padding: '0.6rem', 
                textAlign: 'center' 
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#1e293b', fontWeight: 600 }}>IDENTITY CARD</p>
              </div>
            </div>

            {/* --- BACK SIDE (HORIZONTAL) --- */}
            <div className="id-card-container" style={{
              width: '540px',
              height: '340px',
              background: 'linear-gradient(135deg, #ffffff 0%, #f1f5f9 100%)',
              borderRadius: '16px',
              boxShadow: '0 20px 40px rgba(0,0,0,0.1)',
              overflow: 'hidden',
              position: 'relative',
              display: 'flex',
              flexDirection: 'column',
              border: '1px solid rgba(0,0,0,0.05)',
            }}>
              <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                <h4 style={{ margin: '0 0 1rem', fontSize: '1.1rem', color: '#1e293b', borderBottom: '2px solid var(--accent-primary)', paddingBottom: '0.4rem', display: 'inline-block' }}>Complete Details</h4>
                
                <div style={{ display: 'flex', gap: '2rem' }}>
                  <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '0.75rem', fontSize: '0.85rem' }}>
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.1rem' }}>Email Address</span>
                      <strong style={{ color: '#0f172a', wordBreak: 'break-all' }}>{profile?.email}</strong>
                    </div>

                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.1rem' }}>Residential Address</span>
                      <p style={{ color: '#0f172a', margin: 0, lineHeight: 1.4 }}>{profile?.address}</p>
                    </div>
                    
                    <div>
                      <span style={{ color: '#64748b', fontSize: '0.75rem', display: 'block', marginBottom: '0.1rem' }}>Enrollment Date</span>
                      <strong style={{ color: '#0f172a' }}>{profile?.posting_date}</strong>
                    </div>
                  </div>

                  <div style={{ width: '120px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', alignItems: 'center' }}>
                    <div style={{ textAlign: 'center' }}>
                      <svg width="70" height="70" viewBox="0 0 24 24" fill="none" stroke="#333" strokeWidth="1.5">
                        <path d="M3 3h5v5H3V3z M16 3h5v5h-5V3z M3 16h5v5H3v-5z" />
                        <rect x="5" y="5" width="1" height="1" fill="#333" />
                        <rect x="18" y="5" width="1" height="1" fill="#333" />
                        <rect x="5" y="18" width="1" height="1" fill="#333" />
                        <path d="M12 3h2v2h-2z M12 7h2v2h-2z M16 12h2v2h-2z M12 16h2v2h-2z M16 16h2v2h-2z M12 20h5v2h-5z M8 12h2v5H8z M3 12h2v2H3z" />
                      </svg>
                      <div style={{ fontSize: '0.55rem', marginTop: '0.3rem', color: '#64748b' }}>SCAN TO VERIFY</div>
                    </div>
                    
                    <div style={{ textAlign: 'center', width: '100%' }}>
                      <div style={{ width: '100%', borderBottom: '1px solid #1e293b', marginBottom: '0.3rem' }}></div>
                      <span style={{ fontSize: '0.7rem', color: '#64748b' }}>Auth. Signatory</span>
                    </div>
                  </div>
                </div>
              </div>

              <div style={{ 
                background: '#f8fafc', 
                borderTop: '1px solid #e2e8f0', 
                padding: '0.8rem', 
                textAlign: 'center' 
              }}>
                <p style={{ margin: 0, fontSize: '0.7rem', color: '#64748b' }}>If found, please return to: Near Balaji Dental Hospital, Narnaul-123001 | www.nitscomputer.com</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </AdminLayout>
  );
};

export default AdminViewUser;
