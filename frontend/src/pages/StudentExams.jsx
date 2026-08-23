import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import StudentLayout from '../components/StudentLayout';

const StudentExams = () => {
  const [availableExams, setAvailableExams] = useState([]);
  const [pastResults, setPastResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [availRes, resultsRes] = await Promise.all([
          axios.get('/api/student/exams.php?type=available', { withCredentials: true }),
          axios.get('/api/student/exams.php?type=results', { withCredentials: true })
        ]);
        
        if (availRes.data.status === 'success') setAvailableExams(availRes.data.data);
        if (resultsRes.data.status === 'success') setPastResults(resultsRes.data.data);
      } catch (err) {
        setError('Failed to fetch exam data.');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <StudentLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Online Examinations</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Take pending tests and view your past performance.</p>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '3rem' }}>
        
        {/* Available Exams Section */}
        <section>
          <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <i className="fas fa-clock" style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}></i> 
            Pending Exams
          </h3>
          
          {loading ? (
            <div style={{ padding: '2rem', textAlign: 'center' }}>Loading available exams...</div>
          ) : availableExams.length > 0 ? (
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '1.5rem' }}>
              {availableExams.map(exam => (
                <div key={exam.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
                    <span style={{ background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>LIVE</span>
                    <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', fontWeight: 600 }}>{exam.duration_minutes} mins</span>
                  </div>
                  <h4 style={{ margin: '0 0 0.5rem 0', fontSize: '1.2rem' }}>{exam.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', flex: 1, marginBottom: '1.5rem' }}>
                    {exam.description || 'Complete this exam within the time limit. Auto-submission will occur when time runs out.'}
                  </p>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
                    <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Total Marks: <strong style={{ color: 'var(--text-primary)' }}>{exam.total_marks}</strong></span>
                  </div>
                  <button onClick={() => navigate(`/exam/run/${exam.id}`)} className="btn btn-primary" style={{ width: '100%' }}>
                    Start Exam Now
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div style={{ textAlign: 'center', padding: '3rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
              <i className="fas fa-check-circle" style={{ fontSize: '3rem', color: 'var(--accent-success)', marginBottom: '1rem' }}></i>
              <h4 style={{ margin: '0 0 0.5rem 0' }}>All Caught Up!</h4>
              <p style={{ color: 'var(--text-secondary)', margin: 0 }}>You have no pending exams to take at this moment.</p>
            </div>
          )}
        </section>

        {/* Past Results Section */}
        <section>
          <h3 style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '0.5rem', marginBottom: '1.5rem' }}>
            <i className="fas fa-trophy" style={{ color: '#f59e0b', marginRight: '0.5rem' }}></i> 
            Past Results
          </h3>
          
          <div className="table-container">
            {loading ? (
              <div style={{ padding: '2rem', textAlign: 'center' }}>Loading results...</div>
            ) : (
              <table className="custom-table">
                <thead>
                  <tr>
                    <th>Exam Title</th>
                    <th>Score</th>
                    <th>Percentage</th>
                    <th>Status</th>
                    <th>Date Taken</th>
                  </tr>
                </thead>
                <tbody>
                  {pastResults.length > 0 ? pastResults.map(res => {
                    const percentage = res.total_marks > 0 ? ((res.score / res.total_marks) * 100).toFixed(1) : 0;
                    return (
                      <tr key={res.id}>
                        <td style={{ fontWeight: 600 }}>{res.title}</td>
                        <td style={{ fontWeight: 'bold' }}>{res.score} / {res.total_marks}</td>
                        <td>{percentage}%</td>
                        <td>
                          {res.passed == 1 ? (
                            <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Passed</span>
                          ) : (
                            <span style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Failed</span>
                          )}
                        </td>
                        <td style={{ fontSize: '0.9rem', color: 'var(--text-secondary)' }}>{new Date(res.submitted_at).toLocaleDateString()}</td>
                      </tr>
                    );
                  }) : (
                    <tr>
                      <td colSpan="5" style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>No past exam results found.</td>
                    </tr>
                  )}
                </tbody>
              </table>
            )}
          </div>
        </section>

      </div>
    </StudentLayout>
  );
};

export default StudentExams;
