import { useState, useMemo } from 'react';
import { ArrowLeft, Mic, Languages, Send, ShieldCheck, RefreshCw, AlertCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// AI init

interface BhashaBotScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function BhashaBotScreen({ onBack, isOnline, lang = 'en' }: BhashaBotScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [text, setText] = useState('');
  const [translation, setTranslation] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

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

  const [targetLang, setTargetLang] = useState(() => {
    return langNames[lang] || 'Hindi';
  });

  const handleTranslate = async () => {
    if (!text.trim() || !isOnline) return;
    setIsLoading(true);

    try {
      
      try {
        fetch((import.meta.env.VITE_API_URL || '') + '/api/searches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featureName: 'Bhasha Bot', searchQuery: input })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Translate the following text to ${targetLang}. 
        Context: Indian Railways (interacting with TTE, staff, or passengers). 
        Provide the translation, the phonetic pronunciation (in English), and 2-3 essential follow-up phrases in both languages.
        Text: "${text}"`,
      });

      setTranslation(response.text || 'Translation failed.');
    } catch (err) {
      setTranslation('Error in AI translation.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-800 to-indigo-700 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">AI BhashaBot</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-blue-600 rounded-3xl p-6 mb-6 shadow-lg">
          <div className="flex items-center text-blue-100 mb-4 font-bold text-xs">
            <Languages size={16} className="mr-2" />
            REAL-TIME RAILWAY TRANSLATOR
          </div>
          <div className="space-y-4">
            <select 
              value={targetLang}
              onChange={(e) => setTargetLang(e.target.value)}
              className="w-full bg-white/10 text-white border border-white/20 rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-white/50"
            >
              <option className="text-black">Hindi</option>
              <option className="text-black">Tamil</option>
              <option className="text-black">Bengali</option>
              <option className="text-black">Telugu</option>
              <option className="text-black">Marathi</option>
              <option className="text-black">Gujarati</option>
              <option className="text-black">Kannada</option>
              <option className="text-black">English</option>
            </select>
            <textarea 
              value={text}
              onChange={(e) => setText(e.target.value)}
              placeholder="Ask for water, seat change, or ticket help..."
              className="w-full bg-white text-gray-800 rounded-2xl p-4 min-h-[100px] text-sm focus:outline-none"
            />
            <button 
              onClick={handleTranslate}
              disabled={isLoading || !text}
              className="w-full bg-white text-blue-700 font-bold py-3 rounded-2xl flex items-center justify-center hover:bg-blue-50 transition"
            >
              {isLoading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <div className="flex items-center"><Mic size={18} className="mr-2" /> Translate Now</div>}
            </button>
          </div>
        </div>

        {translation && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 animate-in fade-in slide-in-from-bottom-2">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{translation}</Markdown>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex justify-between">
              <span className="text-[10px] items-center flex text-gray-400 font-bold uppercase"><ShieldCheck size={12} className="mr-1 text-blue-500" /> Context Verified</span>
              <button onClick={() => setTranslation(null)} className="text-[10px] text-blue-600 font-bold uppercase">Clear</button>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
