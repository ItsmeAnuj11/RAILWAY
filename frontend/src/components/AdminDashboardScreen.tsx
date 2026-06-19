import { useState, useEffect } from 'react';
import { ArrowLeft, CheckCircle, Clock, AlertCircle, User as UserIcon, Mail, Phone, Hash, Users as UsersIcon, LayoutDashboard, UserCircle, Moon, Sun, Search } from 'lucide-react';
import { Complaint, User } from '../types';
import { Screen } from '../App';

interface AdminDashboardScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  user: User | null;
  profileImage: string | null;
  isOnline: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export default function AdminDashboardScreen({ onBack, onNavigate, user, profileImage, isOnline, theme, onToggleTheme }: AdminDashboardScreenProps) {
  const [complaints, setComplaints] = useState<Complaint[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');

  const fetchComplaints = async () => {
    if (!isOnline) {
      setIsLoading(false);
      return;
    }
    try {
      const response = await fetch('/api/complaints');
      const data = await response.json();
      setComplaints(data);
    } catch (error) {
      console.error('Error fetching complaints:', error);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchComplaints();
  }, [isOnline]);

  const filteredComplaints = complaints.filter(c => 
    (c.pnr && c.pnr.includes(searchQuery)) || 
    (c.userName && c.userName.toLowerCase().includes(searchQuery.toLowerCase())) ||
    (c.type && c.type.toLowerCase().includes(searchQuery.toLowerCase()))
  );

  const updateStatus = async (id: string, status: string) => {
    if (!isOnline) return;
    try {
      await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status }),
      });
      fetchComplaints();
    } catch (error) {
      console.error('Error updating status:', error);
    }
  };

  const sendFeedback = async (id: string, feedback: string) => {
    if (!isOnline) return;
    try {
      await fetch(`/api/complaints/${id}`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ adminFeedback: feedback }),
      });
      fetchComplaints();
      alert('Feedback sent successfully!');
    } catch (error) {
      console.error('Error sending feedback:', error);
    }
  };

  const statusIcons = {
    Pending: <AlertCircle className="text-yellow-500" size={20} />,
    'In Progress': <Clock className="text-blue-500" size={20} />,
    Resolved: <CheckCircle className="text-green-500" size={20} />,
  };

  const stats = {
    total: complaints.length,
    pending: complaints.filter(c => c.status === 'Pending').length,
    inProgress: complaints.filter(c => c.status === 'In Progress').length,
    resolved: complaints.filter(c => c.status === 'Resolved').length,
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-slate-900 text-white p-4 flex items-center justify-between shadow-lg sticky top-0 z-20">
        <div className="flex items-center">
          <button 
            onClick={onBack}
            className="mr-3 w-10 h-10 rounded-full bg-slate-800 text-blue-400 flex items-center justify-center shadow-md hover:bg-slate-700 transition-all border border-slate-700"
            title="Switch to Passenger View"
          >
            <UserCircle size={20} />
          </button>
          <div className="flex items-center">
            <div className="w-10 h-10 rounded-lg bg-blue-500 flex items-center justify-center mr-3">
              <LayoutDashboard size={20} />
            </div>
            <div>
              <h1 className="text-lg font-bold text-blue-400 leading-tight">Admin Console</h1>
              <p className="text-[10px] text-slate-400 uppercase tracking-widest">RailCare Management</p>
            </div>
          </div>
        </div>
        <div className="flex items-center space-x-3">
          <div className="flex flex-col items-end mr-1">
            <span className="text-[10px] font-bold text-slate-500 uppercase tracking-tighter">
              {theme === 'light' ? 'Dark Mode' : 'Normal Mode'}
            </span>
          </div>
          <button 
            onClick={onToggleTheme}
            className="w-10 h-10 rounded-full bg-slate-800 text-amber-500 dark:text-blue-400 flex items-center justify-center shadow-sm border border-slate-700 hover:scale-110 transition-all"
          >
            {theme === 'light' ? <Moon size={18} /> : <Sun size={18} />}
          </button>
          <button onClick={() => onNavigate('profile')} className="w-10 h-10 rounded-full bg-slate-800 overflow-hidden border border-slate-700">
            <img src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="profile" className="w-full h-full object-cover" />
          </button>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        {/* Stats Summary */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-gray-500 dark:text-gray-400 font-bold uppercase">Total</p>
            <p className="text-xl font-black text-slate-800 dark:text-white">{stats.total}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-yellow-600 font-bold uppercase">New</p>
            <p className="text-xl font-black text-yellow-500">{stats.pending}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-blue-600 font-bold uppercase">Active</p>
            <p className="text-xl font-black text-blue-500">{stats.inProgress}</p>
          </div>
          <div className="bg-white dark:bg-slate-800 p-3 rounded-xl shadow-sm border border-gray-100 dark:border-slate-700 text-center">
            <p className="text-[10px] text-green-600 font-bold uppercase">Done</p>
            <p className="text-xl font-black text-green-500">{stats.resolved}</p>
          </div>
        </div>

        <div className="flex justify-between items-center mb-4">
          <h2 className="text-lg font-bold text-gray-800 dark:text-white">Submitted Reports</h2>
          <button onClick={fetchComplaints} className="text-xs text-blue-500 font-bold hover:underline">Refresh</button>
        </div>

        <div className="mb-6 sticky top-0 z-10 py-1 bg-transparent/10 backdrop-blur-sm -mx-1 px-1">
          <div className="relative group">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <Search size={18} className="text-gray-400 group-focus-within:text-blue-500 transition-colors" />
            </div>
            <input 
              type="text" 
              placeholder="Filter by PNR, Passenger Name, or Category..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-gray-200 dark:border-slate-700 focus:outline-none focus:ring-2 focus:ring-blue-500/50 bg-white dark:bg-slate-800 text-gray-800 dark:text-white text-sm shadow-sm transition-all"
            />
          </div>
        </div>

        {isLoading ? (
          <div className="flex justify-center py-10">
            <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-500"></div>
          </div>
        ) : filteredComplaints.length === 0 ? (
          <div className="text-center py-20 text-gray-400 dark:text-gray-500">
            <AlertCircle size={48} className="mx-auto mb-2 opacity-20" />
            <p>No matching reports found.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {filteredComplaints.map((complaint) => (
              <div key={complaint.id} className="bg-white dark:bg-slate-800 rounded-xl shadow-sm overflow-hidden border border-gray-200 dark:border-slate-700">
                <div className="p-4 border-b border-gray-100 dark:border-slate-700 bg-gray-50 dark:bg-slate-700/50 flex justify-between items-center">
                  <div className="flex items-center space-x-2">
                    {statusIcons[complaint.status as keyof typeof statusIcons]}
                    <span className="font-bold text-sm text-gray-700 dark:text-gray-200">{complaint.type}</span>
                  </div>
                  <span className="text-[10px] text-gray-400 dark:text-gray-500 font-mono">{complaint.id.slice(0, 8)}</span>
                </div>

                <div className="p-4 space-y-3">
                  <div className="grid grid-cols-2 gap-2 text-xs">
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <UserIcon size={14} className="mr-1 text-blue-500" />
                      <span className="truncate">{complaint.userName}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Mail size={14} className="mr-1 text-blue-500" />
                      <span className="truncate">{complaint.userEmail}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Phone size={14} className="mr-1 text-blue-500" />
                      <span>{complaint.phone}</span>
                    </div>
                    <div className="flex items-center text-gray-600 dark:text-gray-400">
                      <Hash size={14} className="mr-1 text-blue-500" />
                      <span className="font-bold">PNR: {complaint.pnr}</span>
                    </div>
                  </div>

                  <div className="bg-gray-50 dark:bg-slate-700/50 p-3 rounded-lg text-sm text-gray-700 dark:text-gray-300 italic border-l-2 border-blue-200 dark:border-blue-900">
                    "{complaint.description}"
                  </div>

                  {/* Feedback Section */}
                  <div className="mt-4 space-y-2">
                    <label className="text-[10px] font-bold text-gray-500 dark:text-gray-400 uppercase">Admin Feedback</label>
                    <textarea 
                      defaultValue={complaint.adminFeedback}
                      onBlur={(e) => {
                        if (e.target.value !== complaint.adminFeedback) {
                          sendFeedback(complaint.id, e.target.value);
                        }
                      }}
                      placeholder="Type feedback for user..."
                      className="w-full p-2 text-xs border dark:border-slate-700 rounded-lg focus:outline-none focus:ring-1 focus:ring-blue-500 bg-gray-50 dark:bg-slate-700 text-gray-800 dark:text-white"
                      rows={2}
                    />
                  </div>

                  <div className="flex space-x-2 pt-2">
                    <button 
                      onClick={() => updateStatus(complaint.id, 'In Progress')}
                      className={`flex-grow py-2 rounded-lg text-xs font-bold transition ${complaint.status === 'In Progress' ? 'bg-blue-500 text-white' : 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30'}`}
                    >
                      In Progress
                    </button>
                    <button 
                      onClick={() => updateStatus(complaint.id, 'Resolved')}
                      className={`flex-grow py-2 rounded-lg text-xs font-bold transition ${complaint.status === 'Resolved' ? 'bg-green-500 text-white' : 'bg-green-50 dark:bg-green-900/20 text-green-600 dark:text-green-400 hover:bg-green-100 dark:hover:bg-green-900/30'}`}
                    >
                      Resolve
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </main>
    </div>
  );
}
