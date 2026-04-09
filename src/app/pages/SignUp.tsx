<<<<<<< HEAD
<<<<<<< HEAD
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Ticket, Mail, Lock, User, ArrowRight } from "lucide-react";
import { useState, type FormEvent } from "react";
import { useAuth } from "../context/AuthContext";
import { getErrorMessage } from "../lib/api";

export function SignUp() {
  const navigate = useNavigate();
  const { signUp } = useAuth();
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState("");

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError("");
    setIsSubmitting(true);

    try {
      await signUp({ name, email, password });
      navigate("/");
    } catch (submitError) {
      setError(getErrorMessage(submitError, "Unable to create your account right now."));
    } finally {
      setIsSubmitting(false);
=======
=======
>>>>>>> e91372e (initial commit)
import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { Link, useNavigate } from "react-router";
import { motion } from "motion/react";
import { Ticket, Mail, Lock, User, ArrowRight } from "lucide-react";
import { toast } from "sonner";
import { useAuth } from "../context/AuthContext";
import { getApiError, getApiFieldErrors } from "../lib/api";

const signUpSchema = z
  .object({
    name: z
      .string()
      .trim()
      .min(2, "Name must be at least 2 characters long.")
      .max(80, "Name must be 80 characters or fewer."),
    email: z.string().trim().email("Please enter a valid email address."),
    password: z
      .string()
      .regex(
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)\S{8,64}$/,
        "Password must be 8-64 characters, include uppercase, lowercase, and a number, and cannot contain spaces.",
      ),
    confirmPassword: z.string(),
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: "Passwords do not match.",
    path: ["confirmPassword"],
  });

type SignUpFormValues = z.infer<typeof signUpSchema>;

export function SignUp() {
  const navigate = useNavigate();
  const { isAuthenticated, isBootstrapping, signUp, user } = useAuth();
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<SignUpFormValues>({
    resolver: zodResolver(signUpSchema),
    defaultValues: {
      name: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  useEffect(() => {
    if (isBootstrapping || !isAuthenticated || !user) {
      return;
    }

    navigate(user.role === "admin" ? "/admin" : "/", { replace: true });
  }, [isAuthenticated, isBootstrapping, navigate, user]);

  async function onSubmit(values: SignUpFormValues) {
    try {
      const signedUpUser = await signUp({
        name: values.name,
        email: values.email,
        password: values.password,
      });

      toast.success(`Welcome to Eventify, ${signedUpUser.name}.`);
      navigate("/", { replace: true });
    } catch (error) {
      const fieldErrors = getApiFieldErrors(error);

      fieldErrors.forEach(({ field, message }) => {
        if (
          field === "name" ||
          field === "email" ||
          field === "password" ||
          field === "confirmPassword"
        ) {
          setError(field, {
            type: "server",
            message,
          });
        }
      });

      if (fieldErrors.length === 0) {
        setError("root", {
          message: getApiError(error, "Unable to create your account right now."),
        });
      }
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center relative overflow-hidden bg-black px-4">
      <div className="absolute inset-0 z-0 bg-[linear-gradient(rgba(255,255,255,0.03)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.03)_1px,transparent_1px)] bg-[size:40px_40px] pointer-events-none" />

<<<<<<< HEAD
<<<<<<< HEAD
      <motion.div 
=======
      <motion.div
>>>>>>> e91372e (initial commit)
=======
      <motion.div
>>>>>>> e91372e (initial commit)
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
<<<<<<< HEAD
<<<<<<< HEAD
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
              placeholder="Password" 
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>

          {error && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {error}
            </div>
          )}

          <button disabled={isSubmitting} className="w-full mt-4 group relative flex items-center justify-center gap-2 py-4 bg-white rounded-2xl text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all transform hover:-translate-y-1 overflow-hidden disabled:opacity-70 disabled:hover:translate-y-0">
            <span className="relative z-10">{isSubmitting ? "Creating account..." : "Sign Up"}</span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
          
        </form>

        <p className="mt-8 text-sm text-slate-400 font-medium">
          Already have an account? <Link to="/signin" className="text-white font-bold hover:underline">Sign In</Link>
        </p>

=======
=======
>>>>>>> e91372e (initial commit)
          <h1 className="text-2xl font-bold text-white mb-2 uppercase">
            Create Your Account
          </h1>
          <p className="text-sm text-slate-400 font-medium">
            Save events, leave ratings, and publish your own.
          </p>
        </div>

        <form className="w-full flex flex-col gap-4" onSubmit={handleSubmit(onSubmit)}>
          <div className="relative group">
            <User className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input
              {...register("name")}
              type="text"
              placeholder="Full Name"
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>
          {errors.name && <p className="text-sm text-red-400 -mt-2">{errors.name.message}</p>}

          <div className="relative group">
            <Mail className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input
              {...register("email")}
              type="email"
              placeholder="Email address"
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>
          {errors.email && <p className="text-sm text-red-400 -mt-2">{errors.email.message}</p>}

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input
              {...register("password")}
              type="password"
              placeholder="Password"
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>
          {errors.password && (
            <p className="text-sm text-red-400 -mt-2">{errors.password.message}</p>
          )}
          {!errors.password && (
            <p className="text-xs text-slate-500 -mt-2">
              Use 8-64 characters with uppercase, lowercase, and a number. Special
              characters are allowed, but spaces are not.
            </p>
          )}

          <div className="relative group">
            <Lock className="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-slate-500 group-focus-within:text-white transition-colors" />
            <input
              {...register("confirmPassword")}
              type="password"
              placeholder="Confirm Password"
              className="w-full bg-black border border-white/20 rounded-2xl py-4 pl-12 pr-4 text-white placeholder:text-slate-500 outline-none focus:border-white focus:bg-white/5 transition-all"
            />
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-red-400 -mt-2">
              {errors.confirmPassword.message}
            </p>
          )}

          {errors.root && (
            <div className="rounded-2xl border border-red-500/30 bg-red-500/10 px-4 py-3 text-sm text-red-200">
              {errors.root.message}
            </div>
          )}

          <button
            disabled={isSubmitting}
            className="w-full mt-4 group relative flex items-center justify-center gap-2 py-4 bg-white rounded-2xl text-black font-black uppercase tracking-widest hover:bg-slate-200 transition-all transform hover:-translate-y-1 overflow-hidden disabled:opacity-70 disabled:cursor-not-allowed disabled:hover:translate-y-0"
          >
            <span className="relative z-10">
              {isSubmitting ? "Creating account..." : "Sign Up"}
            </span>
            <ArrowRight className="w-4 h-4 relative z-10 group-hover:translate-x-1 transition-transform" />
          </button>
        </form>

        <p className="mt-8 text-sm text-slate-400 font-medium">
          Already have an account?{" "}
          <Link to="/signin" className="text-white font-bold hover:underline">
            Sign In
          </Link>
        </p>
<<<<<<< HEAD
>>>>>>> e91372e (initial commit)
=======
>>>>>>> e91372e (initial commit)
      </motion.div>
    </div>
  );
}
