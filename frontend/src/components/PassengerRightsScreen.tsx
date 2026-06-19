import { ArrowLeft, Scale, Shield, AlertCircle, FileText, User, Clock, CreditCard, Package, Phone, MapPin, Trash2, HeartPulse, Siren } from 'lucide-react';

interface PassengerRightsScreenProps {
  onBack: () => void;
}

const rights = [
  {
    title: 'Refund Rules',
    icon: <Scale className="text-blue-500" />,
    content: 'Passengers are entitled to a refund for cancelled trains, delayed trains (over 3 hours), and partially used tickets. TDR must be filed within specified time limits.'
  },
  {
    title: 'Medical Aid',
    icon: <Shield className="text-red-500" />,
    content: 'In case of medical emergencies, passengers can contact the TTE or station master. Basic first aid is available on all long-distance trains.'
  },
  {
    title: 'Luggage Policy',
    icon: <FileText className="text-green-500" />,
    content: 'Free allowance varies by class (e.g., 40kg for Sleeper, 70kg for 1AC). Excess luggage should be booked in advance as parcel.'
  },
  {
    title: 'Safety & Security',
    icon: <AlertCircle className="text-orange-500" />,
    content: 'RPF/GRP are responsible for passenger safety. Use the 139 helpline for immediate security assistance during travel.'
  },
  {
    title: 'Right to Information',
    icon: <FileText className="text-purple-500" />,
    content: 'Passengers have the right to know the status of their train, reasons for delay, and platform numbers through official announcements and apps.'
  },
  {
    title: 'Bedroll Entitlement',
    icon: <Shield className="text-teal-500" />,
    content: 'Passengers in AC coaches (except 3E) are entitled to a clean bedroll (2 sheets, 1 pillow, 1 blanket) included in the ticket fare.'
  },
  {
    title: 'Catering & MRP',
    icon: <Scale className="text-amber-500" />,
    content: 'All food items sold on trains must follow the official IRCTC menu and be sold at MRP. Always ask for a bill for your purchases.'
  },
  {
    title: 'Senior Citizen Facilities',
    icon: <AlertCircle className="text-pink-500" />,
    content: 'Lower berths are prioritized for senior citizens, pregnant women, and physically challenged passengers during booking.'
  },
  {
    title: 'Right to Privacy',
    icon: <Shield className="text-indigo-500" />,
    content: 'Night hours are from 10 PM to 6 AM. During this time, TTEs should not check tickets (unless boarding), and lights should be dimmed.'
  },
  {
    title: 'Compensation for Accidents',
    icon: <AlertCircle className="text-red-600" />,
    content: 'In the unfortunate event of a train accident, passengers or their kin are entitled to ex-gratia compensation from the Railways.'
  },
  {
    title: 'Right to Cleanliness',
    icon: <Scale className="text-cyan-500" />,
    content: 'Passengers can request cleaning of coaches and toilets during the journey using the "Coach Mitra" service or RailMadad app.'
  },
  {
    title: 'TTE Verification',
    icon: <FileText className="text-slate-500" />,
    content: 'Passengers have the right to see the TTE\'s identity card. TTEs must be in proper uniform while performing their duties.'
  },
  {
    title: 'Booking & Cancellation',
    icon: <Scale className="text-emerald-500" />,
    content: 'Tickets can be booked up to 120 days in advance. Cancellation charges vary based on the time remaining before train departure.'
  },
  {
    title: 'Complaint Redressal',
    icon: <AlertCircle className="text-violet-500" />,
    content: 'Every passenger has the right to lodge a complaint via the RailMadad app, website, or 139 helpline for any service deficiency.'
  },
  {
    title: 'Waitlisted Ticket Rights',
    icon: <Clock className="text-amber-600" />,
    content: 'Waitlisted passengers are not allowed to board reserved coaches. They are entitled to a full refund (minus clerkage) if the ticket remains waitlisted after chart preparation.'
  },
  {
    title: 'Quota for Women',
    icon: <User className="text-pink-500" />,
    content: 'Specific quotas and separate coaches (in some trains) are reserved for women passengers to ensure comfort and safety during the journey.'
  },
  {
    title: 'Free Emergency Calls',
    icon: <Phone className="text-green-600" />,
    content: 'Helpline numbers like 139 and 182 are toll-free and accessible even without a balance on your mobile phone from any network.'
  },
  {
    title: 'Right to Basic Amenities',
    icon: <MapPin className="text-blue-400" />,
    content: 'Stations must provide drinking water, waiting halls, and seating arrangements for passengers with valid tickets. Report deficiencies to the Station Master.'
  },
  {
    title: 'Concessions for Divyangjan',
    icon: <HeartPulse className="text-rose-500" />,
    content: 'Persons with disabilities are entitled to significant fare concessions and specialized berths/toilets in modified coaches (SLRD) for easier access.'
  },
  {
    title: 'Protection from Overcharging',
    icon: <CreditCard className="text-emerald-600" />,
    content: 'Vendors at stations and on trains cannot charge more than the Maximum Retail Price (MRP) for packaged items. Always check the price printed on the pack.'
  },
  {
    title: 'Right to Seat/Berth',
    icon: <Shield className="text-blue-600" />,
    content: 'A confirmed ticket guarantees a specific seat or berth. TTEs cannot allot your confirmed seat to another passenger without your consent or valid cause.'
  },
  {
    title: 'Luggage Allowance',
    icon: <Package className="text-orange-600" />,
    content: 'Each class has a specific free luggage allowance. Passengers have the right to carry their belongings within these weight limits safely in the coach.'
  },
  {
    title: 'Emergency Stop',
    icon: <Siren className="text-red-600" />,
    content: 'Passengers can pull the alarm chain for genuine emergencies like medical crises, safety threats, or if a companion is left behind (misuse is a punishable offense).'
  },
  {
    title: 'Cloak Room Facilities',
    icon: <Trash2 className="text-slate-600" />,
    content: 'Major stations provide cloakrooms to store luggage safely for a nominal fee. You must have a valid journey ticket or platform ticket to use this service.'
  }
];

export default function PassengerRightsScreen({ onBack }: PassengerRightsScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-indigo-700 to-blue-600 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Passenger Rights</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-4 rounded-xl shadow-sm mb-6 border-l-4 border-indigo-500">
          <p className="text-sm text-gray-600 dark:text-gray-300 italic">"Knowledge is power. Know your rights as a railway passenger in India."</p>
        </div>

        <div className="space-y-4">
          {rights.map((right, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center mb-3">
                <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg mr-3">
                  {right.icon}
                </div>
                <h2 className="font-bold text-gray-800 dark:text-white">{right.title}</h2>
              </div>
              <p className="text-sm text-gray-600 dark:text-gray-400 leading-relaxed">
                {right.content}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-8 p-4 bg-indigo-50 dark:bg-indigo-900/20 rounded-xl border border-indigo-100 dark:border-indigo-900/30">
          <h3 className="font-bold text-indigo-900 dark:text-indigo-300 mb-2">Important Helpline</h3>
          <div className="flex items-center justify-between">
            <span className="text-sm text-indigo-700 dark:text-indigo-400">RailMadad Helpline</span>
            <span className="text-lg font-black text-indigo-900 dark:text-indigo-200">139</span>
          </div>
        </div>
      </main>
    </div>
  );
}
