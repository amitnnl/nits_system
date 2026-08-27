import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminCertificateViewer = () => {
  const { id, type } = useParams(); // id is user id, type is basic | six | year
  const navigate = useNavigate();
  
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [endingDate, setEndingDate] = useState('');

  const [offsetTop, setOffsetTop] = useState(Number(localStorage.getItem('cert_offsetTop')) || 260);
  const [lineGap, setLineGap] = useState(Number(localStorage.getItem('cert_gap')) || 16);
  const [textScale, setTextScale] = useState(Number(localStorage.getItem('cert_scale')) || 1.05);

  useEffect(() => {
    const fetchProfileAndResult = async () => {
      try {
        const response = await axios.get(`/api/student/result.php?uid=${id}&type=${type}`);
        if (response.data.status === 'success') {
          const res = response.data.data;
          setProfile(res);
          
          // Calculate ending date dynamically based on certificate type
          const posting = res.dob; // Or posting date
          
          // Get posting_date from users raw profile (since result endpoint returns it as course info)
          const userRawRes = await axios.get(`/api/admin/users.php?uid=${id}`);
          if (userRawRes.data.status === 'success') {
            const rawUser = userRawRes.data.data;
            setProfile(prev => ({
              ...prev,
              posting_date: rawUser.posting_date,
              reg_number: rawUser.reg_number
            }));

            if (rawUser.posting_date) {
              const dateObj = new Date(rawUser.posting_date);
              const monthsToAdd = type === 'year' ? 12 : type === 'six' ? 6 : 3;
              dateObj.setMonth(dateObj.getMonth() + monthsToAdd);
              
              // Format as YYYY-MM-DD
              const yyyy = dateObj.getFullYear();
              const mm = String(dateObj.getMonth() + 1).padStart(2, '0');
              const dd = String(dateObj.getDate()).padStart(2, '0');
              setEndingDate(`${yyyy}-${mm}-${dd}`);
            }
          }
        } else {
          setError(response.data.message || 'Failed to load student details');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading student profile and academic data.');
      } finally {
        setLoading(false);
      }
    };
    fetchProfileAndResult();
  }, [id, type]);

  const getDurationText = () => {
    if (type === 'year') return '12 (Twelve) Months';
    if (type === 'six') return '6 (Six) Months';
    return '3 (Three) Months';
  };

  // Handlers for calibration
  const handleOffsetChange = (e) => {
    const val = Number(e.target.value);
    setOffsetTop(val);
    localStorage.setItem('cert_offsetTop', val);
  };
  const handleGapChange = (e) => {
    const val = Number(e.target.value);
    setLineGap(val);
    localStorage.setItem('cert_gap', val);
  };
  const handleScaleChange = (e) => {
    const val = Number(e.target.value);
    setTextScale(val);
    localStorage.setItem('cert_scale', val);
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Generating certificate preview...</p>
        </div>
      </AdminLayout>
    );
  }

  if (error) {
    return (
      <AdminLayout>
        <div className="glass-card" style={{ padding: '2rem', textAlign: 'center', borderTop: '4px solid var(--accent-danger)' }}>
          <h3>Failed to Load Certificate</h3>
          <p style={{ color: 'var(--text-secondary)', marginTop: '0.5rem' }}>{error}</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <style>
        {`
          @media print {
            @page {
              size: A4 landscape;
              margin: 0mm !important;
            }
            html, body {
              width: 100%;
              height: 100%;
              margin: 0 !important;
              padding: 0 !important;
              background-color: white;
              -webkit-print-color-adjust: exact !important;
              print-color-adjust: exact !important;
            }
            .animate-fade-in {
              transform: none !important;
              animation: none !important;
            }
            .print-area {
              position: fixed !important;
              top: 0 !important;
              left: 0 !important;
              width: 100vw !important;
              height: 100vh !important;
              max-width: none !important;
              margin: 0 !important;
              padding: 0 !important;
              z-index: 9999 !important;
              box-sizing: border-box !important;
            }
          }
        `}
      </style>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '1.5rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }} className="no-print">
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Print Student Certificate</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Preview and print graduation certificate</p>
          </div>
          <div style={{ display: 'flex', gap: '1rem' }}>
            <button onClick={() => navigate('/admin/users')} className="btn btn-secondary">
              Back to Students
            </button>
            <button onClick={() => window.print()} className="btn btn-primary">
              Print Certificate
            </button>
          </div>
        </div>

        {/* Calibration Panel */}
        <div className="no-print glass-card" style={{ padding: '1.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '2rem', alignItems: 'center' }}>
          <div>
            <label className="form-label">Top Offset (px)</label>
            <input type="number" className="form-control" value={offsetTop} onChange={handleOffsetChange} style={{ width: '100%', marginTop: '0.5rem' }} />
          </div>
          <div>
            <label className="form-label">Line Spacing (px)</label>
            <input type="number" className="form-control" value={lineGap} onChange={handleGapChange} style={{ width: '100%', marginTop: '0.5rem' }} />
          </div>
          <div>
            <label className="form-label">Text Scale (x)</label>
            <input type="number" className="form-control" step="0.01" value={textScale} onChange={handleScaleChange} style={{ width: '100%', marginTop: '0.5rem' }} />
          </div>
        </div>

        <div 
          className="print-area"
          style={{
            width: '100%',
            maxWidth: '297mm', // A4 Landscape width
            aspectRatio: '297 / 210', // A4 Landscape aspect ratio
            margin: '0 auto',
            padding: '0',
            backgroundColor: 'transparent',
            color: '#000',
            position: 'relative',
            overflow: 'hidden',
            display: 'block',
            boxShadow: 'var(--card-shadow)'
          }}
        >
          {/* Guaranteed Print Background Image */}
          <img 
            src="/images/certificate.png" 
            alt="Certificate Template" 
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

          <div style={{
            position: 'relative',
            zIndex: 1,
            width: '100%',
            height: '100%',
            paddingTop: `${offsetTop}px`, 
            textAlign: 'center',
            fontFamily: "'Lucida Calligraphy', Times, serif"
          }}>
            <div style={{
              width: '85%',
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: `${lineGap}px`, 
              color: '#1a202c'
            }}>
              <div style={{ fontSize: `${18 * textScale}px`, color: '#4a5568' }}>
                <span style={{ fontWeight: 'bold' }}>Enrollment Number :</span> Nits_{profile?.reg_number}
              </div>
              
              <div style={{ fontSize: `${24 * textScale}px` }}>
                Mr. / Ms. <span style={{ fontWeight: 'bold', color: '#90764f' }}>{profile?.fname} {profile?.lname}</span> , 
                Son / Daughter of <span style={{ fontWeight: 'bold' }}>{profile?.father}</span>
              </div>

              <div style={{ fontSize: `${20 * textScale}px` }}>
                Has successfully completed the Course
              </div>
              
              <div style={{ fontSize: `${26 * textScale}px`, fontWeight: 'bold', color: '#1e3a8a', letterSpacing: '1px' }}>
                {profile?.course}
              </div>

              <div style={{ fontSize: `${18 * textScale}px` }}>
                from <span style={{ fontWeight: 'bold' }}>{profile?.posting_date}</span> to <span style={{ fontWeight: 'bold' }}>{endingDate}</span> at our institute with <span style={{ fontWeight: 'bold' }}>"A"</span> Grade.
              </div>

              <div style={{ fontSize: `${18 * textScale}px` }}>
                Duration <span style={{ fontWeight: 'bold' }}>{getDurationText()}</span>
              </div>
            </div>

            {/* Absolute positioned Date & Place to perfectly align with template footer */}
            <div style={{ position: 'absolute', bottom: '13%', left: '18%', textAlign: 'left' }}>
              <h5 style={{ fontSize: `${15 * textScale}px`, color: '#90764f', lineHeight: '1.6', margin: '0', fontWeight: 'bold' }}>
                Date on : <br />
                Place : Narnaul (Haryana)
              </h5>
            </div>

            {/* Absolute positioned Authorised Signatory to perfectly align with template footer */}
            <div style={{ position: 'absolute', bottom: '13%', right: '18%', textAlign: 'right' }}>
              <h5 style={{ fontSize: `${15 * textScale}px`, color: '#90764f', lineHeight: '1.6', margin: '0', fontWeight: 'bold' }}>
                <br />
                Authorised Signatory
              </h5>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminCertificateViewer;
