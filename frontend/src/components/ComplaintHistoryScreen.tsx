import { ArrowLeft, CloudOff } from 'lucide-react';
import { Complaint } from '../types';

interface ComplaintHistoryScreenProps {
  onBack: () => void;
  complaints: Complaint[];
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

export default function ComplaintHistoryScreen({ onBack, complaints }: ComplaintHistoryScreenProps) {
  const pendingSyncIds = JSON.parse(localStorage.getItem('railcare_pending_complaints') || '[]').map((c: any) => c.id);

  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 flex items-center shadow-md z-10">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Complaint History</h1>
      </header>
      <main className="flex-grow p-4 overflow-y-auto">
        {complaints.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-center">
            <h2 className="text-2xl font-semibold text-gray-700 dark:text-gray-300 mb-2">No complaints yet</h2>
            <p className="text-gray-500 dark:text-gray-400">Your submitted complaints will appear here.</p>
          </div>
        ) : (
          <div className="space-y-4">
            {complaints.map((complaint) => {
              const isPendingSync = pendingSyncIds.includes(complaint.id);
              return (
                <div key={complaint.id} className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm border border-gray-100 dark:border-slate-700">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-bold text-lg text-gray-800 dark:text-white">{complaint.type}</h3>
                      <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">PNR: {complaint.pnr}</p>
                    </div>
                    <div className="flex flex-col items-end space-y-2">
                      <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[complaint.status as keyof typeof statusColors] || 'bg-gray-100 text-gray-600 dark:bg-slate-700 dark:text-gray-400'}`}>
                        {complaint.status}
                      </span>
                      {isPendingSync && (
                        <span className="flex items-center text-[10px] font-bold text-amber-600 dark:text-amber-400 bg-amber-50 dark:bg-amber-900/20 px-2 py-0.5 rounded border border-amber-200 dark:border-amber-900/30">
                          <CloudOff size={10} className="mr-1" />
                          PENDING SYNC
                        </span>
                      )}
                    </div>
                  </div>
                  <p className="text-gray-700 dark:text-gray-300 mt-4">{complaint.description}</p>
                  
                  {complaint.adminFeedback && (
                    <div className="mt-4 p-3 bg-blue-50 dark:bg-blue-900/20 border-l-4 border-blue-500 rounded-r-lg">
                      <p className="text-[10px] font-bold text-blue-600 dark:text-blue-400 uppercase tracking-wider mb-1">Admin Response</p>
                      <p className="text-sm text-gray-700 dark:text-gray-200 italic">"{complaint.adminFeedback}"</p>
                    </div>
                  )}

                  <div className="text-xs text-gray-400 dark:text-gray-500 mt-4 pt-4 border-t dark:border-slate-700">
                    <p>Complaint ID: {complaint.id}</p>
                    <p>Time: {new Date(Number(complaint.id)).toLocaleString()}</p>
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </main>
    </div>
  );
}
