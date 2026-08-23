import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminAddUser = () => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    reg_number: '',
    fname: '',
    lname: '',
    aadhar: '',
    posting_date: new Date().toISOString().split('T')[0],
    father: '',
    gender: '',
    dob: '',
    email: '',
    password: '',
    contact: '',
    course: '',
    address: ''
  });
  
  const [image, setImage] = useState(null);
  const [imagePreview, setImagePreview] = useState('');
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    if (name === 'reg_number') {
      const filtered = value.replace(/[^a-zA-Z0-9\-\/\s]/g, '').toUpperCase();
      setFormData(prev => ({ ...prev, [name]: filtered }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage(file);
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    setIsSubmitting(true);

    if (!image) {
      setError('Please upload a profile photo.');
      setIsSubmitting(false);
      return;
    }

    const data = new FormData();
    Object.keys(formData).forEach(key => data.append(key, formData[key]));
    data.append('image', image);

    try {
      const response = await axios.post('/api/auth/signup.php', data, {
        headers: { 'Content-Type': 'multipart/form-data' }
      });

      if (response.data.status === 'success') {
        setSuccess('Student successfully registered! Redirecting...');
        setTimeout(() => navigate('/admin/users'), 2000);
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        
        {/* Header */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Register New Student</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Add a new student to the institute database</p>
          </div>
          <button onClick={() => navigate('/admin/users')} className="btn btn-secondary">
            Back to Users
          </button>
        </div>

        {/* Alerts */}
        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', fontWeight: 500 }}>
            {error}
          </div>
        )}
        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '1rem', borderRadius: 'var(--border-radius-sm)', fontWeight: 500 }}>
            {success}
          </div>
        )}

        {/* Form Card */}
        <div style={{ backgroundColor: '#ffffff', borderRadius: '1rem', padding: '2rem', border: '1px solid var(--border-color)', boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.05)' }}>
          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2">
              {/* Left Column */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Personal Information</h3>
                
                <div className="form-group">
                  <label className="form-label">Registration Number</label>
                  <input
                    name="reg_number"
                    type="text"
                    className="form-control"
                    placeholder="E.g., NITS/2026/08"
                    value={formData.reg_number}
                    onChange={handleInputChange}
                    required
                  />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">First Name</label>
                    <input name="fname" type="text" className="form-control" value={formData.fname} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input name="lname" type="text" className="form-control" value={formData.lname} onChange={handleInputChange} required />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Aadhar No.</label>
                    <input name="aadhar" type="text" maxLength="12" pattern="\d{12}" title="12 digits" className="form-control" value={formData.aadhar} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Admission Date</label>
                    <input name="posting_date" type="date" className="form-control" value={formData.posting_date} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Father's Name</label>
                  <input name="father" type="text" className="form-control" value={formData.father} onChange={handleInputChange} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-control" value={formData.gender} onChange={handleInputChange} required>
                      <option value="">SELECT</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <div className="form-group">
                    <label className="form-label">Date of Birth</label>
                    <input name="dob" type="date" className="form-control" value={formData.dob} onChange={handleInputChange} required />
                  </div>
                </div>
              </div>

              {/* Right Column */}
              <div>
                <h3 style={{ fontSize: '1.25rem', fontWeight: 600, marginBottom: '1.5rem', paddingBottom: '0.5rem', borderBottom: '1px solid var(--border-color)' }}>Account & Academic Details</h3>
                
                <div className="form-group">
                  <label className="form-label">Email Address (Login ID)</label>
                  <input name="email" type="email" className="form-control" placeholder="Student Email" value={formData.email} onChange={handleInputChange} required />
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Password</label>
                    <input name="password" type="password" className="form-control" value={formData.password} onChange={handleInputChange} required />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Contact number</label>
                    <input name="contact" type="tel" maxLength="10" pattern="\d{10}" title="10 digits" className="form-control" value={formData.contact} onChange={handleInputChange} required />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Select Course</label>
                  <select name="course" className="form-control" value={formData.course} onChange={handleInputChange} required>
                    <option value="">SELECT</option>
                    <option value="Computer Basic & Microsoft Office">Computer Basic & Microsoft Office</option>
                    <option value="Computer Basic & Tally Accounting">Computer Basic & Tally Accounting</option>
                    <option value="Data Entry (Typing Skills)">Data Entry (Typing Skills)</option>
                    <option value="DTP(Desk Top Publishing)">DTP(Desk Top Publishing)</option>
                    <option value="DCA (Diploma In Computer Application)">DCA (Diploma In Computer Application)</option>
                    <option value="PGDCA (Post Graduate Diploma In Computer Application)">PGDCA (Post Graduate Diploma In Computer Application)</option>
                    <option value="BCA (Bachlor in Computer Applications)">BCA (Bachlor in Computer Applications)</option>
                    <option value="MCA (Masters in Computer Applications)">MCA (Masters in Computer Applications)</option>
                    <option value="MSC Computer">MSC Computer</option>
                    <option value="MBA in (IT and Management)">MBA in (IT and Management)</option>
                    <option value="Financial Accounts (Tally Erp 9 with GST)">Financial Accounts (Tally Erp 9 with GST)</option>
                    <option value="Advance Excel">Advance Excel</option>
                  </select>
                </div>

                <div className="form-group">
                  <label className="form-label">Address</label>
                  <textarea name="address" rows="3" className="form-control" value={formData.address} onChange={handleInputChange} required></textarea>
                </div>

                <div className="form-group">
                  <label className="form-label">Profile Image</label>
                  <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                    <input type="file" accept="image/*" onChange={handleFileChange} className="form-control" style={{ flex: 1 }} required />
                    {imagePreview && (
                      <img src={imagePreview} alt="Preview" style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }} />
                    )}
                  </div>
                </div>
              </div>
            </div>

            <div style={{ marginTop: '2.5rem', paddingTop: '1.5rem', borderTop: '1px solid var(--border-color)', display: 'flex', justifyContent: 'flex-end', gap: '1rem' }}>
              <button type="button" onClick={() => navigate('/admin/users')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary" disabled={isSubmitting} style={{ minWidth: '150px' }}>
                {isSubmitting ? 'Registering...' : 'Register Student'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminAddUser;
