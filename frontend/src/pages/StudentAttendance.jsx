import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentAttendance = () => {
  const [data, setData] = useState({ stats: null, history: [] });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchAttendance = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/student/attendance.php', { withCredentials: true });
      if (res.data.status === 'success') {
        setData(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch attendance records.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchAttendance();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Present': return <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Present</span>;
      case 'Absent': return <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Absent</span>;
      case 'Late': return <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Late</span>;
      case 'Excused': return <span style={{ background: 'rgba(148, 163, 184, 0.1)', color: '#94a3b8', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Excused</span>;
      default: return null;
    }
  };

  const { stats, history } = data;
  
  // Calculate attendance percentage
  const totalDays = stats ? parseInt(stats.total_days) : 0;
  const presentDays = stats ? parseInt(stats.present_days) : 0;
  const lateDays = stats ? parseInt(stats.late_days) : 0;
  
  // Custom logic: A late counts as present for percentage, but you can adjust.
  const percentage = totalDays > 0 ? (((presentDays + lateDays) / totalDays) * 100).toFixed(1) : 0;

  return (
    <StudentLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>My Attendance</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Track your daily class attendance and overall percentage.</p>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      {loading ? (
        <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your attendance data...</div>
      ) : (
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          
          {/* Stats Cards */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '1.5rem' }}>
            <div className="glass-card" style={{ textAlign: 'center', padding: '2rem 1rem' }}>
              <h4 style={{ color: 'var(--text-secondary)', margin: 0, fontSize: '0.9rem', textTransform: 'uppercase', letterSpacing: '1px' }}>Attendance Rate</h4>
              <div style={{ fontSize: '3rem', fontWeight: 800, color: percentage >= 75 ? 'var(--accent-success)' : 'var(--accent-danger)', margin: '0.5rem 0' }}>{percentage}%</div>
              <p style={{ fontSize: '0.85rem', color: 'var(--text-muted)', margin: 0 }}>Minimum 75% required</p>
            </div>
            
            <div className="glass-card" style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', gap: '1rem', padding: '1.5rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 600 }}>Total Classes</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{totalDays}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-success)' }}>
                <span style={{ fontWeight: 600 }}>Present</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{presentDays}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', color: 'var(--accent-danger)' }}>
                <span style={{ fontWeight: 600 }}>Absent</span>
                <span style={{ fontSize: '1.2rem', fontWeight: 800 }}>{stats?.absent_days || 0}</span>
              </div>
            </div>
          </div>

          {/* History Table */}
          <div className="table-container animate-fade-in">
            <h3 style={{ padding: '1.5rem 1.5rem 0.5rem', margin: 0 }}>Recent History (Last 30 Days)</h3>
            <table className="custom-table">
              <thead>
                <tr>
                  <th>Date</th>
                  <th>Status</th>
                  <th>Instructor Remarks</th>
                </tr>
              </thead>
              <tbody>
                {history.length > 0 ? history.map((rec, idx) => (
                  <tr key={idx}>
                    <td style={{ fontWeight: 500 }}>{new Date(rec.date).toLocaleDateString('en-US', { weekday: 'short', year: 'numeric', month: 'short', day: 'numeric' })}</td>
                    <td>{getStatusBadge(rec.status)}</td>
                    <td style={{ color: 'var(--text-secondary)' }}>{rec.remarks || '-'}</td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="3" style={{ textAlign: 'center', padding: '2rem' }}>No attendance records found yet.</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>

        </div>
      )}
    </StudentLayout>
  );
};

export default StudentAttendance;
