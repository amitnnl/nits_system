import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    yesterdayUsers: 0,
    last7DaysUsers: 0,
    last30DaysUsers: 0,
    todayUsers: 0
  });
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await axios.get('/api/admin/dashboard.php');
        if (response.data.status === 'success') {
          setStats(response.data.data);
        }
      } catch (err) {
        console.error('Failed to fetch admin stats', err);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const handleCardClick = (range) => {
    if (range) {
      navigate(`/admin/users?range=${range}`);
    } else {
      navigate('/admin/users');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading dashboard statistics...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Administration Dashboard</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Overview of student enrollment performance and metrics</p>
        </div>

        <div className="grid-cols-4">
          {/* Total Registrations */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', borderTop: '4px solid var(--accent-primary)' }} onClick={() => handleCardClick('')}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Total Students</span>
                <span style={{ color: 'var(--accent-primary)', backgroundColor: 'rgba(79, 70, 229, 0.1)', padding: '0.35rem', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                </span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.totalUsers}</h2>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View Registry list</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>

          {/* Today Registrations */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', borderTop: '4px solid var(--accent-success)' }} onClick={() => handleCardClick('today')}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Registered Today</span>
                <span style={{ color: 'var(--accent-success)', backgroundColor: 'rgba(16, 185, 129, 0.1)', padding: '0.35rem', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
                </span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.todayUsers}</h2>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View today's users</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>

          {/* Yesterday Registrations */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', borderTop: '4px solid var(--accent-warning)' }} onClick={() => handleCardClick('yesterday')}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Yesterday</span>
                <span style={{ color: 'var(--accent-warning)', backgroundColor: 'rgba(245, 158, 11, 0.1)', padding: '0.35rem', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                </span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.yesterdayUsers}</h2>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View yesterday's users</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>

          {/* Last 7 Days */}
          <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', cursor: 'pointer', borderTop: '4px solid var(--accent-secondary)' }} onClick={() => handleCardClick('last7')}>
            <div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
                <span style={{ fontSize: '0.85rem', fontWeight: 600, color: 'var(--text-muted)', textTransform: 'uppercase' }}>Last 7 Days</span>
                <span style={{ color: 'var(--accent-secondary)', backgroundColor: 'rgba(14, 165, 233, 0.1)', padding: '0.35rem', borderRadius: '8px' }}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><line x1="18" y1="20" x2="18" y2="10"/><line x1="12" y1="20" x2="12" y2="4"/><line x1="6" y1="20" x2="6" y2="14"/></svg>
                </span>
              </div>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700 }}>{stats.last7DaysUsers}</h2>
            </div>
            <div style={{ marginTop: '1.5rem', fontSize: '0.8rem', color: 'var(--text-muted)', display: 'flex', alignItems: 'center', gap: '0.25rem' }}>
              <span>View last 7 days</span>
              <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3"><line x1="5" y1="12" x2="19" y2="12"/><polyline points="12 5 19 12 12 19"/></svg>
            </div>
          </div>
        </div>

        {/* Informational Board */}
        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <h3 style={{ fontSize: '1.4rem', fontWeight: 600, marginBottom: '1rem' }}>Administrative Controls Summary</h3>
          <p style={{ color: 'var(--text-secondary)', marginBottom: '1.5rem', fontSize: '0.975rem' }}>
            From this panel, you can supervise the complete student registry cycle. Search for enrolled users, edit registration profiles, input marks, compute grading statements, and generate print-ready completion certificates.
          </p>
          <div style={{ display: 'flex', gap: '1rem', flexWrap: 'wrap' }}>
            <button onClick={() => navigate('/admin/users')} className="btn btn-primary" style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}>
              Manage Student Database
            </button>
            <button onClick={() => navigate('/admin/reports')} className="btn btn-secondary" style={{ padding: '0.65rem 1.3rem', fontSize: '0.9rem' }}>
              Generate Custom Reports
            </button>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminDashboard;
