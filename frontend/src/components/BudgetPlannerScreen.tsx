import { useState, useMemo } from 'react';
import { ArrowLeft, Wallet, PieChart, TrendingDown, Receipt, RefreshCw, Sparkles, PlusCircle } from 'lucide-react';
import { GoogleGenAI } from "@google/genai";
import Markdown from 'react-markdown';

// Initialize

interface BudgetPlannerScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

export default function BudgetPlannerScreen({ onBack, isOnline, lang = 'en' }: BudgetPlannerScreenProps) {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [tripDetails, setTripDetails] = useState('');
  const [budgetPlan, setBudgetPlan] = useState<string | null>(null);
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

  const fetchBudgetPlan = async () => {
    if (!tripDetails.trim() || !isOnline) return;
    setIsLoading(true);
    setLoadingText('Calculating food & travel costs...');

    const progressMessages = [
      'Finding cheapest pantry meals...',
      'Estimating city-to-station fares...',
      'Reviewing retirement room rates...',
      'Optimizing daily spend limits...'
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
          body: JSON.stringify({ featureName: 'Budget Planner', searchQuery: tripDetails })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `Create a detailed AI Trip Budget for this journey: "${tripDetails}". 
        Include:
        1. **Food Expenses**: Estimated cost of pantry meals or station food for the duration.
        2. **Transit Costs**: Usual auto/taxi/metro rates at the source and destination stations.
        3. **Station Stay**: Pricing for retirement rooms or nearby budget stays.
        4. **Saving Tips**: How to save money on this specific route (e.g., buying water before boarding).
        5. **Emergency Buffer**: Recommended extra cash for this duration.
        
        CRITICAL instruction: You MUST respond completely in the ${currentLangName} language. All headings, descriptions, advices, and labels should be in ${currentLangName} so the assistant is fully translated.
        Format as a professional expense planner with Markdown tables or lists.`,
        config: { tools: [{ googleSearch: {} }] }
      });

      setBudgetPlan(response.text || 'Budget estimation failed.');
    } catch (err) {
      setBudgetPlan('Error planning budget. Please keep a manual record of receipts.');
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-900 transition-colors duration-300">
      <header className="bg-gradient-to-r from-emerald-900 to-green-700 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">AI Budget Planner</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-emerald-100 dark:border-emerald-900/20 mb-6">
          <div className="flex items-center space-x-2 mb-4 text-emerald-600 dark:text-emerald-400">
            <Wallet size={20} />
            <h2 className="font-bold text-sm uppercase tracking-wider">Trip Finance Assistant</h2>
          </div>
          
          <textarea 
            value={tripDetails}
            onChange={(e) => setTripDetails(e.target.value)}
            placeholder="e.g. 3 day trip to Varanasi from Delhi for 2 people"
            className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-2xl p-4 text-sm mb-4 focus:ring-2 focus:ring-emerald-500 text-gray-800 dark:text-white"
          />
          <button 
            onClick={fetchBudgetPlan}
            disabled={isLoading || !tripDetails}
            className="w-full bg-emerald-700 text-white font-bold py-3 rounded-2xl flex items-center justify-center hover:bg-emerald-800 transition shadow-lg"
          >
            {isLoading ? <RefreshCw className="animate-spin mr-2" size={18} /> : <div className="flex items-center"><PieChart size={18} className="mr-2" /> Plan My Budget</div>}
          </button>
        </div>

        {isLoading && (
          <div className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-sm text-center">
            <div className="w-12 h-12 border-4 border-emerald-100 border-t-emerald-700 rounded-full animate-spin mx-auto mb-4"></div>
            <p className="text-sm font-black text-emerald-700 dark:text-emerald-400 animate-pulse">{loadingText}</p>
          </div>
        )}

        {budgetPlan && (
          <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border-2 border-emerald-50 dark:border-emerald-950 animate-in slide-in-from-left-4 duration-500">
            <div className="prose prose-sm dark:prose-invert max-w-none">
              <Markdown>{budgetPlan}</Markdown>
            </div>
          </div>
        )}

        {!budgetPlan && !isLoading && (
          <div className="space-y-4">
             <div className="bg-emerald-50 dark:bg-emerald-900/20 p-4 rounded-2xl flex items-center">
                <TrendingDown className="text-emerald-600 mr-3" size={24} />
                <div>
                  <h4 className="text-xs font-bold dark:text-white">Save More</h4>
                  <p className="text-[10px] text-gray-400">AI finds the best value meals and transit.</p>
                </div>
             </div>
             <div className="bg-blue-50 dark:bg-blue-900/20 p-4 rounded-2xl flex items-center">
                <Receipt className="text-blue-600 mr-3" size={24} />
                <div>
                  <h4 className="text-xs font-bold dark:text-white">Real-world Data</h4>
                  <p className="text-[10px] text-gray-400">Estimated based on current station rates.</p>
                </div>
             </div>
          </div>
        )}
      </main>
    </div>
  );
}
