import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { X } from 'lucide-react';

const AuthModal = ({ onClose, onSuccess, initialLoginState = true }) => {
  const [isLogin, setIsLogin] = useState(initialLoginState);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const endpoint = isLogin ? 'http://localhost:3000/api/v1/auth/login' : 'http://localhost:3000/api/v1/auth/signup';
      const res = await fetch(endpoint, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData)
      });
      const data = await res.json();
      
      if (res.ok && data.success) {
        if (isLogin) {
          localStorage.setItem('token', data.data);
          onSuccess(data.data, 'Login successful!');
        } else {
          setIsLogin(true);
          setError('Signup successful! Please login.');
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch (err) {
      setError('Network error');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = 'http://localhost:3000/api/v1/auth/google';
  };

  return (
    <div className="modal-overlay">
      <motion.div 
        className="modal-content"
        initial={{ opacity: 0, scale: 0.9, y: 20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        exit={{ opacity: 0, scale: 0.9, y: 20 }}
        transition={{ type: "spring", damping: 25, stiffness: 300 }}
      >
        <button className="close-btn" onClick={onClose}>
          <X size={24} />
        </button>
        <div className="modal-logo">
          <svg viewBox="0 0 24 24" aria-hidden="true" style={{fill: "var(--text-color)", width: 34, height: 34}}>
            <g><path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"></path></g>
          </svg>
        </div>
        <h1>{isLogin ? 'Sign in to X' : 'Join X today'}</h1>
        
        <button className="google-btn" onClick={handleGoogleLogin}>
          <svg viewBox="0 0 48 48">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign {isLogin ? 'in' : 'up'} with Google
        </button>
        
        <div className="divider">
          <div className="line"></div>
          <span>or</span>
          <div className="line"></div>
        </div>

        <form className="auth-form" onSubmit={handleSubmit}>
          {!isLogin && (
            <>
              <div className="input-group">
                <input type="text" name="fullName" placeholder=" " value={formData.fullName} onChange={handleChange} required />
                <label>Full Name</label>
              </div>
              <div className="input-group">
                <input type="text" name="username" placeholder=" " value={formData.username} onChange={handleChange} required />
                <label>Username</label>
              </div>
            </>
          )}
          <div className="input-group">
            <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>
          <div className="input-group">
            <input type="password" name="password" placeholder=" " value={formData.password} onChange={handleChange} required />
            <label>Password</label>
          </div>
          {error && (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className={`error-text ${error.includes('successful') ? 'success' : ''}`}>
              {error}
            </motion.div>
          )}
          <motion.button 
            type="submit" 
            className="auth-submit-btn" 
            disabled={loading}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
          >
            {loading ? 'Processing...' : isLogin ? 'Log in' : 'Sign up'}
          </motion.button>
        </form>

        <div className="toggle-auth" onClick={() => { setIsLogin(!isLogin); setError(''); }}>
          {isLogin ? "Don't have an account? Sign up" : "Already have an account? Log in"}
        </div>
      </motion.div>
    </div>
  );
};

export default AuthModal;
