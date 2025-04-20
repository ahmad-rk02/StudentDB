import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const Home = () => {
  return (
    <motion.div
      className="d-flex flex-column justify-content-center align-items-center min-vh-100 text-center bg-gradient"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.8 }}
    >
      <h1 className="display-4 fw-bold mb-3 text-primary">Welcome to the Student Database 🎓</h1>
      <p className="lead mb-4 px-3" style={{ maxWidth: '600px' }}>
        Manage all student data, courses, enrollments, and marks in one place. Navigate using the links below to get started.
      </p>

      <div className="d-flex gap-3 flex-wrap justify-content-center">
        <Link to="/students" className="btn btn-primary btn-lg">Manage Students</Link>
        <Link to="/courses" className="btn btn-secondary btn-lg">Explore Courses</Link>
        <Link to="/enrollments" className="btn btn-success btn-lg">Track Enrollments</Link>
        <Link to="/marks" className="btn btn-info btn-lg">View Marks</Link>
      </div>

      <motion.img
        src="https://cdn-icons-png.flaticon.com/512/3135/3135755.png"
        alt="Student Icon"
        className="mt-5"
        style={{ width: 200 }}
        initial={{ y: 50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ delay: 0.3 }}
      />
    </motion.div>
  );
};

export default Home;
