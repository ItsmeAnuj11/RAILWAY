import { ArrowLeft, Lightbulb, Zap, Shield, Coffee } from 'lucide-react';

interface TravelTipsScreenProps {
  onBack: () => void;
}

const tips = [
  {
    category: 'Safety & Security',
    icon: <Shield className="text-red-500" size={20} />,
    items: [
      'Lock your luggage with a sturdy chain and padlock under the lower berth to prevent theft while sleeping.',
      'Never share your PNR number or personal contact details with strangers or on public social media platforms.',
      'Keep your original ID proof (Aadhar, PAN, etc.) in a secure but accessible place for TTE verification.',
      'Avoid accepting open food or drinks from fellow passengers to stay safe from potential drugging incidents.',
      'Use the RailMadad app or 139 helpline immediately if you notice any suspicious activity or security threats.',
      'Avoid using station Wi-Fi for sensitive transactions like banking or shopping.',
      'Check the emergency exit window location in your coach as soon as you board for quick evacuation if needed.',
      'Keep a physical note of emergency contacts in your wallet in case your phone battery dies or is lost.'
    ]
  },
  {
    category: 'Comfort & Convenience',
    icon: <Zap className="text-amber-500" size={20} />,
    items: [
      'Carry a lightweight inflatable neck pillow and a thin blanket, as AC temperatures can sometimes be very low.',
      'Wear loose-fitting cotton clothes and slip-on shoes for maximum comfort during long-distance journeys.',
      'Pack a high-capacity power bank (20,000mAh+) as charging points on trains can be unreliable or occupied.',
      'Download movies, music, or books offline before your journey, as network connectivity is often poor on tracks.',
      'Keep a small "essentials kit" with a toothbrush, paste, hand sanitizer, and wet wipes for quick freshening up.',
      'Book lower berths for elderly passengers and upper berths for more privacy and luggage safety during the day.',
      'Use a small personal towel to cover the pillow provided in AC coaches for better hygiene and comfort.',
      'If traveling in Sleeper class, carry a light shawl even in summer as it can get surprisingly chilly at night.'
    ]
  },
  {
    category: 'Food & Health',
    icon: <Coffee className="text-emerald-500" size={20} />,
    items: [
      'Always carry a reusable water bottle and refill it only from trusted RO water points at major stations.',
      'Prefer hot, freshly cooked meals from the official IRCTC pantry or authorized e-catering services.',
      'Carry basic medicines for common issues like acidity, headache, fever, and motion sickness.',
      'Pack some dry fruits, biscuits, or home-made snacks to avoid over-reliance on station junk food.',
      'Wipe down the snack table with a sanitizer before eating to maintain hygiene in your seating area.',
      'Carry paper soap or small soap strips for better hygiene in train washrooms.',
      'Download the "RailRestro" or "Zoop" app for more variety in e-catering options at major stations.',
      'Avoid buying cut fruits or salads from station vendors to prevent potential food poisoning incidents.'
    ]
  },
  {
    category: 'Tech & Travel Hacks',
    icon: <Lightbulb className="text-blue-500" size={20} />,
    items: [
      'Use the "Where is my train" app for offline tracking using cell towers when GPS is weak.',
      'Carry a small multi-plug or extension cord as there is often only one socket per bay.',
      'Keep a digital copy of your ticket and ID proof in a dedicated folder on your phone.',
      'Check the "Coach Position" on the platform display or app before the train arrives to avoid a last-minute rush.',
      'Carry a small LED torch for night-time navigation without disturbing fellow passengers.',
      'Keep some loose change and small denomination notes (₹10, ₹20) for quick station purchases.',
      'Use the "Upper Berth" to store your day-bags safely while you are sitting on the lower seat.',
      'Use "Google Maps" offline mode to track your location and distance to the next station without using data.',
      'Keep your phone on "Battery Saver" mode during long stretches without charging to preserve power.',
      'Use the "Side Lower" berth table to keep your laptop or books while sitting during the day.',
      'If your train is delayed significantly, check for "Retiring Rooms" at the station for a comfortable stay.'
    ]
  }
];

export default function TravelTipsScreen({ onBack }: TravelTipsScreenProps) {
  return (
    <div className="w-full h-full flex flex-col bg-transparent transition-colors duration-300">
      <header className="bg-gradient-to-r from-amber-600 to-orange-500 text-white p-4 flex items-center shadow-md">
        <button onClick={onBack} className="mr-4">
          <ArrowLeft size={24} />
        </button>
        <h1 className="text-xl font-bold">Travel Tips & Hacks</h1>
      </header>

      <main className="flex-grow p-4 overflow-y-auto">
        <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl shadow-sm mb-6 text-center border border-gray-100 dark:border-slate-700">
          <div className="w-16 h-16 bg-amber-100 dark:bg-amber-900/30 rounded-full flex items-center justify-center mx-auto mb-4">
            <Lightbulb className="text-amber-600 dark:text-amber-400" size={32} />
          </div>
          <h2 className="text-xl font-bold text-gray-800 dark:text-white mb-2">Pro Traveler Guide</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">Make your train journey smoother with these curated tips.</p>
        </div>

        <div className="space-y-6">
          {tips.map((section, idx) => (
            <div key={idx} className="bg-white dark:bg-slate-800 p-5 rounded-2xl shadow-sm border border-gray-100 dark:border-slate-700">
              <div className="flex items-center mb-4">
                <div className="p-2 bg-gray-50 dark:bg-slate-700 rounded-lg mr-3">
                  {section.icon}
                </div>
                <h3 className="font-bold text-gray-800 dark:text-white">{section.category}</h3>
              </div>
              <ul className="space-y-3">
                {section.items.map((item, i) => (
                  <li key={i} className="flex items-start">
                    <div className="w-1.5 h-1.5 rounded-full bg-amber-400 mt-1.5 mr-3 flex-shrink-0"></div>
                    <p className="text-sm text-gray-600 dark:text-gray-300 leading-tight">{item}</p>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-8 mb-4 text-center">
          <p className="text-[10px] text-gray-400 dark:text-gray-500 uppercase font-bold tracking-widest">Happy Journey!</p>
        </div>
      </main>
    </div>
  );
}
