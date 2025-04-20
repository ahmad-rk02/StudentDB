import React, { useEffect, useState } from 'react';
import axios from 'axios';
import './Enrollments.css';

const BASE_URL = process.env.REACT_APP_API_BASE_URL;

function Enrollments() {
  const [students, setStudents] = useState([]);
  const [courses, setCourses] = useState([]);
  const [enrollments, setEnrollments] = useState([]);
  const [form, setForm] = useState({
    student_id: '',
    course_id: ''
  });
  const [showModal, setShowModal] = useState(false);
  const [modalMessage, setModalMessage] = useState('');
  const [searchQuery, setSearchQuery] = useState('');

  const fetchData = async (retries = 3) => {
    for (let attempt = 1; attempt <= retries; attempt++) {
      try {
        const [s, c, e] = await Promise.all([
          axios.get(`${BASE_URL}/api/students`),
          axios.get(`${BASE_URL}/api/courses`),
          axios.get(`${BASE_URL}/api/enrollments`)
        ]);
        setStudents(s.data);
        setCourses(c.data);
        setEnrollments(e.data);
        console.log('Fetched data (attempt', attempt, '):', {
          students: s.data,
          courses: c.data,
          enrollments: e.data
        });
        return;
      } catch (error) {
        console.error(`Fetch error (attempt ${attempt}):`, error);
        if (attempt === retries) {
          setModalMessage('Error fetching data after retries: ' + error.message);
          setShowModal(true);
        }
        await new Promise(resolve => setTimeout(resolve, 1000));
      }
    }
  };

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleEnroll = async (e) => {
    e.preventDefault();
    const requiredFields = ['student_id', 'course_id'];
    const emptyFields = requiredFields.filter(field => !form[field]);
    if (emptyFields.length > 0) {
      setModalMessage('Please fill in all required fields: ' + emptyFields.join(', '));
      setShowModal(true);
      return;
    }
    try {
      const response = await axios.post(`${BASE_URL}/api/enrollments`, form);
      const newEnrollment = response.data;
      setEnrollments(prev => [...prev, newEnrollment]);
      setForm({ student_id: '', course_id: '' });
      await fetchData();
      console.log('Enrolled:', newEnrollment);
    } catch (error) {
      setModalMessage('Error enrolling student: ' + (error.response?.data?.message || error.message));
      setShowModal(true);
      console.error('Enroll error:', error);
    }
  };

  const handleDelete = async (id) => {
    try {
      await axios.delete(`${BASE_URL}/api/enrollments/${id}`);
      setEnrollments(prev => prev.filter(e => e.id !== id));
      await fetchData();
      console.log('Deleted enrollment:', id);
    } catch (error) {
      setModalMessage('Error deleting enrollment: ' + (error.response?.data?.message || error.message));
      setShowModal(true);
      console.error('Delete error:', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const findName = (id, list, enrollment) => {
    if (enrollment?.first_name && enrollment?.last_name) {
      return `${enrollment.first_name} ${enrollment.last_name}`;
    }
    const item = list.find(i => i.id === id);
    return item ? `${item.first_name} ${item.last_name}` : 'Unknown Student';
  };

  const findCourse = (id, enrollment) => {
    if (enrollment?.course_name) {
      return enrollment.course_name;
    }
    const course = courses.find(c => c.id === id);
    return course ? course.course_name : 'Unknown Course';
  };

  const filteredEnrollments = enrollments.filter(e =>
    findName(e.student_id, students, e).toLowerCase().includes(searchQuery.toLowerCase()) ||
    findCourse(e.course_id, e).toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleCloseModal = () => setShowModal(false);

  return (
    <div className="app-container">
      <h2 className="title">Enroll Student in Course</h2>

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
        </div>
        <button onClick={handleEnroll} className="form-button">Enroll</button>
      </div>

      <div className="search-bar">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by student or course..."
          className="search-input"
        />
      </div>

      <h4 className="title" style={{ fontSize: '1.5rem' }}>Enrollment List</h4>
      <div className="table-container">
        <table className="table">
          <thead>
            <tr>
              <th>Student</th>
              <th>Course</th>
              <th>Date</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredEnrollments.slice(0, 5).map(e => (
              <tr key={e.id}>
                <td>{findName(e.student_id, students, e)}</td>
                <td>{findCourse(e.course_id, e)}</td>
                <td>{e.enrollment_date}</td>
                <td>
                  <div className="action-buttons">
                    <button
                      className="action-button delete-button"
                      onClick={() => handleDelete(e.id)}
                    >
                      Delete
                    </button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {filteredEnrollments.length > 5 && (
          <button
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="scroll-button"
          >
            Scroll Up to View More
          </button>
        )}
      </div>

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

export default Enrollments;
