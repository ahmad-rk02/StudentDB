import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Students.css'
function Students() {
  const [students, setStudents] = useState([]);
  const [form, setForm] = useState({
    first_name: '',
    last_name: '',
    dob: '',
    gender: '',
    email: '',
    phone: '',
    address: ''
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchStudents = async () => {
    const res = await axios.get('http://localhost:5000/api/students');
    setStudents(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['first_name', 'last_name', 'dob', 'gender', 'email'];
    const emptyFields = requiredFields.filter(field => !form[field]);
    if (emptyFields.length > 0) {
      setModalMessage('Please fill in all required fields: ' + emptyFields.join(', '));
      setShowModal(true);
      return;
    }
    if (editId) {
      await axios.put(`http://localhost:5000/api/students/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/students', form);
    }
    setForm({ first_name: '', last_name: '', dob: '', gender: '', email: '', phone: '', address: '' });
    setEditId(null);
    fetchStudents();
  };

  const handleEdit = (student) => {
    setForm(student);
    setEditId(student.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/students/${id}`);
    fetchStudents();
  };

  useEffect(() => {
    fetchStudents();
  }, []);

  const handleCloseModal = () => setShowModal(false);

  // Search functionality
  const filteredStudents = students.filter(stu =>
    `${stu.first_name} ${stu.last_name}`.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
    stu.address.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <div className="app-container">


      <h2 className="title">Student Management</h2>

      {/* Form */}
      <div className="form-container">
        <div className="form-grid">
          <input
            name="first_name"
            value={form.first_name}
            onChange={handleChange}
            placeholder="First Name *"
            className="form-input"
          />
          <input
            name="last_name"
            value={form.last_name}
            onChange={handleChange}
            placeholder="Last Name *"
            className="form-input"
          />
          <input
            name="dob"
            value={form.dob}
            onChange={handleChange}
            type="date"
            className="form-input"
          />
          <input
            name="gender"
            value={form.gender}
            onChange={handleChange}
            placeholder="Gender *"
            className="form-input"
          />
          <input
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Email *"
            className="form-input"
          />
          <input
            name="phone"
            value={form.phone}
            onChange={handleChange}
            placeholder="Phone"
            className="form-input"
          />
          <textarea
            name="address"
            value={form.address}
            onChange={handleChange}
            placeholder="Address"
            className="form-textarea"
          />
        </div>
        <button onClick={handleSubmit} className="form-button">
          {editId ? 'Update' : 'Add'} Student
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, email, or address..."
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>First Name</th>
              <th>Last Name</th>
              <th>DOB</th>
              <th>Gender</th>
              <th>Email</th>
              <th>Phone</th>
              <th>Address</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredStudents.slice(0, filteredStudents.length > 5 ? 5 : filteredStudents.length).map((stu) => (
              <tr key={stu.id}>
                <td>{stu.first_name}</td>
                <td>{stu.last_name}</td>
                <td>{stu.dob}</td>
                <td>{stu.gender}</td>
                <td>{stu.email}</td>
                <td>{stu.phone}</td>
                <td>{stu.address}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button edit-button" onClick={() => handleEdit(stu)}>Edit</button>
                    <button className="action-button delete-button" onClick={() => handleDelete(stu.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredStudents.length > 5 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="scroll-button"
          >
            Scroll Up to View More
          </button>
        )}
      </div>

      {/* Bootstrap Modal */}
      <div className={`modal ${showModal ? 'd-block' : 'd-none'}`} style={{ backgroundColor: 'rgba(0,0,0,0.5)' }}>
        <div className="modal-dialog modal-dialog-centered">
          <div className="modal-content">
            <div className="modal-header bg-danger text-white">
              <h5 className="modal-title">Error</h5>
              <button type="button" className="btn-close" onClick={handleCloseModal}></button>
            </div>
            <div className="modal-body">
              <p>{modalMessage}</p>
            </div>
            <div className="modal-footer">
              <button type="button" className="btn btn-secondary" onClick={handleCloseModal}>Close</button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default Students;