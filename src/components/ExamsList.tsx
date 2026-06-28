import React, { useContext, useState } from 'react';
import { BookOpen, MapPin, Calendar, Clock, Plus } from 'lucide-react';
import { AppContext } from '../AppContext';
import { motion } from 'motion/react';
import AddExamModal from './AddExamModal';

export default function ExamsList() {
  const { exams } = useContext(AppContext);
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <div className="flex flex-col h-full bg-gray-50 dark:bg-gray-900 pb-24 md:pb-0">
      <div className="bg-white dark:bg-gray-800 px-6 md:px-8 pt-12 md:pt-8 pb-4 shadow-sm sticky top-0 z-10 flex justify-center">
        <div className="w-full max-w-4xl flex justify-between items-center">
          <h1 className="text-2xl font-bold text-gray-900 dark:text-white tracking-tight">My Exams</h1>
          <button 
            onClick={() => setIsModalOpen(true)}
            className="px-4 py-2 bg-blue-600 text-white rounded-full shadow-md hover:bg-blue-700 transition-colors flex items-center font-medium text-sm"
          >
            <Plus size={18} className="mr-1.5" />
            Add Exam
          </button>
        </div>
      </div>
      
      <div className="p-6 md:p-8 overflow-y-auto flex-1 w-full max-w-4xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
          {exams.map((exam, index) => (
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
          ))}
        </div>
      </div>
      <AddExamModal isOpen={isModalOpen} onClose={() => setIsModalOpen(false)} />
    </div>
  );
}
