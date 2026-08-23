import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import { useParams, useNavigate } from 'react-router-dom';

const StudentExamRunner = () => {
  const { examId } = useParams();
  const navigate = useNavigate();
  
  const [examInfo, setExamInfo] = useState(null);
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({}); // { question_id: 'A' }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);
  
  const [timeLeft, setTimeLeft] = useState(0); // in seconds
  const timerRef = useRef(null);

  useEffect(() => {
    const fetchExam = async () => {
      try {
        setLoading(true);
        const res = await axios.get(`/api/student/exams.php?type=questions&exam_id=${examId}`, { withCredentials: true });
        if (res.data.status === 'success') {
          setExamInfo(res.data.data.exam);
          setQuestions(res.data.data.questions);
          // Init timer
          setTimeLeft(res.data.data.exam.duration_minutes * 60);
        } else {
          setError(res.data.message);
        }
      } catch (err) {
        setError('Failed to load exam data.');
      } finally {
        setLoading(false);
      }
    };
    fetchExam();
  }, [examId]);

  // Timer Logic
  useEffect(() => {
    if (timeLeft > 0 && !submitting) {
      timerRef.current = setInterval(() => {
        setTimeLeft(prev => {
          if (prev <= 1) {
            clearInterval(timerRef.current);
            handleSubmit(true); // auto-submit on timeout
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timerRef.current);
  }, [timeLeft, submitting]);

  const handleOptionChange = (questionId, optionKey) => {
    setAnswers(prev => ({ ...prev, [questionId]: optionKey }));
  };

  const handleSubmit = async (isAutoSubmit = false) => {
    if (!isAutoSubmit && !window.confirm("Are you sure you want to submit the exam?")) return;
    
    clearInterval(timerRef.current);
    setSubmitting(true);
    
    try {
      const payload = { exam_id: examId, answers: answers };
      const res = await axios.post('/api/student/exams.php?type=submit', payload, { withCredentials: true });
      
      if (res.data.status === 'success') {
        const { score, total, passed } = res.data.data;
        alert(`Exam Submitted!\n\nYour Score: ${score}/${total}\nStatus: ${passed == 1 ? 'PASSED' : 'FAILED'}`);
        navigate('/exams'); // go back to exams dashboard
      } else {
        alert(res.data.message);
        navigate('/exams');
      }
    } catch (err) {
      alert("Failed to submit exam results.");
      setSubmitting(false);
    }
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60).toString().padStart(2, '0');
    const s = (seconds % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  };

  if (loading) return <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>Loading Exam Environment...</div>;
  
  if (error) return (
    <div style={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', height: '100vh', background: 'var(--bg-primary)' }}>
      <div style={{ padding: '2rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '12px', textAlign: 'center' }}>
        <h3>Cannot Start Exam</h3>
        <p>{error}</p>
        <button onClick={() => navigate('/exams')} className="btn btn-secondary" style={{ marginTop: '1rem' }}>Go Back</button>
      </div>
    </div>
  );

  return (
    <div style={{ minHeight: '100vh', background: 'var(--bg-secondary)', paddingBottom: '4rem' }}>
      {/* Sticky Header with Timer */}
      <header style={{ position: 'sticky', top: 0, zIndex: 100, background: 'var(--bg-primary)', padding: '1rem 2rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', boxShadow: '0 4px 6px rgba(0,0,0,0.1)' }}>
        <h2 style={{ margin: 0, fontSize: '1.2rem' }}>{examInfo?.title}</h2>
        
        <div style={{ display: 'flex', alignItems: 'center', gap: '2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: timeLeft < 60 ? 'rgba(244,63,94,0.1)' : 'rgba(59,130,246,0.1)', color: timeLeft < 60 ? 'var(--accent-danger)' : 'var(--accent-primary)', padding: '0.5rem 1rem', borderRadius: '30px', fontWeight: 'bold', fontSize: '1.2rem' }}>
            <i className="fas fa-stopwatch"></i>
            {formatTime(timeLeft)}
          </div>
          <button onClick={() => handleSubmit(false)} disabled={submitting} className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px' }}>
            {submitting ? 'Submitting...' : 'Submit Exam'}
          </button>
        </div>
      </header>

      {/* Questions Container */}
      <div style={{ maxWidth: '800px', margin: '2rem auto', padding: '0 1rem' }}>
        <div style={{ background: 'var(--bg-primary)', padding: '1.5rem', borderRadius: '12px', marginBottom: '2rem', borderLeft: '4px solid var(--accent-primary)' }}>
          <h4 style={{ margin: '0 0 0.5rem 0' }}>Instructions</h4>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>Read each question carefully. Select the best answer. The exam will automatically submit when the timer reaches zero.</p>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
          {questions.map((q, idx) => (
            <div key={q.id} className="glass-card" style={{ padding: '2rem', background: 'var(--bg-primary)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '1.5rem' }}>
                <h3 style={{ margin: 0, fontSize: '1.2rem', lineHeight: 1.5 }}>
                  <span style={{ color: 'var(--accent-primary)', marginRight: '0.5rem' }}>{idx + 1}.</span> 
                  {q.question_text}
                </h3>
                <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', whiteSpace: 'nowrap', marginLeft: '1rem' }}>[{q.marks} Marks]</span>
              </div>
              
              <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {['A', 'B', 'C', 'D'].map(opt => {
                  const optionText = q[`option_${opt.toLowerCase()}`];
                  if (!optionText) return null; // In case C or D are empty
                  
                  const isSelected = answers[q.id] === opt;
                  
                  return (
                    <label 
                      key={opt} 
                      style={{ 
                        display: 'flex', 
                        alignItems: 'center', 
                        padding: '1rem', 
                        borderRadius: '8px', 
                        border: isSelected ? '2px solid var(--accent-primary)' : '1px solid var(--border-color)',
                        background: isSelected ? 'rgba(59, 130, 246, 0.05)' : 'transparent',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                      }}
                    >
                      <input 
                        type="radio" 
                        name={`question_${q.id}`} 
                        value={opt} 
                        checked={isSelected}
                        onChange={() => handleOptionChange(q.id, opt)}
                        style={{ marginRight: '1rem', transform: 'scale(1.2)' }}
                      />
                      <span style={{ fontWeight: 600, marginRight: '0.5rem' }}>{opt}.</span>
                      <span>{optionText}</span>
                    </label>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default StudentExamRunner;
