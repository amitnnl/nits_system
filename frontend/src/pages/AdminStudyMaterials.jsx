import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminStudyMaterials = () => {
  const [materials, setMaterials] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [form, setForm] = useState({ course_id: '', title: '', description: '' });
  const [file, setFile] = useState(null);

  const fetchMaterials = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/lms.php?type=materials', { withCredentials: true });
      if (res.data.status === 'success') {
        setMaterials(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch study materials.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/admin/lms.php?type=courses', { withCredentials: true });
      if (res.data.status === 'success') {
        setCourses(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load courses");
    }
  };

  useEffect(() => {
    fetchMaterials();
    fetchCourses();
  }, []);

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return alert("Please select a file to upload.");
    if (file.size > 10 * 1024 * 1024) return alert("File size exceeds 10MB limit.");

    const formData = new FormData();
    formData.append('course_id', form.course_id);
    formData.append('title', form.title);
    formData.append('description', form.description);
    formData.append('file', file);

    try {
      setUploading(true);
      const res = await axios.post('/api/admin/lms.php?type=materials', formData, {
        withCredentials: true,
        headers: { 'Content-Type': 'multipart/form-data' }
      });
      
      if (res.data.status === 'success') {
        setShowModal(false);
        setForm({ course_id: '', title: '', description: '' });
        setFile(null);
        fetchMaterials();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to upload material.');
    } finally {
      setUploading(false);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this study material? The file will be permanently removed.")) return;
    try {
      const res = await axios.delete(`/api/admin/lms.php?type=materials&id=${id}`, { withCredentials: true });
      if (res.data.status === 'success') {
        fetchMaterials();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to delete material.');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Study Materials</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Upload PDFs, Docs, and notes to the Digital Library.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Upload Material
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading library...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course</th>
                <th>Title</th>
                <th>Description</th>
                <th>File Name</th>
                <th>Upload Date</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {materials.length > 0 ? materials.map(item => (
                <tr key={item.id}>
                  <td><span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{item.course_name}</span></td>
                  <td style={{ fontWeight: 600 }}>{item.title}</td>
                  <td>{item.description || '-'}</td>
                  <td style={{ color: 'var(--accent-primary)', fontSize: '0.9rem' }}>
                    <i className="fas fa-file-pdf" style={{ marginRight: '0.5rem' }}></i>
                    {item.file_name}
                  </td>
                  <td style={{ fontSize: '0.85rem' }}>{new Date(item.uploaded_at).toLocaleDateString()}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <a href={`http://localhost/loginsystem/${item.file_path}`} target="_blank" rel="noreferrer" className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>
                      </a>
                      <button onClick={() => handleDelete(item.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '4px' }}>
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="6" style={{ textAlign: 'center', padding: '2rem' }}>No study materials uploaded yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Upload Study Material</h3>
            <form onSubmit={handleUpload} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Select Course</label>
                <select className="form-control" value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} required>
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Title</label>
                <input type="text" className="form-control" placeholder="e.g. Chapter 1: Introduction to Tally" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Select File (Max 10MB)</label>
                <input type="file" className="form-control" onChange={e => setFile(e.target.files[0])} required accept=".pdf,.doc,.docx,.ppt,.pptx,.txt,.zip" />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }} disabled={uploading}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }} disabled={uploading}>
                  {uploading ? 'Uploading...' : 'Upload File'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminStudyMaterials;
