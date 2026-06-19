import { useState, useMemo } from 'react';
import { ArrowLeft, ShieldAlert, Zap, Lock, Eye, AlertTriangle, RefreshCw, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Initialize

interface SafetyGuardScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function SafetyGuardScreen({ onBack, isOnline, lang = 'en' }: SafetyGuardScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [coachDetail, setCoachDetail] = useState('');
  const [safetyReport, setSafetyReport] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');

  const langNames: { [key: string]: string } = {
    en: 'English',
    hi: 'Hindi',
    ta: 'Tamil',
    te: 'Telugu',
    bn: 'Bengali',
    mr: 'Marathi',
    gu: 'Gujarati',
    kn: 'Kannada'
  };

  const fetchSafetyAdvice = async () => {
    if (!coachDetail.trim() || !isOnline) return;
    setIsLoading(true);
    setLoadingText('Analyzing coach security parameters...');

    const progressMessages = [
      'Checking surveillance coverage...',
      'Mapping nearest help points...',
      'Reviewing past safety reports...',
      'Summarizing security protocols...'
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < progressMessages.length) {
        setLoadingText(progressMessages[msgIndex]);
        msgIndex++;
      }
    }, 2000);

    try {
      const currentLangName = langNames[lang] || 'English';
      
      try {
        fetch((import.meta.env.VITE_API_URL || '') + '/api/searches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featureName: 'Safety Guard', searchQuery: pnr })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a detailed AI Safety & Security report for the following train/coach context: "${coachDetail}". 
        Include:
        1. **Coach Safety Rating**: General safety profile based on coach type (General, Sleeper, AC).
        2. **Security Features**: Where are the alarms? Is there RPF presence?
        3. **Night Safety Protocol**: Essential tips for solo travelers or night journeys.
        4. **Emergency Points**: Location of fire extinguishers and hammers in this specific coach type.
        5. **Luggage Security**: How to best secure items in this specific layout.
        
        CRITICAL instruction: You MUST respond completely in the ${currentLangName} language. All headings, descriptions, advices, and labels should be in ${currentLangName} so the assistant is fully translated.
        Use Markdown with clear, urgent icons.`,
        config: { tools: [{ googleSearch: {} }] }
      });

      setSafetyReport(response.text || 'No safety data available.');
    } catch (err) {
      setSafetyReport('Unable to reach security AI. Stay alert and contact 182 for immediate help.');
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-red-700 to-rose-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">AI Safety Guard</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-red-100 dark:border-red-900/20 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-red-600 dark:text-red-400">
            <Lock size={20} />
            <h2 className="font-bold text-sm uppercase tracking-wider">Coach Security Analyzer</h2>
          </div>
          
          <textarea 
            value={coachDetail}
            onChange={(e) => setCoachDetail(e.target.value)}
            placeholder="e.g. 12622 Tamilnadu Express, Coach S5 or 2nd AC"
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm mb-4 focus:ring-2 focus:ring-red-500 text-gray-800 dark:text-white"
          />
          <button 
            onClick={fetchSafetyAdvice}
            disabled={isLoading || !coachDetail}
            className="w-full bg-red-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center hover:bg-red-700 transition"
          >
            {isLoading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <div className="flex items-center"><ShieldAlert size={18} className="mr-2" /> Analyze Security</div>}
          </button>
        </div>

        {isLoading && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm text-center">
            <div className="w-12 h-12 border-4 border-red-100 border-t-red-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-black text-red-600 dark:text-red-400 animate-pulse">{loadingText}</p>
          </div>
        )}

        {safetyReport && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border-l-4 border-red-500 animate-in fade-in slide-in-from-bottom-5">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{safetyReport}</Markdown>
            </div>
          </div>
        )}

        {!safetyReport && !isLoading && (
          <div className="space-y-4">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center space-x-4">
                <Zap size={24} className="text-amber-500" />
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Quick advice for coach safety and solo travel.</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl flex items-center space-x-4">
                <Eye size={24} className="text-blue-500" />
                <p className="text-[10px] text-gray-500 font-medium uppercase tracking-wider">Scans layout for emergency equipment locations.</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
