import { useEffect, useState, type FormEvent } from "react";
import { Link, useNavigate, useSearchParams } from "react-router";
import { motion } from "motion/react";
import { Ticket, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useAuth } from "../context/AuthContext";
import { useNotifications } from "../context/NotificationsContext";
import { getApiError } from "../lib/api";

export function SignUp() {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const { isAuthenticated, signUp, user } = useAuth();
  const { pushNotification } = useNotifications();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const redirectTo = searchParams.get("redirect");
  const passwordChecks = getPasswordChecks(password);
  const passwordError = getPasswordError(passwordChecks);

  useEffect(() => {
    if (isAuthenticated && user) {
      navigate(redirectTo || (user.role === "admin" ? "/admin" : "/"), {
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, redirectTo, user]);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");

    if (passwordError) {
      setError(passwordError);
      return;
    }

    setIsSubmitting(true);

    try {
      const signedUpUser = await signUp({ name, email, password });
      pushNotification({
        title: "Account ready",
        body: `Welcome to Eventify, ${signedUpUser.name}.`,
        href: redirectTo || "/library",
      });
      navigate(redirectTo || "/", { replace: true });
    } catch (submitError) {
      setError(getApiError(submitError, "Unable to create your account right now."));
    } finally {
      setIsSubmitting(false);
    }
  }

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

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit}>
          
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input 
              type="text" 
              value={name}
              onChange={(event) => setName(event.target.value)}
              autoComplete="name"
              required
              placeholder="Full Name" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input 
              type="email" 
              value={email}
              onChange={(event) => setEmail(event.target.value)}
              autoComplete="email"
              inputMode="email"
              required
              placeholder="Email address" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input 
              type="password" 
              value={password}
              onChange={(event) => setPassword(event.target.value)}
              autoComplete="new-password"
              required
              placeholder="Password" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          <div className="-mt-1 rounded-2xl border border-white/10 bg-black/40 px-4 py-3">
            <p className="text-xs font-semibold uppercase tracking-[0.2em] text-slate-500">
              Password rules
            </p>
            <div className="mt-3 grid gap-2 text-xs sm:grid-cols-2">
              {passwordChecks.map((check) => (
                <div
                  key={check.label}
                  className={check.valid ? "text-emerald-300" : "text-slate-500"}
                >
                  {check.valid ? "OK" : "NO"} {check.label}
                </div>
              ))}
            </div>
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button
            disabled={isSubmitting}
            className="w-full mt-4 group relative flex items-center justify-center gap-2 py-4 bg-white rounded-2xl text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all transform hover:-translate-y-1 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0"
          >
            <span className="relative z-10">{isSubmitting ? "Creating account..." : "Sign Up"}</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
        </form>

        <p className="mt-8 text-sm text-slate-400 font-medium">
          Already have an account?{" "}
          <Link
            to={redirectTo ? `/signin?redirect=${encodeURIComponent(redirectTo)}` : "/signin"}
            className="text-white font-bold hover:underline"
          >
            Sign In
          </Link>
        </p>

      </motion.div>
    </div>
  );
}

function getPasswordChecks(password: string) {
  return [
    {
      label: "8 to 64 characters",
      valid: password.length >= 8 && password.length <= 64,
    },
    {
      label: "One uppercase letter",
      valid: /[A-Z]/.test(password),
    },
    {
      label: "One lowercase letter",
      valid: /[a-z]/.test(password),
    },
    {
      label: "One number",
      valid: /\d/.test(password),
    },
    {
      label: "No spaces",
      valid: !/\s/.test(password),
    },
  ];
}

function getPasswordError(
  checks: Array<{ label: string; valid: boolean }>,
) {
  const failedChecks = checks.filter((check) => !check.valid).map((check) => check.label);

  if (failedChecks.length === 0) {
    return "";
  }

  return `Password needs: ${failedChecks.join(", ")}.`;
}
