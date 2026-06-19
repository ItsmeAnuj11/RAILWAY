import { useState } from 'react';
import { ArrowLeft, Grid, Info } from 'lucide-react';

interface SeatMapsScreenProps {
  onBack: () => void;
}

const coachTypes = [
  { id: 'SL', name: 'Sleeper (SL)', rows: 8, layout: '3+3+2' },
  { id: '3A', name: '3-Tier AC (3A)', rows: 8, layout: '3+3+2' },
  { id: '2A', name: '2-Tier AC (2A)', rows: 6, layout: '2+2+2' },
  { id: '1A', name: '1st AC (1A)', rows: 4, layout: '2+2' },
  { id: 'CC', name: 'Chair Car (CC)', rows: 10, layout: '3+2' },
];

export default function SeatMapsScreen({ onBack }: SeatMapsScreenProps) {
  const [selectedType, setSelectedType] = useState('SL');

  const renderLayout = () => {
    switch (selectedType) {
      case 'SL':
      case '3A':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
              <div className="col-span-2 grid grid-cols-3 gap-2">
                {['LB', 'MB', 'UB', 'LB', 'MB', 'UB'].map((type, i) => (
                  <div key={i} className="h-12 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
                    {type}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {['SL', 'SU'].map((type, i) => (
                  <div key={i} className="h-12 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-400 dark:text-indigo-500">
                    {type}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic">Standard 8-berth bay layout (6 Main + 2 Side)</p>
          </div>
        );
      case '2A':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
              <div className="col-span-2 grid grid-cols-2 gap-2">
                {['LB', 'UB', 'LB', 'UB'].map((type, i) => (
                  <div key={i} className="h-16 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
                    {type}
                  </div>
                ))}
              </div>
              <div className="flex flex-col gap-2">
                {['SL', 'SU'].map((type, i) => (
                  <div key={i} className="h-16 bg-indigo-50 dark:bg-indigo-900/30 rounded border border-indigo-100 dark:border-indigo-900/50 flex items-center justify-center text-[10px] font-bold text-indigo-400 dark:text-indigo-500">
                    {type}
                  </div>
                ))}
              </div>
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic">Standard 6-berth bay layout (4 Main + 2 Side)</p>
          </div>
        );
      case '1A':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4 p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
              {[1, 2].map((cabin) => (
                <div key={cabin} className="p-3 bg-white dark:bg-slate-700 rounded-lg border border-gray-200 dark:border-slate-600">
                  <p className="text-[8px] font-bold text-gray-400 mb-2 uppercase">Cabin {cabin}</p>
                  <div className="grid grid-cols-2 gap-2">
                    {['LB', 'UB', 'LB', 'UB'].map((type, i) => (
                      <div key={i} className="h-12 bg-teal-50 dark:bg-teal-900/20 rounded border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-[10px] font-bold text-teal-600 dark:text-teal-400">
                        {type}
                      </div>
                    ))}
                  </div>
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic">Luxury 4-berth cabin layout</p>
          </div>
        );
      case 'CC':
        return (
          <div className="space-y-4">
            <div className="grid grid-cols-5 gap-2 p-4 bg-gray-100 dark:bg-slate-800 rounded-xl">
              {[1, 2, 3].map((_, i) => (
                <div key={`l-${i}`} className="h-10 bg-white dark:bg-slate-700 rounded border border-gray-200 dark:border-slate-600 flex items-center justify-center text-[10px] font-bold text-gray-400 dark:text-gray-500">
                  W/M/A
                </div>
              ))}
              <div className="col-span-1"></div>
              {[1, 2].map((_, i) => (
                <div key={`r-${i}`} className="h-10 bg-teal-50 dark:bg-teal-900/30 rounded border border-teal-100 dark:border-teal-900/50 flex items-center justify-center text-[10px] font-bold text-teal-400 dark:text-teal-500">
                  A/W
                </div>
              ))}
            </div>
            <p className="text-[10px] text-gray-400 dark:text-gray-500 text-center italic">Standard 3+2 seating layout with aisle</p>
          </div>
        );
      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-teal-700 to-emerald-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Seat Map Explorer</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="flex space-x-2 mb-6 overflow-x-auto pb-2">
          {coachTypes.map((type) => (
            <button
              key={type.id}
              onClick={() => setSelectedType(type.id)}
              className={`px-4 py-2 rounded-full text-sm font-bold whitespace-nowrap transition ${
                selectedType === type.id 
                ? 'bg-teal-600 text-white shadow-md' 
                : 'bg-white dark:bg-slate-800 text-gray-500 dark:text-gray-400 border border-gray-200 dark:border-slate-700'
              }`}
            >
              {type.name}
            </button>
          ))}
        </div>

        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm border border-gray-100 dark:border-slate-700 mb-6">
          <div className="flex items-center justify-between mb-6">
            <h2 className="font-bold text-gray-800 dark:text-white">Typical {selectedType} Layout</h2>
            <div className="flex space-x-2">
              <div className="w-3 h-3 rounded-full bg-indigo-500"></div>
              <div className="w-3 h-3 rounded-full bg-teal-500"></div>
            </div>
          </div>

          {renderLayout()}

          <div className="mt-6 grid grid-cols-2 gap-4">
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-white dark:bg-slate-700 border border-gray-200 dark:border-slate-600"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{selectedType === 'CC' ? 'Window/Middle' : 'Main Berth'}</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-4 h-4 rounded bg-indigo-50 dark:bg-indigo-900/30 border border-indigo-100 dark:border-indigo-900/50"></div>
              <span className="text-xs text-gray-500 dark:text-gray-400 font-medium">{selectedType === 'CC' ? 'Aisle Side' : 'Side Berth'}</span>
            </div>
          </div>
        </div>

        <div className="bg-teal-50 dark:bg-teal-900/20 p-4 rounded-2xl border border-teal-100 dark:border-teal-900/30">
          <div className="flex items-start">
            <Info className="text-teal-600 dark:text-teal-400 mr-3 mt-0.5" size={20} />
            <div>
              <h3 className="font-bold text-teal-900 dark:text-teal-300 text-sm mb-1">Coach Legend</h3>
              <div className="text-xs text-teal-700 dark:text-teal-400 leading-relaxed">
                {selectedType === 'CC' ? (
                  <p>W: Window | M: Middle | A: Aisle</p>
                ) : (
                  <p>
                    LB: Lower Berth | MB: Middle Berth | UB: Upper Berth<br/>
                    SL: Side Lower | SU: Side Upper
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
