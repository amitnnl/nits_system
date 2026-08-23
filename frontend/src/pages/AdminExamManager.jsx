import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const AdminExamManager = () => {
  const [exams, setExams] = useState([]);
  const [courses, setCourses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const navigate = useNavigate();

  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({ course_id: '', title: '', description: '', duration_minutes: 30, total_marks: 0 });

  const fetchExams = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/exams.php?type=exams', { withCredentials: true });
      if (res.data.status === 'success') {
        setExams(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch exams.');
    } finally {
      setLoading(false);
    }
  };

  const fetchCourses = async () => {
    try {
      const res = await axios.get('/api/admin/lms.php?type=courses', { withCredentials: true });
      if (res.data.status === 'success') setCourses(res.data.data);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchExams();
    fetchCourses();
  }, []);

  const handleCreateExam = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/exams.php?type=exams', form, { withCredentials: true });
      if (res.data.status === 'success') {
        setShowModal(false);
        setForm({ course_id: '', title: '', description: '', duration_minutes: 30, total_marks: 0 });
        fetchExams();
        // Redirect to builder automatically
        navigate(`/admin/exams/build/${res.data.data.id}`);
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to create exam.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this exam? All questions and student results will be permanently lost.")) return;
    try {
      const res = await axios.delete(`/api/admin/exams.php?type=exams&id=${id}`, { withCredentials: true });
      if (res.data.status === 'success') fetchExams();
    } catch (err) {
      alert('Failed to delete exam.');
    }
  };

  const toggleActive = async (id, currentStatus) => {
    try {
      const newStatus = currentStatus == 1 ? 0 : 1;
      const res = await axios.put(`/api/admin/exams.php?type=exams&id=${id}`, { is_active: newStatus }, { withCredentials: true });
      if (res.data.status === 'success') fetchExams();
    } catch (err) {
      alert('Failed to update status.');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Exam Manager</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Create and publish multiple-choice online examinations.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Create Exam
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading exams...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Status</th>
                <th>Course</th>
                <th>Exam Title</th>
                <th>Duration</th>
                <th>Questions</th>
                <th>Total Marks</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {exams.length > 0 ? exams.map(exam => (
                <tr key={exam.id}>
                  <td>
                    <button 
                      onClick={() => toggleActive(exam.id, exam.is_active)}
                      style={{ 
                        background: exam.is_active == 1 ? 'rgba(16, 185, 129, 0.1)' : 'rgba(148, 163, 184, 0.1)', 
                        color: exam.is_active == 1 ? '#10b981' : '#94a3b8', 
                        border: 'none',
                        padding: '0.3rem 0.6rem', 
                        borderRadius: '4px', 
                        fontSize: '0.8rem', 
                        fontWeight: 'bold',
                        cursor: 'pointer'
                      }}
                    >
                      {exam.is_active == 1 ? 'LIVE' : 'DRAFT'}
                    </button>
                  </td>
                  <td><span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem' }}>{exam.course_name}</span></td>
                  <td style={{ fontWeight: 600 }}>{exam.title}</td>
                  <td>{exam.duration_minutes} mins</td>
                  <td>{exam.question_count}</td>
                  <td style={{ color: 'var(--accent-success)', fontWeight: 500 }}>{exam.total_marks}</td>
                  <td>
                    <div style={{ display: 'flex', gap: '0.5rem' }}>
                      <button onClick={() => navigate(`/admin/exams/build/${exam.id}`)} className="btn btn-secondary" style={{ padding: '0.4rem', borderRadius: '4px' }} title="Build/Edit Questions">
                        <i className="fas fa-edit"></i> Build
                      </button>
                      <button onClick={() => navigate(`/admin/exams/results/${exam.id}`)} className="btn btn-primary" style={{ padding: '0.4rem', borderRadius: '4px' }} title="View Results">
                        <i className="fas fa-chart-bar"></i> Results
                      </button>
                      <button onClick={() => handleDelete(exam.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '4px' }} title="Delete Exam">
                        <i className="fas fa-trash-alt"></i>
                      </button>
                    </div>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No exams created yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Create New Exam</h3>
            <form onSubmit={handleCreateExam} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Select Course</label>
                <select className="form-control" value={form.course_id} onChange={e => setForm({...form, course_id: e.target.value})} required>
                  <option value="">-- Choose Course --</option>
                  {courses.map(c => <option key={c.id} value={c.id}>{c.course_name}</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Exam Title</label>
                <input type="text" className="form-control" placeholder="e.g. Mid-Term ADCA Exam" value={form.title} onChange={e => setForm({...form, title: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Description / Instructions (Optional)</label>
                <textarea className="form-control" rows="2" value={form.description} onChange={e => setForm({...form, description: e.target.value})}></textarea>
              </div>
              <div className="form-group">
                <label>Duration (Minutes)</label>
                <input type="number" min="1" className="form-control" value={form.duration_minutes} onChange={e => setForm({...form, duration_minutes: e.target.value})} required />
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Create Exam</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminExamManager;
