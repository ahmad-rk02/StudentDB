import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Marks.css'
function Marks() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [marksList, setMarksList] = useState([]);
  const [form, setForm] = useState({
    student_id: '',
    course_id: '',
    marks: '',
    semester: ''
  });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async () => {
    const s = await axios.get('http://localhost:5000/api/students');
    const c = await axios.get('http://localhost:5000/api/courses');
    const m = await axios.get('http://localhost:5000/api/marks');
    setStudents(s.data);
    setCourses(c.data);
    setMarksList(m.data);
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const requiredFields = ['student_id', 'course_id', 'marks', 'semester'];
    const emptyFields = requiredFields.filter(field => !form[field]);
    if (emptyFields.length > 0) {
      setModalMessage('Please fill in all required fields: ' + emptyFields.join(', '));
      setShowModal(true);
      return;
    }
    try {
      if (editId) {
        await axios.put(`http://localhost:5000/api/marks/${editId}`, form);
      } else {
        await axios.post('http://localhost:5000/api/marks', form);
      }
      setForm({ student_id: '', course_id: '', marks: '', semester: '' });
      setEditId(null);
      fetchData();
    } catch (error) {
      setModalMessage('Error saving mark: ' + error.response?.data?.message || error.message);
      setShowModal(true);
    }
  };

  const handleEdit = (mark) => {
    setForm({
      student_id: mark.student_id,
      course_id: mark.course_id,
      marks: mark.marks,
      semester: mark.semester
    });
    setEditId(mark.id);
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`http://localhost:5000/api/marks/${id}`);
      fetchData();
    } catch (error) {
      setModalMessage('Error deleting mark: ' + error.response?.data?.message || error.message);
      setShowModal(true);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findName = (id) => {
    const student = students.find(s => s.id === id);
    return student ? `${student.first_name} ${student.last_name}` : '';
  };

  const findCourse = (id) => {
    const course = courses.find(c => c.id === id);
    return course ? course.course_name : '';
  };

  // Search functionality
  const filteredMarks = marksList.filter(m =>
    findName(m.student_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    findCourse(m.course_id).toLowerCase().includes(searchQuery.toLowerCase()) ||
    m.semester.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="app-container">

      <h2 className="title">Enter Marks</h2>

      {/* Form */}
      <div className="form-container">
        <div className="form-grid">
          <select
            name="student_id"
            onChange={handleChange}
            value={form.student_id}
            className="form-select"
            required
          >
            <option value="">Select Student *</option>
            {students.map(s => (
              <option key={s.id} value={s.id}>{s.first_name} {s.last_name}</option>
            ))}
          </select>
          <select
            name="course_id"
            onChange={handleChange}
            value={form.course_id}
            className="form-select"
            required
          >
            <option value="">Select Course *</option>
            {courses.map(c => (
              <option key={c.id} value={c.id}>{c.course_name}</option>
            ))}
          </select>
          <input
            type="number"
            name="marks"
            placeholder="Marks *"
            value={form.marks}
            onChange={handleChange}
            className="form-input"
          />
          <input
            type="text"
            name="semester"
            placeholder="Semester *"
            value={form.semester}
            onChange={handleChange}
            className="form-input"
          />
        </div>
        <button onClick={handleSubmit} className="form-button">
          {editId ? 'Update' : 'Add'} Mark
        </button>
      </div>

      {/* Search Bar */}
      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student, course, or semester..."
          className="search-input"
        />
      </div>

      {/* Table */}
      <h4 className="title" style={{ fontSize: '1.5rem' }}>Marks List</h4>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Marks</th>
              <th>Semester</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredMarks.slice(0, filteredMarks.length > 5 ? 5 : filteredMarks.length).map(m => (
              <tr key={m.id}>
                <td>{findName(m.student_id)}</td>
                <td>{findCourse(m.course_id)}</td>
                <td>{m.marks}</td>
                <td>{m.semester}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button edit-button"
                      onClick={() => handleEdit(m)}
                    >
                      Edit
                    </button>
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(m.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredMarks.length > 5 && (
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

export default Marks;