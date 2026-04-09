import { Link } from "react-router";
import { motion } from "motion/react";
import { Ticket, Mail, Lock, User, ArrowRight } from "lucide-react";

export function SignUp() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black px-4">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95, y: -20 }}
        animate={{ opacity: 1, scale: 1, y: 0 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
        className="relative z-10 w-full max-w-md bg-zinc-950 border border-white/20 p-8 sm:p-10 rounded-[2.5rem] shadow-2xl flex flex-col items-center"
      >
        <Link to="/" className="flex items-center gap-2 group mb-8">
          <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center transition-all">
            <Ticket className="w-6 h-6 text-black" />
          </div>
          <span className="text-2xl font-black tracking-widest text-white">
            EVENTIFY
          </span>
        </Link>

        <div className="text-center mb-8">
          <h1 className="text-2xl font-bold text-white mb-2 uppercase">Create Account</h1>
          <p className="text-sm text-slate-400 font-medium">Join the ultimate event experience</p>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={e => e.preventDefault()}>
          
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              placeholder="Full Name" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input 
              type="email" 
              placeholder="Email address" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input 
              type="password" 
              placeholder="Password" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          <button className="w-full mt-4 group relative flex items-center justify-center gap-2 py-4 bg-white rounded-2xl text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all transform hover:-translate-y-1 overflow-hidden">
            <span className="relative z-10">Sign Up</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
        </form>

        <p className="mt-8 text-sm text-slate-400 font-medium">
          Already have an account? <Link to="/signin" className="text-white font-bold hover:underline">Sign In</Link>
        </p>

      </motion.div>
    </div>
  );
}
