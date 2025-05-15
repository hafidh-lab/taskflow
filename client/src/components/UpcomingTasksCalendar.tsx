import React from 'react';
import { Task } from '@shared/schema';
import { 
  formatDateShort, 
  formatTime, 
  getTomorrowDateWithoutTime, 
  getNextWeekDateWithoutTime 
} from '@/lib/date';
import { format } from 'date-fns';

interface UpcomingTasksCalendarProps {
  tasks: Task[];
}

const UpcomingTasksCalendar: React.FC<UpcomingTasksCalendarProps> = ({ tasks }) => {
  // Get tomorrow and next week dates for comparisons
  const tomorrow = getTomorrowDateWithoutTime();
  const nextWeek = getNextWeekDateWithoutTime();
  
  // Filter and group tasks
  const tomorrowTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const dueDateWithoutTime = new Date(dueDate);
    dueDateWithoutTime.setHours(0, 0, 0, 0);
    return dueDateWithoutTime.getTime() === tomorrow.getTime();
  }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  
  const nextWeekTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const dueDateWithoutTime = new Date(dueDate);
    dueDateWithoutTime.setHours(0, 0, 0, 0);
    return dueDateWithoutTime.getTime() === nextWeek.getTime();
  }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime());
  
  const laterTasks = tasks.filter(task => {
    if (!task.dueDate || task.completed) return false;
    const dueDate = new Date(task.dueDate);
    const dueDateWithoutTime = new Date(dueDate);
    dueDateWithoutTime.setHours(0, 0, 0, 0);
    return dueDateWithoutTime > nextWeek;
  }).sort((a, b) => new Date(a.dueDate!).getTime() - new Date(b.dueDate!).getTime())
  .slice(0, 3); // Limit to 3 tasks
  
  const tomorrowFormatted = format(tomorrow, 'EEEE, d MMMM');
  const nextWeekFormatted = format(nextWeek, 'EEEE, d MMMM');

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-medium text-neutral-900">Upcoming Schedule</h2>
        <a href="#" className="text-sm text-primary-600 hover:text-primary-700">View Calendar</a>
      </div>
      <div className="p-4">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {/* Tomorrow */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-200">
              <h3 className="font-medium">Tomorrow</h3>
              <p className="text-sm text-neutral-500">{tomorrowFormatted}</p>
            </div>
            {tomorrowTasks.length > 0 ? (
              <ul className="divide-y divide-neutral-200">
                {tomorrowTasks.map(task => (
                  <li key={task.id} className="p-3 flex items-start">
                    <div className="flex-shrink-0 w-10 text-center">
                      <span className="text-sm font-medium text-neutral-900">
                        {formatTime(task.dueDate!).split(':')[0]}
                      </span>
                      <span className="block text-xs text-neutral-500">
                        {formatTime(task.dueDate!).split(' ')[1]}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-neutral-500 mt-0.5">{task.description.substring(0, 30)}{task.description.length > 30 ? '...' : ''}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-center text-neutral-500 text-sm">
                No tasks scheduled
              </div>
            )}
          </div>
          
          {/* Next Week */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-200">
              <h3 className="font-medium">Next Week</h3>
              <p className="text-sm text-neutral-500">{nextWeekFormatted}</p>
            </div>
            {nextWeekTasks.length > 0 ? (
              <ul className="divide-y divide-neutral-200">
                {nextWeekTasks.map(task => (
                  <li key={task.id} className="p-3 flex items-start">
                    <div className="flex-shrink-0 w-10 text-center">
                      <span className="text-sm font-medium text-neutral-900">
                        {formatTime(task.dueDate!).split(':')[0]}
                      </span>
                      <span className="block text-xs text-neutral-500">
                        {formatTime(task.dueDate!).split(' ')[1]}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-neutral-500 mt-0.5">{task.description.substring(0, 30)}{task.description.length > 30 ? '...' : ''}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-center text-neutral-500 text-sm">
                No tasks scheduled
              </div>
            )}
          </div>
          
          {/* Later */}
          <div className="border border-neutral-200 rounded-lg overflow-hidden">
            <div className="bg-neutral-100 px-4 py-2 border-b border-neutral-200">
              <h3 className="font-medium">Later</h3>
              <p className="text-sm text-neutral-500">Coming Up</p>
            </div>
            {laterTasks.length > 0 ? (
              <ul className="divide-y divide-neutral-200">
                {laterTasks.map(task => (
                  <li key={task.id} className="p-3 flex items-start">
                    <div className="flex-shrink-0 w-10 text-center">
                      <span className="text-sm font-medium text-neutral-900">
                        {formatDateShort(task.dueDate!).split(' ')[0]}
                      </span>
                      <span className="block text-xs text-neutral-500">
                        {formatDateShort(task.dueDate!).split(' ')[1]}
                      </span>
                    </div>
                    <div className="ml-3 flex-1">
                      <p className="text-sm font-medium text-neutral-900">{task.title}</p>
                      {task.description && (
                        <p className="text-xs text-neutral-500 mt-0.5">{task.description.substring(0, 30)}{task.description.length > 30 ? '...' : ''}</p>
                      )}
                    </div>
                  </li>
                ))}
              </ul>
            ) : (
              <div className="p-3 text-center text-neutral-500 text-sm">
                No tasks scheduled
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default UpcomingTasksCalendar;
