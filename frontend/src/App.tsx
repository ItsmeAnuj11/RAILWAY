import { useState, useEffect, useLayoutEffect } from 'react';
import SignupScreen from './components/SignupScreen';
import HomeScreen from './components/HomeScreen';
import ChatbotScreen from './components/ChatbotScreen';
import ComplaintScreen from './components/ComplaintScreen';
import ComplaintHistoryScreen from './components/ComplaintHistoryScreen';
import UserProfileScreen from './components/UserProfileScreen';
import EmergencyScreen from './components/EmergencyScreen';
import ChecklistScreen from './components/ChecklistScreen';
import AdminDashboardScreen from './components/AdminDashboardScreen';
import PassengerRightsScreen from './components/PassengerRightsScreen';
import SeatMapsScreen from './components/SeatMapsScreen';
import TravelTipsScreen from './components/TravelTipsScreen';
import SmartJourneyScreen from './components/SmartJourneyScreen';
import StationConciergeScreen from './components/StationConciergeScreen';
import BhashaBotScreen from './components/BhashaBotScreen';
import RefundAdvisorScreen from './components/RefundAdvisorScreen';
import SafetyGuardScreen from './components/SafetyGuardScreen';
import StationNavigatorScreen from './components/StationNavigatorScreen';
import BudgetPlannerScreen from './components/BudgetPlannerScreen';
import FeedbackScreen from './components/FeedbackScreen';
import { Wifi, WifiOff, RefreshCcw, Moon, Sun, ShieldAlert } from 'lucide-react';

export type Screen = 'signup' | 'home' | 'chatbot' | 'complaint' | 'complaint-history' | 'profile' | 'emergency' | 'checklist' | 'admin' | 'passenger-rights' | 'seat-maps' | 'travel-tips' | 'smart-journey' | 'station-concierge' | 'bhasha-bot' | 'refund-advisor' | 'safety-guard' | 'station-navigator' | 'budget-planner' | 'feedback';

import { Complaint, User } from './types';

