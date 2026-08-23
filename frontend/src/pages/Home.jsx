import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import axios from 'axios';

const Home = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [enquiryForm, setEnquiryForm] = useState({ name: '', email: '', phone: '', message: '' });
  const [enquiryStatus, setEnquiryStatus] = useState({ loading: false, success: false, error: '' });
  
  // Theme Toggle State
  const [theme, setTheme] = useState(document.documentElement.getAttribute('data-theme') || 'light');

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    document.documentElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
  };

  const handleEnquirySubmit = async (e) => {
    e.preventDefault();
    setEnquiryStatus({ loading: true, success: false, error: '' });
    
    if (!enquiryForm.name || !enquiryForm.phone) {
      setEnquiryStatus({ loading: false, success: false, error: 'Name and Phone are required.' });
      return;
    }

    try {
      const response = await axios.post('/api/public/enquiries.php', enquiryForm);
      if (response.data.status === 'success') {
        setEnquiryStatus({ loading: false, success: true, error: '' });
        setEnquiryForm({ name: '', email: '', phone: '', message: '' });
        setTimeout(() => setEnquiryStatus(prev => ({ ...prev, success: false })), 5000);
      } else {
        throw new Error(response.data.message || 'Submission failed');
      }
    } catch (err) {
      setEnquiryStatus({ loading: false, success: false, error: err.message || 'Failed to submit enquiry. Please try again.' });
    }
  };

  return (
    <div className="landing-page" style={{ minHeight: '100vh', display: 'flex', flexDirection: 'column', backgroundColor: 'var(--bg-primary)', color: 'var(--text-primary)', fontFamily: 'var(--font-sans)', transition: 'background-color 0.3s, color 0.3s' }}>
      {/* Tech Navigation */}
      <nav style={{
        position: 'fixed', top: 0, left: 0, right: 0,
        padding: isScrolled ? '1rem 8%' : '1.5rem 8%',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center',
        background: isScrolled ? 'var(--glass-bg)' : 'transparent',
        backdropFilter: isScrolled ? 'blur(20px)' : 'none', 
        WebkitBackdropFilter: isScrolled ? 'blur(20px)' : 'none',
        zIndex: 1000, transition: 'all 0.4s cubic-bezier(0.4, 0, 0.2, 1)',
        borderBottom: isScrolled ? '1px solid var(--border-color)' : '1px solid transparent',
        boxShadow: isScrolled ? 'var(--card-shadow)' : 'none'
      }}>
        <div style={{ display: 'flex', alignItems: 'center' }}>
          <img src="/images/nits-logo.png" alt="NITS Logo" style={{ height: '45px', width: 'auto', borderRadius: '8px' }} />
        </div>
        
        <div style={{ display: 'flex', gap: '2rem', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: '2rem', alignItems: 'center', display: window.innerWidth > 768 ? 'flex' : 'none' }}>
            <a href="#home" style={{ color: 'var(--text-primary)', fontWeight: 500, fontSize: '0.95rem' }}>// Home</a>
            <a href="#courses" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>// Curriculum</a>
            <a href="#about" style={{ color: 'var(--text-secondary)', fontWeight: 500, fontSize: '0.95rem' }}>// About</a>
          </div>
          <div style={{ width: '1px', height: '24px', backgroundColor: 'var(--border-color)' }}></div>
          
          {/* Theme Toggle Button */}
          <button onClick={toggleTheme} style={{ background: 'transparent', border: 'none', color: 'var(--text-primary)', cursor: 'pointer', fontSize: '1.2rem', padding: '0.5rem', display: 'flex', alignItems: 'center', justifyContent: 'center' }} title="Toggle Theme">
            {theme === 'dark' ? <i className="fas fa-sun" style={{ color: 'var(--accent-warning)' }}></i> : <i className="fas fa-moon" style={{ color: 'var(--accent-primary)' }}></i>}
          </button>

          <Link to="/login" style={{ color: 'var(--text-primary)', fontWeight: 600, fontSize: '0.95rem' }} className="animate-pulse-glow">
            <i className="fas fa-terminal" style={{ marginRight: '8px', color: 'var(--accent-primary)' }}></i>
            Student Portal
          </Link>
          <Link to="/admin/login" className="btn btn-primary" style={{ padding: '0.6rem 1.5rem', borderRadius: '8px', fontSize: '0.95rem', background: 'transparent', border: '1px solid var(--accent-primary)', color: 'var(--accent-primary)', boxShadow: 'inset 0 0 10px rgba(59,130,246,0.1)' }}>
            Admin Access
          </Link>
        </div>
      </nav>

      {/* Cyber Hero Section */}
      <header id="home" className="cyber-grid" style={{
        height: '100vh', minHeight: '800px',
        display: 'flex', flexDirection: 'column', justifyContent: 'center', alignItems: 'center', textAlign: 'center',
        padding: '0 8%', position: 'relative', overflow: 'hidden',
        background: theme === 'dark' ? 'transparent' : 'radial-gradient(circle at center, rgba(59,130,246,0.05) 0%, transparent 70%)'
      }}>
        {/* Glow Orbs */}
        <div style={{ position: 'absolute', top: '20%', left: '10%', width: '300px', height: '300px', background: 'var(--accent-primary)', filter: 'blur(150px)', opacity: theme === 'dark' ? 0.15 : 0.25, borderRadius: '50%' }}></div>
        <div style={{ position: 'absolute', bottom: '20%', right: '10%', width: '300px', height: '300px', background: 'var(--accent-secondary)', filter: 'blur(150px)', opacity: theme === 'dark' ? 0.15 : 0.25, borderRadius: '50%' }}></div>

        <div style={{ position: 'relative', zIndex: 2, maxWidth: '1000px', display: 'flex', flexDirection: 'column', alignItems: 'center' }} className="animate-fade-in">
          <div style={{
            background: 'var(--glass-bg)', backdropFilter: 'blur(10px)',
            padding: '0.5rem 1.25rem', borderRadius: '100px', border: '1px solid var(--border-color)',
            marginBottom: '2rem', display: 'inline-flex', alignItems: 'center', gap: '0.75rem', color: 'var(--accent-primary)',
            boxShadow: 'var(--card-shadow)'
          }}>
            <i className="fas fa-code-branch"></i>
            <span style={{ fontSize: '0.875rem', fontWeight: 600, letterSpacing: '2px', textTransform: 'uppercase', fontFamily: 'var(--font-display)' }}>Next-Gen IT Education</span>
          </div>
          
          <h1 style={{ 
            fontSize: 'clamp(3rem, 6vw, 6rem)', fontWeight: 800, lineHeight: 1.1, letterSpacing: '-2px', marginBottom: '1.5rem',
            color: 'var(--text-primary)', textShadow: theme === 'dark' ? '0 0 40px rgba(59, 130, 246, 0.3)' : '0 4px 20px rgba(59, 130, 246, 0.15)'
          }}>
            <span className="typewriter-text" style={{ display: 'inline-block', width: 'fit-content' }}>Code Your Future_</span>
          </h1>
          
          <p style={{ fontSize: 'clamp(1.1rem, 2vw, 1.35rem)', color: 'var(--text-secondary)', maxWidth: '700px', marginBottom: '3rem', fontWeight: 400, lineHeight: 1.7 }}>
            NITS Computer Institute is the premier launchpad for elite tech talent. Master Full-Stack Development, Data Entry, and Advanced Accounting in state-of-the-art labs.
          </p>
          
          <div style={{ display: 'flex', gap: '1.5rem', flexWrap: 'wrap', justifyContent: 'center' }}>
            <a href="#courses" className="btn btn-primary" style={{ padding: '1rem 2.5rem', fontSize: '1.1rem', borderRadius: '8px', textTransform: 'uppercase', letterSpacing: '1px' }}>
              Explore Curriculum <i className="fas fa-arrow-right" style={{ marginLeft: '10px' }}></i>
            </a>
          </div>

          {/* Tech Stack Banner */}
          <div style={{ marginTop: '5rem', display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.5rem' }}>
            <span style={{ color: 'var(--text-muted)', fontSize: '0.85rem', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600 }}>Technologies Taught</span>
            <div style={{ display: 'flex', gap: '2rem', flexWrap: 'wrap', justifyContent: 'center', filter: theme === 'dark' ? 'grayscale(100%) opacity(0.6)' : 'grayscale(0%) opacity(0.8)', transition: 'all 0.3s' }}>
              <i className="fab fa-react" style={{ fontSize: '2.5rem', color: '#61DBFB' }}></i>
              <i className="fab fa-node-js" style={{ fontSize: '2.5rem', color: '#68A063' }}></i>
              <i className="fab fa-python" style={{ fontSize: '2.5rem', color: '#FFD43B' }}></i>
              <i className="fab fa-html5" style={{ fontSize: '2.5rem', color: '#E34F26' }}></i>
              <i className="fab fa-css3-alt" style={{ fontSize: '2.5rem', color: '#1572B6' }}></i>
              <i className="fas fa-database" style={{ fontSize: '2.5rem', color: '#4DB33D' }}></i>
            </div>
          </div>
        </div>
      </header>

      {/* About Section */}
      <section id="about" style={{ padding: '8rem 8%', backgroundColor: 'var(--bg-primary)', position: 'relative', overflow: 'hidden' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', position: 'relative', zIndex: 2 }}>
          <div className="grid-cols-2" style={{ gap: '4rem', alignItems: 'center', marginBottom: '6rem' }}>
            <div>
              <h4 style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>_About Nits Computer Institute</h4>
              <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1.5rem' }}>Welcome to your gateway to digital possibilities.</h2>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8, marginBottom: '1.5rem' }}>
                At Nits Computer, we are passionate about empowering individuals with the knowledge and skills they need to excel in the ever-evolving field of technology. Whether you're a beginner eager to learn the basics or a seasoned professional looking to upskill, we have something to offer everyone.
              </p>
              <h3 style={{ fontSize: '1.5rem', fontWeight: 700, color: 'var(--text-primary)', marginTop: '2rem', marginBottom: '1rem' }}>Our Mission</h3>
              <p style={{ color: 'var(--text-secondary)', fontSize: '1.1rem', lineHeight: 1.8 }}>
                Our mission is simple but profound: To provide quality computer education that transforms lives. We believe that knowledge is the key to success in today's digital age, and we are committed to helping our students unlock their full potential. Through our comprehensive courses and expert instructors, we aim to bridge the gap between ambition and achievement.
              </p>
            </div>
            
            <div className="glass-card cyber-card" style={{ padding: '3rem', display: 'flex', flexDirection: 'column', gap: '2rem', background: 'var(--bg-tertiary)', borderRadius: '16px' }}>
              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(59, 130, 246, 0.1)', color: 'var(--accent-primary)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  <i className="fas fa-graduation-cap"></i>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Experienced Faculty</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Our team of certified instructors is dedicated to delivering the highest standard of education, bringing real-world expertise to every class.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(16, 185, 129, 0.1)', color: 'var(--accent-success)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  <i className="fas fa-book-open"></i>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Cutting-Edge Curriculum</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>We keep our curriculum up to date with the latest industry trends to ensure our students are always ahead of the curve.</p>
                </div>
              </div>

              <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'flex-start' }}>
                <div style={{ width: '50px', height: '50px', borderRadius: '12px', background: 'rgba(245, 158, 11, 0.1)', color: 'var(--accent-warning)', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.5rem', flexShrink: 0 }}>
                  <i className="fas fa-desktop"></i>
                </div>
                <div>
                  <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>State-of-the-Art Facilities</h4>
                  <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Our modern classrooms and well-equipped computer labs provide the perfect setting for hands-on learning.</p>
                </div>
              </div>
            </div>
          </div>
          
          <div className="grid-cols-2" style={{ gap: '2rem' }}>
             <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-primary)', background: 'var(--bg-secondary)' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Flexible Learning Options</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>We understand that everyone's schedule is unique. That's why we offer flexible learning options, including part-time and online courses, so you can choose what works best for you.</p>
             </div>
             <div className="glass-card" style={{ padding: '2rem', borderLeft: '4px solid var(--accent-secondary)', background: 'var(--bg-secondary)' }}>
                <h4 style={{ color: 'var(--text-primary)', fontSize: '1.2rem', marginBottom: '0.5rem', fontWeight: 600 }}>Career Support</h4>
                <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: 1.6 }}>Our commitment to your success doesn't end with the last class. We offer career counseling, job placement assistance, and networking opportunities.</p>
             </div>
          </div>
        </div>
      </section>

      {/* Courses / Curriculum Section */}
      <section id="courses" style={{ padding: '8rem 8%', backgroundColor: 'var(--bg-secondary)', position: 'relative' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: '4rem' }}>
            <div>
              <h4 style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '2px', fontWeight: 600, marginBottom: '0.5rem', fontFamily: 'var(--font-display)' }}>_Curriculum</h4>
              <h2 style={{ fontSize: '3rem', fontWeight: 700, color: 'var(--text-primary)' }}>Featured Programs</h2>
            </div>
            <p style={{ color: 'var(--text-secondary)', maxWidth: '500px', textAlign: 'right', display: window.innerWidth > 768 ? 'block' : 'none' }}>
              Whether you're interested in programming, web development, or accounting, we have a course tailored to your needs. Practical, engaging, and career-focused.
            </p>
          </div>

          <div className="grid-cols-3">
            {[
              { title: 'Full Stack Web Dev', duration: '6 Months', icon: 'fa-layer-group', color: 'var(--accent-primary)', tech: ['React', 'Node', 'SQL'], desc: 'Build modern, responsive web applications from front to back using industry-standard frameworks.' },
              { title: 'Advanced Tally Prime', duration: '3 Months', icon: 'fa-chart-pie', color: 'var(--accent-success)', tech: ['Tally', 'GST', 'ERP9'], desc: 'Master financial accounting, automated inventory, and GST compliance for corporate environments.' },
              { title: 'ADCA Mastery', duration: '12 Months', icon: 'fa-laptop-code', color: 'var(--accent-secondary)', tech: ['Office', 'DTP', 'Logic'], desc: 'The complete computer applications diploma covering everything from basic ops to advanced publishing.' }
            ].map((course, idx) => (
              <div key={idx} className="glass-card cyber-card" style={{ display: 'flex', flexDirection: 'column', minHeight: '350px', background: 'var(--bg-tertiary)', borderRadius: '12px' }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '2rem' }}>
                  <div style={{ width: '60px', height: '60px', borderRadius: '12px', background: `rgba(59, 130, 246, 0.1)`, color: course.color, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: '1.8rem', border: `1px solid ${course.color}` }}>
                    <i className={`fas ${course.icon}`}></i>
                  </div>
                  <span style={{ fontSize: '0.75rem', fontWeight: 700, color: '#fff', background: course.color, padding: '0.3rem 0.8rem', borderRadius: '4px', textTransform: 'uppercase', letterSpacing: '1px' }}>
                    {course.duration}
                  </span>
                </div>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 700, marginBottom: '1rem', color: 'var(--text-primary)' }}>{course.title}</h3>
                <p style={{ color: 'var(--text-secondary)', lineHeight: 1.6, flex: 1, marginBottom: '1.5rem' }}>{course.desc}</p>
                <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
                  {course.tech.map((t, i) => (
                    <span key={i} style={{ fontSize: '0.75rem', padding: '0.2rem 0.6rem', border: '1px solid var(--border-color)', borderRadius: '4px', color: 'var(--text-muted)' }}>{t}</span>
                  ))}
                </div>
              </div>
            ))}
          </div>
          
          {/* Detailed Course Fees Table */}
          <div style={{ marginTop: '6rem' }}>
            <h3 style={{ fontSize: '2rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '2rem', textAlign: 'center' }}>Complete Course & Fee Structure</h3>
            <div className="table-container">
              <table className="custom-table" style={{ width: '100%', minWidth: '600px' }}>
                <thead>
                  <tr>
                    <th>Course Category</th>
                    <th>Duration</th>
                    <th>Average Fees (INR)</th>
                  </tr>
                </thead>
                <tbody>
                  <tr><td>Hardware and Networking Courses</td><td>6 months</td><td>INR 10,000</td></tr>
                  <tr><td>Data Entry Operator Course</td><td>6 months</td><td>INR 3,000</td></tr>
                  <tr><td>Web Designing</td><td>18 months</td><td>INR 12,000</td></tr>
                  <tr><td>Diploma in IT</td><td>6 months – 1 year</td><td>INR 1,50,000</td></tr>
                  <tr><td>VFX and Animation</td><td>8 months</td><td>INR 30,000</td></tr>
                  <tr><td>Software and Programming Language Courses</td><td>12 months – 15 months</td><td>INR 2,000 – INR 10,000</td></tr>
                  <tr><td>Computer Hardware Maintenance</td><td>6 months</td><td>INR 2,000</td></tr>
                  <tr><td>Tally</td><td>3 months</td><td>INR 3,000 – INR 6,000</td></tr>
                  <tr><td>Cyber Security Courses</td><td>3 months – 2 years</td><td>INR 15,000 – INR 20,000</td></tr>
                  <tr><td>Diploma in Computer Science</td><td>12 months</td><td>INR 35,000</td></tr>
                  <tr><td>Microsoft Office and Typing Courses</td><td>150 hours</td><td>INR 7,500 – INR 10,000</td></tr>
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </section>

      {/* Portals Section - Tech Style */}
      <section style={{ padding: '6rem 8%', backgroundColor: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', margin: '0 auto', border: '1px solid var(--border-color)', borderRadius: '24px', padding: '4rem', background: 'var(--bg-tertiary)', position: 'relative', overflow: 'hidden', boxShadow: 'var(--card-shadow)' }}>
          
          <div style={{ position: 'absolute', top: 0, left: '50%', transform: 'translateX(-50%)', width: '60%', height: '2px', background: 'linear-gradient(90deg, transparent, var(--accent-primary), transparent)' }}></div>

          <div style={{ textAlign: 'center', marginBottom: '4rem' }}>
            <h2 style={{ fontSize: '2.5rem', fontWeight: 700, color: 'var(--text-primary)', marginBottom: '1rem' }}>Access Terminals</h2>
            <p style={{ color: 'var(--text-secondary)' }}>Secure login portals for students and administration staff.</p>
          </div>

          <div className="grid-cols-2">
            <div style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', transition: 'all 0.3s', cursor: 'pointer' }} className="cyber-card">
              <i className="fas fa-user-astronaut" style={{ fontSize: '2.5rem', color: 'var(--accent-primary)', marginBottom: '1.5rem' }}></i>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>Student Portal</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Access your learning dashboard, digital marksheet, identity card, and fee receipts.</p>
              <Link to="/login" style={{ color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', fontWeight: 600 }}>
                Initialize Login <i className="fas fa-chevron-right" style={{ marginLeft: '5px', fontSize: '0.8rem' }}></i>
              </Link>
            </div>

            <div style={{ padding: '2.5rem', background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '16px', transition: 'all 0.3s', cursor: 'pointer' }} className="cyber-card">
              <i className="fas fa-shield-alt" style={{ fontSize: '2.5rem', color: 'var(--accent-warning)', marginBottom: '1.5rem' }}></i>
              <h3 style={{ color: 'var(--text-primary)', fontSize: '1.5rem', marginBottom: '1rem' }}>Admin / Staff</h3>
              <p style={{ color: 'var(--text-secondary)', marginBottom: '2rem' }}>Root access for registry management, certificate generation, and analytics.</p>
              <Link to="/admin/login" style={{ color: 'var(--accent-warning)', textTransform: 'uppercase', letterSpacing: '1px', fontSize: '0.9rem', fontWeight: 600 }}>
                Authenticate <i className="fas fa-chevron-right" style={{ marginLeft: '5px', fontSize: '0.8rem' }}></i>
              </Link>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section style={{ padding: '6rem 8%', backgroundColor: 'var(--accent-primary)', textAlign: 'center', position: 'relative', overflow: 'hidden' }}>
         <div style={{ position: 'relative', zIndex: 2, maxWidth: '800px', margin: '0 auto' }}>
            <h2 style={{ fontSize: '3rem', fontWeight: 800, color: '#fff', marginBottom: '1.5rem', fontFamily: 'var(--font-display)', letterSpacing: '-1px' }}>Join Us Today</h2>
            <p style={{ color: 'rgba(255,255,255,0.9)', fontSize: '1.2rem', lineHeight: 1.8, marginBottom: '2.5rem' }}>
              Embark on your journey to success with Nits Computer Institute. Discover the exciting world of technology and acquire the skills that will open doors to countless opportunities. We're here to support you every step of the way. Contact us today to learn more about our courses, schedule a campus tour, or speak with one of our knowledgeable advisors. Your future in technology starts here at Nits Computer Institute.
            </p>
            <a href="#home" className="btn" style={{ background: '#fff', color: 'var(--accent-primary)', padding: '1rem 3rem', fontSize: '1.1rem', borderRadius: '8px', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '1px' }}>
              Start Your Journey
            </a>
         </div>
      </section>

      {/* Modern Footer */}
      <footer style={{ backgroundColor: 'var(--bg-secondary)', paddingTop: '4rem', paddingBottom: '2rem', borderTop: '1px solid var(--border-color)' }}>
        <div style={{ maxWidth: '1400px', margin: '0 auto', padding: '0 8%', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '3rem', marginBottom: '3rem' }}>
          
          <div>
            <img src="/images/nits-logo.png" alt="NITS Logo" style={{ height: '60px', width: 'auto', borderRadius: '8px', marginBottom: '1rem' }} />
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              At Nits Computer, we are passionate about empowering individuals with the knowledge and skills they need to excel in the ever-evolving field of technology.
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1rem' }}>Location</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <i className="fas fa-map-marker-alt" style={{ color: 'var(--accent-primary)', marginRight: '10px' }}></i> State Highway No.11,<br/>
              Near Balaji Dental Clinic,<br/> 
              Narnaul-123001 (Haryana) INDIA
            </p>
          </div>

          <div>
            <h4 style={{ color: 'var(--text-primary)', fontWeight: 600, marginBottom: '1rem' }}>Contact</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', lineHeight: 1.6 }}>
              <i className="fas fa-envelope" style={{ color: 'var(--accent-primary)', marginRight: '10px' }}></i> info@nitscomputer.in<br/>
              <i className="fas fa-envelope" style={{ color: 'var(--accent-primary)', marginRight: '10px', marginTop: '10px' }}></i> Contact@nitscomputer.in<br/>
              <i className="fas fa-phone" style={{ color: 'var(--accent-primary)', marginRight: '10px', marginTop: '10px' }}></i> +91 94168 85868<br/>
              <i className="fas fa-phone" style={{ color: 'var(--accent-primary)', marginRight: '10px', marginTop: '10px' }}></i> +91 88168 30806
            </p>
          </div>

        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.8rem', borderTop: '1px solid var(--border-color)', paddingTop: '2rem' }}>
          &copy; {new Date().getFullYear()} NITS Computer Education. Designed for the Future.
        </div>
      </footer>
    </div>
  );
};

export default Home;
