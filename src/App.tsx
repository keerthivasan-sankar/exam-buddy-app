import React, { useState, useEffect, createContext, useContext } from 'react';
import { Compass, Users, BookOpen, User as UserIcon, MessageCircle, MoreVertical, Ban, LogIn, MapPin, Calendar } from 'lucide-react';
import ExamsList from './components/ExamsList';
import MatchList from './components/MatchList';
import Profile from './components/Profile';
import { motion, AnimatePresence } from 'motion/react';
import { useTheme } from './hooks/useTheme';
import { AppContext } from './AppContext';
import { db } from './lib/firebase';
import { query, collection, where, onSnapshot, getDoc, doc, deleteDoc, updateDoc } from 'firebase/firestore';
import { Chat, User } from './types';

import AddExamModal from './components/AddExamModal';

function Dashboard({ setActiveTab }: { setActiveTab: (tab: string) => void }) {
  const [isExamModalOpen, setIsExamModalOpen] = useState(false);
  const { exams } = useContext(AppContext);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24 md:pb-0">
      <div className="bg-white dark:bg-gray-800 px-6 pt-12 md:pt-8 pb-6 shadow-sm sticky top-0 z-10 md:hidden">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">ExamBuddy</h1>
        <p className="text-gray-500 dark:text-gray-400 text-sm mt-1">Connect, Travel, Succeed.</p>
      </div>
      <div className="hidden md:block bg-white dark:bg-gray-800 px-8 pt-8 pb-6 shadow-sm sticky top-0 z-10">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Home Dashboard</h1>
      </div>
      
      <div className="p-6 md:p-8 overflow-y-auto flex-1 w-full max-w-5xl mx-auto">
        {/* Stats Cards */}
        <div className="mb-8">
          <div className="bg-gradient-to-br from-purple-500 to-purple-600 rounded-3xl p-6 text-white shadow-purple-500/20 shadow-lg flex justify-between items-center">
            <div>
              <h3 className="text-purple-100 text-sm font-semibold uppercase tracking-wider mb-1">Buddies Matched</h3>
              <p className="text-4xl font-bold">14</p>
            </div>
            <div className="w-14 h-14 bg-white/20 rounded-full flex items-center justify-center">
              <Users size={28} className="text-white" />
            </div>
          </div>
        </div>
        
        {/* Quick Actions */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Quick Actions</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <button 
            onClick={() => setIsExamModalOpen(true)}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-blue-50 dark:bg-blue-900/30 flex items-center justify-center text-blue-600 dark:text-blue-400">
              <BookOpen size={28} />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Add Exam</span>
          </button>
          
          <button 
            onClick={() => setActiveTab('matches')}
            className="bg-white dark:bg-gray-800 rounded-2xl p-6 shadow-sm border border-gray-100 dark:border-gray-700 flex flex-col items-center justify-center gap-4 hover:shadow-md hover:-translate-y-1 transition-all"
          >
            <div className="w-14 h-14 rounded-full bg-purple-50 dark:bg-purple-900/30 flex items-center justify-center text-purple-600 dark:text-purple-400">
              <Users size={28} />
            </div>
            <span className="font-semibold text-gray-800 dark:text-gray-200">Find Buddy</span>
          </button>
        </div>
        
        {/* Upcoming Exams */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Upcoming Exams</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6 mb-8">
          {exams.length > 0 ? (
            exams.map((exam, index) => (
              <motion.div 
                key={exam.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white dark:bg-gray-800 rounded-2xl p-5 md:p-6 shadow-sm border border-gray-100 dark:border-gray-700 relative overflow-hidden hover:shadow-md transition-shadow"
              >
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500"></div>
                
                <div className="flex justify-between items-start mb-4 md:mb-6">
                  <div>
                    <h3 className="text-lg font-bold text-gray-900 dark:text-white">{exam.examName}</h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 flex items-center mt-1 font-medium">
                      <Calendar size={14} className="mr-1.5 text-blue-500" />
                      {new Date(exam.examDate).toLocaleDateString('en-US', { weekday: 'short', month: 'short', day: 'numeric', year: 'numeric' })}
                    </p>
                  </div>
                  <span className="bg-blue-50 dark:bg-blue-900/30 text-blue-700 dark:text-blue-400 text-xs font-bold px-3 py-1.5 rounded-full shadow-sm">
                    Upcoming
                  </span>
                </div>
                
                <div className="space-y-2 mt-4 pt-4 border-t border-gray-50 dark:border-gray-700">
                  <div className="flex items-start text-sm text-gray-600 dark:text-gray-300">
                    <MapPin size={16} className="mr-2 mt-0.5 text-gray-400 dark:text-gray-500 shrink-0" />
                    <span>
                      <span className="block font-medium text-gray-900 dark:text-gray-200 mb-0.5">{exam.examCity}</span>
                      <span className="text-gray-500 dark:text-gray-400 text-xs">{exam.examCenter}</span>
                    </span>
                  </div>
                </div>
              </motion.div>
            ))
          ) : (
            <div className="col-span-full bg-white dark:bg-gray-800 rounded-2xl p-8 text-center border border-dashed border-gray-200 dark:border-gray-700">
              <p className="text-gray-500 dark:text-gray-400 mb-4">You haven't added any exams yet.</p>
              <button 
                onClick={() => setIsExamModalOpen(true)}
                className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-sm hover:bg-blue-700 transition-colors inline-flex items-center text-sm font-medium"
              >
                <BookOpen size={16} className="mr-2" />
                Add Your First Exam
              </button>
            </div>
          )}
        </div>

        {/* Safety Tips */}
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-4 tracking-tight">Safety Tips</h2>
        <div className="bg-amber-50 dark:bg-amber-900/20 rounded-2xl p-6 border border-amber-100 dark:border-amber-800/30 max-w-2xl">
          <div className="flex gap-4">
            <div className="w-12 h-12 shrink-0 rounded-full bg-amber-100 dark:bg-amber-900/50 flex items-center justify-center text-amber-600 dark:text-amber-400">
              <ShieldCheckIcon />
            </div>
            <div>
              <h4 className="font-bold text-amber-900 dark:text-amber-400 text-base">Always verify buddies</h4>
              <p className="text-amber-700 dark:text-amber-500 text-sm mt-1.5 leading-relaxed">Meet in public places and verify ID details before confirming travel plans.</p>
            </div>
          </div>
        </div>
      </div>
      <AddExamModal isOpen={isExamModalOpen} onClose={() => setIsExamModalOpen(false)} />
    </div>
  );
}

function ShieldCheckIcon() {
  return (
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z"/><path d="m9 12 2 2 4-4"/></svg>
  );
}

import ChatRoom from './components/ChatRoom';

function ChatList() {
  const { user } = useContext(AppContext);
  const [chats, setChats] = useState<Chat[]>([]);
  const [showMenuId, setShowMenuId] = useState<string | null>(null);
  const [activeChat, setActiveChat] = useState<Chat | null>(null);

  useEffect(() => {
    if (!user) return;
    const q = query(collection(db, 'chats'), where('participants', 'array-contains', user.id));
    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const loadedChats: Chat[] = [];
      for (const docSnap of snapshot.docs) {
        const chatData = { id: docSnap.id, ...docSnap.data() } as Chat;
        if (chatData.type === 'direct') {
          const buddyId = chatData.participants.find(id => id !== user.id);
          if (buddyId) {
            const buddyDoc = await getDoc(doc(db, 'users', buddyId));
            if (buddyDoc.exists()) {
              chatData.buddy = { id: buddyDoc.id, ...buddyDoc.data() } as User;
            }
          }
        }
        loadedChats.push(chatData);
      }
      setChats(loadedChats.sort((a, b) => b.timestamp - a.timestamp));
    });
    return () => unsubscribe();
  }, [user]);

  const handleBlock = async (chat: Chat, e: React.MouseEvent) => {
    e.stopPropagation();
    if (!user) return;
    try {
      if (chat.type === 'group') {
        const chatRef = doc(db, 'chats', chat.id);
        const newParticipants = chat.participants.filter(p => p !== user.id);
        if (newParticipants.length === 0) {
          await deleteDoc(chatRef);
        } else {
          await updateDoc(chatRef, { participants: newParticipants });
        }
      } else {
        await deleteDoc(doc(db, 'chats', chat.id));
      }
      if (activeChat?.id === chat.id) {
        setActiveChat(null);
      }
    } catch (error) {
      console.error("Error modifying chat", error);
    }
    setShowMenuId(null);
  };

  if (activeChat) {
    return <ChatRoom chat={activeChat} onBack={() => setActiveChat(null)} />;
  }

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24 md:pb-0">
      <div className="bg-white dark:bg-gray-800 px-6 md:px-8 pt-12 md:pt-8 pb-4 shadow-sm sticky top-0 z-10 flex justify-between items-center">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">Messages</h1>
      </div>
      <div className="p-4 md:p-8 overflow-y-auto flex-1 w-full max-w-4xl mx-auto">
        <AnimatePresence>
          {chats.length === 0 ? (
            <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="text-center py-12">
              <p className="text-gray-500 dark:text-gray-400">No messages yet.</p>
            </motion.div>
          ) : (
            chats.map((chat) => (
              <motion.div 
                key={chat.id}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, x: -20, scale: 0.95 }}
                onClick={() => setActiveChat(chat)}
                className="bg-white dark:bg-gray-800 rounded-2xl p-4 shadow-sm border border-gray-100 dark:border-gray-700 flex items-center gap-4 mb-3 hover:bg-gray-50 dark:hover:bg-gray-700/50 cursor-pointer transition-colors relative"
              >
                <div className="relative shrink-0">
                  <div className="w-14 h-14 rounded-full bg-gray-100 dark:bg-gray-700 flex items-center justify-center overflow-hidden">
                    {chat.type === 'group' ? (
                      <Users size={24} className="text-gray-400" />
                    ) : (
                      <img src={chat.buddy?.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${chat.buddy?.id}`} alt={chat.buddy?.name} className="w-full h-full object-cover" />
                    )}
                  </div>
                </div>
                <div className="flex-1 min-w-0 pr-8">
                  <div className="flex justify-between items-baseline mb-0.5">
                    <h3 className="text-base font-bold text-gray-900 dark:text-white truncate">
                      {chat.type === 'group' ? chat.name : chat.buddy?.name}
                    </h3>
                    <span className="text-xs text-gray-400 dark:text-gray-500 whitespace-nowrap ml-2">
                      {new Date(chat.timestamp).toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})}
                    </span>
                  </div>
                  <p className="text-sm truncate text-gray-500 dark:text-gray-400">
                    {chat.lastMessage}
                  </p>
                </div>

                <div className="absolute right-3 top-1/2 -translate-y-1/2">
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setShowMenuId(showMenuId === chat.id ? null : chat.id);
                    }}
                    className="p-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300 rounded-full hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors"
                  >
                    <MoreVertical size={18} />
                  </button>
                  
                  {showMenuId === chat.id && (
                    <div className="absolute right-0 top-10 w-40 bg-white dark:bg-gray-800 rounded-xl shadow-lg border border-gray-100 dark:border-gray-700 overflow-hidden z-20">
                      <button 
                        onClick={(e) => handleBlock(chat, e)}
                        className="w-full text-left px-4 py-3 text-sm text-red-600 dark:text-red-400 hover:bg-red-50 dark:hover:bg-red-900/20 font-medium flex items-center transition-colors"
                      >
                        <Ban size={16} className="mr-2" />
                        {chat.type === 'group' ? 'Leave Group' : 'Block User'}
                      </button>
                    </div>
                  )}
                </div>
              </motion.div>
            ))
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export const ThemeContext = createContext({
  theme: 'light',
  toggleTheme: () => {}
});

export default function App() {
  const [activeTab, setActiveTab] = useState('home');
  const { theme, toggleTheme } = useTheme();
  const { user, loading, login, loginAnonymously } = useContext(AppContext);

  const tabs = [
    { id: 'home', icon: Compass, label: 'Home' },
    { id: 'matches', icon: Users, label: 'Buddies' },
    { id: 'chat', icon: MessageCircle, label: 'Chat' },
    { id: 'profile', icon: UserIcon, label: 'Profile' }
  ];

  const renderContent = () => {
    switch (activeTab) {
      case 'home': return <Dashboard setActiveTab={setActiveTab} />;
      case 'matches': return <MatchList setActiveTab={setActiveTab} />;
      case 'chat': return <ChatList />;
      case 'profile': return <Profile />;
      default: return <Dashboard setActiveTab={setActiveTab} />;
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent"></div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 flex flex-col items-center justify-center p-6">
        <div className="bg-white dark:bg-gray-800 rounded-3xl p-8 shadow-xl max-w-sm w-full text-center border border-gray-100 dark:border-gray-700">
          <div className="w-16 h-16 bg-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-6 shadow-lg shadow-blue-500/30">
            <span className="text-white font-black text-2xl">EB</span>
          </div>
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Welcome to ExamBuddy</h1>
          <p className="text-gray-500 dark:text-gray-400 mb-8 text-sm">Connect, Travel, Succeed.</p>
          
          <div className="flex flex-col gap-3">
            <button 
              onClick={login}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3.5 px-4 rounded-xl transition-colors shadow-md flex items-center justify-center gap-2"
            >
              <LogIn size={20} />
              Continue with Google
            </button>
            <button 
              onClick={loginAnonymously}
              className="w-full bg-gray-100 hover:bg-gray-200 dark:bg-gray-700 dark:hover:bg-gray-600 text-gray-700 dark:text-gray-300 font-bold py-3.5 px-4 rounded-xl transition-colors shadow-sm flex items-center justify-center gap-2"
            >
              <UserIcon size={20} />
              Continue as Guest
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      <div className="h-screen w-full bg-gray-50 dark:bg-gray-900 flex overflow-hidden">
        
        {/* Desktop Sidebar Navigation */}
        <div className="hidden md:flex flex-col w-64 bg-white dark:bg-gray-800 border-r border-gray-100 dark:border-gray-700 z-20 shrink-0">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight flex items-center">
              <span className="w-8 h-8 bg-blue-600 rounded-lg flex items-center justify-center mr-2 text-white font-black text-sm">EB</span>
              ExamBuddy
            </h1>
            <p className="text-gray-500 dark:text-gray-400 text-xs mt-2 font-medium uppercase tracking-wider">Connect, Travel, Succeed</p>
          </div>
          <div className="flex-1 px-4 space-y-2 mt-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`w-full flex items-center p-3 rounded-xl transition-colors ${
                    isActive ? 'bg-blue-50 dark:bg-blue-900/20 text-blue-600 dark:text-blue-400 font-semibold' : 'text-gray-600 dark:text-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700/50 font-medium'
                  }`}
                >
                  <Icon size={20} strokeWidth={isActive ? 2.5 : 2} className={`mr-3 ${isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500'}`} />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          <div className="p-6 border-t border-gray-100 dark:border-gray-700">
            <div className="flex items-center gap-3">
              <img src={user.avatar || `https://api.dicebear.com/7.x/avataaars/svg?seed=${user.id}`} alt={user.name} className="w-10 h-10 rounded-full bg-gray-100 dark:bg-gray-700 border border-gray-200 dark:border-gray-600" />
              <div className="flex-1 min-w-0">
                <p className="text-sm font-bold text-gray-900 dark:text-white truncate">{user.name}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="flex-1 flex flex-col relative w-full bg-white dark:bg-gray-900 overflow-hidden">
          <div className="flex-1 overflow-hidden relative">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="h-full"
              >
                {renderContent()}
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Mobile Bottom Navigation */}
          <div className="md:hidden absolute bottom-0 left-0 right-0 bg-white dark:bg-gray-800 border-t border-gray-100 dark:border-gray-700 pb-safe pt-2 px-6 z-20 shadow-[0_-4px_20px_rgba(0,0,0,0.05)] dark:shadow-none">
            <div className="flex justify-between items-center pb-4">
              {tabs.map((tab) => {
                const Icon = tab.icon;
                const isActive = activeTab === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`flex flex-col items-center justify-center p-2 gap-1 w-16 transition-colors ${
                      isActive ? 'text-blue-600 dark:text-blue-400' : 'text-gray-400 dark:text-gray-500 hover:text-gray-600 dark:hover:text-gray-300'
                    }`}
                  >
                    <div className={`relative ${isActive ? 'scale-110' : ''} transition-transform`}>
                      <Icon size={24} strokeWidth={isActive ? 2.5 : 2} />
                      {isActive && (
                        <motion.div
                          layoutId="nav-indicator"
                          className="absolute -bottom-2 left-1/2 -translate-x-1/2 w-1 h-1 bg-blue-600 dark:bg-blue-400 rounded-full"
                        />
                      )}
                    </div>
                    <span className="text-[10px] font-medium">{tab.label}</span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </ThemeContext.Provider>
  );
}
