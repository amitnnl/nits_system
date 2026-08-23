import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminCourseManager = () => {
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [form, setForm] = useState({ id: null, course_name: '', description: '', duration_months: 6, base_fee: 0 });

  const fetchCourses = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/lms.php?type=courses', { withCredentials: true });
      if (res.data.status === 'success') {
        setCourses(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch courses.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  const handleAddCourse = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/lms.php?type=courses', form, { withCredentials: true });
      if (res.data.status === 'success') {
        setShowModal(false);
        setIsEditing(false);
        setForm({ id: null, course_name: '', description: '', duration_months: 6, base_fee: 0 });
        fetchCourses();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to add course.');
    }
  };

  const handleEditClick = (course) => {
    setForm(course);
    setIsEditing(true);
    setShowModal(true);
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this course? This will also delete ALL related study materials and video lectures!")) return;
    try {
      const res = await axios.delete(`/api/admin/lms.php?type=courses&id=${id}`, { withCredentials: true });
      if (res.data.status === 'success') {
        fetchCourses();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to delete course.');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Course Manager</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Define your curriculum and course offerings.</p>
        </div>
        <button onClick={() => { setIsEditing(false); setForm({ id: null, course_name: '', description: '', duration_months: 6, base_fee: 0 }); setShowModal(true); }} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Add Course
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading courses...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Description</th>
                <th>Duration</th>
                <th>Base Fee</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {courses.length > 0 ? courses.map(course => (
                <tr key={course.id}>
                  <td style={{ fontWeight: 600 }}>{course.course_name}</td>
                  <td>{course.description || '-'}</td>
                  <td>{course.duration_months} Months</td>
                  <td style={{ color: 'var(--accent-success)', fontWeight: 500 }}>₹{parseFloat(course.base_fee).toFixed(2)}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => handleEditClick(course)} className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '4px', background: 'var(--accent-warning)', border: 'none', boxShadow: 'none' }} title="Edit Course">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>
                      </button>
                      <button onClick={() => handleDelete(course.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '4px' }} title="Delete Course">
                        <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/><line x1="10" y1="11" x2="10" y2="17"/><line x1="14" y1="11" x2="14" y2="17"/></svg>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>No courses defined.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>{isEditing ? 'Edit Course' : 'Add New Course'}</h3>
            <form onSubmit={handleAddCourse} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Course Name</label>
                <input type="text" className="form-control" value={form.course_name} onChange={e => setForm({...form, course_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description</label>
                <textarea className="form-control" rows="3" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
              <div className="form-group" style={{ display: 'flex', gap: '1rem' }}>
                <div style={{ flex: 1 }}>
                  <label>Duration (Months)</label>
                  <input type="number" className="form-control" value={form.duration_months} onChange={e => setForm({...form, duration_months: e.target.value})} required />
                </div>
                <div style={{ flex: 1 }}>
                  <label>Base Fee (₹)</label>
                  <input type="number" step="0.01" className="form-control" value={form.base_fee} onChange={e => setForm({...form, base_fee: e.target.value})} required />
                </div>
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>{isEditing ? 'Update Course' : 'Add Course'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminCourseManager;