export default function App() {
  const [isOnline, setIsOnline] = useState(navigator.onLine);
  const [isSyncing, setIsSyncing] = useState(false);
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    try {
      const saved = localStorage.getItem('railcare_theme');
      if (saved) return saved as 'light' | 'dark';
    } catch (e) {}
    try {
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    } catch (e) {
      return 'light';
    }
  });

  useLayoutEffect(() => {
    localStorage.setItem('railcare_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
      document.body.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
      document.body.classList.remove('dark');
    }
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => prev === 'light' ? 'dark' : 'light');
  };

  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);

    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);

    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  const [user, setUser] = useState<User | null>(() => {
    try {
      const savedUser = localStorage.getItem('railcare_user');
      return (savedUser && savedUser !== 'undefined') ? JSON.parse(savedUser) : null;
    } catch (e) {
      console.error('Error parsing user from localStorage:', e);
      return null;
    }
  });

  const [currentScreen, setCurrentScreen] = useState<Screen>(() => {
    try {
      const savedUser = localStorage.getItem('railcare_user');
      return (savedUser && savedUser !== 'undefined') ? 'home' : 'signup';
    } catch (e) {
      return 'signup';
    }
  });

  const [complaintHistory, setComplaintHistory] = useState<Complaint[]>(() => {
    try {
      const savedComplaints = localStorage.getItem('railcare_complaints');
      return savedComplaints ? JSON.parse(savedComplaints) : [];
    } catch (e) {
      return [];
    }
  });

  const [profileImage, setProfileImage] = useState<string | null>(() => {
    try {
      return localStorage.getItem('railcare_profile_image');
    } catch (e) {
      return null;
    }
  });

  const [adminMode, setAdminMode] = useState(() => {
    try {
      return localStorage.getItem('railcare_admin_mode') === 'true';
    } catch (e) {
      return false;
    }
  });

  const [lang, setLang] = useState<string>(() => {
    try {
      return localStorage.getItem('railcare_lang') || 'en';
    } catch (e) {
      return 'en';
    }
  });

  useEffect(() => {
    localStorage.setItem('railcare_lang', lang);
  }, [lang]);

  useEffect(() => {
    localStorage.setItem('railcare_admin_mode', adminMode.toString());
  }, [adminMode]);

  useEffect(() => {
    if (user) {
      localStorage.setItem('railcare_user', JSON.stringify(user));
    } else {
      localStorage.removeItem('railcare_user');
    }
  }, [user]);

  useEffect(() => {
    localStorage.setItem('railcare_complaints', JSON.stringify(complaintHistory));
  }, [complaintHistory]);

  useEffect(() => {
    if (profileImage) {
      localStorage.setItem('railcare_profile_image', profileImage);
    } else {
      localStorage.removeItem('railcare_profile_image');
    }
  }, [profileImage]);

  useEffect(() => {
    if (isOnline) {
      const syncComplaints = async () => {
        const pending = JSON.parse(localStorage.getItem('railcare_pending_complaints') || '[]');
        if (pending.length === 0) return;

        setIsSyncing(true);
        const syncedIds: string[] = [];

        for (const complaint of pending) {
          try {
            const response = await fetch('/api/complaints', {
              method: 'POST',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify(complaint),
            });
            if (response.ok) {
              syncedIds.push(complaint.id);
            }
          } catch (error) {
            console.error('Sync failed for complaint:', complaint.id);
          }
        }

        const remaining = pending.filter((c: any) => !syncedIds.includes(c.id));
        localStorage.setItem('railcare_pending_complaints', JSON.stringify(remaining));
        setIsSyncing(false);
      };

      syncComplaints();
    }
  }, [isOnline]);

  const [runtimeError, setRuntimeError] = useState<string | null>(null);

  const renderScreen = () => {
    try {
      switch (currentScreen) {
        case 'signup':
          return <SignupScreen 
            onSignup={async (name, email, phone, password) => {
              const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
              if (password) {
                try {
                  await fetch((import.meta.env.VITE_API_URL || '') + '/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: new Date().getTime().toString(), fullName: name, email, phone, password, role })
                  });
                } catch (error) {
                  console.error('Failed to save user to MySQL:', error);
                }
              }
              setUser({ name, email, phone, role });
              setCurrentScreen('home');
            }} 
            theme={theme}
            onToggleTheme={toggleTheme}
          />;
        case 'home':
          if (user?.role === 'admin' && adminMode) {
            return <AdminDashboardScreen 
              onBack={() => setAdminMode(false)} 
              onNavigate={setCurrentScreen}
              user={user}
              profileImage={profileImage}
              isOnline={isOnline}
              theme={theme}
              onToggleTheme={toggleTheme}
            />;
          }
          return <HomeScreen 
            onNavigate={setCurrentScreen} 
            user={user} 
            profileImage={profileImage} 
            onToggleAdminMode={() => setAdminMode(true)}
            theme={theme}
            onToggleTheme={toggleTheme}
            lang={lang}
            onLangChange={setLang}
          />;
        case 'chatbot':
          return <ChatbotScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'complaint':
          return <ComplaintScreen 
            onBack={() => setCurrentScreen('home')} 
            onNavigate={setCurrentScreen} 
            user={user}
            isOnline={isOnline}
            onSubmitComplaint={(complaint) => {
              setComplaintHistory(prev => [...prev, complaint]);
              setCurrentScreen('complaint-history');
            }}
          />;
        case 'complaint-history':
          return <ComplaintHistoryScreen onBack={() => setCurrentScreen('home')} complaints={complaintHistory} />;
        case 'profile':
          return <UserProfileScreen 
            onBack={() => setCurrentScreen('home')} 
            user={user} 
            profileImage={profileImage}
            onProfileImageChange={setProfileImage}
            onUpdateUser={setUser}
            onLogout={() => {
              setUser(null);
              setProfileImage(null);
              setCurrentScreen('signup');
            }}
            onClearCache={() => {
              setComplaintHistory([]);
              setProfileImage(null);
              localStorage.removeItem('railcare_complaints');
              localStorage.removeItem('railcare_pending_complaints');
              localStorage.removeItem('railcare_feedbacks');
              localStorage.removeItem('railcare_checklist');
              localStorage.removeItem('railcare_profile_image');
            }}
          />;
        case 'emergency':
          return <EmergencyScreen onBack={() => setCurrentScreen('home')} />;
        case 'checklist':
          return <ChecklistScreen onBack={() => setCurrentScreen('home')} />;
        case 'smart-journey':
          return <SmartJourneyScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'station-concierge':
          return <StationConciergeScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'bhasha-bot':
          return <BhashaBotScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'refund-advisor':
          return <RefundAdvisorScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'safety-guard':
          return <SafetyGuardScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'station-navigator':
          return <StationNavigatorScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'budget-planner':
          return <BudgetPlannerScreen onBack={() => setCurrentScreen('home')} isOnline={isOnline} lang={lang} />;
        case 'feedback':
          return <FeedbackScreen onBack={() => setCurrentScreen('home')} user={user} onSubmit={(f) => console.log('Feedback submitted:', f)} />;
        case 'passenger-rights':
          return <PassengerRightsScreen onBack={() => setCurrentScreen('home')} />;
        case 'seat-maps':
          return <SeatMapsScreen onBack={() => setCurrentScreen('home')} />;
        case 'travel-tips':
          return <TravelTipsScreen onBack={() => setCurrentScreen('home')} />;
        case 'admin':
          return <AdminDashboardScreen 
            onBack={() => setCurrentScreen('home')} 
            onNavigate={setCurrentScreen}
            user={user}
            profileImage={profileImage}
            isOnline={isOnline}
            theme={theme}
            onToggleTheme={toggleTheme}
          />;
        default:
          return <SignupScreen 
            onSignup={async (name, email, phone, password) => {
              const role = email.toLowerCase().includes('admin') ? 'admin' : 'user';
              if (password) {
                try {
                  await fetch((import.meta.env.VITE_API_URL || '') + '/api/users', {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ id: new Date().getTime().toString(), fullName: name, email, phone, password, role })
                  });
                } catch (error) {
                  console.error('Failed to save user to MySQL:', error);
                }
              }
              setUser({ name, email, phone, role });
              setCurrentScreen('home');
            }} 
            theme={theme}
            onToggleTheme={toggleTheme}
          />;
      }
    } catch (e: any) {
      return (
        <div className="flex flex-col items-center justify-center h-full p-8 text-center text-white">
          <ShieldAlert size={48} className="mb-4" />
          <h2 className="text-xl font-bold mb-2">Something went wrong</h2>
          <p className="text-sm opacity-80 mb-4">{e.message}</p>
          <button 
            onClick={() => {
              localStorage.clear();
              window.location.reload();
            }}
            className="px-4 py-2 bg-white/20 rounded-lg backdrop-blur-md"
          >
            Reset App
          </button>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center font-sans bg-slate-200 dark:bg-slate-900 transition-colors duration-700">
      <div 
        className={`relative w-[375px] h-[667px] border-[10px] border-slate-900 dark:border-slate-800 rounded-[40px] overflow-hidden shadow-2xl transition-all duration-500 
          ${theme === 'light' ? 'bg-gradient-to-br from-purple-600 to-blue-500' : 'bg-gradient-to-br from-slate-900 to-slate-950'}`}
      >
        {/* Connectivity Indicator */}
        <div className={`absolute top-0 left-0 right-0 z-50 flex items-center justify-center py-1 text-[10px] font-bold transition-all duration-500 ${isOnline ? (isSyncing ? 'bg-blue-500 text-white' : 'h-0 overflow-hidden') : 'bg-gray-800 text-white h-6'}`}>
          {!isOnline ? (
            <div className="flex items-center">
              <WifiOff size={10} className="mr-1" />
              OFFLINE MODE
            </div>
          ) : isSyncing ? (
            <div className="flex items-center animate-pulse">
              <RefreshCcw size={10} className="mr-1 animate-spin" />
              SYNCING DATA...
            </div>
          ) : null}
        </div>

        <main className={`relative w-full h-full overflow-y-auto ${(!isOnline || isSyncing) ? 'pt-6' : 'pt-0'} transition-colors duration-300 z-10`}>
          {renderScreen()}
        </main>
      </div>
    </div>
  );
}