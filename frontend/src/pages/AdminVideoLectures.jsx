import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminVideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course_id: '', title: '', description: '', video_url: '' });

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/lms.php?type=videos', { withCredentials: true });
      if (res.data.status === 'success') {
        setVideos(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch video lectures.');
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
    fetchVideos();
    fetchCourses();
  }, []);

  const handlePostVideo = async (e) => {
    e.preventDefault();
    
    // Auto-convert standard YouTube URLs to Embed URLs
    let embedUrl = form.video_url;
    if (embedUrl.includes('youtube.com/watch?v=')) {
      embedUrl = embedUrl.replace('youtube.com/watch?v=', 'youtube.com/embed/');
      // Strip off any extra parameters like &t=...
      const ampersandPos = embedUrl.indexOf('&');
      if (ampersandPos !== -1) {
        embedUrl = embedUrl.substring(0, ampersandPos);
      }
    } else if (embedUrl.includes('youtu.be/')) {
      embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
      const questionPos = embedUrl.indexOf('?');
      if (questionPos !== -1) {
        embedUrl = embedUrl.substring(0, questionPos);
      }
    }

    try {
      const payload = { ...form, video_url: embedUrl };
      const res = await axios.post('/api/admin/lms.php?type=videos', payload, { withCredentials: true });
      
      if (res.data.status === 'success') {
        setShowModal(false);
        setForm({ course_id: '', title: '', description: '', video_url: '' });
        fetchVideos();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to post video.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this video lecture?")) return;
    try {
      const res = await axios.delete(`/api/admin/lms.php?type=videos&id=${id}`, { withCredentials: true });
      if (res.data.status === 'success') {
        fetchVideos();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to delete video.');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Video Lectures</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Embed YouTube/Vimeo class recordings for your students.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Post Video
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading videos...</div>
        ) : (
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '1.5rem', padding: '1rem' }}>
            {videos.length > 0 ? videos.map(video => (
              <div key={video.id} className="glass-card" style={{ display: 'flex', flexDirection: 'column', overflow: 'hidden' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={video.video_url} 
                    title={video.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div style={{ padding: '1.5rem', flex: 1, display: 'flex', flexDirection: 'column' }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '0.5rem' }}>
                    <span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.7rem', color: 'var(--text-secondary)' }}>{video.course_name}</span>
                    <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(video.posted_at).toLocaleDateString()}</span>
                  </div>
                  <h4 style={{ margin: '0.5rem 0', fontSize: '1.1rem' }}>{video.title}</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.85rem', flex: 1, marginBottom: '1rem' }}>{video.description || 'No description provided.'}</p>
                  <button onClick={() => handleDelete(video.id)} className="btn btn-secondary" style={{ color: 'var(--accent-danger)', width: '100%' }}>
                    <i className="fas fa-trash-alt" style={{ marginRight: '0.5rem' }}></i> Delete Lecture
                  </button>
                </div>
              </div>
            )) : (
              <div style={{ gridColumn: '1 / -1', textAlign: 'center', padding: '3rem', color: 'var(--text-secondary)' }}>
                No video lectures posted yet.
              </div>
            )}
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Post Video Lecture</h3>
            <form onSubmit={handlePostVideo} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Select Course</label>
                <select className="form-control" value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} required>
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Lecture Title</label>
                <input type="text" className="form-control" placeholder="e.g. Day 1: Tally Basics" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description (Optional)</label>
                <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>YouTube/Vimeo Link</label>
                <input type="url" className="form-control" placeholder="https://youtube.com/watch?v=..." value={form.video_url} onChange={e => setForm({...form, video_url: e.target.value})} required />
                <small style={{ color: 'var(--text-muted)', marginTop: '0.3rem', display: 'block' }}>Paste the full YouTube link. It will automatically convert to an embedded player.</small>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Post Video</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminVideoLectures;
