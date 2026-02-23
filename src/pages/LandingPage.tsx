import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import {
  Zap, Shield, Clock, ArrowRight,
  Smartphone, MapPin, CheckCircle2, PlayCircle, Menu, X, Code2, Lock, Award, Star, Globe, Cpu, Users, Bot
} from 'lucide-react';

const LandingPage: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const scaleX = useSpring(scrollYProgress, { stiffness: 100, damping: 30, restDelta: 0.001 });

  return (
    <div className="min-h-screen text-slate-900 selection:bg-indigo-500/20 font-sans overflow-x-hidden relative">
      {/* Soft Light Mix Animated Background */}
      <div
        className="fixed inset-0 -z-10 bg-gradient-to-r from-blue-100 via-indigo-100 to-purple-100 animate-gradient-slow opacity-60"
        style={{ backgroundSize: '400% 400%' }}
      />

      {/* Subtle Floating Blobs for Extra Depth - Very Light & Soft */}
      <div className="fixed inset-0 -z-10 pointer-events-none overflow-hidden">
        <div className="absolute top-[-10%] left-[-10%] w-[60%] h-[60%] rounded-full bg-blue-200/20 blur-[150px] animate-blob mix-blend-multiply" />
        <div className="absolute top-[20%] right-[-10%] w-[60%] h-[60%] rounded-full bg-purple-200/20 blur-[150px] animate-blob animation-delay-2000 mix-blend-multiply" />
        <div className="absolute bottom-[-10%] left-[20%] w-[60%] h-[60%] rounded-full bg-pink-200/20 blur-[150px] animate-blob animation-delay-4000 mix-blend-multiply" />
      </div>

      <motion.div className="fixed top-0 left-0 right-0 h-1.5 bg-gradient-to-r from-blue-400/50 via-indigo-400/50 to-purple-400/50 origin-left z-[60]" style={{ scaleX }} />

      <Navbar />
      <Hero />
      <Features />
      <DetailedBreakdown />
      <HowItWorks />
      <CTA />
      <Footer />
    </div>
  );
};

// --- Magnetic Effect Wrapper ---
const MagneticButton = ({ children, className = "" }: { children: React.ReactNode, className?: string }) => {
  const ref = useRef<HTMLDivElement>(null);
  const [position, setPosition] = useState({ x: 0, y: 0 });

  const handleMouse = (e: React.MouseEvent) => {
    const { clientX, clientY } = e;
    const { height, width, left, top } = ref.current!.getBoundingClientRect();
    const middleX = clientX - (left + width / 2);
    const middleY = clientY - (top + height / 2);
    setPosition({ x: middleX * 0.3, y: middleY * 0.3 });
  };

  const reset = () => {
    setPosition({ x: 0, y: 0 });
  };

  const { x, y } = position;

  return (
    <motion.div
      ref={ref}
      onMouseMove={handleMouse}
      onMouseLeave={reset}
      animate={{ x, y }}
      transition={{ type: "spring", stiffness: 150, damping: 15, mass: 0.1 }}
      className={`inline-block ${className}`}
    >
      {children}
    </motion.div>
  );
};

// --- Sections ---

const Navbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <nav className={`fixed top-0 w-full z-50 transition-all duration-500 ${isScrolled ? 'bg-white/40 backdrop-blur-2xl border-b border-white/20 py-3 shadow-xl shadow-indigo-500/5' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-3 font-black text-2xl tracking-tighter hover:scale-105 transition-transform cursor-pointer group">
          <div className="h-12 w-12 rounded-2xl bg-gradient-to-br from-indigo-600 via-violet-600 to-fuchsia-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20 group-hover:shadow-indigo-500/40 transition-all duration-500 hover:rotate-12">
            <Zap className="h-7 w-7 fill-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-900 via-indigo-900 to-violet-900">ElectroCare</span>
        </div>

        <div className="hidden md:flex items-center gap-10 text-sm font-bold text-slate-700">
          <a href="#features" className="hover:text-indigo-600 transition-colors relative group/link">
            Features
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover/link:w-full" />
          </a>
          <a href="#details" className="hover:text-indigo-600 transition-colors relative group/link">
            Why Us
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover/link:w-full" />
          </a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors relative group/link">
            Process
            <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-indigo-600 transition-all duration-300 group-hover/link:w-full" />
          </a>
          <div className="h-6 w-px bg-slate-200" />
          <Link to="/login" className="text-slate-700 hover:text-indigo-600 transition-all hover:translate-x-1">Log in</Link>
          <MagneticButton>
            <Link to="/register" className="btn-premium">
              Get Started
            </Link>
          </MagneticButton>
        </div>

        <button className="md:hidden p-3 text-slate-700 hover:bg-white/50 rounded-2xl transition-all active:scale-90" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="absolute top-full left-0 w-full bg-white/95 backdrop-blur-xl border-b border-slate-100 p-6 flex flex-col gap-4 md:hidden shadow-xl z-50"
        >
          <a href="#features" className="text-lg font-bold text-slate-700 p-3 hover:bg-indigo-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Features</a>
          <a href="#details" className="text-lg font-bold text-slate-700 p-3 hover:bg-indigo-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Why Us</a>
          <a href="#how-it-works" className="text-lg font-bold text-slate-700 p-3 hover:bg-indigo-50 rounded-xl" onClick={() => setMobileMenuOpen(false)}>Process</a>
          <div className="h-px bg-slate-100 my-2" />
          <Link to="/login" className="text-lg font-bold text-center p-3 text-indigo-600 hover:bg-indigo-50 rounded-xl">Log in</Link>
          <Link to="/register" className="btn-primary justify-center text-center py-4 bg-gradient-to-r from-indigo-600 to-violet-600 text-white rounded-xl font-bold shadow-lg shadow-indigo-500/30">Get Started Now</Link>
        </motion.div>
      )}
    </nav>
  );
};

const Hero = () => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = (e: React.MouseEvent) => {
    const { clientX, clientY, currentTarget } = e;
    const { width, height, left, top } = currentTarget.getBoundingClientRect();
    const x = clientX - left;
    const y = clientY - top;
    mouseX.set(x);
    mouseY.set(y);
  };

  return (
    <section className="pt-24 pb-20 lg:pt-32 lg:pb-40 overflow-hidden relative" onMouseMove={handleMouseMove}>
      {/* Animated Aurora Background purely for Hero */}
      <div className="absolute inset-0 -z-10 bg-[#f8fafc] overflow-hidden">
        <motion.div
          className="absolute -inset-[100px] opacity-20 blur-[100px]"
          style={{
            background: useMotionTemplate`radial-gradient(circle at ${mouseX}px ${mouseY}px, rgba(79, 70, 229, 0.4) 0%, rgba(124, 58, 237, 0.2) 25%, transparent 50%)`
          }}
        />
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-full bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-indigo-100/50 via-transparent to-transparent" />
      </div>

      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, type: "spring" }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium text-indigo-700 text-xs font-black uppercase tracking-[0.2em] mb-10 shadow-xl shadow-indigo-500/10 border-indigo-200/50"
        >
          <span className="relative flex h-2 w-2">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-indigo-600"></span>
          </span>
          Next-Gen Home Service
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="text-6xl md:text-8xl lg:text-[9rem] font-black tracking-[-0.05em] text-slate-950 mb-10 leading-[0.85] uppercase italic"
        >
          Fast. Reliable. <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 pb-4 animate-gradient bg-300%">Efficient.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.3 }}
          className="text-xl md:text-2xl text-slate-600 max-w-3xl mx-auto mb-16 leading-relaxed font-medium"
        >
          We've engineered the perfect home service experience. Instant booking, real-time tracking, and <span className="text-indigo-600 font-black glow-indigo">AI diagnostics</span> at your fingertips.
        </motion.p>

        <div className="flex flex-col sm:flex-row items-center justify-center gap-6 mb-32 relative z-20">
          <MagneticButton>
            <Link to="/register" className="h-16 px-10 rounded-2xl bg-slate-950 text-white font-black flex items-center justify-center gap-3 hover:shadow-2xl hover:shadow-indigo-500/40 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto text-lg group">
              Fix it Now <ArrowRight className="w-6 h-6 group-hover:translate-x-1 transition-transform" />
            </Link>
          </MagneticButton>
          <MagneticButton>
            <Link to="/login" className="h-16 px-10 rounded-2xl glass-premium text-slate-900 font-bold flex items-center justify-center gap-3 hover:bg-white transition-all w-full sm:w-auto shadow-xl shadow-slate-200/50 text-lg">
              <PlayCircle className="w-6 h-6 text-indigo-600" /> Watch Demo
            </Link>
          </MagneticButton>
        </div>

        {/* =========================================
           RESPONSIVE 3D APP PREVIEW
        ========================================= */}
        <div className="relative max-w-6xl mx-auto">

          {/* ================= DESKTOP VERSION ================= */}
          <div className="hidden lg:block perspective-[2000px]">
            <motion.div
              initial={{ opacity: 0, rotateX: 18, y: 100 }}
              animate={{ opacity: 1, rotateX: 8, y: 0 }}
              transition={{ duration: 1.2, type: "spring", stiffness: 40 }}
              whileHover={{ rotateX: 4, rotateY: 2, scale: 1.02 }}
              className="relative will-change-transform rounded-[3rem] bg-slate-950 p-[12px]
                         shadow-[0_40px_80px_-20px_rgba(0,0,0,0.45)]
                         border-[6px] border-slate-900"
            >
              {/* Reflection */}
              <div className="absolute inset-x-0 top-0 h-1/2 bg-gradient-to-b from-white/10 to-transparent rounded-t-[2.5rem]" />

              {/* Screen */}
              <div className="rounded-[2.5rem] overflow-hidden bg-white aspect-[16/10] grid grid-cols-12 shadow-inner">

                {/* Sidebar */}
                <div className="col-span-3 bg-slate-50 border-r p-6 space-y-6 flex flex-col">
                  <div className="w-12 h-12 rounded-xl bg-indigo-600" />
                  {[1, 2, 3].map((i) => (
                    <div key={i} className="h-10 bg-slate-200 rounded-xl" />
                  ))}
                </div>

                {/* Main */}
                <div className="col-span-9 p-8 flex flex-col relative">
                  <div className="h-8 w-48 bg-slate-200 rounded-xl mb-8" />

                  <div className="grid grid-cols-2 gap-6 mb-auto">
                    <div className="h-40 rounded-2xl bg-indigo-600 text-white p-6 shadow-lg">
                      <div className="text-xl font-black">
                        ACCORDING TO YOUR TIME
                      </div>
                      <div className="text-xs opacity-80 uppercase tracking-widest font-bold">
                        Arrival on time
                      </div>
                    </div>

                    <div className="h-40 rounded-2xl bg-white border p-6 shadow">
                      <div className="text-xl font-black">
                        STAY SAFE
                      </div>
                      <div className="text-xs text-slate-400 uppercase tracking-widest font-bold">
                        OTP Secure Closure
                      </div>
                    </div>
                  </div>

                  <div className="absolute bottom-8 right-8 bg-white border p-4 rounded-xl shadow flex gap-3 items-center">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center">
                      <Bot className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="font-bold text-sm">AI Diagnosis</div>
                      <div className="text-xs text-slate-500 italic">
                        Compressor issue detected
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>

          {/* ================= MOBILE VERSION ================= */}
          <div className="block lg:hidden flex justify-center">
            <motion.div
              initial={{ opacity: 0, y: 80 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1 }}
              className="relative w-[280px] rounded-[2.5rem] bg-slate-950 p-[8px]
                         shadow-[0_30px_60px_-20px_rgba(0,0,0,0.5)]
                         border-[5px] border-slate-900"
            >
              {/* Phone Notch */}
              <div className="absolute top-2 left-1/2 -translate-x-1/2 w-24 h-5 bg-slate-900 rounded-full z-10" />

              {/* Screen */}
              <div className="rounded-[2rem] overflow-hidden bg-white aspect-[9/19] p-5 flex flex-col">

                <div className="h-6 w-32 bg-slate-200 rounded-lg mb-6" />

                <div className="h-28 bg-indigo-600 rounded-xl p-4 text-white mb-4 shadow">
                  <div className="font-bold text-sm uppercase italic">
                    Quick Repair
                  </div>
                  <div className="text-[10px] opacity-80 uppercase tracking-tighter">
                    Technician arriving in 25 mins
                  </div>
                </div>

                <div className="h-24 bg-white border rounded-xl p-4 shadow-sm mb-4">
                  <div className="font-bold text-sm uppercase italic">
                    OTP Secure
                  </div>
                  <div className="text-[10px] text-slate-400 uppercase tracking-tighter">
                    Close with verification
                  </div>
                </div>

                <div className="mt-auto bg-white border p-3 rounded-xl shadow flex gap-3 items-center">
                  <div className="w-8 h-8 bg-emerald-500 rounded-lg flex items-center justify-center">
                    <Bot className="w-4 h-4 text-white" />
                  </div>
                  <div className="text-[10px] font-bold leading-tight">
                    AI detected possible compressor fault.
                  </div>
                </div>

              </div>
            </motion.div>
          </div>

          {/* Soft Glow Background */}
          <div className="absolute -top-12 left-1/2 -translate-x-1/2 w-[110%] h-[110%] bg-indigo-500/10 blur-[70px] -z-10 pointer-events-none" />
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-32 md:py-48 relative overflow-hidden">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-4xl mx-auto text-center mb-32">
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full glass-premium text-indigo-600 text-xs font-black uppercase tracking-[0.2em] mb-8"
          >
            Core Technologies
          </motion.div>
          <motion.h2
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-5xl md:text-7xl font-black tracking-[-0.04em] mb-8 text-slate-950 uppercase italic"
          >
            Engineered for <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-fuchsia-600">Top Performance.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl md:text-2xl text-slate-500 leading-relaxed font-medium"
          >
            We didn't just build an app; we built a high-performance infrastructure for your home maintenance.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 md:gap-10 auto-rows-[400px]">
          <BentoCard
            className="md:col-span-2 bg-[#020617] text-white border-white/5"
            light={false}
            icon={<Bot className="w-10 h-10 text-indigo-400" />}
            title="AI PROBLEM FINDER"
            desc="Our proprietary LLM-driven troubleshooter analyzes symptoms with 94% accuracy, predicting parts and labor costs before the tech even arrives."
            visual={
              <div className="absolute inset-0 flex items-center justify-center opacity-40 pointer-events-none">
                <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-30" />
                <div className="w-[600px] h-[600px] bg-indigo-600/20 rounded-full blur-[120px] animate-pulse" />
                <div className="grid grid-cols-8 gap-3 opacity-20 relative z-10 rotate-[15deg] scale-[2]">
                  {Array.from({ length: 40 }).map((_, i) => (
                    <div key={i} className="w-16 h-16 rounded-xl bg-indigo-500/20 border border-indigo-400/30 backdrop-blur-3xl animate-pulse" style={{ animationDelay: `${i * 150}ms` }} />
                  ))}
                </div>
              </div>
            }
          />
          <BentoCard
            title="TRUST PROTOCOL"
            desc="Verified Aadhaar checks and live-photo proof mean you know exactly who's entering your home. No exceptions."
            icon={<Shield className="w-10 h-10 text-emerald-400" />}
            className="bg-white border-slate-100 shadow-2xl shadow-indigo-500/5"
            light={true}
            visual={<div className="absolute -bottom-10 -right-10 opacity-5"><Shield className="w-64 h-64 text-slate-900" /></div>}
          />
          <BentoCard
            className="md:col-span-2 bg-white border-slate-100 shadow-2xl shadow-indigo-500/5 group/map-card"
            light={true}
            icon={<MapPin className="w-10 h-10 text-indigo-600" />}
            title="SMART NEARBY TRACKING"
            desc="Our serverless broadcast system triggers the 20 nearest available pros within seconds. Average arrival time: 32 minutes."
            visual={
              <div className="absolute inset-0 flex items-center justify-center opacity-20 pointer-events-none overflow-hidden">
                <div className="w-[500px] h-[500px] rounded-full border-2 border-indigo-500/20 animate-[ping_4s_ease-in-out_infinite]" />
                <div className="absolute w-[300px] h-[300px] rounded-full border-2 border-indigo-400/30 animate-[ping_4s_ease-in-out_infinite_1s]" />
                <div className="absolute w-[700px] h-[700px] rounded-full border-2 border-violet-300/10 animate-[ping_5s_ease-in-out_infinite_2s]" />
                <MapPin className="absolute w-24 h-24 text-indigo-600 group-hover/map-card:scale-125 transition-transform duration-700" />
              </div>
            }
          />
          <BentoCard
            title="OTP CLOSURE"
            desc="The job isn't done until you verify. Final payments are escrowed until secure OTP confirmation."
            icon={<Lock className="w-10 h-10 text-fuchsia-500" />}
            className="bg-slate-950 text-white border-white/5"
            light={false}
            visual={
              <div className="absolute bottom-10 right-10 flex gap-3">
                {[1, 2, 3, 4].map(i => <div key={i} className="w-4 h-4 rounded-full bg-fuchsia-500/50 shadow-[0_0_20px_rgba(217,70,239,0.8)] animate-pulse" />)}
              </div>
            }
          />
          <BentoCard
            className="md:col-span-3 glass-premium border-indigo-100/50"
            title="360° QUALITY ECOSYSTEM"
            desc="We don't just fix appliances; we manage your home's digital twin. History, invoices, and warranties, all stored in one immutable timeline."
            icon={<Cpu className="w-10 h-10 text-violet-600" />}
          />
        </div>
      </div>
    </section>
  );
};

const DetailedBreakdown = () => (
  <section id="details" className="py-48 relative overflow-hidden">
    <div className="absolute inset-0 bg-slate-50/50 -z-10" />
    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-32">
        <h2 className="text-5xl md:text-7xl font-black mb-6 text-slate-950 tracking-[-0.04em] uppercase italic">The Advantage.</h2>
        <div className="h-2 w-32 bg-indigo-600 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center mb-48">
        <div className="order-2 md:order-1 space-y-12">
          <div className="group/item flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-indigo-50 border border-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-xl shadow-indigo-500/5 group-hover/item:bg-indigo-600 group-hover/item:text-white transition-all duration-500 hover:rotate-6">
              <Globe className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-4 text-slate-950 uppercase">Global Infrastructure, Local Precision</h3>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">We use real-time location systems to ensure that when you tap 'Book', every available expert in your 20km radius is notified instantly.</p>
            </div>
          </div>
          <div className="group/item flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-violet-50 border border-violet-100 flex items-center justify-center text-violet-600 shrink-0 shadow-xl shadow-violet-500/5 group-hover/item:bg-violet-600 group-hover/item:text-white transition-all duration-500 hover:rotate-6">
              <Cpu className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-4 text-slate-950 uppercase">Smart Assigning Logic</h3>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">Our system doesn't just find 'a' technician; it finds the *perfect* one based on appliance model, failure type, and historical success rates.</p>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 h-[500px] bg-slate-950 rounded-[3rem] shadow-2xl relative overflow-hidden group">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/20 to-violet-500/20" />
          <div className="absolute inset-0 flex items-center justify-center">
            <div className="w-[80%] h-[80%] border border-white/5 rounded-full animate-[spin_20s_linear_infinite] p-10">
              <div className="w-full h-full border border-white/10 rounded-full animate-[spin_10s_linear_infinite_reverse] p-10">
                <Globe className="w-full h-full text-indigo-500/50" />
              </div>
            </div>
          </div>
          <div className="absolute bottom-12 left-1/2 -translate-x-1/2 px-10 py-4 glass-premium text-white font-black text-xs uppercase tracking-[0.3em] backdrop-blur-3xl border-white/10">
            Real-time Syncing...
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-24 items-center">
        <div className="h-[500px] bg-gradient-to-br from-emerald-500 to-teal-700 rounded-[3rem] shadow-2xl relative overflow-hidden group flex items-center justify-center">
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
          <Shield className="w-48 h-48 text-white drop-shadow-2xl group-hover:scale-110 transition-transform duration-700 animate-pulse" />
          <div className="absolute bottom-12 px-10 py-4 bg-white/10 backdrop-blur-3xl border border-white/20 rounded-2xl text-white font-black text-xs uppercase tracking-[0.3em]">
            Certified Verification
          </div>
        </div>
        <div className="space-y-12">
          <div className="group/item flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-emerald-50 border border-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-xl shadow-emerald-500/5 group-hover/item:bg-emerald-600 group-hover/item:text-white transition-all duration-500 hover:rotate-6">
              <Users className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-4 text-slate-950 uppercase">Trust and Reliability</h3>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">Trust goes both ways. Our marketplace rewards the best technicians AND the most respectful customers with priority matching.</p>
            </div>
          </div>
          <div className="group/item flex items-start gap-6">
            <div className="w-16 h-16 rounded-2xl bg-amber-50 border border-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-xl shadow-amber-500/5 group-hover/item:bg-amber-600 group-hover/item:text-white transition-all duration-500 hover:rotate-6">
              <Award className="w-8 h-8" />
            </div>
            <div>
              <h3 className="text-2xl font-black mb-4 text-slate-950 uppercase">Reward Points System</h3>
              <p className="text-lg text-slate-500 leading-relaxed font-medium">Technicians earn 'Legacy Points' for every successful fix, unlocking better rates and premium job access. Quality is our currency.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => {
  const { scrollYProgress } = useScroll();
  const pathLength = useSpring(scrollYProgress, { stiffness: 100, damping: 30 });

  return (
    <section id="how-it-works" className="py-48 bg-[#fdfdff] relative overflow-hidden">
      <div className="max-w-6xl mx-auto px-6 relative z-10">
        <div className="text-center mb-32">
          <h2 className="text-5xl md:text-7xl font-black tracking-[-0.04em] text-slate-950 uppercase italic mb-6">How it Works.</h2>
          <div className="h-2 w-32 bg-indigo-600 mx-auto rounded-full" />
        </div>

        <div className="relative">
          {/* Connection Path Animation (Desktop Only) */}
          <div className="absolute left-1/2 -translate-x-1/2 top-20 bottom-20 w-[2px] bg-slate-100 hidden md:block">
            <motion.div
              style={{ scaleY: scrollYProgress, originY: 0 }}
              className="w-full h-full bg-indigo-600"
            />
          </div>

          <div className="space-y-48">
            <Step
              num="01"
              title="IDENTIFY"
              desc="Book via geo-location or use our AI diagnostic tool to pinpoint the exact failure point of your appliance."
              align="left"
              gradient="from-indigo-600 to-blue-600"
            />
            <Step
              num="02"
              title="EXECUTE"
              desc="The nearest pro accepts instantly. Track their exact GPS position as they navigate to your coordinates."
              align="right"
              gradient="from-blue-600 to-violet-600"
            />
            <Step
              num="03"
              title="VALIDATE"
              desc="Review digital estimates, authorize repairs, and close the session with a secure 4-digit OTP."
              align="left"
              gradient="from-violet-600 to-fuchsia-600"
            />
          </div>
        </div>
      </div>
    </section>
  );
};

const CTA = () => (
  <section className="py-48 px-6">
    <div className="max-w-7xl mx-auto bg-[#020617] rounded-[4rem] p-16 md:p-32 text-center text-white relative overflow-hidden shadow-[0_50px_100px_-20px_rgba(79,70,229,0.3)] group border border-white/5">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[1000px] h-[1000px] bg-gradient-to-r from-indigo-600/30 to-fuchsia-600/30 rounded-full blur-[120px] group-hover:blur-[150px] transition-all duration-1000" />

      <div className="relative z-10 max-w-4xl mx-auto">
        <h2 className="text-6xl md:text-9xl font-black tracking-[-0.05em] mb-12 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-500 uppercase italic">Fix it Forever.</h2>
        <MagneticButton>
          <Link to="/register" className="inline-flex h-20 px-16 rounded-3xl bg-white text-slate-950 text-2xl font-black items-center justify-center gap-4 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_20px_50px_-10px_rgba(255,255,255,0.4)] group/btn">
            Get Started <ArrowRight className="w-8 h-8 group-hover/btn:translate-x-2 transition-transform" />
          </Link>
        </MagneticButton>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-24 border-t border-slate-100 bg-[#fdfdff] text-center relative overflow-hidden">
    <div className="max-w-7xl mx-auto px-6">
      <div className="flex items-center justify-center gap-3 font-black text-3xl tracking-tighter mb-10">
        <div className="h-12 w-12 rounded-2xl bg-indigo-600 flex items-center justify-center text-white shadow-xl shadow-indigo-500/20">
          <Zap className="h-7 w-7 fill-white" />
        </div>
        ElectroCare
      </div>

      <div className="flex flex-wrap justify-center gap-12 text-sm font-black text-slate-950 uppercase tracking-widest mb-16">
        <Link to="/privacy" className="hover:text-indigo-600 transition-all hover:-translate-y-1">Privacy</Link>
        <Link to="/terms" className="hover:text-indigo-600 transition-all hover:-translate-y-1">Terms</Link>
        <Link to="/contact" className="hover:text-indigo-600 transition-all hover:-translate-y-1">Contact</Link>
        <Link to="/careers" className="hover:text-indigo-600 transition-all hover:-translate-y-1">Careers</Link>
      </div>

      <div className="h-px w-full bg-slate-200/50 mb-12" />

      <div className="flex flex-col md:flex-row items-center justify-between gap-8 text-sm font-bold text-slate-400">
        <p>© 2026 ElectroCare &bull; Home Support Systems</p>

        {/* Developer Credits - Ultra Premium */}
        <div className="flex items-center gap-4 px-8 py-4 rounded-2xl glass-premium border-indigo-50/50 group cursor-default">
          <Code2 className="w-5 h-5 text-indigo-600 group-hover:rotate-12 transition-transform" />
          <span className="text-slate-900 flex items-center gap-2">
            Engineered by
            <span className="font-black text-indigo-600 hover:text-fuchsia-600 transition-colors cursor-pointer">Kailashsinh</span>,
            <span className="font-black text-indigo-600 hover:text-fuchsia-600 transition-colors cursor-pointer">Dhruvill</span> &
            <span className="font-black text-indigo-600 hover:text-fuchsia-600 transition-colors cursor-pointer">Abhay</span>
          </span>
        </div>
      </div>
    </div>
  </footer>
);

// --- Subcomponents ---

interface BentoCardProps {
  className?: string;
  title: string;
  desc: string;
  icon: React.ReactNode;
  light?: boolean;
  visual?: React.ReactNode;
}

const BentoCard = ({ className, title, desc, icon, light = true, visual }: BentoCardProps) => {
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const handleMouseMove = ({ currentTarget, clientX, clientY }: React.MouseEvent) => {
    const { left, top } = currentTarget.getBoundingClientRect();
    mouseX.set(clientX - left);
    mouseY.set(clientY - top);
  };

  return (
    <div
      className={`group relative p-10 rounded-[3rem] border overflow-hidden flex flex-col justify-between transition-all duration-700 hover:shadow-2xl hover:-translate-y-2 ${light ? 'bg-white/40 backdrop-blur-3xl border-slate-200/50 shadow-xl shadow-indigo-500/5' : 'bg-slate-950 border-white/5'} ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Effect */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[3rem] opacity-0 transition duration-500 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
               radial-gradient(
                 800px circle at ${mouseX}px ${mouseY}px,
                 ${light ? 'rgba(99, 102, 241, 0.08)' : 'rgba(255, 255, 255, 0.1)'},
                 transparent 80%
               )
             `,
        }}
      />

      <div className="relative z-10">
        <div className={`w-20 h-20 rounded-2xl flex items-center justify-center mb-8 shadow-2xl transition-all group-hover:scale-110 group-hover:rotate-6 duration-500 ${light ? 'bg-indigo-50 text-indigo-600' : 'bg-white/5 border border-white/10 text-white'}`}>
          {icon}
        </div>
        <h3 className="text-3xl font-black mb-4 tracking-[-0.02em] uppercase italic">{title}</h3>
        <p className={`font-bold leading-relaxed text-lg ${light ? 'text-slate-500' : 'text-slate-400'}`}>{desc}</p>
      </div>
      {visual && <div className="absolute inset-0 z-0 pointer-events-none">{visual}</div>}
    </div>
  );
};

const Step = ({ num, title, desc, align, gradient }: any) => (
  <motion.div
    initial={{ opacity: 0, x: align === 'left' ? -100 : 100 }}
    whileInView={{ opacity: 1, x: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.8, type: "spring" }}
    className={`flex flex-col md:flex-row items-center gap-16 lg:gap-32 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
  >
    <div className={`flex-1 text-center ${align === 'right' ? 'md:text-left' : 'md:text-right'}`}>
      <h3 className={`text-5xl lg:text-7xl font-black mb-8 tracking-[-0.05em] text-transparent bg-clip-text bg-gradient-to-r uppercase italic ${gradient}`}>{title}</h3>
      <p className="text-2xl text-slate-500 leading-relaxed font-bold italic">{desc}</p>
    </div>
    <div className="relative shrink-0 group">
      <div className={`relative z-10 w-32 h-32 rounded-[2.5rem] bg-white border border-slate-100 shadow-2xl flex items-center justify-center text-5xl font-black text-slate-200 group-hover:scale-110 group-hover:text-white transition-all duration-700 group-hover:rotate-12 group-hover:bg-gradient-to-br ${gradient}`}>
        {num}
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-48 h-48 bg-gradient-to-r ${gradient} opacity-20 rounded-full blur-[60px] -z-10 group-hover:opacity-40 transition-all duration-700`} />
    </div>
    <div className="flex-1 hidden md:block" />
  </motion.div>
);

export default LandingPage;