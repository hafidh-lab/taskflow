import React from 'react';
import { Task, Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date';

interface TasksListProps {
  tasks: Task[];
  categories: Category[];
  onTaskComplete: (data: { id: number; completed: boolean }) => void;
  onTaskDelete: (id: number) => void;
}

const TasksList: React.FC<TasksListProps> = ({ 
  tasks, 
  categories,
  onTaskComplete,
  onTaskDelete
}) => {
  const { setEditingTask, openTaskForm } = useTaskContext();
  
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return '';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    openTaskForm();
  };

  const priorityColors = {
    low: 'bg-green-100 text-green-800',
    medium: 'bg-amber-100 text-amber-800',
    high: 'bg-red-100 text-red-800'
  };
  
  // Sort tasks: incomplete first (sorted by priority), then completed
  const sortedTasks = [...tasks].sort((a, b) => {
    // Completed tasks at the end
    if (a.completed !== b.completed) {
      return a.completed ? 1 : -1;
    }
    
    // For incomplete tasks, sort by priority
    if (!a.completed && !b.completed) {
      const priorityOrder = { high: 0, medium: 1, low: 2 };
      return priorityOrder[a.priority as keyof typeof priorityOrder] - 
             priorityOrder[b.priority as keyof typeof priorityOrder];
    }
    
    return 0;
  });

  return (
    <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
      <div className="p-4 border-b border-neutral-200 flex justify-between items-center">
        <h2 className="font-medium text-neutral-900">Tasks</h2>
        <div className="flex gap-2">
          <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700 p-1">
            <i className="ri-refresh-line"></i>
          </Button>
          <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700 p-1">
            <i className="ri-filter-line"></i>
          </Button>
        </div>
      </div>

      {sortedTasks.length === 0 ? (
        <div className="p-8 text-center">
          <div className="inline-flex items-center justify-center p-4 bg-neutral-100 rounded-full mb-4">
            <i className="ri-file-list-3-line text-2xl text-neutral-500"></i>
          </div>
          <h3 className="text-lg font-medium text-neutral-900 mb-1">No tasks found</h3>
          <p className="text-neutral-500 mb-4">Create a new task to get started</p>
          <Button onClick={openTaskForm}>
            <i className="ri-add-line mr-1"></i>
            New Task
          </Button>
        </div>
      ) : (
        <ul className="divide-y divide-neutral-200">
          {sortedTasks.map((task) => (
            <li 
              key={task.id} 
              className={cn(
                "animate-fade-in",
                task.completed ? "bg-neutral-50" : ""
              )}
            >
              <div className={cn(
                "p-4 hover:bg-neutral-50 transition-colors",
                task.completed && "hover:bg-neutral-100"
              )}>
                <div className="flex items-start gap-3">
                  <Button
                    variant="ghost" 
                    size="icon"
                    className={cn(
                      "mt-1 flex-shrink-0 w-5 h-5 rounded-full p-0",
                      task.completed 
                        ? "border-2 border-green-500 bg-green-500 text-white" 
                        : task.priority === 'high'
                          ? "border-2 border-primary-500 flex items-center justify-center hover:bg-primary-50"
                          : "border-2 border-neutral-300 flex items-center justify-center hover:bg-neutral-50"
                    )}
                    onClick={() => onTaskComplete({ id: task.id, completed: !task.completed })}
                  >
                    {task.completed && <i className="ri-check-line text-xs"></i>}
                  </Button>
                  
                  <div className="flex-1 min-w-0">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <h3 className={cn(
                        "text-base font-medium",
                        task.completed 
                          ? "text-neutral-500 line-through" 
                          : "text-neutral-900"
                      )}>
                        {task.title}
                      </h3>
                      <div className="flex items-center gap-2">
                        {!task.completed && (
                          <Badge variant="outline" className={cn(
                            "px-2.5 py-0.5 rounded-full text-xs font-medium",
                            priorityColors[task.priority as keyof typeof priorityColors]
                          )}>
                            {task.priority.charAt(0).toUpperCase() + task.priority.slice(1)} Priority
                          </Badge>
                        )}
                        
                        {task.completed && (
                          <Badge variant="outline" className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-neutral-200 text-neutral-700">
                            Completed
                          </Badge>
                        )}
                        
                        <Badge variant="outline" className="px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
                          {getCategoryName(task.categoryId)}
                        </Badge>
                      </div>
                    </div>
                    
                    {task.description && (
                      <p className={cn(
                        "text-sm mt-1",
                        task.completed 
                          ? "text-neutral-500 line-through" 
                          : "text-neutral-600"
                      )}>
                        {task.description}
                      </p>
                    )}
                    
                    {task.dueDate && (
                      <div className="flex flex-wrap items-center gap-3 mt-3">
                        <div className="flex items-center text-sm text-neutral-500">
                          <i className={cn(
                            "mr-1",
                            task.completed ? "ri-calendar-check-line" : "ri-calendar-event-line"
                          )}></i>
                          <span>
                            {task.completed 
                              ? "Completed today" 
                              : formatDate(task.dueDate)
                            }
                          </span>
                        </div>
                        
                        {task.reminder && !task.completed && (
                          <div className="flex items-center text-sm text-neutral-500">
                            <i className="ri-alarm-line mr-1"></i>
                            <span>Reminder set</span>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                  
                  <div className="flex items-center gap-1 ml-2">
                    {!task.completed && (
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
                        onClick={() => handleEditTask(task)}
                      >
                        <i className="ri-pencil-line"></i>
                      </Button>
                    )}
                    
                    <Button 
                      variant="ghost" 
                      size="icon"
                      className="text-neutral-400 hover:text-red-600 p-1 rounded-full hover:bg-neutral-100"
                      onClick={() => onTaskDelete(task.id)}
                    >
                      <i className="ri-delete-bin-line"></i>
                    </Button>
                  </div>
                </div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TasksList;
