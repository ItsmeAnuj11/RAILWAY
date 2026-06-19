import { MessageSquare, FileText, History, ShieldAlert, CheckSquare, LayoutDashboard, Scale, Grid, Lightbulb, Moon, Sun, Sparkles, Compass, Languages, Calculator, ShieldCheck, Navigation, Wallet, MessageSquareHeart } from 'lucide-react';
import { Screen } from '../App';
import { User } from '../types';
import { translate } from '../translations';

interface HomeScreenProps {
  onNavigate: (screen: Screen) => void;
  user: User | null;
  profileImage: string | null;
  onToggleAdminMode: () => void;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
  lang: string;
  onLangChange: (code: string) => void;
}

const CardButton = ({ onClick, icon: Icon, title, color, lang }: any) => (
  <button onClick={onClick} className={`bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex flex-col items-center justify-center text-center text-gray-700 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-300 border border-transparent dark:border-slate-700 relative`}>
    <div className={`w-14 h-14 rounded-full bg-${color}-100 dark:bg-${color}-900/30 flex items-center justify-center mb-4`}>
      <Icon className={`text-${color}-500 dark:text-${color}-400`} size={28} />
    </div>
    <span className="font-semibold text-[10px] leading-tight uppercase tracking-tight">{translate(title, lang)}</span>
  </button>
);

export default function HomeScreen({ onNavigate, user, profileImage, onToggleAdminMode, theme, onToggleTheme, lang, onLangChange }: HomeScreenProps) {
  return (
    <div className="w-full max-w-md mx-auto h-full flex flex-col p-4 transition-colors duration-300">
      <header className="p-4">
        <div className="flex flex-col space-y-2">
          <div className="flex justify-between items-center">
            <div className="flex items-center">
              {user?.role === 'admin' && (
                <button 
                  onClick={onToggleAdminMode}
                  className="mr-4 w-10 h-10 rounded-full bg-slate-900 text-blue-400 flex items-center justify-center shadow-md hover:bg-slate-800 transition-all border border-slate-700"
                  title="Switch to Admin Dashboard"
                >
                  <LayoutDashboard size={20} />
                </button>
              )}
              <div>
                <p className="text-sm text-gray-500 dark:text-gray-400">{translate("Welcome back,", lang)}</p>
                <h1 className="text-xl font-bold text-gray-800 dark:text-white leading-tight">{user?.name || translate("Guest", lang)}</h1>
              </div>
            </div>
            <div className="flex items-center space-x-2">
              <button 
                onClick={onToggleTheme}
                className="w-10 h-10 rounded-full bg-white dark:bg-slate-800 text-amber-500 dark:text-blue-400 flex items-center justify-center shadow-sm border border-gray-100 dark:border-slate-700 hover:scale-110 transition-all"
              >
                {theme === 'light' ? <Moon size={20} /> : <Sun size={20} />}
              </button>
              <button onClick={() => onNavigate('profile')} className="w-11 h-11 rounded-full bg-gray-200 dark:bg-slate-700 overflow-hidden border-2 border-white dark:border-slate-800 shadow-sm">
                <img src={profileImage || `https://api.dicebear.com/7.x/initials/svg?seed=${user?.name}`} alt="profile" className="w-full h-full object-cover" />
              </button>
            </div>
          </div>
          
          {/* Quick inline language selector */}
          <div className="flex justify-end pt-1">
            <div className="relative flex items-center">
              <Languages size={14} className="absolute left-2 text-indigo-500 dark:text-indigo-400 pointer-events-none" />
              <select 
                value={lang}
                onChange={(e) => onLangChange(e.target.value)}
                className="pl-7 pr-7 py-1 text-xs bg-gray-100 dark:bg-slate-800 border-0 rounded-lg text-gray-700 dark:text-gray-200 focus:outline-none focus:ring-1 focus:ring-indigo-500 cursor-pointer appearance-none text-right font-medium"
              >
                <option value="en">English</option>
                <option value="hi">हिन्दी</option>
                <option value="ta">தமிழ்</option>
                <option value="te">తెలుగు</option>
                <option value="bn">বাংলা</option>
                <option value="mr">मराठी</option>
                <option value="gu">ગુજરાતી</option>
                <option value="kn">ಕನ್ನಡ</option>
              </select>
              <span className="absolute right-2 text-[10px] text-gray-400 pointer-events-none">▼</span>
            </div>
          </div>
        </div>
      </header>

      <main className="flex-grow p-4">
        <div className="grid grid-cols-2 gap-4 pb-12">
          {/* Operational Features */}
          <CardButton onClick={() => onNavigate('complaint')} icon={FileText} title="Raise Case" color="green" lang={lang} />
          <CardButton onClick={() => onNavigate('complaint-history')} icon={History} title="View History" color="purple" lang={lang} />
          <CardButton onClick={() => onNavigate('chatbot')} icon={MessageSquare} title="RailBot AI" color="blue" lang={lang} />
          <CardButton onClick={() => onNavigate('seat-maps')} icon={Grid} title="Seat Maps" color="teal" lang={lang} />
          <CardButton onClick={() => onNavigate('emergency')} icon={ShieldAlert} title="Emergency" color="red" lang={lang} />
          <CardButton onClick={() => onNavigate('passenger-rights')} icon={Scale} title="Rights Info" color="amber" lang={lang} />
          <CardButton onClick={() => onNavigate('checklist')} icon={CheckSquare} title="Checklist" color="emerald" lang={lang} />
          <CardButton onClick={() => onNavigate('feedback')} icon={MessageSquareHeart} title="Feedback" color="pink" lang={lang} />
          <CardButton onClick={() => onNavigate('travel-tips')} icon={Lightbulb} title="Travel Tips" color="slate" lang={lang} />

          {/* AI-First Power Features (Last) */}
          <CardButton onClick={() => onNavigate('smart-journey')} icon={Sparkles} title="Journey AI" color="indigo" lang={lang} />
          <CardButton onClick={() => onNavigate('station-concierge')} icon={Compass} title="AI Concierge" color="emerald" lang={lang} />
          <CardButton onClick={() => onNavigate('bhasha-bot')} icon={Languages} title="BhashaBot AI" color="blue" lang={lang} />
          <CardButton onClick={() => onNavigate('refund-advisor')} icon={Calculator} title="Refund AI" color="slate" lang={lang} />
          <CardButton onClick={() => onNavigate('safety-guard')} icon={ShieldCheck} title="Safety Guard" color="red" lang={lang} />
          <CardButton onClick={() => onNavigate('station-navigator')} icon={Navigation} title="AI Navigator" color="teal" lang={lang} />
          <CardButton onClick={() => onNavigate('budget-planner')} icon={Wallet} title="Budget AI" color="emerald" lang={lang} />
        </div>
      </main>
    </div>
  );
}
