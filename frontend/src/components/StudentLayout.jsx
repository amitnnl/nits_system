import React from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const StudentLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  };

  return (
    <div className="app-container">
      {/* Sidebar navigation */}
      <aside className="sidebar no-print">
        <div style={{ display: 'flex', flexDirection: 'column', gap: '2rem', height: '100%' }}>
          <div className="sidebar-logo" style={{ padding: '0.5rem', marginBottom: '1rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1.5rem' }}>
            <div className="logo-icon" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
              <i className="fas fa-microchip"></i>
            </div>
            <span style={{ fontSize: '1.3rem', whiteSpace: 'nowrap' }}>NITS<span style={{ color: 'var(--accent-primary)' }}>.</span>TECH</span>
          </div>
          
          <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.02)', padding: '1rem', borderRadius: '12px', marginBottom: '1rem' }}>
            <div style={{ width: '35px', height: '35px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>
              {user?.username?.[0]?.toUpperCase() || 'S'}
            </div>
            <div style={{ overflow: 'hidden' }}>
              <h3 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'var(--font-display)' }}>{user?.username || 'Student'}</h3>
              <span style={{ fontSize: '0.7rem', color: 'var(--accent-secondary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>Student</span>
            </div>
          </div>

          <nav className="sidebar-links">
            <NavLink to="/welcome" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
              Welcome Board
            </NavLink>

            <NavLink to="/profile" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              My Profile
            </NavLink>

            <NavLink to="/marksheet" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              View Marksheet
            </NavLink>

            <NavLink to="/fees" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="2" y="5" width="20" height="14" rx="2"/><line x1="2" y1="10" x2="22" y2="10"/></svg>
              Fee Ledger
            </NavLink>

            <NavLink to="/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/><rect x="8" y="2" width="8" height="4" rx="1" ry="1"/><path d="M9 14h6"/><path d="M9 10h6"/><path d="M9 18h6"/></svg>
              My Attendance
            </NavLink>

            <NavLink to="/library" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20"/><path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z"/></svg>
              Digital Library
            </NavLink>

            <NavLink to="/videos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
              Video Lectures
            </NavLink>

            <NavLink to="/exams" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
              Online Exams
            </NavLink>

            <NavLink to="/change-password" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              Security
            </NavLink>
          </nav>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button onClick={toggleTheme} className="btn btn-secondary sidebar-link" style={{ justifyContent: 'flex-start', border: 'none', background: 'none', padding: '0.5rem 1rem' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              Theme Toggle
            </button>
            <button onClick={handleLogout} className="btn btn-secondary sidebar-link" style={{ justifyContent: 'flex-start', border: 'none', background: 'none', padding: '0.5rem 1rem', color: 'var(--accent-danger)' }}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Sign Out
            </button>
          </div>
        </div>
      </aside>

      {/* Main workspace */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', minWidth: 0 }}>
        <header className="navbar no-print">
          <div>
            <h4 style={{ fontSize: '1.1rem', fontWeight: 500 }}>Student Portal</h4>
          </div>
          <div className="nav-profile">
            <span style={{ fontSize: '0.9rem', fontWeight: 500 }}>{user?.name}</span>
            <div style={{ width: '40px', height: '40px', borderRadius: '50%', backgroundColor: 'var(--accent-primary)', color: 'white', display: 'flex', alignItems: 'center', justifyContent: 'center', fontWeight: 'bold' }}>
              {user?.name ? user.name.charAt(0).toUpperCase() : 'S'}
            </div>
          </div>
        </header>

        <main className="main-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default StudentLayout;
