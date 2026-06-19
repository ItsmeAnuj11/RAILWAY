import React, { useState } from 'react';
import { Train, Eye, EyeOff, Moon, Sun } from 'lucide-react';
import TermsModal from './TermsModal';

interface SignupScreenProps {
  onSignup: (name: string, email: string, phone: string, password?: string) => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function SignupScreen({ onSignup, theme, onToggleTheme }: SignupScreenProps) {
  const [activeTab, setActiveTab] = useState('create'); // 'create' or 'login'
  const [showPassword, setShowPassword] = useState(false);
  const [password, setPassword] = useState('');
  const [isTermsModalOpen, setIsTermsModalOpen] = useState(false);
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (activeTab === 'create') {
      onSignup(fullName, email, phone, password);
    } else {
      // For login, we'll just use a default name for now
      onSignup('User', 'user@example.com', 'N/A');
    }
  };

  return (
    <div className="w-full h-full p-8 relative overflow-y-auto bg-transparent">
      <div className="absolute top-4 right-4 flex items-center space-x-2">
        <span className="text-[10px] font-bold text-white/60 uppercase tracking-tighter">
          {theme === 'light' ? 'Dark Mode' : 'Normal Mode'}
        </span>
        <button 
          onClick={onToggleTheme}
          className="w-10 h-10 rounded-full bg-white/20 backdrop-blur-md text-white flex items-center justify-center shadow-lg border border-white/20 hover:scale-110 transition-all"
        >
          {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
        </button>
      </div>
      <div className="flex flex-col items-center mb-6">
        <div className="p-3 rounded-full mb-4 bg-gradient-to-br from-pink-500 to-yellow-300 text-white shadow-lg">
          <Train size={48} />
        </div>
        <h1 className="text-4xl font-bold text-white dark:text-white">RailCare</h1>
        <p className="text-white/80 dark:text-white/70">Your trusted companion for train journeys</p>
      </div>
      <div className="bg-white/20 dark:bg-slate-900/60 backdrop-blur-lg rounded-2xl shadow-lg border border-white/10 dark:border-slate-800">
        <div className="flex border-b border-white/20 dark:border-slate-800">
          <button onClick={() => setActiveTab('create')} className={`w-1/2 py-3 font-semibold text-center rounded-tl-2xl transition-colors ${activeTab === 'create' ? 'text-white bg-white/20 dark:bg-slate-800/50' : 'text-white/70 hover:text-white'}`}>
            Create Account
          </button>
          <button onClick={() => setActiveTab('login')} className={`w-1/2 py-3 font-semibold text-center rounded-tr-2xl transition-colors ${activeTab === 'login' ? 'text-white bg-white/20 dark:bg-slate-800/50' : 'text-white/70 hover:text-white'}`}>
            Login
          </button>
        </div>
        <div className="p-8">
          {activeTab === 'create' ? (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input name="fullName" value={fullName} onChange={(e) => setFullName(e.target.value)} className="w-full px-4 py-2 border border-white/30 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/50 text-white placeholder-white/70 focus:outline-none focus:border-white/80 dark:focus:border-blue-500" type="text" placeholder="Full Name" required />
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-2 border border-white/30 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/50 text-white placeholder-white/70 focus:outline-none focus:border-white/80 dark:focus:border-blue-500" type="tel" placeholder="Phone Number" required />
                <input value={email} onChange={(e) => setEmail(e.target.value)} className="w-full px-4 py-2 border border-white/30 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/50 text-white placeholder-white/70 focus:outline-none focus:border-white/80 dark:focus:border-blue-500" type="email" placeholder="Email" required />
                <div className="relative">
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-white/30 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/50 text-white placeholder-white/70 focus:outline-none focus:border-white/80 dark:focus:border-blue-500 pr-10" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Create Password" 
                    pattern=".{6,}" 
                    title="Password must be at least 6 characters long and include numbers."
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-white/70">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
                <p className="text-xs text-white/70 dark:text-white/40 -mt-2">Password must be 6+ characters and include numbers.</p>
                <div className="flex items-center mt-4">
                  <input id="terms" type="checkbox" className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500" required />
                  <label htmlFor="terms" className="ml-2 block text-sm text-white/80 dark:text-white/70">
                    I agree to the <button type="button" onClick={() => setIsTermsModalOpen(true)} className="font-bold text-white hover:underline">Terms and Conditions</button>
                  </label>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-green-500 to-teal-400 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:from-green-600 hover:to-teal-500 transition duration-300 shadow-lg" type="submit">
                Create Account
              </button>
            </form>
          ) : (
            <form onSubmit={handleSubmit}>
              <div className="space-y-4">
                <input className="w-full px-4 py-2 border border-white/30 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/50 text-white placeholder-white/70 focus:outline-none focus:border-white/80 dark:focus:border-blue-500" type="email" placeholder="Email" required />
                <div className="relative">
                  <input 
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full px-4 py-2 border border-white/30 dark:border-slate-700 rounded-lg bg-white/30 dark:bg-slate-800/50 text-white placeholder-white/70 focus:outline-none focus:border-white/80 dark:focus:border-blue-500 pr-10" 
                    type={showPassword ? 'text' : 'password'} 
                    placeholder="Password" 
                    required 
                  />
                  <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute inset-y-0 right-0 px-3 flex items-center text-white/70">
                    {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
                  </button>
                </div>
              </div>
              <button className="w-full bg-gradient-to-r from-blue-500 to-purple-500 text-white font-bold py-3 px-4 rounded-lg mt-6 hover:from-blue-600 hover:to-purple-600 transition duration-300 shadow-lg" type="submit">
                Login
              </button>
            </form>
          )}
        </div>
      </div>
      {isTermsModalOpen && <TermsModal onClose={() => setIsTermsModalOpen(false)} />}
    </div>
  );
}
