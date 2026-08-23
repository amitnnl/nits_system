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
              size: A4 landscape !important;
              margin: 0 !important;
            }
          }
        `}
      </style>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
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
            display: 'block'
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
            paddingTop: '240px', /* Reduced to pull text up slightly */
            textAlign: 'center',
            fontFamily: "'Lucida Calligraphy', Times, serif"
          }}>
            <div style={{
              width: '85%',
              margin: '0 auto',
              padding: '0 20px',
              display: 'flex',
              flexDirection: 'column',
              gap: '8px', /* Tighter gap to prevent vertical overflow */
              color: '#1a202c'
            }}>
              <div style={{ fontSize: '18px', color: '#4a5568' }}>
                <span style={{ fontWeight: 'bold' }}>Enrollment Number :</span> Nits_{profile?.reg_number}
              </div>
              
              <div style={{ fontSize: '24px' }}>
                Mr. / Ms. <span style={{ fontWeight: 'bold', color: '#90764f' }}>{profile?.fname} {profile?.lname}</span> , 
                Son / Daughter of <span style={{ fontWeight: 'bold' }}>{profile?.father}</span>
              </div>

              <div style={{ fontSize: '20px' }}>
                Has successfully completed the Course
              </div>
              
              <div style={{ fontSize: '26px', fontWeight: 'bold', color: '#1e3a8a', letterSpacing: '1px' }}>
                {profile?.course}
              </div>

              <div style={{ fontSize: '18px' }}>
                from <span style={{ fontWeight: 'bold' }}>{profile?.posting_date}</span> to <span style={{ fontWeight: 'bold' }}>{endingDate}</span> at our institute with <span style={{ fontWeight: 'bold' }}>"A"</span> Grade.
              </div>

              <div style={{ fontSize: '18px' }}>
                Duration <span style={{ fontWeight: 'bold' }}>{getDurationText()}</span>
              </div>
            </div>

            {/* Absolute positioned Date & Place to perfectly align with template footer */}
            <div style={{ position: 'absolute', bottom: '13%', left: '18%', textAlign: 'left' }}>
              <h5 style={{ fontSize: '15px', color: '#90764f', lineHeight: '1.6', margin: '0', fontWeight: 'bold' }}>
                Date on : <br />
                Place : Narnaul (Haryana)
              </h5>
            </div>

            {/* Absolute positioned Authorised Signatory to perfectly align with template footer */}
            <div style={{ position: 'absolute', bottom: '13%', right: '18%', textAlign: 'right' }}>
              <h5 style={{ fontSize: '15px', color: '#90764f', lineHeight: '1.6', margin: '0', fontWeight: 'bold' }}>
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
