import { useState, useMemo } from 'react';
import { ArrowLeft, Calculator, FileCheck, Scale, History, RefreshCw, AlertCircle, Sparkles } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// AI Setup

interface RefundAdvisorScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function RefundAdvisorScreen({ onBack, isOnline, lang = 'en' }: RefundAdvisorScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [details, setDetails] = useState('');
  const [result, setResult] = useState<string | null>(null);
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

  const calculateRefund = async () => {
    if (!details.trim() || !isOnline) return;
    setIsLoading(true);

    try {
      const currentLangName = langNames[lang] || 'English';
      
      try {
        fetch((import.meta.env.VITE_API_URL || '') + '/api/searches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featureName: 'Refund Advisor', searchQuery: details })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Analyze this railway delay/cancellation scenario: "${details}". 
        Based on the latest IRCTC/Indian Railways refund rules:
        1. **Eligibility**: Can the user get a full/partial refund?
        2. **Estimated Amount**: Calculate the percentage refund (TDR rules).
        3. **Process**: Exact steps to file TDR or claim refund for this scenario.
        4. **Rights**: Mention any relevant Passenger Charter rights for this delay duration.
        
        CRITICAL instruction: You MUST respond completely in the ${currentLangName} language. All headings, descriptions, advices, and labels should be in ${currentLangName} so the assistant is fully translated.
        Provide a concise, tabular or structured Markdown response with clear icons.`,
        config: { tools: [{ googleSearch: {} }] }
      });

      setResult(response.text || 'Advisor was unable to process policy rules.');
    } catch (err) {
      setResult('Error connecting to Policy AI.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-slate-900 to-slate-800 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">AI Refund Advisor</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-slate-800 dark:text-slate-200">
            <Calculator size={20} />
            <h2 className="font-bold text-sm uppercase tracking-wider">Claims & Policy Pro</h2>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mb-4">
            Describe your situation (e.g., "Train delayed 4 hours", "AC not working", "Lower berth not given to senior citizen") to get instant legal and refund advice.
          </p>
          <textarea 
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="e.g. My train 22442 was cancelled today. I had a 2nd AC ticket. What is the process?"
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm mb-4 focus:ring-2 focus:ring-slate-500 text-gray-800 dark:text-white min-h-[120px]"
          />
          <button 
            onClick={calculateRefund} 
            disabled={isLoading || !details}
            className="w-full bg-slate-900 dark:bg-blue-600 text-white font-bold py-3 rounded-2xl flex items-center justify-center hover:bg-slate-800 transition shadow-lg"
          >
            {isLoading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <div className="flex items-center"><Sparkles size={18} className="mr-2" /> Analyze My Rights</div>}
          </button>
        </div>

        {result && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border-2 border-blue-100 dark:border-blue-900/30 animate-in fade-in slide-in-from-bottom-3">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{result}</Markdown>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 dark:border-slate-700 flex items-center justify-between">
              <div className="flex space-x-3">
                <FileCheck size={16} className="text-emerald-500" />
                <Scale size={16} className="text-amber-500" />
              </div>
              <span className="text-[10px] text-gray-400 font-bold uppercase tracking-widest">Official Policy Analysis</span>
            </div>
          </div>
        )}

        {!result && !isLoading && (
          <div className="grid grid-cols-1 gap-4">
            <div className="p-4 bg-blue-50 dark:bg-blue-900/10 rounded-2xl flex items-center">
              <History className="text-blue-600 mr-3" size={24} />
              <div>
                <h4 className="text-xs font-bold dark:text-white">TDR Rules Explorer</h4>
                <p className="text-[10px] text-gray-500">Auto-calculates penalties and deductions.</p>
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
