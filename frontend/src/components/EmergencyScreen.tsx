import { ArrowLeft, Phone, ShieldAlert, HeartPulse, UserCheck, Siren, AlertCircle } from 'lucide-react';

interface EmergencyScreenProps {
  onBack: () => void;
}

const emergencyNumbers = [
  { name: 'Railway Security', number: '182', icon: ShieldAlert, color: 'bg-red-100 text-red-600', description: 'For theft, harassment, or security threats' },
  { name: 'Medical Help', number: '132', icon: HeartPulse, color: 'bg-pink-100 text-pink-600', description: 'Emergency medical assistance on train' },
  { name: 'All-in-One Helpline', number: '139', icon: Siren, color: 'bg-blue-100 text-blue-600', description: 'General inquiry, complaints, and help' },
  { name: 'Women Helpline', number: '1091', icon: UserCheck, color: 'bg-purple-100 text-purple-600', description: 'Dedicated support for women passengers' },
  { name: 'Child Helpline', number: '1098', icon: UserCheck, color: 'bg-teal-100 text-teal-600', description: 'For missing or distressed children' },
  { name: 'Vigilance Helpline', number: '155210', icon: ShieldAlert, color: 'bg-orange-100 text-orange-600', description: 'Report corruption or bribery incidents' },
  { name: 'GRP Police', number: '1512', icon: ShieldAlert, color: 'bg-slate-100 text-slate-600', description: 'Government Railway Police assistance' },
  { name: 'Fire Brigade', number: '101', icon: Siren, color: 'bg-red-50 text-red-500', description: 'Emergency fire services' },
  { name: 'Ambulance', number: '102', icon: HeartPulse, color: 'bg-emerald-50 text-emerald-600', description: 'Emergency medical transport' },
  { name: 'Disaster Management', number: '108', icon: Siren, color: 'bg-blue-50 text-blue-500', description: 'Emergency response for disasters' },
  { name: 'Cyber Crime', number: '1930', icon: ShieldAlert, color: 'bg-indigo-50 text-indigo-500', description: 'Report online fraud or cyber threats' },
  { name: 'Police Control', number: '100', icon: ShieldAlert, color: 'bg-slate-100 text-slate-800', description: 'Direct access to local police' },
  { name: 'State Police', number: '112', icon: Siren, color: 'bg-slate-100 text-slate-800', description: 'Unified emergency services' },
  { name: 'Coast Guard', number: '1554', icon: ShieldAlert, color: 'bg-blue-100 text-blue-800', description: 'For coastal area emergencies' },
  { name: 'Railway Accident', number: '1072', icon: AlertCircle, color: 'bg-red-200 text-red-700', description: 'Railway accident information' },
  { name: 'IRCTC Food Help', number: '1323', icon: Siren, color: 'bg-amber-100 text-amber-700', description: 'Catering and food complaints' },
];

export default function EmergencyScreen({ onBack }: EmergencyScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-red-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Emergency Help</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-900/30 p-4 rounded-xl mb-6">
          <p className="text-red-800 dark:text-red-400 text-sm font-medium">
            In case of immediate danger or life-threatening emergency, please use the numbers below to contact railway authorities directly.
          </p>
        </div>

        <div className="space-y-4">
          {emergencyNumbers.map((item, idx) => (
            <a 
              key={idx} 
              href={`tel:${item.number}`}
              className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm flex items-center hover:bg-gray-50 dark:hover:bg-slate-700 transition duration-300 border border-gray-100 dark:border-slate-700"
            >
              <div className={`p-3 rounded-full ${item.color.replace('bg-', 'dark:bg-').replace('text-', 'dark:text-')} mr-4`}>
                <item.icon size={24} />
              </div>
              <div className="flex-grow">
                <h3 className="font-bold text-gray-800 dark:text-white">{item.name}</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">{item.description}</p>
              </div>
              <div className="bg-green-500 text-white p-2 rounded-full">
                <Phone size={20} />
              </div>
            </a>
          ))}
        </div>

        <div className="mt-8 p-6 bg-gray-200 dark:bg-slate-800 rounded-2xl text-center">
          <p className="text-gray-600 dark:text-gray-400 text-sm italic">
            "Your safety is our priority. RailCare ensures you are never alone during your journey."
          </p>
        </div>
      </main>
    </div>
  );
}
