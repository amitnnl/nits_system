import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

const Signup = () => {
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
  const navigate = useNavigate();
  const { isAuthenticated, user } = useAuth();

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    
    // Custom filter for registration number: upper case alphanumeric, spaces, hyphens, slashes
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
      reader.onloadend = () => {
        setImagePreview(reader.result);
      };
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
    // Append all form inputs
    Object.keys(formData).forEach(key => {
      data.append(key, formData[key]);
    });
    // Append file
    data.append('image', image);

    try {
      const response = await axios.post('/api/auth/signup.php', data, {
        headers: {
          'Content-Type': 'multipart/form-data'
        }
      });

      if (response.data.status === 'success') {
        if (isAuthenticated && user?.role === 'admin') {
          setSuccess('Registration successful! Redirecting to admin dashboard...');
          setTimeout(() => navigate('/admin/dashboard'), 2000);
        } else {
          setSuccess('Registration successful! Redirecting to login page...');
          setTimeout(() => navigate('/login'), 2000);
        }
      } else {
        setError(response.data.message || 'Registration failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={{ minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '2rem 1.5rem', backgroundColor: 'var(--bg-primary)' }}>
      <div className="glass-card animate-fade-in" style={{ width: '100%', maxWidth: '840px' }}>
        <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
          <h1 style={{ fontSize: '2.5rem', fontWeight: 800, marginBottom: '0.5rem' }}>Student Registration</h1>
          <p style={{ color: 'var(--text-secondary)' }}>Create your student account to join NITS Computer Education</p>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', marginBottom: '1.5rem', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="grid-cols-2">
            <div>
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
                  <input
                    name="fname"
                    type="text"
                    className="form-control"
                    placeholder="First Name"
                    value={formData.fname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Last Name</label>
                  <input
                    name="lname"
                    type="text"
                    className="form-control"
                    placeholder="Last Name"
                    value={formData.lname}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Aadhar No.</label>
                  <input
                    name="aadhar"
                    type="text"
                    maxLength="12"
                    pattern="\d{12}"
                    title="Aadhar must be exactly 12 digits"
                    className="form-control"
                    placeholder="12-digit number"
                    value={formData.aadhar}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Admission Date</label>
                  <input
                    name="posting_date"
                    type="date"
                    className="form-control"
                    value={formData.posting_date}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>

              <div className="form-group">
                <label className="form-label">Father's Name</label>
                <input
                  name="father"
                  type="text"
                  className="form-control"
                  placeholder="Father's Full Name"
                  value={formData.father}
                  onChange={handleInputChange}
                  required
                />
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
                  <input
                    name="dob"
                    type="date"
                    className="form-control"
                    value={formData.dob}
                    onChange={handleInputChange}
                    required
                  />
                </div>
              </div>
            </div>

            <div>
              <div className="form-group">
                <label className="form-label">Email Address</label>
                <input
                  name="email"
                  type="email"
                  className="form-control"
                  placeholder="name@example.com"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                />
              </div>

              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                <div className="form-group">
                  <label className="form-label">Password</label>
                  <input
                    name="password"
                    type="password"
                    className="form-control"
                    placeholder="Create Password"
                    value={formData.password}
                    onChange={handleInputChange}
                    required
                  />
                </div>
                <div className="form-group">
                  <label className="form-label">Contact number</label>
                  <input
                    name="contact"
                    type="tel"
                    maxLength="10"
                    pattern="\d{10}"
                    title="Contact number must be 10 digits"
                    className="form-control"
                    placeholder="10-digit mobile"
                    value={formData.contact}
                    onChange={handleInputChange}
                    required
                  />
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
                <textarea
                  name="address"
                  rows="3"
                  className="form-control"
                  placeholder="Enter full postal address"
                  value={formData.address}
                  onChange={handleInputChange}
                  required
                ></textarea>
              </div>

              <div className="form-group" style={{ marginBottom: '1.5rem' }}>
                <label className="form-label">Profile Image</label>
                <div style={{ display: 'flex', gap: '1rem', alignItems: 'center' }}>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleFileChange}
                    className="form-control"
                    style={{ flex: 1 }}
                    required
                  />
                  {imagePreview && (
                    <img
                      src={imagePreview}
                      alt="Preview"
                      style={{ width: '56px', height: '56px', borderRadius: '50%', objectFit: 'cover', border: '2px solid var(--accent-primary)' }}
                    />
                  )}
                </div>
              </div>
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary"
            style={{ width: '100%', padding: '0.85rem', marginTop: '1rem' }}
            disabled={isSubmitting}
          >
            {isSubmitting ? 'Registering Student...' : 'Register Account'}
          </button>
        </form>

        <div style={{ marginTop: '2rem', textAlign: 'center', fontSize: '0.875rem', color: 'var(--text-secondary)' }}>
          Already have an account? <Link to="/login" style={{ fontWeight: 600 }}>Login here</Link>
        </div>
      </div>
    </div>
  );
};

export default Signup;
