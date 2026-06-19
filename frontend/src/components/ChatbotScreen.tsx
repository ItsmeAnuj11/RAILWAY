import { useState, useRef, useEffect, useMemo } from 'react';
import { ArrowLeft, Send, ExternalLink, RefreshCw } from 'lucide-react';
import { Message, Citation } from '../types';
import Markdown from 'react-markdown';
import { GoogleGenAI } from "@google/genai";

// Initialize Gemini AI

interface ChatbotScreenProps {
  onBack: () => void;
  isOnline: boolean;
  lang?: string;
}

const languages = [
  { code: 'en', name: 'English' },
  { code: 'hi', name: 'Hindi' },
  { code: 'ta', name: 'Tamil' },
  { code: 'te', name: 'Telugu' },
  { code: 'bn', name: 'Bengali' },
  { code: 'mr', name: 'Marathi' },
  { code: 'gu', name: 'Gujarati' },
  { code: 'kn', name: 'Kannada' }
];

const ChatbotScreen = ({ onBack, isOnline, lang = 'en' }: ChatbotScreenProps) => {
  const ai = useMemo(() => new GoogleGenAI({ apiKey: import.meta.env.VITE_GEMINI_API_KEY || '' }), []);
  const [messages, setMessages] = useState<Message[]>([
    { sender: 'bot', text: 'Heyy! I am your personal RailBot. I can provide the timing, schedule, and details of any train. Just ask me!' }
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [loadingText, setLoadingText] = useState('Searching...');
  const [selectedLang, setSelectedLang] = useState(lang);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!isOnline) {
      setMessages(prev => {
        if (prev[prev.length - 1].text.includes('offline')) return prev;
        return [...prev, { sender: 'bot', text: '⚠️ You are currently offline. RailBot requires an internet connection to process new queries.' }];
      });
    }
  }, [isOnline]);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (input.trim() === '' || !isOnline) return;

    if (!import.meta.env.VITE_GEMINI_API_KEY) {
      setMessages(prev => [...prev, { sender: 'bot', text: '⚠️ GEMINI_API_KEY is missing. Please add it to your project secrets to use the chatbot.' }]);
      return;
    }

    const userMessage: Message = { text: input, sender: 'user' };
    setMessages((prev) => [...prev, userMessage]);
    setInput('');
    setIsLoading(true);
    setLoadingText('Searching...');

    const progressMessages = [
      'Collecting information...',
      'Analyzing train data...',
      'Verifying schedules...',
      'Formatting response...'
    ];

    let msgIndex = 0;
    const interval = setInterval(() => {
      if (msgIndex < progressMessages.length) {
        setLoadingText(progressMessages[msgIndex]);
        msgIndex++;
      }
    }, 2000);

    try {
      
      try {
        fetch((import.meta.env.VITE_API_URL || '') + '/api/searches', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ featureName: 'Chatbot', searchQuery: input })
        });
      } catch (e) {}

      const response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: `You are an expert railway assistant. Provide extremely detailed information about trains, schedules, platforms, and routes. Use the Google Search tool to ensure you have the latest and most accurate real-world data. Respond in the following language: ${languages.find(l => l.code === selectedLang)?.name || 'English'}. Question: "${input}"`,
        config: {
          tools: [{ googleSearch: {} }]
        }
      });

      const botResponse = response.candidates?.[0];
      const groundingMetadata = botResponse?.groundingMetadata;
      
      const citations: Citation[] = groundingMetadata?.searchEntryPoint?.renderedContent ? [] : []; // Basic fallback

      // More accurate extraction if available
      const chunks = groundingMetadata?.groundingChunks || [];
      const extractedCitations: Citation[] = chunks.map((chunk: any) => ({
        uri: chunk.web?.uri || '',
        title: chunk.web?.title || 'Source'
      })).filter((c: Citation) => c.uri);

      const botMessage: Message = { 
        text: response.text || 'I could not find detailed information for that specific request. Could you please specify the train number or name?', 
        sender: 'bot',
        citations: extractedCitations.length > 0 ? extractedCitations : undefined
      };
      
      setMessages((prev) => [...prev, botMessage]);
    } catch (error: any) {
      console.error('Error fetching from Gemini API:', error);
      const errorMessage: Message = {
        text: `Sorry, I encountered an error: ${error.message || 'Something went wrong'}. Please try again.`,
        sender: 'bot',
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
      clearInterval(interval);
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center">
          <button onClick={onBack} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">RailBot</h1>
        </div>
        <select 
          value={selectedLang}
          onChange={(e) => setSelectedLang(e.target.value)}
          className="bg-white/20 text-white rounded-md px-2 py-1 text-sm focus:outline-none"
          disabled={!isOnline}>
          {languages.map(lang => (
            <option key={lang.code} value={lang.code} className="text-black">{lang.name}</option>
          ))}
        </select>
      </header>

      <div className="flex-grow p-4 overflow-y-auto">
        <div className="space-y-4">
          {messages.map((msg, index) => (
            <div key={index} className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}>
              <div className={`px-4 py-2 rounded-2xl max-w-[85%] shadow-sm ${msg.sender === 'user' ? 'bg-blue-600 text-white' : 'bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200'} ${msg.text.includes('offline') ? 'bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/30 text-amber-800 dark:text-amber-400' : ''}`}>
                <div className={`prose prose-sm max-w-none ${msg.sender === 'user' ? 'prose-invert' : 'prose-slate dark:prose-invert'}`}>
                  <Markdown>{msg.text}</Markdown>
                </div>
              </div>
              {msg.citations && msg.citations.length > 0 && (
                <div className="mt-2 text-xs text-gray-500 dark:text-gray-400">
                  <p className="font-bold mb-1">Sources:</p>
                  <ul className="space-y-1">
                    {msg.citations.map((citation, i) => (
                      <li key={i} className="flex items-start">
                        <a href={citation.uri} target="_blank" rel="noopener noreferrer" className="text-blue-600 dark:text-blue-400 hover:underline flex items-center">
                          <ExternalLink size={12} className="mr-1 shrink-0" />
                          <span className="truncate">{citation.title}</span>
                        </a>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          ))}
          {isLoading && (
            <div className="flex justify-start">
              <div className="px-4 py-2 rounded-2xl bg-white dark:bg-slate-800 text-gray-800 dark:text-gray-200 shadow-md">
                <span className="flex items-center">
                  <span className="w-2 h-2 bg-indigo-500 rounded-full animate-bounce mr-2"></span>
                  {loadingText}
                </span>
              </div>
            </div>
          )}
          <div ref={messagesEndRef} />
        </div>
      </div>

      <div className="p-4 bg-white dark:bg-slate-900 border-t border-gray-200 dark:border-slate-800">
        <div className="flex items-center">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && !isLoading && handleSend()}
            placeholder={isOnline ? "Ask about trains..." : "RailBot is offline"}
            className="flex-grow px-4 py-2 border dark:border-slate-700 rounded-full focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white dark:bg-slate-800 text-gray-800 dark:text-white disabled:bg-gray-50 dark:disabled:bg-slate-950 disabled:text-gray-400"
            disabled={isLoading || !isOnline}
          />
          <button
            onClick={handleSend}
            disabled={isLoading || !isOnline}
            className="ml-3 bg-blue-500 text-white p-3 rounded-full disabled:bg-gray-400 dark:disabled:bg-slate-800 hover:bg-blue-600 transition duration-300 shadow-md"
          >
            <Send size={20} />
          </button>
        </div>
      </div>
    </div>
  );
};

export default ChatbotScreen;
