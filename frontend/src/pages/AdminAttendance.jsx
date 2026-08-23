import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminAttendance = () => {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [records, setRecords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const fetchAttendance = async (selectedDate) => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/attendance.php?date=${selectedDate}`, { withCredentials: true });
      if (res.data.status === 'success') {
        setRecords(res.data.data.records);
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
    fetchAttendance(date);
  }, [date]);

  const handleStatusChange = (index, newStatus) => {
    const updated = [...records];
    updated[index].status = newStatus;
    setRecords(updated);
  };

  const handleRemarksChange = (index, newRemarks) => {
    const updated = [...records];
    updated[index].remarks = newRemarks;
    setRecords(updated);
  };

  const handleSaveAttendance = async () => {
    try {
      setSaving(true);
      const payload = { date, records };
      const res = await axios.post('/api/admin/attendance.php', payload, { withCredentials: true });
      
      if (res.data.status === 'success') {
        setSuccess('Attendance register saved successfully!');
        setTimeout(() => setSuccess(''), 3000);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to save attendance register.');
    } finally {
      setSaving(false);
    }
  };

  const getStatusColor = (status) => {
    switch(status) {
      case 'Present': return 'var(--accent-success)';
      case 'Absent': return 'var(--accent-danger)';
      case 'Late': return 'var(--accent-warning)';
      case 'Excused': return 'var(--text-muted)';
      default: return 'var(--border-color)';
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem', flexWrap: 'wrap', gap: '1rem' }}>
        <div>
          <h2>Daily Attendance Register</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Mark daily attendance for all enrolled students.</p>
        </div>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
          <label style={{ fontWeight: 600 }}>Select Date:</label>
          <input 
            type="date" 
            className="form-control" 
            value={date} 
            onChange={(e) => setDate(e.target.value)}
            style={{ width: '200px' }}
          />
        </div>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}
      {success && <div style={{ padding: '1rem', background: 'rgba(16,185,129,0.1)', color: 'var(--accent-success)', borderRadius: '8px', marginBottom: '1rem' }}>{success}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading register for {date}...</div>
        ) : (
          <div>
            <table className="custom-table" style={{ marginBottom: '0' }}>
              <thead>
                <tr>
                  <th style={{ width: '5%' }}>#</th>
                  <th style={{ width: '25%' }}>Student</th>
                  <th style={{ width: '15%' }}>Course</th>
                  <th style={{ width: '30%' }}>Attendance Status</th>
                  <th style={{ width: '25%' }}>Remarks (Optional)</th>
                </tr>
              </thead>
              <tbody>
                {records.length > 0 ? records.map((rec, idx) => (
                  <tr key={rec.student_id}>
                    <td>{idx + 1}</td>
                    <td>
                      <div style={{ fontWeight: 600 }}>{rec.fname} {rec.lname}</div>
                      <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{rec.reg_number}</div>
                    </td>
                    <td>{rec.course}</td>
                    <td>
                      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                        {['Present', 'Absent', 'Late', 'Excused'].map(stat => (
                          <button
                            key={stat}
                            onClick={() => handleStatusChange(idx, stat)}
                            style={{
                              padding: '0.4rem 0.8rem',
                              fontSize: '0.8rem',
                              borderRadius: '20px',
                              border: `1px solid ${getStatusColor(stat)}`,
                              background: rec.status === stat ? getStatusColor(stat) : 'transparent',
                              color: rec.status === stat ? 'white' : getStatusColor(stat),
                              cursor: 'pointer',
                              fontWeight: rec.status === stat ? 'bold' : 'normal',
                              transition: 'all 0.2s'
                            }}
                          >
                            {stat}
                          </button>
                        ))}
                      </div>
                    </td>
                    <td>
                      <input 
                        type="text" 
                        className="form-control" 
                        placeholder="Add note..." 
                        value={rec.remarks || ''} 
                        onChange={(e) => handleRemarksChange(idx, e.target.value)}
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.9rem' }}
                      />
                    </td>
                  </tr>
                )) : (
                  <tr>
                    <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No enrolled students found.</td>
                  </tr>
                )}
              </tbody>
            </table>
            
            {records.length > 0 && (
              <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', borderBottomLeftRadius: '12px', borderBottomRightRadius: '12px' }}>
                <button onClick={handleSaveAttendance} className="btn btn-primary" style={{ padding: '0.75rem 2rem', fontSize: '1rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }} disabled={saving}>
                  <i className="fas fa-save"></i> {saving ? 'Saving...' : 'Save Attendance Register'}
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminAttendance;
