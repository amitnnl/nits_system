import React, { useEffect, useState } from 'react';
import axios from 'axios';
import StudentLayout from '../components/StudentLayout';

const StudentMarksheet = () => {
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    const fetchResult = async () => {
      try {
        // Step 1: Fetch profile to get course info
        const profileRes = await axios.get('/api/student/profile.php');
        if (profileRes.data.status !== 'success') {
          throw new Error('Failed to load profile');
        }
        
        const course = profileRes.data.data.course || '';
        let type = 'basic';
        if (course.includes('Diploma') || course.includes('DCA') || course.includes('PGDCA') || course.includes('BCA') || course.includes('MCA')) {
          type = 'year';
        } else if (course.includes('Tally') || course.includes('Financial Accounts') || course.includes('GST')) {
          type = 'six';
        }
        
        // Step 2: Fetch result with mapped type
        const resultRes = await axios.get(`/api/student/result.php?type=${type}`);
        if (resultRes.data.status === 'success') {
          setResult(resultRes.data.data);
        } else {
          setError(resultRes.data.message || 'Failed to fetch result');
        }
      } catch (err) {
        console.error('Failed to load result data', err);
        setError('No marksheet records found. Please contact administration.');
      } finally {
        setLoading(false);
      }
    };
    
    fetchResult();
  }, []);

  if (loading) {
    return (
      <StudentLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading academic transcript...</p>
        </div>
      </StudentLayout>
    );
  }

  if (error) {
    return (
      <StudentLayout>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent-danger)' }}>
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="var(--accent-danger)" strokeWidth="2" style={{ marginBottom: '1rem' }}><circle cx="12" cy="12" r="10"/><line x1="12" y1="8" x2="12" y2="12"/><line x1="12" y1="16" x2="12.01" y2="16"/></svg>
          <h3>Transcript Record Unavailable</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{error}</p>
        </div>
      </StudentLayout>
    );
  }

  return (
    <StudentLayout>

      <style>
        {`
          @media print {
            @page {
              size: A4 portrait !important;
              margin: 0 !important;
            }
          }
        `}
      </style>
      <div className="animate-fade-in print-content" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Academic Transcript</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Statement of marks and course grading</p>
          </div>
          <button onClick={() => window.print()} className="btn btn-primary" style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M6 9V2h12v7M6 18H4a2 2 0 01-2-2v-5a2 2 0 012-2h16a2 2 0 012 2v5a2 2 0 01-2 2h-2"/><rect x="6" y="14" width="12" height="8"/></svg>
            Print Marksheet
          </button>
        </div>

        <div 
          className="print-area" 
          style={{ 
            width: '100%',
            maxWidth: '210mm', // Standard A4 width
            aspectRatio: '210 / 297', // Exact A4 aspect ratio
            margin: '0 auto',
            padding: '0',
            backgroundColor: '#ffffff',
            color: '#000',
            position: 'relative',
            overflow: 'hidden'
        }}>
          {/* Guaranteed Print Background Image */}
          <img 
            src="/images/marksheet.png" 
            alt="Marksheet Template" 
            style={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%',
              zIndex: 0,
              objectFit: 'fill'
            }}
          />

          <div style={{ paddingTop: '100px', position: 'relative', zIndex: 1 }}>
            <div style={{ textAlign: 'center' }}>
              <div style={{ border: '0px solid black', padding: '5px' }}>
                <h2 style={{ fontWeight: 700, margin: '0', fontSize: '24px' }}><strong>NITS COMPUTER EDUCATION</strong></h2>
                <div style={{ marginTop: '5px' }}><h5 style={{ margin: '0', fontSize: '16px', fontWeight: 500 }}>Near Balaji Dental Hospital, Singhana Road, Narnaul-123001(Haryana)</h5></div>
                <h5 style={{ margin: '5px 0 0 0', fontSize: '16px', fontWeight: 500 }}> Website : www.nitscomputer.in </h5>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', paddingTop: '15px' }}>
              <div style={{ width: '66.666%' }}>
                <div style={{ display: 'flex' }}>
                  <div style={{ width: '50%' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Reg. No.</strong> Nits_ {result?.reg_number}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Student Name :</strong> {result?.fname} {result?.lname}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Father's Name :</strong> {result?.father}
                    </div>
                  </div>
                  <div style={{ width: '50%' }}>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Date of Birth :</strong> {result?.dob}
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Total Marks :</strong> {result?.total} Marks
                    </div>
                    <div style={{ marginBottom: '0.5rem' }}>
                      <strong>Percentage :</strong> {result?.percentage} %
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center' }}>
              <div style={{ width: '66.666%' }}>
                <h5 style={{ textAlign: 'center', paddingTop: '20px', fontSize: '18px', margin: '0 0 10px 0' }}>
                  <strong>Statement of Marks</strong>
                </h5>
                <div>
                  <table style={{ width: '100%', borderCollapse: 'collapse', border: '1px solid #dee2e6', fontSize: '14px' }}>
                    <thead>
                      <tr>
                        <th style={{ border: '1px solid #dee2e6', padding: '6px', backgroundColor: 'transparent' }}>Subject's</th>
                        <th style={{ border: '1px solid #dee2e6', padding: '6px', backgroundColor: 'transparent' }}>Obtain Marks</th>
                        <th style={{ border: '1px solid #dee2e6', padding: '6px', backgroundColor: 'transparent' }}>Max Marks</th>
                        <th style={{ border: '1px solid #dee2e6', padding: '6px', backgroundColor: 'transparent' }}>Grade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {result?.subjects.map((sub, index) => (
                        <tr key={index}>
                          <td style={{ border: '1px solid #dee2e6', padding: '6px' }}>{sub.name}</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '6px' }}>{sub.marks}</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '6px' }}>100</td>
                          <td style={{ border: '1px solid #dee2e6', padding: '6px' }}>{sub.grade}</td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', justifyContent: 'center', textAlign: 'left', marginTop: '0.5rem' }}>
              <div style={{ width: '33.333%', border: '0px solid black', padding: '10px 80px 10px' }}>
                <p style={{ margin: '0 0 1rem 0' }}><strong>Total Marks :</strong> {result?.total} Marks</p>
                <p style={{ margin: '0 0 1rem 0' }}><strong>Percentage :</strong> {result?.percentage} %</p>
              </div>
              <div style={{ width: '33.333%', border: '0px solid black', padding: '10px 80px 10px' }}>
                <strong>Checked By :</strong>
              </div>
              <div style={{ width: '33.333%', border: '0px solid black', padding: '10px 80px 10px' }}>
                <strong>Authorised Signatory :</strong>
              </div>
            </div>
          </div>
        </div>
      </div>
    </StudentLayout>
  );
};

export default StudentMarksheet;
