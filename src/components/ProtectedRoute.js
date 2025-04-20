// components/ProtectedRoute.js
import React, { useContext, useState, useEffect } from 'react';
import { AuthContext } from '../context/AuthContext';
import AuthModal from './AuthModal';

const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useContext(AuthContext);
  const [showModal, setShowModal] = useState(false);

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      setShowModal(true);
    }
  }, [loading, isAuthenticated]);

  if (loading) return <div className="text-center mt-5">Loading...</div>;

  if (!isAuthenticated) {
    return (
      <>
        {showModal && <AuthModal onClose={() => setShowModal(false)} />}
        <div className="text-center mt-5">
          <p className="lead">You must login or sign up to access this content.</p>
        </div>
      </>
    );
  }

  return children;
};

export default ProtectedRoute;
