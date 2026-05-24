import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Modal from './ui/Modal';
import Button from './ui/Button';
import { Eye, EyeOff } from 'lucide-react';
import { login, signup, getGoogleAuthUrl } from '../lib/api';

const AuthModal = ({ onClose, onSuccess, initialLoginState = true }) => {
  const [isLogin, setIsLogin] = useState(initialLoginState);
  const [formData, setFormData] = useState({ email: '', password: '', username: '', fullName: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    setError(''); // Clear error on typing
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');
    setLoading(true);

    try {
      const { res, data } = isLogin 
        ? await login({ email: formData.email, password: formData.password })
        : await signup(formData); // Using fullName as model expects

      if (res.ok && data.success) {
        if (isLogin) {
          // data.data is an object with { user, token } for login
          const token = data.data.token || data.data; // fallback for older API format
          onSuccess(token, 'Welcome back!');
        } else {
          setIsLogin(true);
          setError('Account created successfully! Please sign in.');
          setFormData({ ...formData, password: '' });
        }
      } else {
        setError(data.message || 'Authentication failed');
      }
    } catch {
      setError('Network error. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = () => {
    window.location.href = getGoogleAuthUrl();
  };

  return (
    <Modal isOpen={true} onClose={onClose} size="md" hideClose={false}>
      <div className="auth-modal-content">
        <div className="brand-logo mx-auto mb-8 w-12 h-12 flex items-center justify-center rounded-full bg-gradient-to-tr from-indigo-500 to-purple-500 text-white shadow-[0_0_20px_rgba(99,102,241,0.4)]">
          <svg viewBox="0 0 24 24" width="24" height="24" stroke="currentColor" strokeWidth="2" fill="none" strokeLinecap="round" strokeLinejoin="round">
            <path d="M22 12h-4l-3 9L9 3l-3 9H2"></path>
          </svg>
        </div>

        <h1 className="text-2xl font-bold text-center mb-8 text-[var(--text-color)]">
          {isLogin ? 'Sign in to Pulse' : 'Join Pulse today'}
        </h1>
        
        <Button 
          variant="outline" 
          fullWidth 
          onClick={handleGoogleLogin}
          className="mb-6 h-12 relative flex items-center justify-center bg-white text-black border-transparent hover:bg-gray-100"
        >
          <svg viewBox="0 0 48 48" className="w-5 h-5 absolute left-4">
            <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.7 17.74 9.5 24 9.5z"></path>
            <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"></path>
            <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24c0 3.88.92 7.54 2.56 10.78l7.97-6.19z"></path>
            <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"></path>
            <path fill="none" d="M0 0h48v48H0z"></path>
          </svg>
          Sign {isLogin ? 'in' : 'up'} with Google
        </Button>
        
        <div className="flex items-center gap-4 mb-6">
          <div className="h-px bg-[var(--border-color)] flex-1"></div>
          <span className="text-[var(--dim-text)] text-sm">or</span>
          <div className="h-px bg-[var(--border-color)] flex-1"></div>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-5">
          <AnimatePresence mode="popLayout">
            {!isLogin && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                exit={{ opacity: 0, height: 0 }}
                className="flex flex-col gap-5"
              >
                <div className="floating-input-group">
                  <input type="text" name="fullName" placeholder=" " value={formData.fullName} onChange={handleChange} required />
                  <label>Full Name</label>
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
          
          <div className="floating-input-group relative">
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
              className="absolute right-4 top-1/2 -translate-y-1/2 text-[var(--dim-text)] hover:text-[var(--text-color)] focus:outline-none"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <AnimatePresence>
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }} 
                animate={{ opacity: 1, y: 0 }} 
                exit={{ opacity: 0, y: -10 }}
                className={`text-sm ${error.includes('successfully') ? 'text-[var(--success-color)]' : 'text-[var(--error-color)]'}`}
              >
                {error}
              </motion.div>
            )}
          </AnimatePresence>

          <Button type="submit" fullWidth isLoading={loading} size="lg" className="mt-2">
            {isLogin ? 'Log in' : 'Sign up'}
          </Button>
        </form>

        <div className="mt-6 text-center text-[var(--dim-text)]">
          {isLogin ? "Don't have an account? " : "Already have an account? "}
          <button 
            type="button"
            onClick={() => { setIsLogin(!isLogin); setError(''); }}
            className="text-[var(--primary-color)] hover:underline font-medium focus:outline-none"
          >
            {isLogin ? "Sign up" : "Log in"}
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default AuthModal;
