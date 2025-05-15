import React from 'react';
import { Button } from '@/components/ui/button';

interface QuickActionsProps {
  date: string;
  onNewTask: () => void;
}

const QuickActions: React.FC<QuickActionsProps> = ({ date, onNewTask }) => {
  return (
    <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
      <div>
        <h1 className="text-2xl font-semibold text-neutral-900">Today's Tasks</h1>
        <p className="text-neutral-500 mt-1">{date}</p>
      </div>
      <div className="flex gap-3">
        <div className="relative">
          <Button variant="outline" className="flex items-center gap-2">
            <i className="ri-sort-desc"></i>
            <span className="text-sm font-medium">Sort</span>
          </Button>
        </div>
        <Button 
          onClick={onNewTask}
          className="flex items-center gap-2 px-4 py-2 bg-primary-600 text-white rounded-lg shadow-sm hover:bg-primary-700 transition-colors"
        >
          <i className="ri-add-line"></i>
          <span className="text-sm font-medium">New Task</span>
        </Button>
      </div>
    </div>
  );
};

export default QuickActions;
