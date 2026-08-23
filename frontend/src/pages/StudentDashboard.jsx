import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentDashboard = () => {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await axios.get('/api/student/profile.php');
        if (response.data.status === 'success') {
          setProfile(response.data.data);
        }
      } catch (err) {
        console.error('Failed to load profile data', err);
      } finally {
        setLoading(false);
      }
    };
    fetchProfile();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading your dashboard...</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>
            Welcome Back, <span style={{ color: 'var(--accent-primary)' }}>{profile?.fname}</span>!
          </h1>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.25rem' }}>
            Here is a quick overview of your student status.
          </p>
        </div>

        <div className="grid-cols-3">
          {/* Card 1: Course Info */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-primary)' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Enrolled Course</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.course || 'Not Enrolled'}</p>
          </div>
          
          {/* Card 2: Registration Info */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-secondary)' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Registration Number</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>NITS_ {profile?.reg_number}</p>
          </div>

          {/* Card 3: Admission Date */}
          <div className="glass-card" style={{ borderLeft: '4px solid var(--accent-success)' }}>
            <h4 style={{ fontSize: '0.85rem', textTransform: 'uppercase', color: 'var(--text-muted)', letterSpacing: '0.05em', marginBottom: '0.5rem' }}>Admission Date</h4>
            <p style={{ fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-primary)' }}>{profile?.posting_date || 'N/A'}</p>
          </div>
        </div>

        <div className="glass-card" style={{ display: 'flex', gap: '2.5rem', alignItems: 'center', flexWrap: 'wrap' }}>
          <div style={{ flexShrink: 0 }}>
            {profile?.image ? (
              <img 
                src={`http://localhost/loginsystem/${profile.image}`} 
                alt="Student profile" 
                style={{ width: '180px', height: '220px', objectFit: 'cover', borderRadius: 'var(--border-radius-md)', border: '4px solid var(--border-color)', boxShadow: 'var(--card-shadow)' }}
              />
            ) : (
              <div style={{ width: '180px', height: '220px', borderRadius: 'var(--border-radius-md)', backgroundColor: 'var(--bg-tertiary)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-muted)' }}>
                No Photo
              </div>
            )}
          </div>

          <div style={{ flex: 1, display: 'flex', flexDirection: 'column', gap: '1.5rem', minWidth: '280px' }}>
            <div>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 600 }}>{profile?.fname} {profile?.lname}</h3>
              <p style={{ color: 'var(--text-secondary)' }}>Student at NITS Computer Education</p>
            </div>
            
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem', fontSize: '0.925rem' }}>
              <div>
                <p><span style={{ color: 'var(--text-muted)' }}>Father's Name:</span> {profile?.father}</p>
                <p style={{ marginTop: '0.5rem' }}><span style={{ color: 'var(--text-muted)' }}>Gender:</span> {profile?.gender}</p>
              </div>
              <div>
                <p><span style={{ color: 'var(--text-muted)' }}>Email:</span> {profile?.email}</p>
                <p style={{ marginTop: '0.5rem' }}><span style={{ color: 'var(--text-muted)' }}>Mobile No:</span> {profile?.contactno}</p>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', marginTop: '0.5rem' }}>
              <Link to="/profile" className="btn btn-primary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                View Full Profile
              </Link>
              <Link to="/marksheet" className="btn btn-secondary" style={{ padding: '0.6rem 1.2rem', fontSize: '0.9rem' }}>
                Check Academic Result
              </Link>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentDashboard;
