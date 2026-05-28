import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles } from 'lucide-react';
import Button from '../components/ui/Button';
import AuthModal from '../components/AuthModal';

const Landing = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalState, setAuthModalState] = useState(true);

  const openModal = (isLogin) => {
    setAuthModalState(isLogin);
    setShowAuthModal(true);
  };

  return (
    <>
      <div className="masterpiece-bg">
        <motion.div 
          className="glow-orb orb-1"
          animate={{ x: [0, 50, 0], y: [0, -30, 0] }}
          transition={{ duration: 15, repeat: Infinity, ease: "easeInOut" }}
        />
        <motion.div 
          className="glow-orb orb-2"
          animate={{ x: [0, -50, 0], y: [0, 30, 0] }}
          transition={{ duration: 20, repeat: Infinity, ease: "easeInOut" }}
        />
        <div className="landing-grid"></div>
      </div>
      <div className="landing-container animate-fade">
        <div className="landing-hero">
          <div className="landing-showcase">
            <motion.div 
              className="showcase-card showcase-card-main"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="showcase-avatar">
                <Sparkles size={28} />
              </div>
              <div className="showcase-copy">
                <strong>Orbit</strong>
                <span></span>
                <span></span>
                <span></span>
              </div>
            </motion.div>
            <motion.div 
              className="showcase-card showcase-card-floating"
              animate={{ y: [0, 10, 0], x: [0, 5, 0] }}
              transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
            >
              <span className="showcase-pulse"></span>
              Live conversations, refined.
            </motion.div>
          </div>
          <div className="brand-logo-large" aria-hidden="true">
            <Sparkles />
          </div>
        </div>
        <div className="landing-content">
          <div className="glass-panel relative overflow-hidden">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 to-purple-500/10 z-0"></div>
            <div className="relative z-10">
              <div className="landing-kicker text-[#14b8a6]">Orbit Social</div>
              <h1 className="animate-slide-up text-5xl font-black mb-6 bg-clip-text text-transparent bg-gradient-to-r from-white to-gray-400">
                Join the conversation.
              </h1>
              <h2 className="animate-slide-up text-gray-300 text-xl font-light mb-10" style={{animationDelay: '0.1s'}}>
                A premium space for your ideas, connections, and moments.
              </h2>
              
              <div className="auth-buttons-container animate-slide-up" style={{animationDelay: '0.2s'}}>
              <Button 
                variant="primary" 
                fullWidth 
                size="lg"
                onClick={() => openModal(false)}
              >
                Create account
              </Button>
              
              <div className="auth-disclaimer">
                By signing up, you agree to the Terms of Service and Privacy Policy, including Cookie Use.
              </div>

              <h3 className="landing-auth-heading">Already have an account?</h3>
              <Button 
                variant="outline" 
                fullWidth 
                size="lg"
                onClick={() => openModal(true)}
              >
                Sign in
              </Button>
            </div>
            </div>
          </div>
        </div>
        
        <AnimatePresence>
          {showAuthModal && (
            <AuthModal 
              initialLoginState={authModalState}
              onClose={() => setShowAuthModal(false)} 
              onSuccess={onLogin}
            />
          )}
        </AnimatePresence>
      </div>
    </>
  );
};

export default Landing;
