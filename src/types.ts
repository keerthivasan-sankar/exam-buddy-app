export interface User {
  id: string;
  mobile: string;
  name: string;
  gender: string;
  homeCity: string;
  avatar?: string;
  verified: boolean;
  preferredTransport?: string;
  preferredLanguage?: string;
}

export interface Exam {
  id: string;
  userId: string;
  examName: string;
  examDate: string;
  examCity: string;
  examCenter: string;
}

export interface Match {
  buddy: User;
  exam: Exam;
}

export interface Message {
  id: string;
  userId: string;
  userName: string;
  message: string;
  timestamp: number;
  chatId: string;
  isLocation?: boolean;
}

export interface Chat {
  id: string;
  type?: 'direct' | 'group';
  name?: string;
  examId?: string;
  participants: string[];
  lastMessage: string;
  timestamp: number;
  unreadCount?: Record<string, number>;
  buddy?: User; // Optional for direct chats where we populate it on the fly
}
