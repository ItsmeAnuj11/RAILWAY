import React, { useState } from 'react';
import { ArrowLeft, Utensils, Trash2, Clock, Send, Star, CheckCircle2 } from 'lucide-react';
import { User, Feedback } from '../types';

interface FeedbackScreenProps {
  onBack: () => void;
  user: User | null;
  onSubmit: (feedback: Feedback) => void;
}

export default function FeedbackScreen({ onBack, user, onSubmit }: FeedbackScreenProps) {
  const [pnr, setPnr] = useState('');
  const [foodRating, setFoodRating] = useState(0);
  const [cleanRating, setCleanRating] = useState(0);
  const [timeRating, setTimeRating] = useState(0);
  const [comment, setComment] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!user) return;

    const newFeedback: Feedback = {
      id: Math.random().toString(36).substr(2, 9),
      userName: user.name,
      userEmail: user.email,
      pnr,
      foodRating,
      cleanlinessRating: cleanRating,
      punctualityRating: timeRating,
      comment,
      timestamp: new Date().toISOString(),
    };

    // Store in localStorage for now
    const existing = JSON.parse(localStorage.getItem('railcare_feedbacks') || '[]');
    localStorage.setItem('railcare_feedbacks', JSON.stringify([...existing, newFeedback]));
    
    onSubmit(newFeedback);
    setSubmitted(true);
    
    setTimeout(() => {
      onBack();
    }, 2000);
  };

  const RatingStars = ({ value, onChange, label, icon: Icon }: { value: number, onChange: (v: number) => void, label: string, icon: any }) => (
    <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
      <div className="flex items-center space-x-2 mb-3">
        <Icon size={20} className="text-blue-500" />
        <span className="font-bold text-sm text-gray-700 dark:text-gray-300 uppercase tracking-wider">{label}</span>
      </div>
      <div className="flex justify-between px-2">
        {[1, 2, 3, 4, 5].map((star) => (
          <button
            key={star}
            type="button"
            onClick={() => onChange(star)}
            className={`transition-all transform hover:scale-125 ${star <= value ? 'text-yellow-400' : 'text-gray-300 dark:text-slate-600'}`}
          >
            <Star size={32} fill={star <= value ? 'currentColor' : 'none'} strokeWidth={star <= value ? 1 : 2} />
          </button>
        ))}
      </div>
    </div>
  );

  if (submitted) {
    return (
      <div className="w-full h-full flex flex-col items-center justify-center p-8 bg-slate-50 dark:bg-slate-950 text-center">
        <div className="w-20 h-20 bg-green-100 dark:bg-green-900/30 text-green-600 rounded-full flex items-center justify-center mb-6 animate-bounce">
          <CheckCircle2 size={48} />
        </div>
        <h2 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">Thank You!</h2>
        <p className="text-gray-600 dark:text-gray-400">Your feedback helps us improve Indian Railways.</p>
      </div>
    );
  }

  return (
    <div className="w-full h-full flex flex-col bg-slate-50 dark:bg-slate-950 transition-colors duration-300">
      <header className="bg-gradient-to-r from-blue-600 to-indigo-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Trip Feedback</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Journey PNR</label>
             <input 
               type="text" 
               required
               value={pnr}
               onChange={(e) => setPnr(e.target.value)}
               placeholder="10-digit PNR Number"
               className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
             />
          </div>

          <RatingStars value={foodRating} onChange={setFoodRating} label="Food Quality" icon={Utensils} />
          <RatingStars value={cleanRating} onChange={setCleanRating} label="Cleanliness" icon={Trash2} />
          <RatingStars value={timeRating} onChange={setTimeRating} label="Punctuality" icon={Clock} />

          <div className="bg-white dark:bg-slate-800 p-4 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
             <label className="block text-xs font-black text-gray-400 uppercase tracking-widest mb-2">Additional Comments</label>
             <textarea 
               value={comment}
               onChange={(e) => setComment(e.target.value)}
               placeholder="Tell us more about your journey..."
               rows={3}
               className="w-full bg-slate-100 dark:bg-slate-900 border-none rounded-xl p-4 text-sm focus:ring-2 focus:ring-blue-500 text-gray-800 dark:text-white"
             />
          </div>

          <button 
            type="submit"
            disabled={!pnr || foodRating === 0 || cleanRating === 0 || timeRating === 0}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:bg-gray-400 text-white font-bold py-4 rounded-2xl shadow-lg flex items-center justify-center transition-all transform active:scale-95"
          >
            <Send size={20} className="mr-2" />
            Submit Feedback
          </button>
        </form>
      </main>
    </div>
  );
}
