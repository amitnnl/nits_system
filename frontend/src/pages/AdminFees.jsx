import React, { useState, useEffect } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminFees = () => {
  const [fees, setFees] = useState([]);
  const [students, setStudents] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  
  // Modals
  const [showAssignModal, setShowAssignModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedFee, setSelectedFee] = useState(null);

  // Forms
  const [assignForm, setAssignForm] = useState({ student_id: '', course_name: '', total_fee: '', due_date: '' });
  const [paymentForm, setPaymentForm] = useState({ amount_paid: '', payment_method: 'Cash', transaction_id: '' });

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/admin/fees.php', { withCredentials: true });
      if (res.data.status === 'success') {
        setFees(res.data.data);
      } else {
        setError(res.data.message);
      }
    } catch (err) {
      setError('Failed to fetch fees.');
    } finally {
      setLoading(false);
    }
  };

  const fetchStudents = async () => {
    try {
      const res = await axios.get('/api/admin/users.php', { withCredentials: true });
      if (res.data.status === 'success') {
        setStudents(res.data.data);
      }
    } catch (err) {
      console.error("Failed to load students for dropdown");
    }
  };

  useEffect(() => {
    fetchFees();
    fetchStudents();
  }, []);

  const handleAssignFee = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('/api/admin/fees.php?action=assign_fee', assignForm, { withCredentials: true });
      if (res.data.status === 'success') {
        alert('Fee assigned successfully!');
        setShowAssignModal(false);
        setAssignForm({ student_id: '', course_name: '', total_fee: '', due_date: '' });
        fetchFees();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to assign fee.');
    }
  };

  const handleRecordPayment = async (e) => {
    e.preventDefault();
    try {
      const payload = { ...paymentForm, fee_id: selectedFee.id };
      const res = await axios.post('/api/admin/fees.php?action=record_payment', payload, { withCredentials: true });
      if (res.data.status === 'success') {
        alert('Payment recorded successfully!');
        setShowPaymentModal(false);
        setPaymentForm({ amount_paid: '', payment_method: 'Cash', transaction_id: '' });
        fetchFees();
      } else {
        alert(res.data.message);
      }
    } catch (err) {
      alert('Failed to record payment.');
    }
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Paid</span>;
      case 'Partial': return <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Partial</span>;
      case 'Unpaid': return <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Unpaid</span>;
      default: return null;
    }
  };

  return (
    <AdminLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2>Fee Management Ledger</h2>
          <p style={{ color: 'var(--text-secondary)' }}>Assign course fees and record student payments.</p>
        </div>
        <button onClick={() => setShowAssignModal(true)} className="btn btn-primary" style={{ padding: '0.75rem 1.5rem', borderRadius: '8px' }}>
          + Assign New Fee
        </button>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading ledger...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Student</th>
                <th>Course</th>
                <th>Total Fee</th>
                <th>Paid Amount</th>
                <th>Balance Due</th>
                <th>Status</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {fees.length > 0 ? fees.map(fee => (
                <tr key={fee.id}>
                  <td>
                    <div style={{ fontWeight: 600 }}>{fee.fname} {fee.lname}</div>
                    <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>{fee.reg_number}</div>
                  </td>
                  <td>{fee.course_name}</td>
                  <td style={{ fontWeight: 600 }}>₹{parseFloat(fee.total_fee).toFixed(2)}</td>
                  <td style={{ color: 'var(--accent-success)' }}>₹{fee.total_paid.toFixed(2)}</td>
                  <td style={{ color: 'var(--accent-danger)' }}>₹{fee.balance.toFixed(2)}</td>
                  <td>{getStatusBadge(fee.status)}</td>
                  <td>
                    {fee.status !== 'Paid' && (
                      <button 
                        onClick={() => { setSelectedFee(fee); setShowPaymentModal(true); }} 
                        className="btn btn-secondary" 
                        style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      >
                        Record Payment
                      </button>
                    )}
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>No fee records found.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Assign Fee Modal */}
      {showAssignModal && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Assign Fee to Student</h3>
            <form onSubmit={handleAssignFee} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Select Student</label>
                <select className="form-control" value={assignForm.student_id} onChange={e => setAssignForm({...assignForm, student_id: e.target.value})} required>
                  <option value="">-- Select Student --</option>
                  {students.map(s => <option key={s.id} value={s.id}>{s.fname} {s.lname} ({s.reg_number})</option>)}
                </select>
              </div>
              <div className="form-group">
                <label>Course Name</label>
                <input type="text" className="form-control" placeholder="e.g. ADCA 12 Months" value={assignForm.course_name} onChange={e => setAssignForm({...assignForm, course_name: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Total Fee Amount (₹)</label>
                <input type="number" step="0.01" className="form-control" value={assignForm.total_fee} onChange={e => setAssignForm({...assignForm, total_fee: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Due Date (Optional)</label>
                <input type="date" className="form-control" value={assignForm.due_date} onChange={e => setAssignForm({...assignForm, due_date: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowAssignModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1 }}>Assign Fee</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Record Payment Modal */}
      {showPaymentModal && selectedFee && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '500px' }}>
            <h3 style={{ marginBottom: '1.5rem', marginTop: 0 }}>Record Installment Payment</h3>
            <p style={{ marginBottom: '1.5rem', color: 'var(--text-secondary)' }}>Recording payment for <strong>{selectedFee.fname} {selectedFee.lname}</strong>. Balance Due: <strong>₹{selectedFee.balance.toFixed(2)}</strong></p>
            <form onSubmit={handleRecordPayment} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              <div className="form-group">
                <label>Amount Paid (₹)</label>
                <input type="number" step="0.01" max={selectedFee.balance} className="form-control" value={paymentForm.amount_paid} onChange={e => setPaymentForm({...paymentForm, amount_paid: e.target.value})} required />
              </div>
              <div className="form-group">
                <label>Payment Method</label>
                <select className="form-control" value={paymentForm.payment_method} onChange={e => setPaymentForm({...paymentForm, payment_method: e.target.value})} required>
                  <option value="Cash">Cash</option>
                  <option value="UPI">UPI</option>
                  <option value="Bank Transfer">Bank Transfer</option>
                  <option value="Card">Credit/Debit Card</option>
                </select>
              </div>
              <div className="form-group">
                <label>Transaction ID (Optional)</label>
                <input type="text" className="form-control" placeholder="For UPI/Bank transfers" value={paymentForm.transaction_id} onChange={e => setPaymentForm({...paymentForm, transaction_id: e.target.value})} />
              </div>
              <div style={{ display: 'flex', gap: '1rem', marginTop: '1rem' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowPaymentModal(false)} style={{ flex: 1 }}>Cancel</button>
                <button type="submit" className="btn btn-primary" style={{ flex: 1, backgroundColor: 'var(--accent-success)', borderColor: 'var(--accent-success)' }}>Confirm Payment</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </AdminLayout>
  );
};

export default AdminFees;
