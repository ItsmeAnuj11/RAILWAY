import { X } from 'lucide-react';

interface TermsModalProps {
  onClose: () => void;
}

export default function TermsModal({ onClose }: TermsModalProps) {
  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-sm flex items-center justify-center z-50">
      <div className="bg-white dark:bg-slate-900 rounded-2xl shadow-xl w-full max-w-lg max-h-[80vh] flex flex-col border border-transparent dark:border-slate-800">
        <div className="p-4 border-b dark:border-slate-800 flex justify-between items-center">
          <h2 className="text-xl font-bold dark:text-white">Terms and Conditions</h2>
          <button onClick={onClose} className="p-1 rounded-full hover:bg-gray-200 dark:hover:bg-slate-800 transition-colors">
            <X size={24} className="dark:text-gray-400" />
          </button>
        </div>
        <div className="p-6 overflow-y-auto">
          <div className="prose max-w-none dark:prose-invert">
            <h3 className="dark:text-white">1. Introduction</h3>
            <p className="dark:text-gray-400">Welcome to RailCare. By using our app, you agree to these terms. Please read them carefully.</p>
            <h3 className="dark:text-white">2. User Accounts</h3>
            <p className="dark:text-gray-400">You are responsible for maintaining the confidentiality of your account and password.</p>
            <h3 className="dark:text-white">3. Complaint Submission</h3>
            <p className="dark:text-gray-400">You agree to provide accurate and complete information when submitting a complaint. You must not submit any content that is unlawful, offensive, or fraudulent.</p>
            <h3 className="dark:text-white">4. Data Privacy</h3>
            <p className="dark:text-gray-400">We collect and use your data as described in our Privacy Policy. By using RailCare, you consent to such processing.</p>
            <h3 className="dark:text-white">5. Limitation of Liability</h3>
            <p className="dark:text-gray-400">RailCare is provided "as is" without any warranties. We are not liable for any damages arising from your use of the app.</p>
            <h3 className="dark:text-white">6. Governing Law</h3>
            <p className="dark:text-gray-400">These terms are governed by the laws of the jurisdiction in which our company is based.</p>
          </div>
        </div>
        <div className="p-4 border-t dark:border-slate-800 bg-gray-50 dark:bg-slate-800/50 rounded-b-2xl">
          <button onClick={onClose} className="w-full bg-blue-500 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-600 transition duration-300">
            Accept and Close
          </button>
        </div>
      </div>
    </div>
  );
}
