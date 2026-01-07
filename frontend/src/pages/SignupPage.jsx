import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate, Link } from 'react-router-dom';
import { register, reset } from '../features/auth/authSlice'; // Ensure this action exists in your slice
import { Lock, Mail, User, AtSign, ArrowRight, Loader2 } from 'lucide-react';
import toast from 'react-hot-toast';

const SignupPage = () => {
  const [formData, setFormData] = useState({
    fullName: '',
    username: '',
    email: '',
    password: '',
  });

  const { fullName, username, email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      toast.error(message || "Registration failed");
    }

    if (isSuccess || user) {
      toast.success("Account created successfully!");
      navigate('/');
    }

    dispatch(reset());
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    if (!fullName || !username || !email || !password) {
        toast.error("Please fill in all fields");
        return;
    }
    dispatch(register(formData));
  };

  return (
    <div className="min-h-screen w-full flex bg-dark-bg">
      {/* Left Side - Visual (Hidden on mobile) */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-purple-600/10 z-10"></div>
        <div className="z-20 text-center px-12">
            <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-purple-500/30">
                <span className="text-3xl font-bold text-white">P</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">Join ProfitPulse</h2>
            <p className="text-slate-400 text-lg">Start tracking your true profit today. No credit card required for the demo.</p>
        </div>
        {/* Abstract Background Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-dark-bg">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Create an account</h2>
            <p className="mt-2 text-slate-400">Enter your details below to get started.</p>
          </div>

          <form className="mt-8 space-y-5" onSubmit={onSubmit}>
            
            {/* Full Name */}
            <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Full Name</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <User className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="fullName"
                    value={fullName}
                    onChange={onChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-card-bg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="John Doe"
                  />
                </div>
            </div>

            {/* Username */}
            <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Username</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <AtSign className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="text"
                    name="username"
                    value={username}
                    onChange={onChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-card-bg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="johndoe123"
                  />
                </div>
            </div>

            {/* Email */}
            <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Email address</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Mail className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="email"
                    name="email"
                    value={email}
                    onChange={onChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-card-bg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="john@example.com"
                  />
                </div>
            </div>

            {/* Password */}
            <div>
                <label className="text-sm font-medium text-slate-300 mb-1.5 block">Password</label>
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <Lock className="h-5 w-5 text-slate-500" />
                  </div>
                  <input
                    type="password"
                    name="password"
                    value={password}
                    onChange={onChange}
                    required
                    className="block w-full pl-10 pr-3 py-2.5 border border-slate-700 rounded-lg bg-card-bg text-white placeholder-slate-500 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                    placeholder="••••••••"
                  />
                </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-6"
            >
              {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Creating account...
                  </>
              ) : (
                  <>
                    Create Account
                    <ArrowRight className="h-4 w-4" />
                  </>
              )}
            </button>
            
            <p className="text-center text-sm text-slate-400 mt-4">
                Already have an account?{' '}
                <Link to="/login" className="font-medium text-blue-500 hover:text-blue-400 transition-colors">Sign in</Link>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default SignupPage;