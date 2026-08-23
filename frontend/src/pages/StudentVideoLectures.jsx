import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentVideoLectures = () => {
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [activeVideo, setActiveVideo] = useState(null);

  const fetchVideos = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/student/lms.php?type=videos', { withCredentials: true });
      if (res.data.status === 'success') {
        setVideos(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to load video lectures.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchVideos();
  }, []);

  return (
    <StudentLayout>
      <div style={{ marginBottom: '2rem' }}>
        <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Class Recordings</h2>
        <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Watch recorded lectures and video tutorials for your course.</p>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading videos...</div>
        ) : videos.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
            
            {/* Active Video Player */}
            {activeVideo && (
              <div style={{ background: '#000', borderRadius: '12px', overflow: 'hidden', boxShadow: '0 10px 30px rgba(0,0,0,0.5)' }}>
                <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%' /* 16:9 Aspect Ratio */ }}>
                  <iframe 
                    style={{ position: 'absolute', top: 0, left: 0, width: '100%', height: '100%', border: 'none' }}
                    src={`${activeVideo.video_url}?autoplay=1`} 
                    title={activeVideo.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                    allowFullScreen
                  ></iframe>
                </div>
                <div style={{ padding: '1.5rem', background: 'var(--bg-secondary)', borderTop: '1px solid var(--border-color)' }}>
                  <h3 style={{ margin: '0 0 0.5rem 0' }}>{activeVideo.title}</h3>
                  <p style={{ margin: 0, color: 'var(--text-secondary)' }}>{activeVideo.description || 'No description provided.'}</p>
                </div>
              </div>
            )}

            {/* Video Grid */}
            <h4 style={{ margin: 0 }}>{activeVideo ? 'More Lectures' : 'Available Lectures'}</h4>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', gap: '1.5rem' }}>
              {videos.map(video => (
                <div 
                  key={video.id} 
                  className="glass-card" 
                  style={{ 
                    cursor: 'pointer', 
                    overflow: 'hidden',
                    border: activeVideo?.id === video.id ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                    transform: activeVideo?.id === video.id ? 'scale(0.98)' : 'scale(1)',
                    transition: 'all 0.2s'
                  }}
                  onClick={() => {
                    setActiveVideo(video);
                    window.scrollTo({ top: 0, behavior: 'smooth' });
                  }}
                >
                  <div style={{ position: 'relative', width: '100%', paddingTop: '56.25%', background: '#222' }}>
                    {/* Just display thumbnail or a play icon overlay since rendering 20 iframes is heavy */}
                    <div style={{ position: 'absolute', top: 0, left: 0, right: 0, bottom: 0, display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'rgba(255,255,255,0.7)' }}>
                      <i className="fas fa-play-circle" style={{ fontSize: '3rem' }}></i>
                    </div>
                  </div>
                  <div style={{ padding: '1rem' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--accent-primary)', marginBottom: '0.3rem', fontWeight: 600 }}>LECTURE</div>
                    <h5 style={{ margin: 0, fontSize: '1rem', lineHeight: 1.4 }}>{video.title}</h5>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.5rem' }}>
                      {new Date(video.posted_at).toLocaleDateString()}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <i className="fas fa-video" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Videos Found</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>There are currently no video lectures assigned to your course.</p>
          </div>
        )}
      </div>
    </StudentLayout>
  );
};

export default StudentVideoLectures;
