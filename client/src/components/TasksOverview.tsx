import React from 'react';

interface TasksOverviewProps {
  pending: number;
  inProgress: number;
  completed: number;
  pendingPercent: number;
  inProgressPercent: number;
  completedPercent: number;
}

const TasksOverview: React.FC<TasksOverviewProps> = ({
  pending,
  inProgress,
  completed,
  pendingPercent,
  inProgressPercent,
  completedPercent
}) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 text-sm">Pending</p>
            <p className="text-2xl font-semibold mt-1">{pending}</p>
          </div>
          <div className="bg-amber-100 text-amber-700 p-2 rounded-full">
            <i className="ri-time-line text-lg"></i>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-amber-400 rounded-full" 
              style={{ width: `${pendingPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 text-sm">In Progress</p>
            <p className="text-2xl font-semibold mt-1">{inProgress}</p>
          </div>
          <div className="bg-blue-100 text-blue-700 p-2 rounded-full">
            <i className="ri-loader-3-line text-lg"></i>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-blue-400 rounded-full" 
              style={{ width: `${inProgressPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
      
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 p-4">
        <div className="flex justify-between items-start">
          <div>
            <p className="text-neutral-500 text-sm">Completed</p>
            <p className="text-2xl font-semibold mt-1">{completed}</p>
          </div>
          <div className="bg-green-100 text-green-700 p-2 rounded-full">
            <i className="ri-check-line text-lg"></i>
          </div>
        </div>
        <div className="mt-3">
          <div className="h-2 w-full bg-neutral-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-green-400 rounded-full" 
              style={{ width: `${completedPercent}%` }}
            ></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TasksOverview;
