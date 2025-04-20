import React, { useContext } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Students from './components/Students';
import Courses from './components/Courses';
import Enrollments from './components/Enrollments';
import Marks from './components/Marks';
import Home from './components/Home';
import Profile from './components/Profile'; // New component
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        {/* Sticky Navbar */}
        <header className="bg-dark text-white sticky-top shadow">
          <div className="container py-3 d-flex flex-wrap align-items-center justify-content-between">
            <h1 className="mb-0 fs-3">🎓 Student DB</h1>
            <nav className="d-flex flex-wrap gap-2">
              <Link to="/" className="btn btn-outline-light">Home</Link>
              {user ? (
                <>
                  <Link to="/students" className="btn btn-outline-light">Students</Link>
                  <Link to="/courses" className="btn btn-outline-light">Courses</Link>
                  <Link to="/enrollments" className="btn btn-outline-light">Enrollments</Link>
                  <Link to="/marks" className="btn btn-outline-light">Marks</Link>
                  <Link to="/profile" className="btn btn-outline-light">Profile</Link>
                  <button onClick={logout} className="btn btn-outline-warning">Logout</button>
                </>
              ) : null}
            </nav>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 bg-light">
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/students"
                element={
                  <ProtectedRoute>
                    <Students />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/courses"
                element={
                  <ProtectedRoute>
                    <Courses />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/enrollments"
                element={
                  <ProtectedRoute>
                    <Enrollments />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/marks"
                element={
                  <ProtectedRoute>
                    <Marks />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/profile"
                element={
                  <ProtectedRoute>
                    <Profile />
                  </ProtectedRoute>
                }
              />
            </Routes>
          </div>
        </main>

        {/* Footer */}
        <footer className="bg-dark text-center text-white py-3">
          © {new Date().getFullYear()} Student Database System
        </footer>
      </div>
    </Router>
  );
}

export default App;