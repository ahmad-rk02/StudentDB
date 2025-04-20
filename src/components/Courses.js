import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Courses.css'

function Courses() {
  const [courses, setCourses] = useState([]);
  const [form, setForm] = useState({
    course_name: '',
    course_code: '',
    course_description: ''
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchCourses = async () => {
    const res = await axios.get('http://localhost:5000/api/courses');
    setCourses(res.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['course_name', 'course_code'];
    const emptyFields = requiredFields.filter(field => !form[field]);
    if (emptyFields.length > 0) {
      setModalMessage('Please fill in all required fields: ' + emptyFields.join(', '));
      setShowModal(true);
      return;
    }
    if (editId) {
      await axios.put(`http://localhost:5000/api/courses/${editId}`, form);
    } else {
      await axios.post('http://localhost:5000/api/courses', form);
    }
    setForm({ course_name: '', course_code: '', course_description: '' });
    setEditId(null);
    fetchCourses();
  };

  const handleEdit = (course) => {
    setForm(course);
    setEditId(course.id);
  };

  const handleDelete = async (id) => {
    await axios.delete(`http://localhost:5000/api/courses/${id}`);
    fetchCourses();
  };

  useEffect(() => {
    fetchCourses();
  }, []);

  // Search functionality
  const filteredCourses = courses.filter(course =>
    course.course_name.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_code.toLowerCase().includes(searchQuery.toLowerCase()) ||
    course.course_description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="app-container">

      <h2 className="title">Course Management</h2>

      {/* Form */}
      <div className="form-container">
        <div className="form-grid">
          <input
            name="course_name"
            value={form.course_name}
            onChange={handleChange}
            placeholder="Course Name *"
            className="form-input"
          />
          <input
            name="course_code"
            value={form.course_code}
            onChange={handleChange}
            placeholder="Course Code *"
            className="form-input"
          />
          <textarea
            name="course_description"
            value={form.course_description}
            onChange={handleChange}
            placeholder="Description"
            className="form-textarea"
          />
        </div>
        <button onClick={handleSubmit} className="form-button">
          {editId ? 'Update' : 'Add'} Course
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by name, code, or description..."
          className="search-input"
        />
      </div>

      {/* Table */}
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Name</th>
              <th>Code</th>
              <th>Description</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredCourses.slice(0, filteredCourses.length > 5 ? 5 : filteredCourses.length).map(course => (
              <tr key={course.id}>
                <td>{course.course_name}</td>
                <td>{course.course_code}</td>
                <td>{course.course_description}</td>
                <td>
                  <div className="action-buttons">
                    <button className="action-button edit-button" onClick={() => handleEdit(course)}>Edit</button>
                    <button className="action-button delete-button" onClick={() => handleDelete(course.id)}>Delete</button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredCourses.length > 5 && (
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

export default Courses;