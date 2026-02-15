import React, { useRef, useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { motion, useScroll, useSpring, useMotionValue, useTransform, useMotionTemplate } from 'framer-motion';
import {
  Zap, Shield, Clock, ArrowRight,
  Smartphone, MapPin, CheckCircle2, PlayCircle, Menu, X, Code2, Lock, Award, Star, Globe, Cpu, Users
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
    <nav className={`fixed top-0 w-full z-50 transition-all duration-300 ${isScrolled ? 'bg-white/60 backdrop-blur-xl border-b border-indigo-50 py-3 shadow-sm' : 'bg-transparent py-5'}`}>
      <div className="max-w-7xl mx-auto px-6 flex items-center justify-between">
        <div className="flex items-center gap-2 font-bold text-xl tracking-tighter hover:scale-105 transition-transform cursor-pointer group">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20 group-hover:shadow-indigo-500/30 transition-shadow">
            <Zap className="h-6 w-6 fill-white" />
          </div>
          <span className="bg-clip-text text-transparent bg-gradient-to-r from-slate-800 to-indigo-600">ElectroCare</span>
        </div>

        <div className="hidden md:flex items-center gap-8 text-sm font-semibold text-slate-600">
          <a href="#features" className="hover:text-indigo-600 transition-colors">Features</a>
          <a href="#details" className="hover:text-indigo-600 transition-colors">Why Us</a>
          <a href="#how-it-works" className="hover:text-indigo-600 transition-colors">Process</a>
          <div className="h-5 w-px bg-slate-200" />
          <Link to="/login" className="text-slate-600 hover:text-indigo-600 transition-colors">Log in</Link>
          <Link to="/register" className="px-6 py-2.5 bg-gradient-to-r from-indigo-600 to-violet-600 text-white text-sm font-bold rounded-full hover:shadow-lg hover:shadow-indigo-500/30 active:scale-95 duration-200 transform transition-all">
            Get Started
          </Link>
        </div>

        <button className="md:hidden p-2 text-slate-700 hover:bg-white/50 rounded-lg transition-colors" onClick={() => setMobileMenuOpen(!mobileMenuOpen)}>
          {mobileMenuOpen ? <X /> : <Menu />}
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
    <section className="pt-32 pb-20 lg:pt-48 lg:pb-32 overflow-hidden relative" onMouseMove={handleMouseMove}>
      <div className="max-w-7xl mx-auto px-6 text-center relative z-10">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-indigo-100 bg-white/50 backdrop-blur-md text-indigo-700 text-xs font-bold uppercase tracking-wider mb-8 shadow-sm ring-1 ring-white/50"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-indigo-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-indigo-600"></span>
          </span>
          Now Live in India
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
          className="text-5xl md:text-7xl lg:text-8xl font-black tracking-tighter text-slate-900 mb-8 leading-[0.9]"
        >
          Home service, <br />
          <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-violet-600 to-fuchsia-600 pb-2 animate-gradient bg-300%">reimagined.</span>
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="text-lg md:text-xl text-slate-600 max-w-2xl mx-auto mb-10 leading-relaxed font-medium"
        >
          Instant booking via geo-location, real-time technician tracking, and AI-powered appliance diagnostics.
          <span className="text-indigo-600 font-bold"> The smartest way to fix your home.</span>
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="flex flex-col sm:flex-row items-center justify-center gap-4 mb-24"
        >
          <Link to="/register" className="h-14 px-8 rounded-full bg-gradient-to-r from-indigo-600 to-violet-600 text-white font-bold flex items-center justify-center gap-2 hover:shadow-lg hover:shadow-indigo-500/30 transition-all hover:scale-105 active:scale-95 w-full sm:w-auto">
            Book a Service <ArrowRight className="w-5 h-5" />
          </Link>
          <Link to="/login" className="h-14 px-8 rounded-full bg-white/80 backdrop-blur-sm border border-slate-200 text-slate-700 font-bold flex items-center justify-center gap-2 hover:bg-white hover:border-indigo-200 hover:text-indigo-600 transition-all w-full sm:w-auto shadow-sm">
            <PlayCircle className="w-5 h-5" /> How it Works
          </Link>
        </motion.div>

        {/* 3D App Preview - Tablet Style */}
        <div className="relative max-w-5xl mx-auto perspective-1000 group">
          <motion.div
            initial={{ opacity: 0, rotateX: 20, y: 100 }}
            animate={{ opacity: 1, rotateX: 0, y: 0 }}
            transition={{ duration: 1.2, delay: 0.4, type: "spring", stiffness: 50 }}
            whileHover={{ scale: 1.02, rotateX: 5 }}
            className="relative rounded-[2.5rem] bg-slate-900 p-[12px] shadow-2xl shadow-indigo-500/20 border-[6px] border-slate-800 ring-1 ring-white/10"
          >
            {/* Camera/Notch Area */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-32 h-7 bg-slate-900 rounded-b-xl z-20 flex items-center justify-center gap-2 shadow-lg">
              <div className="w-1.5 h-1.5 rounded-full bg-slate-800" />
              <div className="w-12 h-1.5 rounded-full bg-slate-800" />
            </div>

            {/* Screen Content */}
            <div className="rounded-[2rem] overflow-hidden bg-slate-50 aspect-[16/10] relative grid grid-cols-12 gap-4 p-4 sm:p-6 bg-gradient-to-br from-indigo-50 to-violet-50">
              {/* Sidebar (Tablet) */}
              <div className="col-span-3 bg-white/60 backdrop-blur-md rounded-2xl shadow-sm border border-white/50 p-4 space-y-4 hidden md:flex flex-col">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-indigo-400 to-violet-500 mb-4 animate-pulse shadow-md" />
                <div className="h-3 w-24 rounded bg-slate-200/50" />
                <div className="space-y-2 pt-4 flex-1">
                  <div className="h-10 w-full rounded-xl bg-indigo-100 text-indigo-700 flex items-center px-3 text-xs font-bold gap-2 ring-1 ring-indigo-200">
                    <div className="w-4 h-4 rounded bg-indigo-300" /> Dashboard
                  </div>
                  {[1, 2, 3].map(i => (
                    <div key={i} className="h-10 w-full rounded-xl hover:bg-slate-100 flex items-center px-3 text-xs font-bold text-slate-400 gap-2 transition-colors">
                      <div className="w-4 h-4 rounded bg-slate-200" /> Menu {i}
                    </div>
                  ))}
                </div>
              </div>

              {/* Main Content Area */}
              <div className="col-span-12 md:col-span-9 bg-white/70 backdrop-blur-xl rounded-2xl shadow-lg border border-white/60 p-6 relative overflow-hidden flex flex-col">
                <div className="flex justify-between items-center mb-8">
                  <div>
                    <div className="h-8 w-48 rounded-lg bg-slate-200/50 mb-2" />
                    <div className="h-4 w-32 rounded bg-slate-100" />
                  </div>
                  <div className="h-12 w-12 rounded-full bg-slate-100 animate-pulse border border-slate-200" />
                </div>

                <div className="grid grid-cols-2 gap-4 mb-6">
                  <div className="h-40 rounded-2xl bg-gradient-to-br from-indigo-500 to-blue-500 p-5 relative overflow-hidden group/card shadow-lg shadow-indigo-500/20 text-white">
                    <div className="absolute top-0 right-0 p-4 opacity-30"><Shield className="w-20 h-20 text-white group-hover/card:scale-110 transition-transform duration-500" /></div>
                    <div className="relative z-10 h-full flex flex-col justify-end">
                      <div className="font-bold text-lg">Verified Pro</div>
                      <div className="text-indigo-100 text-xs mt-1">Background Checked</div>
                    </div>
                  </div>
                  <div className="h-40 rounded-2xl bg-white border border-slate-100 p-5 relative overflow-hidden group/card shadow-sm hover:shadow-md transition-shadow">
                    <div className="absolute top-0 right-0 p-4 opacity-10"><Clock className="w-20 h-20 text-slate-900 group-hover/card:scale-110 transition-transform duration-500" /></div>
                    <div className="relative z-10 h-full flex flex-col justify-end">
                      <div className="font-bold text-lg text-slate-900">On Time</div>
                      <div className="text-slate-500 text-xs mt-1">Guaranteed Arrival</div>
                    </div>
                  </div>
                </div>

                {/* Floating Notification - Animated */}
                <motion.div
                  initial={{ y: 50, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  transition={{ delay: 1.8, duration: 0.6, type: "spring" }}
                  className="mt-auto bg-slate-900/90 backdrop-blur-md text-white p-4 rounded-xl shadow-2xl flex items-center gap-4 z-30 ring-1 ring-white/20"
                >
                  <div className="h-10 w-10 rounded-full bg-gradient-to-r from-emerald-500 to-green-500 flex items-center justify-center shrink-0 shadow-lg shadow-green-500/30">
                    <CheckCircle2 className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <div className="text-sm font-bold">Technician Arrived</div>
                    <div className="text-xs text-slate-400">Jignesh is at your door</div>
                  </div>
                  <div className="ml-auto text-xs font-mono bg-slate-800 px-2 py-1 rounded text-emerald-400">Now</div>
                </motion.div>
              </div>
            </div>
          </motion.div>

          {/* Decorative Glow Behind */}
          <div className="absolute -inset-4 bg-gradient-to-tr from-indigo-500/20 via-purple-500/20 to-pink-500/20 rounded-[3rem] blur-3xl -z-10 animate-pulse" />
        </div>
      </div>
    </section>
  );
};

const Features = () => {
  return (
    <section id="features" className="py-24 md:py-32 relative">
      <div className="max-w-7xl mx-auto px-6">
        <div className="max-w-3xl mx-auto text-center mb-24">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-6xl font-black tracking-tight mb-6 text-slate-900"
          >
            Built for modern <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">service excellence.</span>
          </motion.h2>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ delay: 0.1 }}
            className="text-xl text-slate-600 leading-relaxed"
          >
            We stripped away the complexity. Real-time data, verified pros, and secure payments.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 auto-rows-[350px]">
          <BentoCard
            className="md:col-span-2 bg-gradient-to-br from-indigo-900 to-slate-900 text-white border-0"
            light={false}
            icon={<MapPin className="w-8 h-8 text-indigo-400" />}
            title="Smart Job Allocator"
            desc="Our geo-spatial algorithm instantly broadcasts requests to the nearest 20km radius of available technicians. Zero wait time."
            visual={
              <div className="absolute inset-0 flex items-center justify-center opacity-30 pointer-events-none mix-blend-screen">
                <div className="w-96 h-96 rounded-full border border-indigo-500/50 animate-[ping_3s_ease-in-out_infinite]" />
                <div className="absolute w-64 h-64 rounded-full border border-indigo-400/50 animate-[ping_3s_ease-in-out_infinite_0.5s]" />
                <MapPin className="absolute w-20 h-20 text-indigo-300 drop-shadow-[0_0_15px_rgba(99,102,241,0.5)]" />
              </div>
            }
          />
          <BentoCard
            title="Secure OTP Verification"
            desc="Jobs are only marked complete when you share your secret OTP code. 100% secure closure."
            icon={<Lock className="w-8 h-8 text-emerald-500" />}
            visual={
              <div className="absolute bottom-6 right-6 pointer-events-none">
                <div className="flex gap-2">
                  {[1, 2, 3, 4].map(i => <div key={i} className="w-3 h-3 rounded-full bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)] animate-bounce" style={{ animationDelay: `${i * 100}ms` }} />)}
                </div>
              </div>
            }
          />
          <BentoCard
            title="Technician Loyalty Program"
            desc="Our pro technicians earn points for every 5-star job. This ensures you always get motivated, high-quality talent."
            icon={<Award className="w-8 h-8 text-amber-500" />}
            className="bg-gradient-to-br from-amber-50 to-orange-50 border-amber-100"
            light={true}
          />
          <BentoCard
            className="md:col-span-2 bg-white/50 backdrop-blur-sm border-purple-100"
            title="Bi-Directional Feedback"
            desc="A fair marketplace where both users and technicians rate each other. This builds a trusted community where quality is rewarded."
            icon={<Star className="w-8 h-8 text-purple-500" />}
          />
        </div>
      </div>
    </section>
  );
};

const DetailedBreakdown = () => (
  <section id="details" className="py-32 bg-white/30 relative overflow-hidden">
    {/* Subtle noise texture for depth */}
    <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-10 pointer-events-none" />

    <div className="max-w-7xl mx-auto px-6 relative z-10">
      <div className="text-center mb-20">
        <h2 className="text-4xl font-black mb-4 text-slate-900">Why ElectroCare is Different</h2>
        <div className="h-1.5 w-24 bg-gradient-to-r from-indigo-500 to-violet-500 mx-auto rounded-full" />
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center mb-32">
        <div className="order-2 md:order-1 space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-blue-100 flex items-center justify-center text-blue-600 shrink-0 shadow-sm">
              <Globe className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Hyper-Local Matching</h3>
              <p className="text-slate-600 leading-relaxed">Unlike traditional aggregators, we use real-time geo-fencing. When you book, we ping technicians within a precise <span className="font-bold text-indigo-600">20km radius</span>. This means faster arrival times and lower travel costs.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-indigo-100 flex items-center justify-center text-indigo-600 shrink-0 shadow-sm">
              <Cpu className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Intelligent Dispatch</h3>
              <p className="text-slate-600 leading-relaxed">Our system filters for availability and skill set automatically. You don't browse lists; you get the best available expert assigned instantly.</p>
            </div>
          </div>
        </div>
        <div className="order-1 md:order-2 h-[400px] bg-gradient-to-br from-indigo-600 to-blue-500 rounded-[2.5rem] shadow-2xl shadow-indigo-500/30 flex items-center justify-center relative overflow-hidden group">
          {/* Decorative Map/Network Visual */}
          <div className="absolute inset-0 opacity-20 bg-[radial-gradient(circle_at_center,_var(--tw-gradient-stops))] from-white to-transparent" />
          <MapPin className="w-32 h-32 text-white drop-shadow-2xl animate-bounce" />
          <div className="absolute bottom-10 px-8 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-sm border border-white/30 shadow-lg">
            Searching within 20km...
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-16 items-center">
        <div className="h-[400px] bg-gradient-to-br from-emerald-500 to-teal-500 rounded-[2.5rem] shadow-2xl shadow-emerald-500/30 flex items-center justify-center relative overflow-hidden group">
          <Shield className="w-32 h-32 text-white drop-shadow-2xl group-hover:scale-110 transition-transform duration-500" />
          <div className="absolute bottom-10 px-8 py-3 bg-white/20 backdrop-blur-md rounded-full text-white font-bold text-sm border border-white/30 shadow-lg">
            100% Verified Professionals
          </div>
        </div>
        <div className="space-y-8">
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-emerald-100 flex items-center justify-center text-emerald-600 shrink-0 shadow-sm">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Community Trust</h3>
              <p className="text-slate-600 leading-relaxed">Safety is paramount. Our unique <span className="font-bold text-emerald-600">Bi-Directional Rating System</span> ensures accountability. Technicians rate customers, and customers rate technicians.</p>
            </div>
          </div>
          <div className="flex items-start gap-4">
            <div className="w-12 h-12 rounded-2xl bg-amber-100 flex items-center justify-center text-amber-600 shrink-0 shadow-sm">
              <Award className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold mb-2 text-slate-900">Loyalty Rewards</h3>
              <p className="text-slate-600 leading-relaxed">Top-performing technicians earn points for excellent service. This incentivizes them to do their best work on your appliance, every single time.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
);

const HowItWorks = () => (
  <section id="how-it-works" className="py-32 bg-white/40 relative overflow-hidden border-t border-slate-100/50">
    <div className="max-w-5xl mx-auto px-6 relative z-10">
      <h2 className="text-4xl font-black tracking-tight text-center mb-20 text-slate-900">Simple by design.</h2>

      <div className="space-y-24">
        <Step
          num="01"
          title="Request"
          desc="Describe your issue. We broadcast it to purely verified local experts instantly."
          align="left"
          gradient="from-blue-500 to-indigo-500"
        />
        <Step
          num="02"
          title="Track"
          desc="See your assigned technician move on the map in real-time. Know exactly when they arrive."
          align="right"
          gradient="from-indigo-500 to-violet-500"
        />
        <Step
          num="03"
          title="Verify"
          desc="Review the estimate, approve work, and close the job securely with your unique OTP."
          align="left"
          gradient="from-violet-500 to-fuchsia-500"
        />
      </div>
    </div>
  </section>
);

const CTA = () => (
  <section className="py-32 px-6">
    <div className="max-w-5xl mx-auto bg-slate-900 rounded-[3rem] p-12 md:p-24 text-center text-white relative overflow-hidden shadow-2xl shadow-indigo-500/30 group">
      <div className="absolute top-0 left-0 w-full h-full bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20" />
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-indigo-500/30 to-purple-500/30 rounded-full blur-[100px] group-hover:blur-[120px] transition-all duration-700" />

      <div className="relative z-10">
        <h2 className="text-5xl md:text-7xl font-black tracking-tighter mb-8 bg-clip-text text-transparent bg-gradient-to-b from-white to-slate-400">Ready to fix it?</h2>
        <Link to="/register" className="inline-flex h-16 px-12 rounded-full bg-white text-indigo-900 text-xl font-bold items-center justify-center gap-2 hover:scale-105 active:scale-95 transition-all duration-300 shadow-[0_0_40px_-10px_rgba(255,255,255,0.4)]">
          Get Started Now
        </Link>
      </div>
    </div>
  </section>
);

const Footer = () => (
  <footer className="py-16 border-t border-slate-100 bg-white/80 backdrop-blur-lg text-center relative overflow-hidden">
    <div className="flex items-center justify-center gap-2 font-bold text-2xl tracking-tighter mb-8">
      <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-indigo-600 to-violet-600 flex items-center justify-center text-white shadow-lg shadow-indigo-500/20">
        <Zap className="h-5 w-5 fill-white" />
      </div>
      ElectroCare
    </div>

    <div className="flex justify-center gap-8 text-sm font-medium text-slate-500 mb-12">
      <Link to="/privacy" className="hover:text-indigo-600 transition-colors">Privacy Policy</Link>
      <Link to="/terms" className="hover:text-indigo-600 transition-colors">Terms & Conditions</Link>
    </div>

    <div className="max-w-md mx-auto h-px bg-slate-200 mb-8" />

    <div className="flex flex-col items-center gap-4 text-sm text-slate-500">
      <p>© 2026 ElectroCare Inc. All rights reserved.</p>

      {/* Developer Credits - Enhanced */}
      <div className="flex items-center gap-3 px-6 py-3 rounded-full bg-white border border-slate-200 shadow-sm hover:shadow-md transition-shadow cursor-default group">
        <div className="p-1.5 bg-indigo-50 rounded-full group-hover:bg-indigo-100 transition-colors">
          <Code2 className="w-3.5 h-3.5 text-indigo-600" />
        </div>
        <span>Crafted by <span className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">Kailashsinh</span> &bull; <span className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">Dhruvill</span> &bull; <span className="text-slate-900 font-bold hover:text-indigo-600 transition-colors">Abhay</span></span>
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
      className={`group relative p-8 rounded-[2.5rem] border overflow-hidden flex flex-col justify-between transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 ${light ? 'bg-white/80 backdrop-blur-sm border-slate-100 shadow-sm' : ''} ${className}`}
      onMouseMove={handleMouseMove}
    >
      {/* Spotlight Effect - Color depends on background */}
      <motion.div
        className="pointer-events-none absolute -inset-px rounded-[2.5rem] opacity-0 transition duration-300 group-hover:opacity-100"
        style={{
          background: useMotionTemplate`
               radial-gradient(
                 650px circle at ${mouseX}px ${mouseY}px,
                 rgba(255, 255, 255, 0.4),
                 transparent 80%
               )
             `,
        }}
      />

      <div className="relative z-10">
        <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 shadow-md transition-transform group-hover:scale-110 duration-300 ${light ? 'bg-indigo-50' : 'bg-white/10 backdrop-blur-md border border-white/20'}`}>
          {icon}
        </div>
        <h3 className="text-2xl font-bold mb-3 tracking-tight">{title}</h3>
        <p className={`font-medium leading-relaxed text-lg ${light ? 'text-slate-500' : 'text-slate-300'}`}>{desc}</p>
      </div>
      {visual && <div className="absolute inset-0 z-0 pointer-events-none">{visual}</div>}
    </div>
  );
};

const Step = ({ num, title, desc, align, gradient }: any) => (
  <motion.div
    initial={{ opacity: 0, y: 40 }}
    whileInView={{ opacity: 1, y: 0 }}
    viewport={{ once: true, margin: "-100px" }}
    transition={{ duration: 0.6 }}
    className={`flex flex-col md:flex-row items-center gap-12 lg:gap-20 ${align === 'right' ? 'md:flex-row-reverse' : ''}`}
  >
    <div className={`flex-1 text-center ${align === 'right' ? 'md:text-left' : 'md:text-right'}`}>
      <h3 className={`text-4xl lg:text-5xl font-black mb-6 tracking-tight text-transparent bg-clip-text bg-gradient-to-r ${gradient}`}>{title}</h3>
      <p className="text-xl text-slate-600 leading-relaxed font-medium">{desc}</p>
    </div>
    <div className="relative shrink-0 group">
      <div className={`relative z-10 w-28 h-28 rounded-3xl bg-white border border-slate-100 shadow-2xl flex items-center justify-center text-4xl font-black text-slate-300 group-hover:scale-110 group-hover:text-white transition-all duration-300 group-hover:bg-gradient-to-br ${gradient}`}>
        {num}
      </div>
      <div className={`absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-40 h-40 bg-gradient-to-r ${gradient} opacity-20 rounded-full blur-3xl -z-10 group-hover:opacity-40 transition-all`} />
    </div>
    <div className="flex-1 hidden md:block" />
  </motion.div>
);

export default LandingPage;
