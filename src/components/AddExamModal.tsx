import React, { useState, useContext } from 'react';
import Modal from './Modal';
import { AppContext } from '../AppContext';

export default function AddExamModal({ isOpen, onClose }: { isOpen: boolean; onClose: () => void }) {
  const { addExam } = useContext(AppContext);
  const [examName, setExamName] = useState('');
  const [examDate, setExamDate] = useState('');
  const [examCity, setExamCity] = useState('');
  const [examCenter, setExamCenter] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!examName || !examDate || !examCity || !examCenter) return;
    
    addExam({
      examName,
      examDate,
      examCity,
      examCenter
    });
    
    // Reset and close
    setExamName('');
    setExamDate('');
    setExamCity('');
    setExamCenter('');
    onClose();
  };

  return (
    <Modal isOpen={isOpen} onClose={onClose} title="Add New Exam">
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Name</label>
          <input 
            type="text" 
            value={examName}
            onChange={(e) => setExamName(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
            placeholder="e.g. GRE General, TOEFL iBT"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Date</label>
          <input 
            type="date" 
            value={examDate}
            onChange={(e) => setExamDate(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam City</label>
          <input 
            type="text" 
            value={examCity}
            onChange={(e) => setExamCity(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
            placeholder="e.g. Boston, New York"
            required
          />
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Exam Center</label>
          <input 
            type="text" 
            value={examCenter}
            onChange={(e) => setExamCenter(e.target.value)}
            className="w-full bg-gray-50 dark:bg-gray-700 border border-gray-200 dark:border-gray-600 rounded-xl px-4 py-2.5 text-sm focus:outline-none focus:ring-2 focus:ring-blue-500/50 text-gray-900 dark:text-white"
            placeholder="e.g. Prometric Center"
            required
          />
        </div>
        <div className="pt-4">
          <button 
            type="submit"
            className="w-full bg-blue-600 hover:bg-blue-700 text-white font-bold py-3 rounded-xl transition-colors shadow-sm"
          >
            Save Exam
          </button>
        </div>
      </form>
    </Modal>
  );
}
