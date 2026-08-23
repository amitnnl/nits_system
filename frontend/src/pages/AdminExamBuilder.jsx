import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';
import AdminLayout from '../components/AdminLayout';

const AdminExamBuilder = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    exam_id: examId,
    question_text: '',
    option_a: '',
    option_b: '',
    option_c: '',
    option_d: '',
    correct_option: 'A',
    marks: 1
  });

  const fetchQuestions = async () => {
    try {
      setLoading(true);
      const res = await axios.get(`/api/admin/exams.php?type=questions&exam_id=${examId}`, { withCredentials: true });
      if (res.data.status === 'success') {
        setQuestions(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch questions.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchQuestions();
  }, [examId]);

  const handleAddQuestion = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/exams.php?type=questions', form, { withCredentials: true });
      if (res.data.status === 'success') {
        setShowModal(false);
        setForm({
          exam_id: examId,
          question_text: '',
          option_a: '',
          option_b: '',
          option_c: '',
          option_d: '',
          correct_option: 'A',
          marks: 1
        });
        fetchQuestions();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to add question.');
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this question?")) return;
    try {
      const res = await axios.delete(`/api/admin/exams.php?type=questions&id=${id}`, { withCredentials: true });
      if (res.data.status === 'success') fetchQuestions();
    } catch (err) {
      alert('Failed to delete question.');
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <button onClick={() => navigate('/admin/exams')} className="btn btn-secondary" style={{ padding: '0.4rem 0.8rem', marginBottom: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <i className="fas fa-arrow-left"></i> Back to Exams
          </button>
          <h2>Exam Builder</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Add multiple-choice questions to this exam.</p>
        </div>
        <button onClick={() => setShowModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Add Question
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading questions...</div>
        ) : questions.length > 0 ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
            {questions.map((q, idx) => (
              <div key={q.id} className="glass-card" style={{ padding: '1.5rem', position: 'relative' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
                  <div style={{ display: 'flex', gap: '1rem' }}>
                    <div style={{ fontWeight: 'bold', fontSize: '1.2rem', color: 'var(--accent-primary)' }}>Q{idx + 1}.</div>
                    <div>
                      <h4 style={{ margin: '0 0 1rem 0', fontSize: '1.1rem' }}>{q.question_text}</h4>
                      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '0.5rem' }}>
                        <div style={{ padding: '0.5rem', background: q.correct_option === 'A' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', border: q.correct_option === 'A' ? '1px solid #10b981' : '1px solid transparent', borderRadius: '4px' }}>
                          <strong>A.</strong> {q.option_a}
                        </div>
                        <div style={{ padding: '0.5rem', background: q.correct_option === 'B' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', border: q.correct_option === 'B' ? '1px solid #10b981' : '1px solid transparent', borderRadius: '4px' }}>
                          <strong>B.</strong> {q.option_b}
                        </div>
                        <div style={{ padding: '0.5rem', background: q.correct_option === 'C' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', border: q.correct_option === 'C' ? '1px solid #10b981' : '1px solid transparent', borderRadius: '4px' }}>
                          <strong>C.</strong> {q.option_c}
                        </div>
                        <div style={{ padding: '0.5rem', background: q.correct_option === 'D' ? 'rgba(16, 185, 129, 0.1)' : 'var(--bg-secondary)', border: q.correct_option === 'D' ? '1px solid #10b981' : '1px solid transparent', borderRadius: '4px' }}>
                          <strong>D.</strong> {q.option_d}
                        </div>
                      </div>
                    </div>
                  </div>
                  <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: '0.5rem' }}>
                    <span style={{ background: 'var(--bg-tertiary)', padding: '0.2rem 0.5rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>{q.marks} Marks</span>
                    <button onClick={() => handleDelete(q.id)} className="btn btn-danger" style={{ padding: '0.4rem', borderRadius: '4px' }}>
                      <i className="fas fa-trash-alt"></i>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div style={{ textAlign: 'center', padding: '4rem 2rem', background: 'var(--bg-secondary)', borderRadius: '12px', border: '1px dashed var(--border-color)' }}>
            <i className="fas fa-question-circle" style={{ fontSize: '3rem', color: 'var(--text-muted)', marginBottom: '1rem' }}></i>
            <h3 style={{ margin: '0 0 0.5rem 0' }}>No Questions Yet</h3>
            <p style={{ color: 'var(--text-secondary)', margin: 0 }}>Click the "Add Question" button to start building your exam.</p>
          </div>
        )}
      </div>

      {showModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '90vh', overflowY: 'auto' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Add Multiple Choice Question</h3>
            <form onSubmit={handleAddQuestion} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Question Text</label>
                <textarea className="form-control" rows="3" value={form.question_text} onChange={e => setForm({...form, question_text: e.target.value})} required placeholder="Enter the question here..."></textarea>
              </div>
              
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label>Option A</label>
                  <input type="text" className="form-control" value={form.option_a} onChange={e => setForm({...form, option_a: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Option B</label>
                  <input type="text" className="form-control" value={form.option_b} onChange={e => setForm({...form, option_b: e.target.value})} required />
                </div>
                <div className="form-group">
                  <label>Option C (Optional)</label>
                  <input type="text" className="form-control" value={form.option_c} onChange={e => setForm({...form, option_c: e.target.value})} />
                </div>
                <div className="form-group">
                  <label>Option D (Optional)</label>
                  <input type="text" className="form-control" value={form.option_d} onChange={e => setForm({...form, option_d: e.target.value})} />
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1rem' }}>
                <div className="form-group" style={{ flex: 2 }}>
                  <label>Correct Answer</label>
                  <select className="form-control" value={form.correct_option} onChange={e => setForm({...form, correct_option: e.target.value})} required>
                    <option value="A">Option A</option>
                    <option value="B">Option B</option>
                    <option value="C">Option C</option>
                    <option value="D">Option D</option>
                  </select>
                </div>
                <div className="form-group" style={{ flex: 1 }}>
                  <label>Marks</label>
                  <input type="number" min="1" className="form-control" value={form.marks} onChange={e => setForm({...form, marks: e.target.value})} required />
                </div>
              </div>
              
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Save Question</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminExamBuilder;
