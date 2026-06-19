import { useState, useRef } from 'react';
import { ArrowLeft, User as UserIcon, Camera, LogOut, ShieldCheck, UserCog, Database, Trash2, HardDrive, CheckCircle } from 'lucide-react';
import { User } from '../types';

interface UserProfileScreenProps {
  onBack: () => void;
  onLogout: () => void;
  user: User | null;
  profileImage: string | null;
  onProfileImageChange: (image: string | null) => void;
  onUpdateUser: (user: User) => void;
  onClearCache?: () => void;
}

export default function UserProfileScreen({ 
  onBack, 
  onLogout, 
  user, 
  profileImage, 
  onProfileImageChange, 
  onUpdateUser,
  onClearCache
}: UserProfileScreenProps) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isCleared, setIsCleared] = useState(false);

  const getCacheDetails = () => {
    const keys = [
      { key: 'railcare_complaints', label: 'Offline Complaints' },
      { key: 'railcare_pending_complaints', label: 'Pending Sync Items' },
      { key: 'railcare_feedbacks', label: 'Saved Feedbacks' },
      { key: 'railcare_checklist', label: 'Travel Checklist' },
      { key: 'railcare_profile_image', label: 'Cached Profile Image' }
    ];

    let totalBytes = 0;
    const items = keys.map(k => {
      try {
        const val = localStorage.getItem(k.key) || '';
        // UTF-16 characters are 2 bytes each in JS string memory
        const bytes = val.length * 2;
        totalBytes += bytes;
        return { label: k.label, bytes };
      } catch (e) {
        return { label: k.label, bytes: 0 };
      }
    });

    return { totalBytes, items };
  };

  const [cacheData, setCacheData] = useState(() => getCacheDetails());

  const formatBytes = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const handleClearCache = () => {
    if (onClearCache) {
      onClearCache();
    } else {
      localStorage.removeItem('railcare_complaints');
      localStorage.removeItem('railcare_pending_complaints');
      localStorage.removeItem('railcare_feedbacks');
      localStorage.removeItem('railcare_checklist');
      localStorage.removeItem('railcare_profile_image');
      onProfileImageChange(null);
    }
    setCacheData(getCacheDetails());
    setIsCleared(true);
    setTimeout(() => {
      setIsCleared(false);
    }, 3000);
  };

  const toggleRole = () => {
    if (!user) return;
    const newRole = user.role === 'admin' ? 'user' : 'admin';
    onUpdateUser({ ...user, role: newRole });
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Your Profile</h1>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="flex flex-col items-center">
          <div className="relative mb-6">
            <div className="w-32 h-32 rounded-full bg-gray-300 dark:bg-slate-800 flex items-center justify-center overflow-hidden border-4 border-white dark:border-slate-700 shadow-lg">
              {profileImage ? (
                <img src={profileImage} alt="Profile" className="w-full h-full object-cover" />
              ) : (
                <UserIcon size={64} className="text-gray-500 dark:text-gray-400" />
              )}
            </div>
            <input 
              type="file" 
              ref={fileInputRef} 
              className="hidden" 
              accept="image/*" 
              onChange={(e) => {
                if (e.target.files && e.target.files[0]) {
                  onProfileImageChange(URL.createObjectURL(e.target.files[0]));
                }
              }}
            />
            <button onClick={() => fileInputRef.current?.click()} className="absolute bottom-0 right-0 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition duration-300 shadow-md">
              <Camera size={20} />
            </button>
            <button 
              onClick={toggleRole} 
              title="Switch Role"
              className={`absolute bottom-0 left-0 p-2 rounded-full transition-all shadow-md ${user?.role === 'admin' ? 'bg-blue-600 text-white' : 'bg-gray-700 dark:bg-slate-700 text-white'}`}
            >
              {user?.role === 'admin' ? <ShieldCheck size={20} /> : <UserCog size={20} />}
            </button>
          </div>

          <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-transparent dark:border-slate-700">
            <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Personal Details</h2>
            <div className="space-y-4">
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Full Name</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{user?.name || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email Address</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{user?.email || 'N/A'}</p>
              </div>
              <div>
                <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Phone Number</label>
                <p className="text-lg text-gray-800 dark:text-gray-200">{user?.phone || 'N/A'}</p>
              </div>
              <div className="pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between items-center">
                <div>
                  <label className="text-xs font-bold uppercase tracking-wider text-gray-400 dark:text-gray-500">Current Role</label>
                  <p className="font-bold text-gray-700 dark:text-gray-300">{user?.role === 'admin' ? 'Administrator' : 'Regular User'}</p>
                </div>
                {user?.role === 'admin' && (
                  <span className="text-[10px] bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 px-2 py-1 rounded-lg font-bold">ADMIN ACCESS</span>
                )}
              </div>
            </div>
          </div>

          {/* Offline Data & Cache Card */}
          <div className="w-full bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-transparent dark:border-slate-700 mt-6 mb-2">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-2">
                <Database size={20} className="text-purple-500" />
                <h2 className="text-lg font-semibold text-gray-800 dark:text-white">Offline Data & Cache</h2>
              </div>
              <span className="text-xs bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400 px-2 py-1 rounded-full font-semibold">
                {formatBytes(cacheData.totalBytes)}
              </span>
            </div>

            <p className="text-sm text-gray-500 dark:text-gray-400 mb-4">
              RailCare saves certain travel helper details and draft complaints inside your browser storage for access when offline.
            </p>

            {/* Cached memory bar */}
            <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden mb-4">
              <div 
                className="bg-purple-500 h-full transition-all duration-500 rounded-full"
                style={{ width: cacheData.totalBytes > 0 ? `${Math.min(100, Math.max(10, (cacheData.totalBytes / 1024) * 100))}%` : '0%' }}
              />
            </div>

            <div className="space-y-3 mb-6">
              {cacheData.items.map((item, index) => (
                <div key={index} className="flex justify-between items-center text-sm">
                  <span className="text-gray-600 dark:text-gray-300 flex items-center space-x-2">
                    <span className="w-1.5 h-1.5 rounded-full bg-purple-400 dark:bg-purple-500" />
                    <span>{item.label}</span>
                  </span>
                  <span className="font-mono text-xs text-gray-500 dark:text-gray-400">
                    {formatBytes(item.bytes)}
                  </span>
                </div>
              ))}
            </div>

            <button
              onClick={handleClearCache}
              disabled={cacheData.totalBytes === 0}
              className={`w-full py-2.5 px-4 rounded-lg font-bold border transition-all duration-300 flex items-center justify-center space-x-2 text-sm ${
                isCleared 
                  ? 'bg-green-500 border-green-500 text-white' 
                  : cacheData.totalBytes === 0
                    ? 'bg-gray-50 dark:bg-slate-800/50 border-gray-200 dark:border-slate-700 text-gray-400 cursor-not-allowed'
                    : 'bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border-red-200 dark:border-red-900/50 hover:bg-red-100 dark:hover:bg-red-900/30 active:scale-[0.98]'
              }`}
            >
              {isCleared ? (
                <>
                  <CheckCircle size={16} className="animate-pulse" />
                  <span>Cache Cleared Successfully</span>
                </>
              ) : (
                <>
                  <Trash2 size={16} />
                  <span>Clear Offline Cache</span>
                </>
              )}
            </button>
          </div>
        </div>
      </main>

      <footer className="p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-slate-800">
        <button onClick={onLogout} className="w-full bg-red-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-red-600 transition duration-300 flex items-center justify-center space-x-3 text-base">
          <LogOut size={20} />
          <span>Logout</span>
        </button>
      </footer>
    </div>
  );
}
