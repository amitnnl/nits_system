import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentProfile = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({ fname: '', lname: '', contactno: '' });
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchProfile = async () => {
    try {
      const response = await axios.get('/api/student/profile.php');
      if (response.data.status === 'success') {
        setProfile(response.data.data);
        setFormData({
          fname: response.data.data.fname,
          lname: response.data.data.lname,
          contactno: response.data.data.contactno
        });
      }
    } catch (err) {
      console.error('Failed to load profile data', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProfile();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleUpdate = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!formData.fname || !formData.lname || !formData.contactno) {
      setError('All fields are required.');
      return;
    }

    try {
      const response = await axios.post('/api/student/profile.php', formData);
      if (response.data.status === 'success') {
        setSuccess('Profile updated successfully!');
        setIsEditing(false);
        fetchProfile();
      } else {
        setError(response.data.message || 'Failed to update profile');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred');
    }
  };

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading profile data...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <style>
        {`
          @media print {
            body {
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .no-print { display: none !important; }
            .print-area {
              background: transparent !important;
              box-shadow: none !important;
              border: none !important;
            }
          }
        `}
      </style>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div className="no-print" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Student ID Card & Profile</h1>
            <p style={{ color: 'var(--text-secondary)' }}>View details or modify contact info</p>
          </div>
          <button 
            onClick={() => { setIsEditing(!isEditing); setError(''); setSuccess(''); }} 
            className="btn btn-secondary no-print"
            style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}
          >
            {isEditing ? 'Cancel Edit' : 'Edit Profile'}
          </button>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        <div className="grid-cols-3" style={{ alignItems: 'flex-start' }}>
          {/* Identity Card Block */}
          <div className="glass-card print-area" style={{ 
            gridColumn: 'span 2', 
            padding: '2rem',
            color: '#1e293b',
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            backgroundColor: 'var(--bg-secondary)'
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

        {/* Edit Panel Column */}
          {isEditing && (
            <div className="glass-card animate-fade-in" style={{ padding: '2rem' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.25rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '0.75rem' }}>Update Info</h3>
              <form onSubmit={handleUpdate}>
                <div className="form-group">
                  <label className="form-label" htmlFor="fname">First Name</label>
                  <input
                    id="fname"
                    name="fname"
                    type="text"
                    className="form-control"
                    value={formData.fname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label" htmlFor="lname">Last Name</label>
                  <input
                    id="lname"
                    name="lname"
                    type="text"
                    className="form-control"
                    value={formData.lname}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                  <label className="form-label" htmlFor="contactno">Mobile No.</label>
                  <input
                    id="contactno"
                    name="contactno"
                    type="tel"
                    maxLength="10"
                    pattern="\d{10}"
                    className="form-control"
                    value={formData.contactno}
                    onChange={handleChange}
                    required
                  />
                </div>

                <button type="submit" className="btn btn-primary" style={{ width: '100%' }}>
                  Save Profile
                </button>
              </form>
            </div>
          )}
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentProfile;
