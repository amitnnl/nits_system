import React, { useState, useEffect } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentFees = () => {
  const [fees, setFees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [selectedPayments, setSelectedPayments] = useState(null);

  const fetchFees = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/student/fees.php', { withCredentials: true });
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

  useEffect(() => {
    fetchFees();
  }, []);

  const getStatusBadge = (status) => {
    switch (status) {
      case 'Paid': return <span style={{ background: 'rgba(16, 185, 129, 0.1)', color: '#10b981', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Fully Paid</span>;
      case 'Partial': return <span style={{ background: 'rgba(245, 158, 11, 0.1)', color: '#f59e0b', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Partial</span>;
      case 'Unpaid': return <span style={{ background: 'rgba(244, 63, 94, 0.1)', color: '#f43f5e', padding: '0.3rem 0.6rem', borderRadius: '4px', fontSize: '0.8rem', fontWeight: 'bold' }}>Unpaid</span>;
      default: return null;
    }
  };

  return (
    <StudentLayout>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '2rem' }}>
        <div>
          <h2 style={{ fontSize: '2rem', fontWeight: 700, margin: 0 }}>Fee Ledger</h2>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>Track your course fees, view installments, and check pending dues.</p>
        </div>
      </div>

      {error && <div style={{ padding: '1rem', background: 'rgba(244,63,94,0.1)', color: 'var(--accent-danger)', borderRadius: '8px', marginBottom: '1rem' }}>{error}</div>}

      <div className="table-container animate-fade-in">
        {loading ? (
          <div style={{ padding: '2rem', textAlign: 'center' }}>Loading your fee records...</div>
        ) : (
          <table className="custom-table">
            <thead>
              <tr>
                <th>Course Name</th>
                <th>Total Fee</th>
                <th>Amount Paid</th>
                <th>Balance Due</th>
                <th>Due Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {fees.length > 0 ? fees.map(fee => (
                <tr key={fee.id}>
                  <td style={{ fontWeight: 600 }}>{fee.course_name}</td>
                  <td>₹{parseFloat(fee.total_fee).toFixed(2)}</td>
                  <td style={{ color: 'var(--accent-success)', fontWeight: 500 }}>₹{fee.total_paid.toFixed(2)}</td>
                  <td style={{ color: 'var(--accent-danger)', fontWeight: 500 }}>₹{fee.balance.toFixed(2)}</td>
                  <td>{fee.due_date ? new Date(fee.due_date).toLocaleDateString() : 'N/A'}</td>
                  <td>{getStatusBadge(fee.status)}</td>
                  <td>
                    <button 
                      onClick={() => setSelectedPayments(fee.payments)} 
                      className="btn btn-secondary" 
                      style={{ padding: '0.4rem 0.8rem', fontSize: '0.8rem' }}
                      disabled={fee.payments.length === 0}
                    >
                      {fee.payments.length === 0 ? 'No Receipts' : 'View Receipts'}
                    </button>
                  </td>
                </tr>
              )) : (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '2rem' }}>You do not have any fee records yet.</td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Receipts Modal */}
      {selectedPayments && (
        <div style={{ position: 'fixed', top: 0, left: 0, right: 0, bottom: 0, backgroundColor: 'rgba(0,0,0,0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 1000 }}>
          <div style={{ background: 'var(--bg-secondary)', padding: '2rem', borderRadius: '12px', width: '100%', maxWidth: '600px', maxHeight: '80vh', overflowY: 'auto' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.5rem' }}>
              <h3 style={{ margin: 0 }}>Payment Receipts</h3>
              <button onClick={() => setSelectedPayments(null)} style={{ background: 'none', border: 'none', fontSize: '1.5rem', cursor: 'pointer', color: 'var(--text-primary)' }}>&times;</button>
            </div>
            
            <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
              {selectedPayments.map(pay => (
                <div key={pay.id} style={{ padding: '1rem', border: '1px dashed var(--border-color)', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                  <div>
                    <div style={{ fontWeight: 600, fontSize: '1.1rem' }}>₹{parseFloat(pay.amount_paid).toFixed(2)}</div>
                    <div style={{ fontSize: '0.85rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                      {new Date(pay.payment_date).toLocaleDateString()} &middot; {pay.payment_method}
                    </div>
                    {pay.transaction_id && <div style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Txn: {pay.transaction_id}</div>}
                  </div>
                  <div style={{ color: 'var(--accent-success)' }}>
                    <i className="fas fa-check-circle" style={{ fontSize: '1.5rem' }}></i>
                  </div>
                </div>
              ))}
            </div>
            <button className="btn btn-primary" onClick={() => setSelectedPayments(null)} style={{ width: '100%', marginTop: '1.5rem' }}>Close</button>
          </div>
        </div>
      )}
    </StudentLayout>
  );
};

export default StudentFees;
