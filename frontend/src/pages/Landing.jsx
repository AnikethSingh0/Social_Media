import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import OrbitLogo from '../components/ui/OrbitLogo';
import Button from '../components/ui/Button';
import AuthModal from '../components/AuthModal';
import ThreeScene from '../components/ui/ThreeScene';

const Landing = ({ onLogin }) => {
  const [showAuthModal, setShowAuthModal] = useState(false);
  const [authModalState, setAuthModalState] = useState(true);

  const openModal = (isLogin) => {
    setAuthModalState(isLogin);
    setShowAuthModal(true);
  };

  return (
    <>
      <section className="relative min-h-screen overflow-x-hidden flex flex-col justify-center items-center py-24 sm:py-32">
        {/* 3D Scene Background */}
        <ThreeScene />

        {/* Grid Pattern Background overlay (Shelf.nu inspired) */}
        <div className="absolute inset-0 -z-10 bg-grid-pattern bg-[size:32px_32px] [mask-image:radial-gradient(ellipse_60%_50%_at_50%_0%,#000_70%,transparent_100%)] pointer-events-none opacity-40"></div>
        <div className="absolute top-0 inset-x-0 h-[600px] bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-[#1d9bf0]/20 via-black to-black pointer-events-none -z-10"></div>
        
        {/* Navigation Bar */}
        <header className="absolute top-0 left-0 right-0 p-6 flex justify-between items-center z-20">
          <div className="flex items-center gap-2">
            <OrbitLogo size={32} />
            <span className="font-bold text-white text-xl tracking-tight">Orbit</span>
          </div>
          <div className="flex gap-4">
            <Button 
              variant="primary" 
              className="px-6 py-2 text-sm font-bold shadow-lg shadow-[#1d9bf0]/30"
              onClick={() => openModal(true)}
            >
              Log in
            </Button>
          </div>
        </header>

        {/* Hero Content */}
        <div className="relative z-20 mx-auto w-full max-w-5xl px-4 sm:px-6 lg:px-8 text-center mt-12">
          {/* Notification Badge */}
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, ease: "easeOut" }}
            className="mb-8 flex justify-center"
          >
            <span onClick={() => openModal(false)} className="inline-flex items-center rounded-full border border-[#1d9bf0]/30 bg-[#1d9bf0]/10 px-4 py-1.5 text-sm font-medium text-[#1d9bf0] backdrop-blur-sm transition-colors hover:bg-[#1d9bf0]/20 cursor-pointer">
              <span className="mr-2 flex items-center">
                <span className="font-bold">New</span>
                <span className="opacity-60 mx-2">|</span>
              </span>
              Orbit is now in Public Beta
              <span className="ml-2 font-semibold">→</span>
            </span>
          </motion.div>

          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.1, ease: "easeOut" }}
            className="text-5xl font-black tracking-tight text-white sm:text-6xl md:text-7xl lg:text-8xl mb-6 leading-[1.1]"
          >
            The social platform your network <span className="text-[#1d9bf0]">will actually use.</span>
          </motion.h1>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2, ease: "easeOut" }}
            className="mx-auto max-w-2xl text-lg sm:text-xl leading-relaxed text-gray-400 mb-10"
          >
            Stop wrestling with noise and algorithmic timelines. Orbit is the fast, beautifully designed space for authentic conversations.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3, ease: "easeOut" }}
            className="flex flex-col sm:flex-row items-center justify-center gap-4"
          >
            <Button 
              variant="primary" 
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base font-bold shadow-lg shadow-[#1d9bf0]/20"
              onClick={() => openModal(false)}
            >
              Sign up free
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              className="w-full sm:w-auto px-8 h-12 text-base font-bold bg-transparent border-gray-700 hover:bg-gray-800"
              onClick={() => openModal(true)}
            >
              Sign in
            </Button>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 1, delay: 0.8 }}
            className="mt-8 flex flex-col sm:flex-row items-center justify-center gap-3 text-sm text-gray-500"
          >
            <span>Free forever <span className="mx-2 opacity-50">|</span> No credit card required</span>
          </motion.div>
        </div>

        {/* Marquee Section */}
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.5, delay: 1 }}
          className="relative w-full overflow-hidden [mask-image:linear-gradient(to_right,transparent,black_10%,black_90%,transparent)] mt-24 z-20 opacity-60"
        >
          <div className="flex flex-nowrap animate-marquee" style={{ "--marquee-duration": "30s" }}>
            {/* Repeated twice for seamless looping */}
            {[1, 2].map((set) => (
              <div key={set} className="flex flex-nowrap flex-shrink-0 gap-16 pr-16 items-center">
                {['Lightning Fast', 'Open Source', 'Beautiful UI', 'Real-time Chat', 'Media Rich', 'Responsive', 'Secure'].map((text, i) => (
                  <div key={`${set}-${i}`} className="flex items-center gap-3">
                    <OrbitLogo size={20} className="text-[#1d9bf0]" />
                    <span className="text-xl font-bold tracking-widest uppercase text-gray-400 whitespace-nowrap">{text}</span>
                  </div>
                ))}
              </div>
            ))}
          </div>
        </motion.div>
      </section>
      
      <AnimatePresence>
        {showAuthModal && (
          <AuthModal 
            initialLoginState={authModalState}
            onClose={() => setShowAuthModal(false)} 
            onSuccess={onLogin}
          />
        )}
      </AnimatePresence>
    </>
  );
};

export default Landing;
