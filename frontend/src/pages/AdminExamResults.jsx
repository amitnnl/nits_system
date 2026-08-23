import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const AdminExamResults = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResults = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/admin/exams.php?type=results&exam_id=${examId}`, { withCredentials: true });
        if (res.data.status === 'success') {
          setResults(res.data.data);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError('Failed to fetch exam results.');
      } finally {
        setLoading(false);
      }
    };
    fetchResults();
  }, [examId]);

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => navigate('/admin/exams')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Back to Exams
          </button>
          <h2>Exam Results</h2>
          <p style={{ color: 'var(--text-secondary)' }}>View student performance for this exam.</p>
        </div>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading results...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student Name</th>
                <th>Registration No.</th>
                <th>Score</th>
                <th>Status</th>
                <th>Submitted On</th>
              </tr>
            </thead>
            <tbody>
              {results.length > 0 ? results.map(res => (
                <tr key={res.id}>
                  <td style={{ fontWeight: 600 }}>{res.fname} {res.lname}</td>
                  <td style={{ color: 'var(--accent-primary)' }}>{res.reg_number || 'N/A'}</td>
                  <td style={{ fontWeight: 'bold' }}>{res.score}</td>
                  <td>
                    {res.passed == 1 ? (
                      <span style={{ color: '#10b981', background: 'rgba(16, 185, 129, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Passed</span>
                    ) : (
                      <span style={{ color: '#f43f5e', background: 'rgba(244, 63, 94, 0.1)', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Failed</span>
                    )}
                  </td>
                  <td>{new Date(res.submitted_at).toLocaleString()}</td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No student has submitted this exam yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminExamResults;
