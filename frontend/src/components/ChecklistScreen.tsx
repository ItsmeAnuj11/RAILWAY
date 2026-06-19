import { useState, useEffect } from 'react';
import { ArrowLeft, Plus, Trash2, CheckCircle2, Circle } from 'lucide-react';

interface ChecklistScreenProps {
  onBack: () => void;
}

interface Todo {
  id: string;
  text: string;
  completed: boolean;
}

const defaultItems = [
  'Train Ticket / PNR',
  'Identity Proof (Aadhar/Voter ID)',
  'Phone Charger & Powerbank',
  'Water Bottle',
  'Hand Sanitizer & Mask',
  'Emergency Medicines',
];

export default function ChecklistScreen({ onBack }: ChecklistScreenProps) {
  const [todos, setTodos] = useState<Todo[]>(() => {
    const saved = localStorage.getItem('railcare_checklist');
    if (saved) return JSON.parse(saved);
    return defaultItems.map(item => ({ id: Math.random().toString(36).substr(2, 9), text: item, completed: false }));
  });
  const [input, setInput] = useState('');

  useEffect(() => {
    localStorage.setItem('railcare_checklist', JSON.stringify(todos));
  }, [todos]);

  const addTodo = () => {
    if (!input.trim()) return;
    const newTodo: Todo = { id: Math.random().toString(36).substr(2, 9), text: input, completed: false };
    setTodos([newTodo, ...todos]);
    setInput('');
  };

  const toggleTodo = (id: string) => {
    setTodos(todos.map(t => t.id === id ? { ...t, completed: !t.completed } : t));
  };

  const deleteTodo = (id: string) => {
    setTodos(todos.filter(t => t.id !== id));
  };

  const progress = Math.round((todos.filter(t => t.completed).length / todos.length) * 100) || 0;

  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-teal-500 to-emerald-500 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Travel Checklist</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-2xl shadow-sm mb-6 border border-transparent dark:border-slate-700">
          <div className="flex justify-between items-end mb-2">
            <h2 className="text-sm font-bold text-gray-500 dark:text-gray-400 uppercase tracking-wider">Journey Readiness</h2>
            <span className="text-2xl font-black text-teal-600 dark:text-teal-400">{progress}%</span>
          </div>
          <div className="w-full bg-gray-100 dark:bg-slate-700 h-2 rounded-full overflow-hidden">
            <div 
              className="bg-teal-500 h-full transition-all duration-500 ease-out" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>

        <div className="flex space-x-2 mb-6">
          <input 
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={(e) => e.key === 'Enter' && addTodo()}
            className="flex-grow px-4 py-3 border-2 border-gray-100 dark:border-slate-700 rounded-xl focus:outline-none focus:border-teal-500 transition-all bg-white dark:bg-slate-800 text-gray-800 dark:text-white shadow-sm" 
            placeholder="Add new travel item..."
          />
          <button 
            onClick={addTodo}
            disabled={!input.trim()}
            className="bg-teal-500 text-white p-3 rounded-xl hover:bg-teal-600 active:scale-95 transition-all shadow-md disabled:bg-gray-300 dark:disabled:bg-slate-800 disabled:shadow-none"
            title="Add Item"
          >
            <Plus size={28} />
          </button>
        </div>

        <div className="space-y-3">
          {todos.map((todo) => (
            <div 
              key={todo.id} 
              className={`flex items-center p-4 rounded-xl border transition-all ${todo.completed ? 'bg-gray-50 dark:bg-slate-900/50 border-gray-100 dark:border-slate-800' : 'bg-white dark:bg-slate-800 border-gray-200 dark:border-slate-700 shadow-sm'}`}
            >
              <button onClick={() => toggleTodo(todo.id)} className="mr-3">
                {todo.completed ? (
                  <CheckCircle2 className="text-teal-500" size={24} />
                ) : (
                  <Circle className="text-gray-300 dark:text-gray-600" size={24} />
                )}
              </button>
              <span className={`flex-grow text-gray-700 dark:text-gray-200 ${todo.completed ? 'line-through text-gray-400 dark:text-gray-500' : ''}`}>
                {todo.text}
              </span>
              <button onClick={() => deleteTodo(todo.id)} className="text-gray-300 dark:text-gray-600 hover:text-red-500 ml-2">
                <Trash2 size={18} />
              </button>
            </div>
          ))}
        </div>

        {todos.length === 0 && (
          <div className="text-center py-10 text-gray-400 dark:text-gray-500">
            <CheckCircle2 size={48} className="mx-auto mb-2 opacity-20" />
            <p>Your checklist is empty. Add items to stay organized!</p>
          </div>
        )}
      </main>
    </div>
  );
}
