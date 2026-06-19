import { useState } from 'react';
import { ArrowLeft, Phone, Mic, Paperclip, ThermometerSnowflake, Sparkles, Receipt, Armchair, Droplets, HeartPulse, BatteryCharging, ShieldOff, UserX, Users, BedDouble, AlertCircle } from 'lucide-react';
import { Screen } from '../App';
import { Complaint } from '../types';

interface ComplaintScreenProps {
  onBack: () => void;
  onNavigate: (screen: Screen) => void;
  onSubmitComplaint: (complaint: Complaint) => void;
  user: { name: string; email: string; phone: string } | null;
  isOnline: boolean;
}

const statusColors = {
  Pending: 'bg-yellow-100 text-yellow-800',
  'In Progress': 'bg-blue-100 text-blue-800',
  Resolved: 'bg-green-100 text-green-800',
};

const complaintTypes = [
  { name: 'Coach AC', icon: ThermometerSnowflake, color: 'text-blue-500', phone: '138' },
  { name: 'Cleanliness', icon: Sparkles, color: 'text-yellow-500', phone: '139' },
  { name: 'Food Overcharge', icon: Receipt, color: 'text-red-500', phone: '1800111321' },
  { name: 'Seat Issue', icon: Armchair, color: 'text-green-500', phone: '182' },
  { name: 'Water Issue', icon: Droplets, color: 'text-cyan-500', phone: '139' },
  { name: 'Medical Emergency', icon: HeartPulse, color: 'text-pink-500', phone: '132' },
  { name: 'Charging Point', icon: BatteryCharging, color: 'text-orange-500', phone: '139' },
  { name: 'Theft', icon: ShieldOff, color: 'text-gray-600', phone: '139' },
  { name: 'Misbehavior', icon: UserX, color: 'text-indigo-500', phone: '139' },
  { name: 'Unauthorized Pax', icon: Users, color: 'text-purple-500', phone: '139' },
  { name: 'No Bedroll', icon: BedDouble, color: 'text-teal-500', phone: '139' },
  { name: 'Others', icon: AlertCircle, color: 'text-gray-500', phone: '139' },
];

