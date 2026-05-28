import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Eye, EyeOff } from 'lucide-react';
import { PiHandsPrayingDuotone } from 'react-icons/pi';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { login, signup, getGoogleAuthUrl } from '../lib/api';

const AuthModal = ({ onClose, onSuccess, initialLoginState = true }) => {
  const [isLogin, setIsLogin] = useState(initialLoginState);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', fullName: '' });
  const [message, setMessage] = useState('');
  const [messageType, setMessageType] = useState('error');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (event) => {
    setFormData({ ...formData, [event.target.name]: event.target.value });
    setMessage('');
  };

  const handleSubmit = async (event) => {
    event.preventDefault();
    setMessage('');
    setMessageType('error');
    setLoading(true);

    try {
      const { res, data } = isLogin
        ? await login({ email: formData.email, password: formData.password })
        : await signup(formData);

      if (res.ok && data.success) {
        if (isLogin) {
          const token = data.data?.token || data.data;
          onSuccess(token, 'Welcome back to Orbit');
        } else {
          setIsLogin(true);
          setMessageType('success');
          setMessage('Account created. Sign in to enter Orbit.');
          setFormData((current) => ({ ...current, password: '' }));
        }
      } else {
        setMessage(data.message || 'Authentication failed');
      }
    } catch {
      setMessage('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Modal isOpen onClose={onClose} size="md">
      <div className="auth-modal-content">
        <div className="auth-brand-mark">
          <PiHandsPrayingDuotone size={26} />
        </div>

        <div className="auth-heading">
          <p>Orbit Social</p>
          <h1>{isLogin ? 'Sign in to Orbit' : 'Create your Orbit account'}</h1>
        </div>

        <Button
          variant="secondary"
          fullWidth
          onClick={handleGoogleLogin}
          className="google-auth-btn"
        >
          <svg viewBox="0 0 48 48" className="google-icon" aria-hidden="true">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign {isLogin ? 'in' : 'up'} with Google
        </Button>

        <div className="auth-divider">
          <span></span>
          <p>or continue with email</p>
          <span></span>
        </div>

        <form onSubmit={handleSubmit} className="auth-form">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="signup-fields"
              >
                <div className="floating-input-group">
                  <input type="text" name="fullName" placeholder=" " value={formData.fullName} onChange={handleChange} required />
                  <label>Full name</label>
                </div>
                <div className="floating-input-group">
                  <input type="text" name="username" placeholder=" " value={formData.username} onChange={handleChange} required />
                  <label>Username</label>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          <div className="floating-input-group">
            <input type="email" name="email" placeholder=" " value={formData.email} onChange={handleChange} required />
            <label>Email</label>
          </div>

          <div className="floating-input-group password-field">
            <input
              type={showPassword ? 'text' : 'password'}
              name="password"
              placeholder=" "
              value={formData.password}
              onChange={handleChange}
              required
            />
            <label>Password</label>
            <button
              type="button"
              className="password-toggle"
              onClick={() => setShowPassword((current) => !current)}
              aria-label={showPassword ? 'Hide password' : 'Show password'}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {message && (
              <motion.div
                initial={{ opacity: 0, y: -8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                className={`auth-message ${messageType}`}
              >
                {message}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" fullWidth isLoading={loading} size="lg" className="auth-submit">
            {isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </form>

        <div className="auth-switch">
          {isLogin ? "Don't have an account? " : 'Already have an account? '}
          <button
            type="button"
            onClick={() => {
              setIsLogin((current) => !current);
              setMessage('');
              setMessageType('error');
            }}
          >
            {isLogin ? 'Sign up' : 'Log in'}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
