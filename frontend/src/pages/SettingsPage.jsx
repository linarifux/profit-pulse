import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Sidebar from '../components/layout/Sidebar';
import authService from '../features/auth/authService';
import { User, Lock, Save, Loader2, CheckCircle, AlertCircle } from 'lucide-react';

const SettingsPage = () => {
  const { user } = useSelector((state) => state.auth);
  
  // State for Profile Form
  const [profileData, setProfileData] = useState({
    fullName: user?.fullName || '',
    email: user?.email || '',
  });
  const [profileLoading, setProfileLoading] = useState(false);
  const [profileMessage, setProfileMessage] = useState({ type: '', text: '' });

  // State for Password Form
  const [passwordData, setPasswordData] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [passwordLoading, setPasswordLoading] = useState(false);
  const [passwordMessage, setPasswordMessage] = useState({ type: '', text: '' });

  // -- Handlers --

  const handleProfileUpdate = async (e) => {
    e.preventDefault();
    setProfileLoading(true);
    setProfileMessage({ type: '', text: '' });
    try {
      await authService.updateProfile(profileData);
      setProfileMessage({ type: 'success', text: 'Profile updated successfully!' });
    } catch (error) {
      setProfileMessage({ type: 'error', text: 'Failed to update profile.' });
    } finally {
      setProfileLoading(false);
    }
  };

  const handlePasswordUpdate = async (e) => {
    e.preventDefault();
    if (passwordData.newPassword !== passwordData.confirmPassword) {
        setPasswordMessage({ type: 'error', text: 'New passwords do not match.' });
        return;
    }
    
    setPasswordLoading(true);
    setPasswordMessage({ type: '', text: '' });
    try {
      await authService.changePassword({
          oldPassword: passwordData.oldPassword,
          newPassword: passwordData.newPassword
      });
      setPasswordMessage({ type: 'success', text: 'Password changed successfully!' });
      setPasswordData({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (error) {
      setPasswordMessage({ type: 'error', text: error.response?.data?.message || 'Failed to change password.' });
    } finally {
      setPasswordLoading(false);
    }
  };

  return (
    <div className="flex min-h-screen bg-dark-bg text-white">
      <Sidebar />
      
      <main className="flex-1 ml-64 p-8">
        <header className="mb-8">
            <h1 className="text-2xl font-bold">Settings</h1>
            <p className="text-slate-400 text-sm">Manage your account preferences and security.</p>
        </header>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* 1. Profile Settings Card */}
            <div className="bg-card-bg rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
                    <div className="p-2 bg-blue-500/10 rounded-lg text-blue-400">
                        <User size={20} />
                    </div>
                    <h2 className="text-lg font-bold">Profile Information</h2>
                </div>

                <form onSubmit={handleProfileUpdate} className="space-y-4">
                    {profileMessage.text && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                            profileMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                            {profileMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                            {profileMessage.text}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Full Name</label>
                        <input 
                            type="text" 
                            value={profileData.fullName}
                            onChange={(e) => setProfileData({...profileData, fullName: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={profileData.email}
                            onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={profileLoading}
                            className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
                        >
                            {profileLoading ? <Loader2 className="animate-spin" size={16} /> : <Save size={16} />}
                            Save Changes
                        </button>
                    </div>
                </form>
            </div>

            {/* 2. Security Settings Card */}
            <div className="bg-card-bg rounded-xl border border-slate-700/50 p-6">
                <div className="flex items-center gap-3 mb-6 border-b border-slate-700/50 pb-4">
                    <div className="p-2 bg-purple-500/10 rounded-lg text-purple-400">
                        <Lock size={20} />
                    </div>
                    <h2 className="text-lg font-bold">Security</h2>
                </div>

                <form onSubmit={handlePasswordUpdate} className="space-y-4">
                    {passwordMessage.text && (
                        <div className={`p-3 rounded-lg text-sm flex items-center gap-2 ${
                            passwordMessage.type === 'success' ? 'bg-green-500/10 text-green-400' : 'bg-red-500/10 text-red-400'
                        }`}>
                            {passwordMessage.type === 'success' ? <CheckCircle size={16}/> : <AlertCircle size={16}/>}
                            {passwordMessage.text}
                        </div>
                    )}

                    <div>
                        <label className="block text-sm font-medium text-slate-400 mb-1">Current Password</label>
                        <input 
                            type="password" 
                            value={passwordData.oldPassword}
                            onChange={(e) => setPasswordData({...passwordData, oldPassword: e.target.value})}
                            className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                        />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">New Password</label>
                            <input 
                                type="password" 
                                value={passwordData.newPassword}
                                onChange={(e) => setPasswordData({...passwordData, newPassword: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-slate-400 mb-1">Confirm New</label>
                            <input 
                                type="password" 
                                value={passwordData.confirmPassword}
                                onChange={(e) => setPasswordData({...passwordData, confirmPassword: e.target.value})}
                                className="w-full bg-slate-900 border border-slate-700 rounded-lg px-4 py-2 text-white focus:outline-none focus:border-blue-500"
                            />
                        </div>
                    </div>

                    <div className="pt-4">
                        <button 
                            type="submit" 
                            disabled={passwordLoading}
                            className="flex items-center gap-2 bg-slate-800 hover:bg-slate-700 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors border border-slate-700 disabled:opacity-50"
                        >
                            {passwordLoading ? <Loader2 className="animate-spin" size={16} /> : <Lock size={16} />}
                            Update Password
                        </button>
                    </div>
                </form>
            </div>

        </div>
      </main>
    </div>
  );
};

export default SettingsPage;