export default function ComplaintScreen({ onBack, onNavigate, onSubmitComplaint, user, isOnline }: ComplaintScreenProps) {
  const [step, setStep] = useState(1);
  const [phone, setPhone] = useState(user?.phone || '');
  const [pnr, setPnr] = useState('');
  const [selectedType, setSelectedType] = useState<string | null>(null);
  const [description, setDescription] = useState('');

  const selectedComplaint = complaintTypes.find(c => c.name === selectedType);
  const isPnrValid = /^\d{10}$/.test(pnr);

  const handleSubmit = async () => {
    if (!selectedType || !isPnrValid) return;
    const newComplaint: Complaint = {
      id: new Date().getTime().toString(),
      userName: user?.name || 'Anonymous',
      userEmail: user?.email || 'N/A',
      phone,
      pnr,
      type: selectedType,
      description,
      status: 'Pending',
    };

    if (!isOnline) {
      // Save to pending queue
      const pending = JSON.parse(localStorage.getItem('railcare_pending_complaints') || '[]');
      localStorage.setItem('railcare_pending_complaints', JSON.stringify([...pending, newComplaint]));
      onSubmitComplaint(newComplaint);
      // Reset form
      setSelectedType(null);
      setDescription('');
      setStep(1);
      setPhone(user?.phone || '');
      setPnr('');
      return;
    }

    try {
      await fetch('/api/complaints', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(newComplaint),
      });
      onSubmitComplaint(newComplaint);
      // Reset form
      setSelectedType(null);
      setDescription('');
      setStep(1);
      setPhone(user?.phone || '');
      setPnr('');
    } catch (error) {
      console.error('Error submitting complaint:', error);
      // Fallback to offline save if fetch fails even if isOnline was true
      const pending = JSON.parse(localStorage.getItem('railcare_pending_complaints') || '[]');
      localStorage.setItem('railcare_pending_complaints', JSON.stringify([...pending, newComplaint]));
      onSubmitComplaint(newComplaint);
    }
  };

  return (
    <div className="w-full h-full flex flex-col relative bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-purple-600 to-blue-500 text-white p-4 flex items-center justify-between shadow-md z-10">
        <div className="flex items-center">
          <button onClick={step === 1 ? onBack : () => setStep(1)} className="mr-4">
            <ArrowLeft size={24} />
          </button>
          <h1 className="text-xl font-bold">Raise Complaint</h1>
        </div>
      </header>

      <main className="flex-grow p-4 overflow-y-auto pb-32">
        <div className="space-y-6">
          {step === 1 && (
            <div className="bg-white dark:bg-slate-800 p-6 rounded-lg shadow-sm border border-transparent dark:border-slate-700">
              <h2 className="text-lg font-semibold text-gray-800 dark:text-white mb-4">Your Details</h2>
              <div className="grid grid-cols-1 gap-4">
                <input value={phone} onChange={(e) => setPhone(e.target.value)} className="w-full px-4 py-3 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-white focus:outline-none focus:border-blue-500" type="tel" placeholder="Phone Number" required />
                <div className="relative">
                  <input 
                    value={pnr} 
                    onChange={(e) => {
                      const val = e.target.value.replace(/\D/g, '').slice(0, 10);
                      setPnr(val);
                    }} 
                    className={`w-full px-4 py-3 border dark:border-slate-700 rounded-lg bg-gray-50 dark:bg-slate-700 text-gray-700 dark:text-white focus:outline-none transition-colors ${pnr.length > 0 && !isPnrValid ? 'border-red-300' : 'focus:border-blue-500'}`} 
                    type="text" 
                    inputMode="numeric"
                    placeholder="10-Digit PNR Number" 
                    required 
                  />
                  {pnr.length > 0 && !isPnrValid && (
                    <p className="text-[10px] text-red-500 mt-1 ml-1">PNR must be exactly 10 digits</p>
                  )}
                </div>
              </div>
              <button onClick={() => setStep(2)} disabled={!phone || !isPnrValid} className="w-full mt-6 bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300 disabled:bg-gray-300 dark:disabled:bg-slate-800">
                Next
              </button>
            </div>
          )}

          {step === 2 && (
            <>
              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Select Complaint Type</h3>
                <div className="grid grid-cols-3 gap-3">
                  {complaintTypes.map((type) => (
                    <button 
                      key={type.name} 
                      onClick={() => setSelectedType(type.name)}
                      className={`p-3 flex flex-col items-center justify-center space-y-2 rounded-lg border-2 transition-all ${selectedType === type.name ? 'border-blue-500 bg-blue-50 dark:bg-blue-900/20' : 'border-gray-200 dark:border-slate-700 bg-white dark:bg-slate-800'}`}>
                      <type.icon size={28} className={type.color} />
                      <span className="text-xs font-medium text-gray-600 dark:text-gray-400 text-center">{type.name}</span>
                    </button>
                  ))}
                </div>
              </div>

              {selectedType && (
                <div className="bg-white dark:bg-slate-800 p-4 rounded-lg shadow-sm space-y-4 border border-transparent dark:border-slate-700">
                  <h3 className="font-semibold text-gray-800 dark:text-white">Details for: {selectedType}</h3>
                  {selectedComplaint?.phone && (
                     <a href={`tel:${selectedComplaint.phone}`} className="w-full bg-green-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-green-600 transition duration-300 flex items-center justify-center space-x-3 text-base">
                        <Phone size={20} />
                        <span>Call Helpline</span>
                      </a>
                  )}
                  <p className="text-sm text-gray-600 dark:text-gray-400">Please describe your issue below.</p>
                </div>
              )}

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Describe your complaint</h3>
                <div className="relative">
                  <textarea 
                    value={description}
                    onChange={(e) => setDescription(e.target.value)}
                    className="w-full px-4 py-3 border dark:border-slate-700 rounded-lg bg-white dark:bg-slate-800 text-gray-700 dark:text-white focus:outline-none focus:border-blue-500 resize-none" 
                    rows={5} 
                    placeholder="Please provide details..."
                  ></textarea>
                  <button className="absolute bottom-3 right-3 p-2 rounded-full bg-gray-200 dark:bg-slate-700 hover:bg-gray-300 dark:hover:bg-slate-600">
                    <Mic size={20} className="text-gray-600 dark:text-gray-400" />
                  </button>
                </div>
              </div>

              <div>
                <h3 className="font-semibold text-gray-700 dark:text-gray-300 mb-2">Upload File (Optional)</h3>
                <div className="flex items-center justify-center w-full">
                    <label className="flex flex-col items-center justify-center w-full h-24 border-2 border-gray-300 dark:border-slate-700 border-dashed rounded-lg cursor-pointer bg-gray-50 dark:bg-slate-800 hover:bg-gray-100 dark:hover:bg-slate-700">
                        <div className="flex flex-col items-center justify-center pt-5 pb-6">
                            <Paperclip className="w-8 h-8 mb-2 text-gray-500 dark:text-gray-400" />
                            <p className="mb-1 text-sm text-gray-500 dark:text-gray-400"><span className="font-semibold">Click to upload</span> or drag and drop</p>
                        </div>
                        <input id="dropzone-file" type="file" className="hidden" />
                    </label>
                </div> 
              </div>
            </>
          )}
        </div>
      </main>

      {step === 2 && (
        <footer className="absolute bottom-0 left-0 right-0 p-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-sm border-t border-gray-200 dark:border-slate-800">
          <div className="space-y-3">
            <button onClick={handleSubmit} className="w-full bg-blue-500 text-white font-bold py-4 px-4 rounded-lg hover:bg-blue-600 transition duration-300 flex items-center justify-center space-x-3 text-lg">
              <span>Submit Complaint</span>
            </button>
          </div>
        </footer>
      )}
    </div>
  );
}
