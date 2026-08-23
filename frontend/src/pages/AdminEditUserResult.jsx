import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminEditUserResult = () => {
  const { id, type } = useParams(); // id is user id, type is basic | six | year
  const navigate = useNavigate();
  
  const [studentInfo, setStudentInfo] = useState(null);
  const [marks, setMarks] = useState({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  // Define subject mapping based on type
  const getSubjectKeys = () => {
    if (type === 'year') {
      return [
        { key: 'sub_one', name: 'Computer Fundamentals' },
        { key: 'sub_two', name: 'Microsoft Word' },
        { key: 'sub_three', name: 'Microsoft Excel' },
        { key: 'sub_four', name: 'Microsoft PowerPoint' },
        { key: 'sub_five', name: 'Internet Technology' },
        { key: 'sub_six', name: 'Financial Accounting' },
        { key: 'sub_seven', name: 'Tally with ERP' },
        { key: 'sub_eight', name: 'HTML with CSS' },
        { key: 'sub_nine', name: 'Object Oriented Programming (C, C++)' },
        { key: 'sub_ten', name: 'Database SQL, MySQL' }
      ];
    } else if (type === 'six') {
      return [
        { key: 'sub_one', name: 'Computer Fundamentals' },
        { key: 'sub_two', name: 'Microsoft Word' },
        { key: 'sub_three', name: 'Microsoft Excel' },
        { key: 'sub_five', name: 'Microsoft PowerPoint' },
        { key: 'sub_six', name: 'Internet Technology' },
        { key: 'sub_eight', name: 'Financial Accounting' },
        { key: 'sub_nine', name: 'Tally with ERP' }
      ];
    } else { // default: basic
      return [
        { key: 'sub_one', name: 'Computer Fundamentals' },
        { key: 'sub_two', name: 'Microsoft Word' },
        { key: 'sub_three', name: 'Microsoft Excel' },
        { key: 'sub_five', name: 'Microsoft PowerPoint' },
        { key: 'sub_six', name: 'Internet Technology' }
      ];
    }
  };

  const subjectConfig = getSubjectKeys();

  useEffect(() => {
    const fetchCurrentResult = async () => {
      try {
        const response = await axios.get(`/api/student/result.php?uid=${id}&type=${type}`);
        if (response.data.status === 'success') {
          const res = response.data.data;
          setStudentInfo({
            fname: res.fname,
            lname: res.lname,
            course: res.course,
            reg_number: res.reg_number
          });
          
          // Map scores to subject keys
          const loadedMarks = {};
          
          // Fetch raw user data for key matching
          const userRawRes = await axios.get(`/api/admin/users.php?uid=${id}`);
          if (userRawRes.data.status === 'success') {
            const raw = userRawRes.data.data;
            subjectConfig.forEach(subj => {
              loadedMarks[subj.key] = raw[subj.key] !== null ? parseInt(raw[subj.key], 10) : 0;
            });
            setMarks(loadedMarks);
          }
        } else {
          setError(response.data.message || 'Failed to load user details');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading student result details.');
      } finally {
        setLoading(false);
      }
    };

    fetchCurrentResult();
  }, [id, type]);

  const handleMarkChange = (key, value) => {
    const numeric = Math.min(100, Math.max(0, parseInt(value, 10) || 0));
    setMarks(prev => ({ ...prev, [key]: numeric }));
  };

  const calculateTotal = () => {
    return Object.values(marks).reduce((sum, current) => sum + current, 0);
  };

  const handleSaveMarks = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post('/api/admin/results.php', {
        uid: id,
        type: type,
        marks: marks
      });

      if (response.data.status === 'success') {
        setSuccess('Marks updated successfully!');
        setTimeout(() => navigate('/admin/users'), 1500);
      } else {
        setError(response.data.message || 'Failed to save marks');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred during update.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading student score profile...</p>
        </div>
      </AdminLayout>
    );
  }

  const maxTotalMarks = subjectConfig.length * 100;
  const currentTotalMarks = calculateTotal();

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div>
          <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Manage Student Results</h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Course: <strong>{studentInfo?.course}</strong> (NITS_{studentInfo?.reg_number})
          </p>
          <p style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
            Result Type: <strong style={{ textTransform: 'uppercase' }}>{type === 'basic' ? 'Basic (3 Months)' : type === 'six' ? 'Tally (6 Months)' : 'DCA (1 Year)'}</strong>
          </p>
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

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSaveMarks}>
            <div className="table-container" style={{ marginBottom: '2rem' }}>
              <table className="custom-table">
                <thead>
                  <tr>
                    <th style={{ width: '60%' }}>Subject Name</th>
                    <th style={{ textAlign: 'center', width: '25%' }}>Obtained Score (0 - 100)</th>
                    <th style={{ textAlign: 'center', width: '15%' }}>Max Score</th>
                  </tr>
                </thead>
                <tbody>
                  {subjectConfig.map(subject => (
                    <tr key={subject.key}>
                      <td style={{ fontWeight: 500 }}>{subject.name}</td>
                      <td style={{ display: 'flex', justifyContent: 'center' }}>
                        <input
                          type="number"
                          min="0"
                          max="100"
                          value={marks[subject.key] || 0}
                          onChange={(e) => handleMarkChange(subject.key, e.target.value)}
                          className="form-control"
                          style={{ width: '120px', textAlign: 'center', padding: '0.5rem' }}
                          required
                        />
                      </td>
                      <td style={{ textAlign: 'center', color: 'var(--text-muted)' }}>100</td>
                    </tr>
                  ))}
                  <tr style={{ backgroundColor: 'var(--bg-tertiary)', fontWeight: 600 }}>
                    <td>Total Combined Score</td>
                    <td style={{ textAlign: 'center', fontSize: '1.1rem', color: 'var(--accent-primary)', fontWeight: 700 }}>
                      {currentTotalMarks}
                    </td>
                    <td style={{ textAlign: 'center' }}>{maxTotalMarks}</td>
                  </tr>
                </tbody>
              </table>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/admin/users')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Update Student Marks
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditUserResult;
