import React, { useState, useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { login, reset } from '../features/auth/authSlice';
import { Lock, Mail, ArrowRight, Loader2 } from 'lucide-react';

const LoginPage = () => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const { email, password } = formData;

  const navigate = useNavigate();
  const dispatch = useDispatch();

  const { user, isLoading, isError, isSuccess, message } = useSelector(
    (state) => state.auth
  );

  useEffect(() => {
    if (isError) {
      // You could use a toast notification here
      console.error(message);
    }

    if (isSuccess || user) {
      navigate('/');
    }

    return () => {
      dispatch(reset());
    };
  }, [user, isError, isSuccess, message, navigate, dispatch]);

  const onChange = (e) => {
    setFormData((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };

  const onSubmit = (e) => {
    e.preventDefault();
    dispatch(login({ email, password }));
  };

  return (
    <div className="min-h-screen w-full flex bg-dark-bg">
      {/* Left Side - Visual */}
      <div className="hidden lg:flex w-1/2 bg-slate-900 relative overflow-hidden items-center justify-center">
        <div className="absolute inset-0 bg-blue-600/10 z-10"></div>
        <div className="z-20 text-center px-12">
            <div className="w-16 h-16 bg-blue-600 rounded-2xl mx-auto flex items-center justify-center mb-6 shadow-lg shadow-blue-500/30">
                <span className="text-3xl font-bold text-white">P</span>
            </div>
            <h2 className="text-4xl font-bold text-white mb-4">ProfitPulse</h2>
            <p className="text-slate-400 text-lg">Track your true profit in real-time. Integrate Shopify, Meta, and TikTok in seconds.</p>
        </div>
        {/* Abstract Background Circles */}
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-blue-500/20 rounded-full blur-3xl"></div>
        <div className="absolute bottom-1/4 right-1/4 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"></div>
      </div>

      {/* Right Side - Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8">
        <div className="w-full max-w-md space-y-8">
          <div className="text-center lg:text-left">
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome back</h2>
            <p className="mt-2 text-slate-400">Please enter your details to sign in.</p>
          </div>

          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            {isError && (
                <div className="bg-red-500/10 border border-red-500/20 rounded-lg p-3 text-red-400 text-sm">
                    {message}
                </div>
            )}
            
            <div className="space-y-4">
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
                    placeholder="Enter your email"
                  />
                </div>
              </div>

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
            </div>

            <div className="flex items-center justify-between">
               <div className="flex items-center">
                 <input id="remember-me" type="checkbox" className="h-4 w-4 rounded border-slate-700 bg-card-bg text-blue-600 focus:ring-blue-500" />
                 <label htmlFor="remember-me" className="ml-2 block text-sm text-slate-400">Remember me</label>
               </div>
               <div className="text-sm">
                 <a href="#" className="font-medium text-blue-500 hover:text-blue-400">Forgot password?</a>
               </div>
            </div>

            <button
              type="submit"
              disabled={isLoading}
              className="w-full flex justify-center items-center gap-2 py-2.5 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 focus:ring-offset-slate-900 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
            >
              {isLoading ? (
                  <>
                    <Loader2 className="animate-spin h-5 w-5" />
                    Signing in...
                  </>
              ) : (
                  <>
                    Sign in
                    <ArrowRight className="h-4 w-4" />
                  </>
              )}
            </button>
            
            <p className="text-center text-sm text-slate-400">
                Don't have an account?{' '}
                <a href="/register" className="font-medium text-blue-500 hover:text-blue-400">Sign up for free</a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;