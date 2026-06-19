import { useState, useMemo } from 'react';
import { ArrowLeft, Search, MapPin, Coffee, Info, ExternalLink, ShieldCheck, Compass } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Initialize AI

interface StationConciergeScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function StationConciergeScreen({ onBack, isOnline, lang = 'en' }: StationConciergeScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [stationName, setStationName] = useState('');
  const [guide, setGuide] = useState<string | null>(null);
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

  const fetchGuide = async () => {
    if (!stationName.trim()) return;
    if (!isOnline) {
      setError('Internet connection required for AI Concierge.');
      return;
    }
    
    setIsLoading(true);
    setError(null);
    setGuide(null);
    setLoadingText('Scanning station layout...');

    const progressMessages = [
      'Locating waiting halls & amenities...',
      'Mapping exits & transit stands...',
      'Identifying safe night zones...',
      'Checking platform accessibility...',
      'Gathering cloakroom & local hacks...'
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
          body: JSON.stringify({ featureName: 'Station Concierge', searchQuery: stationName })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Provide a detailed AI Concierge guide for "${stationName}" railway station. 
        Focus on these passenger-critical aspects:
        1. **Platform Guide**: Which platforms host main express trains?
        2. **Food & Amenities**: Best places to eat *inside* or *exactly outside* the station. Where is the AC waiting hall?
        3. **Transit Connections**: Where is the taxi stand or nearest Metro entrance? Best exit for the city center?
        4. **Station Hacks**: Is there a cloakroom? Charging points location? Shortest bridge for crossing?
        5. **Safety Tips**: Any specific areas to be careful about at night?
        
        CRITICAL instruction: You MUST respond completely in the ${currentLangName} language. All headings, descriptions, advices, and labels should be in ${currentLangName} so the assistant is fully translated.
        Use Markdown formatting with relevant icons. Make it feel like a helpful local assistant.`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      setGuide(response.text || 'No station details found.');
    } catch (err: any) {
      console.error(err);
      setError('AI Concierge is busy guiding others. Please try again.');
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-emerald-700 to-teal-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">AI Station Concierge</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-emerald-600 dark:text-emerald-400">
            <Compass size={20} />
            <h2 className="font-bold text-sm uppercase tracking-wider">Smart Facility Finder</h2>
          </div>
          
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Stuck at a large junction? Ask the AI Concierge for the best waiting rooms, food stalls, or exit paths for any station.
          </p>

          <div className="flex space-x-2">
            <input 
              type="text" 
              value={stationName}
              onChange={(e) => setStationName(e.target.value)}
              placeholder="e.g. New Delhi or Howrah"
              className="flex-grow bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white"
            />
            <button 
              onClick={fetchGuide}
              disabled={isLoading || !stationName}
              className="bg-emerald-600 text-white p-3 rounded-xl disabled:bg-gray-300 hover:bg-emerald-700 transition"
            >
              {isLoading ? <span className="animate-spin inline-block">⌛</span> : <Search size={20} />}
            </button>
          </div>
        </div>

        {error && (
          <div className="bg-red-50 dark:bg-red-900/20 text-red-600 p-4 rounded-2xl flex items-center mb-6">
            <p className="text-xs font-bold">{error}</p>
          </div>
        )}

        {isLoading && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 text-center flex flex-col items-center">
            <div className="w-12 h-12 border-4 border-emerald-200 border-t-emerald-600 rounded-full animate-spin mb-4"></div>
            <p className="text-sm font-black text-emerald-600 dark:text-emerald-400 animate-pulse">{loadingText}</p>
            <p className="text-[10px] text-gray-400 mt-2 uppercase tracking-widest">Assistant is on it...</p>
          </div>
        )}

        {guide && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 animate-in fade-in zoom-in-95">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{guide}</Markdown>
            </div>
          </div>
        )}

        {!guide && !isLoading && (
          <div className="grid grid-cols-2 gap-3 mt-4">
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
              <Coffee className="mx-auto mb-2 text-amber-500" size={24} />
              <p className="text-[10px] font-bold dark:text-white">Best Food</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
              <ShieldCheck className="mx-auto mb-2 text-blue-500" size={24} />
              <p className="text-[10px] font-bold dark:text-white">Safe Exit</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
              <MapPin className="mx-auto mb-2 text-red-500" size={24} />
              <p className="text-[10px] font-bold dark:text-white">Waiting Halls</p>
            </div>
            <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl border border-gray-100 dark:border-slate-700 text-center">
              <Info className="mx-auto mb-2 text-indigo-500" size={24} />
              <p className="text-[10px] font-bold dark:text-white">Station Tips</p>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
