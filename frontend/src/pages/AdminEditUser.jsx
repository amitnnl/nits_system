import React, { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import axios from 'axios';
import AdminLayout from '../components/AdminLayout';

const AdminEditUser = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    fname: '',
    lname: '',
    contactno: '',
    father: '',
    course: '',
    dob: '',
    gender: '',
    aadhar: '',
    address: '',
    posting_date: '',
    reg_number: ''
  });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const response = await axios.get(`/api/admin/users.php?uid=${id}`);
        if (response.data.status === 'success') {
          const user = response.data.data;
          setFormData({
            fname: user.fname || '',
            lname: user.lname || '',
            contactno: user.contactno || '',
            father: user.father || '',
            course: user.course || '',
            dob: user.dob || '',
            gender: user.gender || '',
            aadhar: user.aadhar || '',
            address: user.address || '',
            posting_date: user.posting_date || '',
            reg_number: user.reg_number || ''
          });
        } else {
          setError(response.data.message || 'Failed to load student details');
        }
      } catch (err) {
        console.error(err);
        setError('Error loading student profile data.');
      } finally {
        setLoading(false);
      }
    };
    fetchUser();
  }, [id]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name === 'reg_number') {
      const filtered = value.replace(/[^a-zA-Z0-9\-\/\s]/g, '').toUpperCase();
      setFormData(prev => ({ ...prev, [name]: filtered }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setSuccess('');

    try {
      const response = await axios.post(`/api/admin/users.php?uid=${id}`, formData);
      if (response.data.status === 'success') {
        setSuccess('Student profile updated successfully!');
        setTimeout(() => navigate('/admin/users'), 1500);
      } else {
        setError(response.data.message || 'Update failed');
      }
    } catch (err) {
      setError(err.response?.data?.message || 'Server error occurred during update.');
    }
  };

  if (loading) {
    return (
      <AdminLayout>
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '200px' }}>
          <p style={{ color: 'var(--text-secondary)' }}>Loading student details...</p>
        </div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="animate-fade-in" style={{ display: 'flex', flexDirection: 'column', gap: '2rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem' }}>
          <div>
            <h1 style={{ fontSize: '2.25rem', fontWeight: 700, margin: '0' }}>Edit Student Profile</h1>
            <p style={{ color: 'var(--text-secondary)' }}>Update administrative information for {formData.fname} {formData.lname}</p>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem' }}>
            <Link to={`/admin/users/result/${id}/basic`} className="btn btn-secondary">
              + Basic Marks
            </Link>
            <Link to={`/admin/users/result/${id}/six`} className="btn btn-secondary">
              + Tally Marks
            </Link>
            <Link to={`/admin/users/result/${id}/year`} className="btn btn-secondary">
              + DCA Marks
            </Link>
          </div>
        </div>

        {error && (
          <div style={{ backgroundColor: 'rgba(239, 68, 68, 0.1)', border: '1px solid var(--accent-danger)', color: 'var(--accent-danger)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
            {error}
          </div>
        )}

        {success && (
          <div style={{ backgroundColor: 'rgba(16, 185, 129, 0.1)', border: '1px solid var(--accent-success)', color: 'var(--accent-success)', padding: '0.75rem 1.125rem', borderRadius: 'var(--border-radius-sm)', fontSize: '0.875rem' }}>
            {success}
          </div>
        )}

        <div className="glass-card" style={{ padding: '2.5rem' }}>
          <form onSubmit={handleSubmit}>
            <div className="grid-cols-2">
              <div>
                <div className="form-group">
                  <label className="form-label">Registration Number</label>
                  <input
                    name="reg_number"
                    type="text"
                    className="form-control"
                    value={formData.reg_number}
                    onChange={handleChange}
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
                      value={formData.fname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Last Name</label>
                    <input
                      name="lname"
                      type="text"
                      className="form-control"
                      value={formData.lname}
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Contact number</label>
                    <input
                      name="contactno"
                      type="tel"
                      maxLength="10"
                      pattern="\d{10}"
                      className="form-control"
                      value={formData.contactno}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="form-group">
                    <label className="form-label">Aadhar No.</label>
                    <input
                      name="aadhar"
                      type="text"
                      maxLength="12"
                      pattern="\d{12}"
                      className="form-control"
                      value={formData.aadhar}
                      onChange={handleChange}
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
                    value={formData.father}
                    onChange={handleChange}
                    required
                  />
                </div>
              </div>

              <div>
                <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
                  <div className="form-group">
                    <label className="form-label">Gender</label>
                    <select name="gender" className="form-control" value={formData.gender} onChange={handleChange} required>
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
                      onChange={handleChange}
                      required
                    />
                  </div>
                </div>

                <div className="form-group">
                  <label className="form-label">Admission Date</label>
                  <input
                    name="posting_date"
                    type="date"
                    className="form-control"
                    value={formData.posting_date}
                    onChange={handleChange}
                    required
                  />
                </div>

                <div className="form-group">
                  <label className="form-label">Select Course</label>
                  <select name="course" className="form-control" value={formData.course} onChange={handleChange} required>
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
                    value={formData.address}
                    onChange={handleChange}
                    required
                  ></textarea>
                </div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '1.25rem', marginTop: '2rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={() => navigate('/admin/users')} className="btn btn-secondary">
                Cancel
              </button>
              <button type="submit" className="btn btn-primary">
                Save Profile Updates
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  );
};

export default AdminEditUser;
