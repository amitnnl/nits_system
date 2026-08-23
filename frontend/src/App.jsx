import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';

// Pages
import Home from './pages/Home';
import Login from './pages/Login';
import AdminLogin from './pages/AdminLogin';
import Signup from './pages/Signup';
import PasswordRecovery from './pages/PasswordRecovery';

// Student Panel
import StudentDashboard from './pages/StudentDashboard';
import StudentProfile from './pages/StudentProfile';
import StudentChangePassword from './pages/StudentChangePassword';
import StudentMarksheet from './pages/StudentMarksheet';
import StudentFees from './pages/StudentFees';
import StudentAttendance from './pages/StudentAttendance';
import StudentDigitalLibrary from './pages/StudentDigitalLibrary';
import StudentVideoLectures from './pages/StudentVideoLectures';
import StudentExams from './pages/StudentExams';
import StudentExamRunner from './pages/StudentExamRunner';

// Admin Panel
import AdminDashboard from './pages/AdminDashboard';
import AdminManageUsers from './pages/AdminManageUsers';
import AdminStaffManager from './pages/AdminStaffManager';
import AdminEditUser from './pages/AdminEditUser';
import AdminAddUser from './pages/AdminAddUser';
import AdminViewUser from './pages/AdminViewUser';
import AdminEditUserResult from './pages/AdminEditUserResult';
import AdminCertificateViewer from './pages/AdminCertificateViewer';
import AdminMarksheetViewer from './pages/AdminMarksheetViewer';
import AdminReports from './pages/AdminReports';
import AdminChangePassword from './pages/AdminChangePassword';
import AdminEnquiries from './pages/AdminEnquiries';
import AdminFees from './pages/AdminFees';
import AdminAttendance from './pages/AdminAttendance';
import AdminCourseManager from './pages/AdminCourseManager';
import AdminStudyMaterials from './pages/AdminStudyMaterials';
import AdminVideoLectures from './pages/AdminVideoLectures';
import AdminExamManager from './pages/AdminExamManager';
import AdminExamBuilder from './pages/AdminExamBuilder';
import AdminExamResults from './pages/AdminExamResults';

// Protected Route wrapper component
const ProtectedRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div style={{ minHeight: '100vh', display: 'flex', justifyContent: 'center', alignItems: 'center', backgroundColor: 'var(--bg-primary)' }}>
        <p style={{ color: 'var(--text-secondary)' }}>Loading session...</p>
      </div>
    );
  }

  if (!isAuthenticated) {
    // Redirect unauthenticated requests to correct portal login
    return allowedRoles && !allowedRoles.includes('student')
      ? <Navigate to="/admin/login" replace /> 
      : <Navigate to="/login" replace />;
  }

  if (allowedRoles && !allowedRoles.includes(user?.role)) {
    // Redirect if role is unauthorized
    return <Navigate to="/" replace />;
  }

  return children;
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/admin/login" element={<AdminLogin />} />
          <Route path="/signup" element={<Signup />} />
          <Route path="/recover-password" element={<PasswordRecovery />} />

          {/* Student Panel Protected Routes */}
          <Route path="/welcome" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDashboard />
            </ProtectedRoute>
          } />
          <Route path="/profile" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentProfile />
            </ProtectedRoute>
          } />
          <Route path="/change-password" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentChangePassword />
            </ProtectedRoute>
          } />
          <Route path="/marksheet" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentMarksheet />
            </ProtectedRoute>
          } />
          <Route path="/fees" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentFees />
            </ProtectedRoute>
          } />
          <Route path="/attendance" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentAttendance />
            </ProtectedRoute>
          } />
          <Route path="/library" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentDigitalLibrary />
            </ProtectedRoute>
          } />
          <Route path="/videos" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentVideoLectures />
            </ProtectedRoute>
          } />
          <Route path="/exams" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentExams />
            </ProtectedRoute>
          } />
          <Route path="/exam/run/:examId" element={
            <ProtectedRoute allowedRoles={['student']}>
              <StudentExamRunner />
            </ProtectedRoute>
          } />

          {/* Admin Panel Protected Routes */}
          <Route path="/admin/dashboard" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist', 'instructor']}>
              <AdminDashboard />
            </ProtectedRoute>
          } />
          <Route path="/admin/staff" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminStaffManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/enquiries" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminEnquiries />
            </ProtectedRoute>
          } />
          <Route path="/admin/fees" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminFees />
            </ProtectedRoute>
          } />
          <Route path="/admin/attendance" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminAttendance />
            </ProtectedRoute>
          } />
          <Route path="/admin/courses" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminCourseManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/materials" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminStudyMaterials />
            </ProtectedRoute>
          } />
          <Route path="/admin/videos" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminVideoLectures />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminExamManager />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/build/:examId" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminExamBuilder />
            </ProtectedRoute>
          } />
          <Route path="/admin/exams/results/:examId" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminExamResults />
            </ProtectedRoute>
          } />
          <Route path="/admin/users" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminManageUsers />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/view/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminViewUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/add" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminAddUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/edit/:id" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminEditUser />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/result/:id/:type" element={
            <ProtectedRoute allowedRoles={['admin', 'instructor']}>
              <AdminEditUserResult />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/certificate/:id/:type" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminCertificateViewer />
            </ProtectedRoute>
          } />
          <Route path="/admin/users/marksheet/:id/:type" element={
            <ProtectedRoute allowedRoles={['admin']}>
              <AdminMarksheetViewer />
            </ProtectedRoute>
          } />
          <Route path="/admin/reports" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist']}>
              <AdminReports />
            </ProtectedRoute>
          } />
          <Route path="/admin/change-password" element={
            <ProtectedRoute allowedRoles={['admin', 'receptionist', 'instructor']}>
              <AdminChangePassword />
            </ProtectedRoute>
          } />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
