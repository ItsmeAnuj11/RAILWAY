export interface Citation {
  uri: string;
  title: string;
}

export interface Message {
  text: string;
  sender: 'user' | 'bot';
  citations?: Citation[];
}

export interface Complaint {
  id: string;
  userName: string;
  userEmail: string;
  phone: string;
  pnr: string;
  type: string;
  description: string;
  status: 'Pending' | 'In Progress' | 'Resolved';
  adminFeedback?: string;
  createdAt?: string;
}

export interface User {
  name: string;
  email: string;
  phone: string;
  role: 'user' | 'admin';
}

export interface Feedback {
  id: string;
  userName: string;
  userEmail: string;
  pnr: string;
  foodRating: number;
  cleanlinessRating: number;
  punctualityRating: number;
  comment: string;
  timestamp: string;
}

export interface Feedback {
  id: string;
  userName: string;
  userEmail: string;
  pnr: string;
  foodRating: number;
  cleanlinessRating: number;
  punctualityRating: number;
  comment: string;
  timestamp: string;
}
