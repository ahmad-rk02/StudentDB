import React, { useState, useContext, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../context/AuthContext';
import './AuthModal.css';

const AuthModal = ({ onClose }) => {
  const { login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [view, setView] = useState('login');
  const [form, setForm] = useState({
    email: '',
    password: '',
    username: '',
    otp: ['', '', '', '', '', ''],
    newPassword: '',
  });
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [showPassword, setShowPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const otpInputs = useRef([]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith('otp')) {
      const index = parseInt(name.split('-')[1]);
      const newOtp = [...form.otp];
      newOtp[index] = value;
      setForm({ ...form, otp: newOtp });
      if (value && index < 5) {
        otpInputs.current[index + 1].focus();
      }
    } else {
      setForm({ ...form, [name]: value });
    }
  };

  const handleOtpPaste = (e) => {
    e.preventDefault();
    const pasted = e.clipboardData.getData('text').trim();
    if (pasted.length === 6 && /^\d{6}$/.test(pasted)) {
      const newOtp = pasted.split('');
      setForm({ ...form, otp: newOtp });
      otpInputs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    try {
      let url = '', body = {};

      switch (view) {
        case 'login':
          url = '/api/auth/login';
          body = { email: form.email, password: form.password };
          break;
        case 'signup':
          url = '/api/auth/signup';
          body = { email: form.email, password: form.password, username: form.username };
          break;
        case 'otp':
          url = '/api/auth/verify-otp-and-register';
          body = {
            email: form.email,
            password: form.password,
            username: form.username,
            otp: form.otp.join(''),
          };
          break;
        case 'forgot':
          url = '/api/auth/forgot-password';
          body = { email: form.email };
          break;
        case 'reset':
          url = '/api/auth/reset-password';
          body = { email: form.email, otp: form.otp.join(''), newPassword: form.newPassword };
          break;
        default:
          return;
      }

      const res = await fetch(`${process.env.REACT_APP_API_BASE_URL}${url}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });

      const data = await res.json();
      if (!res.ok) throw new Error(data.error || 'Something went wrong');

      if (view === 'login') {
        login(data.user, data.token);
        onClose();
        navigate('/');
      } else if (view === 'signup') {
        setView('otp');
        setSuccess('OTP sent to your email. Please enter the 6-digit code.');
      } else if (view === 'otp') {
        setView('login');
        setSuccess('Registration successful. Please log in.');
        setForm({
          email: '',
          password: '',
          username: '',
          otp: ['', '', '', '', '', ''],
          newPassword: '',
        });
      } else if (view === 'forgot') {
        setView('reset');
        setSuccess('OTP sent. Please check your email.');
      } else if (view === 'reset') {
        setView('login');
        setSuccess('Password reset successful. You can now login.');
      }
    } catch (err) {
      setError(err.message);
    }
  };

  useEffect(() => {
    if (view === 'otp' || view === 'reset') {
      otpInputs.current[0]?.focus();
    }
  }, [view]);

  return (
    <div className="auth-modal-overlay">
      <div className="auth-modal">
        <button className="close-btn" onClick={onClose}>×</button>
        <h3 className="modal-title">
          {view === 'otp' ? 'Verify OTP' : view.replace('-', ' ')}
        </h3>
        
        {error && <p className="text-danger">{error}</p>}
        {success && <p className="text-success">{success}</p>}

        <form onSubmit={handleSubmit}>
          {view === 'signup' && (
            <input
              type="text"
              name="username"
              className="form-control"
              placeholder="Username"
              value={form.username}
              onChange={handleChange}
              required
            />
          )}

          {(view === 'login' || view === 'signup' || view === 'forgot' || view === 'reset') && (
            <input
              type="email"
              name="email"
              className="form-control"
              placeholder="Email"
              value={form.email}
              onChange={handleChange}
              required
            />
          )}

          {(view === 'login' || view === 'signup') && (
            <div className="password-input">
              <input
                type={showPassword ? 'text' : 'password'}
                name="password"
                className="form-control"
                placeholder="Password"
                value={form.password}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-eye"
                onClick={() => setShowPassword(!showPassword)}
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          {(view === 'otp' || view === 'reset') && (
            <div className="otp-input-container">
              <div className="otp-inputs">
                {form.otp.map((digit, index) => (
                  <input
                    key={index}
                    type="text"
                    inputMode="numeric"
                    pattern="[0-9]*"
                    name={`otp-${index}`}
                    className="otp-box"
                    maxLength="1"
                    value={digit}
                    onChange={handleChange}
                    onPaste={index === 0 ? handleOtpPaste : null}
                    ref={(el) => (otpInputs.current[index] = el)}
                    required
                  />
                ))}
              </div>
            </div>
          )}

          {view === 'reset' && (
            <div className="password-input">
              <input
                type={showNewPassword ? 'text' : 'password'}
                name="newPassword"
                className="form-control"
                placeholder="New Password"
                value={form.newPassword}
                onChange={handleChange}
                required
              />
              <button
                type="button"
                className="btn-eye"
                onClick={() => setShowNewPassword(!showNewPassword)}
                aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              >
                {showNewPassword ? '🙈' : '👁️'}
              </button>
            </div>
          )}

          <button type="submit" className="btn btn-primary">
            {view === 'login' ? 'Login' :
             view === 'signup' ? 'Sign Up' :
             view === 'otp' ? 'Verify OTP' :
             view === 'forgot' ? 'Send OTP' :
             'Reset Password'}
          </button>
        </form>

        <div className="auth-links">
          {view === 'login' && (
            <>
              <p>New user? <button className="btn-link" onClick={() => setView('signup')}>Sign Up</button></p>
              <p><button className="btn-link" onClick={() => setView('forgot')}>Forgot Password?</button></p>
            </>
          )}
          {(view === 'signup' || view === 'forgot' || view === 'reset' || view === 'otp') && (
            <p>Back to <button className="btn-link" onClick={() => setView('login')}>Login</button></p>
          )}
        </div>
      </div>
    </div>
  );
};

export default AuthModal;