import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const AdminLayout = ({ children }) => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();
  const [isSidebarOpen, setIsSidebarOpen] = useState(window.innerWidth > 768);

  const handleLogout = async () => {
    await logout();
    navigate('/admin/login');
  };

  const toggleTheme = () => {
    const current = document.documentElement.getAttribute('data-theme');
    document.documentElement.setAttribute('data-theme', current === 'dark' ? 'light' : 'dark');
  };

  const role = user?.role || 'admin';

  return (
    <div className="admin-layout" style={{ display: 'flex', minHeight: '100vh', background: 'var(--bg-primary)' }}>
      {/* Mobile toggle button */}
      <button 
        className="mobile-sidebar-toggle no-print"
        onClick={() => setIsSidebarOpen(!isSidebarOpen)}
        style={{ position: 'fixed', top: '1rem', left: '1rem', zIndex: 1000, background: 'var(--bg-secondary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.5rem', display: window.innerWidth > 768 ? 'none' : 'block' }}
      >
        <i className="fas fa-bars"></i>
      </button>

      {/* Sidebar */}
      <aside className={`admin-sidebar no-print ${isSidebarOpen ? 'open' : 'closed'}`} style={{ 
        width: '280px', 
        background: 'var(--bg-secondary)', 
        borderRight: '1px solid var(--border-color)',
        display: 'flex',
        flexDirection: 'column',
        position: window.innerWidth > 768 ? 'sticky' : 'fixed',
        top: 0,
        height: '100vh',
        transition: 'all 0.3s ease',
        transform: isSidebarOpen ? 'translateX(0)' : 'translateX(-100%)',
        zIndex: 999
      }}>
        <div className="sidebar-logo" style={{ padding: '1.5rem', marginBottom: 0, borderBottom: '1px solid var(--border-color)' }}>
          <div className="logo-icon" style={{ boxShadow: '0 0 15px rgba(59, 130, 246, 0.4)' }}>
            <i className="fas fa-microchip"></i>
          </div>
          <span style={{ fontSize: '1.3rem', whiteSpace: 'nowrap' }}>NITS<span style={{ color: 'var(--accent-primary)' }}>.</span>TECH</span>
        </div>
        
        <div style={{ padding: '1.5rem', display: 'flex', alignItems: 'center', gap: '1rem', background: 'rgba(0,0,0,0.02)' }}>
          <div style={{ width: '35px', height: '35px', borderRadius: '8px', background: 'var(--bg-tertiary)', border: '1px solid var(--border-color)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: 'var(--text-primary)', fontWeight: 'bold' }}>
            {user?.username?.[0]?.toUpperCase() || 'A'}
          </div>
          <div style={{ overflow: 'hidden' }}>
            <h3 style={{ margin: 0, fontSize: '0.9rem', whiteSpace: 'nowrap', textOverflow: 'ellipsis', fontFamily: 'var(--font-display)' }}>{user?.username || 'Administrator'}</h3>
            <span style={{ fontSize: '0.7rem', color: 'var(--accent-primary)', textTransform: 'uppercase', letterSpacing: '1px', fontWeight: 700 }}>{role}</span>
          </div>
        </div>

        <div style={{ padding: '1rem', display: 'flex', flexDirection: 'column', gap: '0.5rem', flex: 1, overflowY: 'auto' }}>
          <nav className="sidebar-links">
            <NavLink to="/admin/dashboard" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="3" width="7" height="9"/><rect x="14" y="3" width="7" height="5"/><rect x="14" y="12" width="7" height="9"/><rect x="3" y="16" width="7" height="5"/></svg>
              <span className="sidebar-text">Dashboard Stats</span>
            </NavLink>

            {/* role === 'admin' && (
              <NavLink to="/admin/staff" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                <span className="sidebar-text">Manage Staff</span>
              </NavLink>
            ) */}

            {['admin', 'receptionist'].includes(role) && (
              <>
                <NavLink to="/admin/users" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>
                  <span className="sidebar-text">Manage Students</span>
                </NavLink>

                {/* <NavLink to="/signup" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  <span className="sidebar-text">New Registration</span>
                </NavLink> */}

                {/* <NavLink to="/admin/fees" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><line x1="12" y1="1" x2="12" y2="23"/><path d="M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"/></svg>
                  <span className="sidebar-text">Fee Management</span>
                </NavLink> */}

                {/* <NavLink to="/admin/reports" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="4" width="18" height="18" rx="2" ry="2"/><line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/><line x1="3" y1="10" x2="21" y2="10"/></svg>
                  <span className="sidebar-text">Date Reports</span>
                </NavLink> */}
                
                {/* <NavLink to="/admin/enquiries" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="8.5" cy="7" r="4"/><line x1="20" y1="8" x2="20" y2="14"/><line x1="23" y1="11" x2="17" y2="11"/></svg>
                  <span className="sidebar-text">Lead Enquiries</span>
                </NavLink> */}
              </>
            )}

            {['admin', 'instructor'].includes(role) && (
              <>
                <NavLink to="/admin/attendance" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span className="sidebar-text">Daily Attendance</span>
                </NavLink>

                <NavLink to="/admin/courses" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/></svg>
                  <span className="sidebar-text">Course Manager</span>
                </NavLink>
                
                {/* <NavLink to="/admin/materials" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" y1="3" x2="12" y2="15"/></svg>
                  <span className="sidebar-text">Study Materials</span>
                </NavLink> */}

                {/* <NavLink to="/admin/videos" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="10"/><polygon points="10 8 16 12 10 16 10 8"/></svg>
                  <span className="sidebar-text">Video Lectures</span>
                </NavLink> */}

                {/* <NavLink to="/admin/exams" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M14 2H6a2 2 0 0 0-2 2v16a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V8z"/><polyline points="14 2 14 8 20 8"/><line x1="16" y1="13" x2="8" y2="13"/><line x1="16" y1="17" x2="8" y2="17"/><polyline points="10 9 9 9 8 9"/></svg>
                  <span className="sidebar-text">Online Exams</span>
                </NavLink> */}
              </>
            )}

            <NavLink to="/admin/change-password" className={({ isActive }) => `sidebar-link ${isActive ? 'active' : ''}`}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <span className="sidebar-text">Change Password</span>
            </NavLink>
          </nav>
          
          <div style={{ display: 'flex', flexDirection: 'column', gap: '1rem', borderTop: '1px solid var(--border-color)', paddingTop: '1.5rem' }}>
            <button onClick={toggleTheme} className="btn btn-secondary sidebar-link" style={{ justifyContent: 'flex-start', border: 'none', background: 'none', padding: '0.5rem 1rem' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <span className="sidebar-text">Theme Toggle</span>
            </button>
            <button onClick={handleLogout} className="btn btn-secondary sidebar-link" style={{ justifyContent: 'flex-start', border: 'none', background: 'none', padding: '0.5rem 1rem', color: 'var(--accent-danger)' }}>
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" style={{ flexShrink: 0 }}><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              <span className="sidebar-text">Sign Out</span>
            </button>
          </div>
        </div>
      </aside>

      {/* Main workspace */}
      <main style={{ flex: 1, padding: '2rem', display: 'flex', flexDirection: 'column', height: '100vh', overflowY: 'auto', background: 'var(--bg-primary)' }}>
        <div style={{ maxWidth: '1200px', width: '100%', margin: '0 auto' }}>
          {children}
        </div>
      </main>
    </div>
  );
};

export default AdminLayout;
