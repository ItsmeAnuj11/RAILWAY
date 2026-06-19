import { useState, useMemo } from 'react';
import { ArrowLeft, Map, Compass, Navigation, Layers, RefreshCw, Sparkles, Footprints } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Initialize

interface StationNavigatorScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function StationNavigatorScreen({ onBack, isOnline, lang = 'en' }: StationNavigatorScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [stationName, setStationName] = useState('');
  const [navigationSteps, setNavigationSteps] = useState<string | null>(null);
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

  const fetchNavigation = async () => {
    if (!stationName.trim() || !isOnline) return;
    setIsLoading(true);
    setLoadingText('Querying official station maps...');

    const progressMessages = [
      'Locating FOB (Foot Over Bridges)...',
      'Identifying lift & escalator status...',
      'Mapping platform connectivity...',
      'Optimizing walking routes...'
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
          body: JSON.stringify({ featureName: 'Station Navigator', searchQuery: station })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide an indoor navigation "cheat sheet" for "${stationName}" station. 
        Focus on:
        1. **Shortcuts**: How to cross from Platform 1 to Platform 10 fastest?
        2. **Accessibility**: Where are the ramps and working escalators?
        3. **Exit Strategy**: Best exit for auto-rickshaws vs prepaid taxis.
        4. **Key Landmarks**: How to find the main bookstall or enquiry counter?
        
        CRITICAL instruction: You MUST respond completely in the ${currentLangName} language. All headings, descriptions, advices, and labels should be in ${currentLangName} so the assistant is fully translated.
        Format as a "Map-less Navigation Guide" using clear, directional Markdown.`,
        config: { tools: [{ googleSearch: {} }] }
      });

      setNavigationSteps(response.text || 'Navigation data unavailable.');
    } catch (err) {
      setNavigationSteps('Error mapping station. Please follow physical signage at the station.');
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-teal-700 to-cyan-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">AI Station Navigator</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-teal-100 dark:border-teal-900/20 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-teal-600 dark:text-teal-400">
            <Map size={20} />
            <h2 className="font-bold text-sm uppercase tracking-wider">Indoor Path Finder</h2>
          </div>
          
          <input 
            type="text" 
            value={stationName}
            onChange={(e) => setStationName(e.target.value)}
            placeholder="e.g. Pune City or CST Mumbai"
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl px-4 py-3 text-sm mb-4 focus:ring-2 focus:ring-teal-500 text-gray-800 dark:text-white"
          />
          <button 
            onClick={fetchNavigation}
            disabled={isLoading || !stationName}
            className="w-full bg-teal-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center hover:bg-teal-700 transition"
          >
            {isLoading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <div className="flex items-center"><Navigation size={18} className="mr-2" /> Map My Path</div>}
          </button>
        </div>

        {isLoading && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm text-center">
            <div className="w-12 h-12 border-4 border-teal-100 border-t-teal-600 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-black text-teal-600 dark:text-teal-400 animate-pulse">{loadingText}</p>
          </div>
        )}

        {navigationSteps && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 animate-in zoom-in-95 duration-500">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{navigationSteps}</Markdown>
            </div>
          </div>
        )}

        {!navigationSteps && !isLoading && (
          <div className="grid grid-cols-2 gap-4">
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl text-center border border-gray-50 dark:border-slate-700">
                <Footprints size={24} className="mx-auto mb-2 text-teal-500" />
                <p className="text-[10px] font-bold dark:text-white">Escalator Status</p>
             </div>
             <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl text-center border border-gray-50 dark:border-slate-700">
                <Layers size={24} className="mx-auto mb-2 text-cyan-500" />
                <p className="text-[10px] font-bold dark:text-white">FOB Shortcuts</p>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
