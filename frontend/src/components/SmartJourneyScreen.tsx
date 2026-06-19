import { useState, useMemo } from 'react';
import { ArrowLeft, Search, Sparkles, AlertCircle, ExternalLink, Calendar, FastForward, CheckCircle2 } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Initialize

interface SmartJourneyScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function SmartJourneyScreen({ onBack, isOnline, lang = 'en' }: SmartJourneyScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [trainNumber, setTrainNumber] = useState('');
  const [insight, setInsight] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('');
  const [error, setError] = useState<string | null>(null);

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

  const fetchInsight = async () => {
    if (!trainNumber.trim()) return;
    if (!isOnline) {
      setError('Internet connection required for AI insights.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setInsight(null);
    setLoadingText('Searching for train history...');

    const progressMessages = [
      'Collecting punctuality trends...',
      'Analyzing cleanliness reports...',
      'Fetching food & pantry secrets...',
      'Identifying route hacks & tips...',
      'Synthesizing passenger advice...'
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
          body: JSON.stringify({ featureName: 'Smart Journey AI', searchQuery: trainNumber })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze the train number/name: "${trainNumber}". 
        Provide a "Smart Journey Profile" with the following specific details based on real-world data and user experiences:
        1. **Punctuality Rating**: How often is it delayed?
        2. **Cleanliness & Maintenance**: General state of the train.
        3. **Hidden Quirks/Tips**: Does it reverse at any station? Which side has better views? Any specific coach secrets?
        4. **Food Strategy**: Is the pantry good? Best station for ordering food?
        5. **Crowd Prediction**: Usual rush patterns.
        
        CRITICAL instruction: You MUST respond completely in the ${currentLangName} language. All headings, descriptions, advices, and labels should be in ${currentLangName} so the assistant is fully translated.
        Format the response in clear Markdown with icons and headings. Be concise but insightful.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setInsight(response.text || 'No insights found for this train.');
    } catch (err: any) {
      console.error(err);
      setError('High demand. Please try again in a moment.');
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-700 to-indigo-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Smart Journey AI</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-indigo-600 dark:text-indigo-400">
            <Sparkles size={20} />
            <h2 className="font-bold text-sm uppercase tracking-wider">AI Journey Analyzer</h2>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Enter a train number or name to get AI-powered insights, punctuality trends, and travel "hacks" specifically for that route.
          </p>

          <div className="flex space-x-2">
            <input 
              type="text" 
              value={trainNumber}
              onChange={(e) => setTrainNumber(e.target.value)}
              placeholder="e.g. 12124 or Deccan Queen"
              className="flex-grow bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-indigo-500 text-gray-800 dark:text-white"
            />
            <button 
              onClick={fetchInsight}
              disabled={isLoading || !trainNumber}
              className="bg-indigo-600 text-white p-3 rounded-xl disabled:bg-gray-300 hover:bg-indigo-700 transition"
            >
              {isLoading ? <RefreshCw className="animate-spin" size={20} /> : <Search size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-2xl flex items-center mb-6">
            <AlertCircle size={20} className="mr-3 shrink-0" />
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-black text-indigo-600 dark:text-indigo-400 animate-pulse">{loadingText}</p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">AI is thinking...</p>
          </div>
        )}

        {insight && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-4">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{insight}</Markdown>
            </div>
          </div>
        )}

        {!insight && !isLoading && (
          <div className="grid grid-cols-1 gap-4 mt-4">
            <div className="bg-indigo-50 dark:bg-indigo-900/20 p-4 rounded-2xl flex items-start">
              <Calendar className="text-indigo-600 mr-3" size={20} />
              <div>
                <h4 className="text-sm font-bold text-indigo-900 dark:text-indigo-300">Punctuality Trends</h4>
                <p className="text-[10px] text-indigo-700 dark:text-indigo-400">AI analyzes historical delays for your specific train.</p>
              </div>
            </div>
            <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex items-start">
              <CheckCircle2 className="text-emerald-600 mr-3" size={20} />
              <div>
                <h4 className="text-sm font-bold text-emerald-900 dark:text-emerald-300">Travel Hacks</h4>
                <p className="text-[10px] text-emerald-700 dark:text-emerald-400">Get tips about seat comfort and station food secrets.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}

const RefreshCw = ({ size, className }: any) => (
  <svg 
    xmlns="http://www.w3.org/2000/svg" 
    width={size} 
    height={size} 
    viewBox="0 0 24 24" 
    fill="none" 
    stroke="currentColor" 
    strokeWidth="2" 
    strokeLinecap="round" 
    strokeLinejoin="round" 
    className={className}
  >
    <path d="M3 12a9 9 0 0 1 9-9 9.75 9.75 0 0 1 6.74 2.74L21 8" />
    <path d="M21 3v5h-5" />
    <path d="M21 12a9 9 0 0 1-9 9 9.75 9.75 0 0 1-6.74-2.74L3 16" />
    <path d="M3 21v-5h5" />
  </svg>
);
