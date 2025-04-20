import React, { useContext, useState } from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom';
import Students from './components/Students';
import Courses from './components/Courses';
import Enrollments from './components/Enrollments';
import Marks from './components/Marks';
import Home from './components/Home';
import Profile from './components/Profile';
import ProtectedRoute from './components/ProtectedRoute';
import { AuthContext } from './context/AuthContext';

function App() {
  const { user, logout } = useContext(AuthContext);
  const [isNavCollapsed, setIsNavCollapsed] = useState(true);

  const handleNavCollapse = () => setIsNavCollapsed(!isNavCollapsed);

  return (
    <Router>
      <div className="min-vh-100 d-flex flex-column">
        {/* Sticky Navbar */}
        <header className="bg-dark text-white sticky-top shadow">
          <div className="container py-3">
            <div className="d-flex justify-content-between align-items-center">
              <h1 className="mb-0 fs-3">🎓 Student DB</h1>

              {/* Toggle Button */}
              <button
                className="navbar-toggler d-md-none"
                type="button"
                onClick={handleNavCollapse}
              >
                <span className="navbar-toggler-icon bg-light"></span>
              </button>
            </div>

            {/* Collapsible Nav */}
            <div className={`mt-3 mt-md-0 ${isNavCollapsed ? 'd-none d-md-flex' : 'd-flex flex-column'} flex-md-row flex-wrap gap-2`}>
              <Link to="/" className="btn btn-outline-light">Home</Link>
              {user && (
                <>
                  <Link to="/students" className="btn btn-outline-light">Students</Link>
                  <Link to="/courses" className="btn btn-outline-light">Courses</Link>
                  <Link to="/enrollments" className="btn btn-outline-light">Enrollments</Link>
                  <Link to="/marks" className="btn btn-outline-light">Marks</Link>
                  <Link to="/profile" className="btn btn-outline-light">Profile</Link>
                  <button onClick={logout} className="btn btn-outline-warning">Logout</button>
                </>
              )}
            </div>
          </div>
        </header>

        {/* Main Content */}
        <main className="flex-grow-1 bg-light">
          <div className="container py-4">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route
                path="/students"
                element={<ProtectedRoute><Students /></ProtectedRoute>}
              />
              <Route
                path="/courses"
                element={<ProtectedRoute><Courses /></ProtectedRoute>}
              />
              <Route
                path="/enrollments"
                element={<ProtectedRoute><Enrollments /></ProtectedRoute>}
              />
              <Route
                path="/marks"
                element={<ProtectedRoute><Marks /></ProtectedRoute>}
              />
              <Route
                path="/profile"
                element={<ProtectedRoute><Profile /></ProtectedRoute>}
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
