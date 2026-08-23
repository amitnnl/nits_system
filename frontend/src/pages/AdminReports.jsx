import React, { useState } from 'react';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminReports = () => {
  const [dates, setDates] = useState({
    fromdate: '',
    todate: ''
  });
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [hasSearched, setHasSearched] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setDates(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);
    setHasSearched(true);

    if (!dates.fromdate || !dates.todate) {
      setError('Both date inputs are required.');
      setLoading(false);
      return;
    }

    try {
      const response = await axios.get(`/api/admin/reports.php?fromdate=${dates.fromdate}&todate=${dates.todate}`);
      if (response.data.status === 'success') {
        setResults(response.data.data);
      } else {
        setError(response.data.message || 'Failed to fetch report data');
      }
    } catch (err) {
      console.error(err);
      setError('Server error occurred while generating report.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Registration Reports</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Retrieve student lists between selected admission dates</p>
          </div>
          {results.length > 0 && (
            <button onClick={() => window.print()} className="btn btn-primary">
              Print Report
            </button>
          )}
        </div>

        {/* Date parameters card */}
        <div className="glass-card no-print" style={{ padding: '2rem' }}>
          <form onSubmit={handleSubmit} style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-end', flexWrap: 'wrap' }}>
            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="form-label">From Date</label>
              <input
                name="fromdate"
                type="date"
                className="form-control"
                value={dates.fromdate}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group" style={{ flex: 1, minWidth: '200px', marginBottom: 0 }}>
              <label className="form-label">To Date</label>
              <input
                name="todate"
                type="date"
                className="form-control"
                value={dates.todate}
                onChange={handleChange}
                required
              />
            </div>

            <button type="submit" className="btn btn-primary" style={{ padding: '0.75rem 2rem' }} disabled={loading}>
              {loading ? 'Searching...' : 'Generate Report'}
            </button>
          </form>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {/* Results Container */}
        {hasSearched && (
          <div className="glass-card print-area" style={{ padding: '2.5rem' }}>
            <div style={{ borderBottom: '2px solid var(--border-color)', paddingBottom: '1rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '1.25rem', fontWeight: 600 }}>
                Registration Results List
              </h3>
              <span style={{ fontSize: '0.9rem', color: 'var(--text-muted)' }}>
                Period: {dates.fromdate} to {dates.todate}
              </span>
            </div>

            {loading ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                Querying database records...
              </div>
            ) : results.length === 0 ? (
              <div style={{ textAlign: 'center', padding: '2rem', color: 'var(--text-secondary)' }}>
                No records found between the selected dates.
              </div>
            ) : (
              <div className="table-container">
                <table className="custom-table">
                  <thead>
                    <tr>
                      <th>S.No</th>
                      <th>Enrollment No.</th>
                      <th>Full Name</th>
                      <th>Email</th>
                      <th>Contact No.</th>
                      <th>Admission Date</th>
                      <th>Course Title</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.map((student, index) => (
                      <tr key={student.id}>
                        <td>{index + 1}</td>
                        <td style={{ fontWeight: 600 }}>NITS_ {student.reg_number}</td>
                        <td>{student.fname} {student.lname}</td>
                        <td>{student.email}</td>
                        <td>{student.contactno}</td>
                        <td>{student.posting_date}</td>
                        <td style={{ fontWeight: 500, color: 'var(--accent-primary)', fontSize: '0.875rem' }}>{student.course}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        )}
      </div>
    </AdminLayout>
  );
};

export default AdminReports;
