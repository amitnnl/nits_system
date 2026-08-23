import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentDigitalLibrary = () => {
  const [materials, setMaterials] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/student/lms.php?type=materials', { withCredentials: true });
      if (res.data.status === 'success') {
        setMaterials(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to load study materials.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMaterials();
  }, []);

  return (
    <StudentLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Digital Library</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Download your course study materials, notes, and eBooks.</p>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your materials...</div>
        ) : materials.length > 0 ? (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
            {materials.map(item => (
              <div key={item.id} className="glass-card" style={{ padding: '1.5rem', display: 'flex', flexDirection: 'column', height: '100%' }}>
                <div style={{ display: 'flex', alignItems: 'center', marginBottom: '1rem' }}>
                  <div style={{ width: '48px', height: '48px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', marginRight: '1rem' }}>
                    <i className="fas fa-file-pdf"></i>
                  </div>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.1rem', wordBreak: 'break-word' }}>{item.title}</h4>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(item.uploaded_at).toLocaleDateString()}</span>
                  </div>
                </div>
                
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, marginBottom: '1.5rem' }}>
                  {item.description || 'No description provided.'}
                </p>
                
                <a 
                  href={`http://localhost/loginsystem/${item.file_path}`} 
                  target="_blank" 
                  rel="noreferrer" 
                  className="btn btn-primary" 
                  style={{ width: '100%', textAlign: 'center', display: 'flex', justifyContent: 'center', alignItems: 'center', gap: '0.5rem' }}
                >
                  <i className="fas fa-download"></i> Download File
                </a>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <i className="fas fa-folder-open" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Materials Found</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>There are currently no study materials assigned to your course.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentDigitalLibrary;
