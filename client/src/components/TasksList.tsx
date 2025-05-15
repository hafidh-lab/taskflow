import React, { useState } from 'react';
import { Task, Category } from '@shared/schema';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { useTaskContext } from '@/context/TaskContext';
import { Badge } from '@/components/ui/badge';
import { formatDate } from '@/lib/date';
import { AlertDialog, AlertDialogContent, AlertDialogAction, AlertDialogCancel, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, 
  AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { Label } from '@/components/ui/label';

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
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);
  const [quickEditOpen, setQuickEditOpen] = useState(false);
  const [quickEditTitle, setQuickEditTitle] = useState('');
  const [quickEditDescription, setQuickEditDescription] = useState('');
  const [quickEditPriority, setQuickEditPriority] = useState('');
  const [quickEditCategory, setQuickEditCategory] = useState('');
  const [quickEditReminder, setQuickEditReminder] = useState(false);
  
  const getCategoryName = (categoryId: number | null) => {
    if (!categoryId) return '';
    const category = categories.find(cat => cat.id === categoryId);
    return category ? category.name : '';
  };
  
  const handleEditTask = (task: Task) => {
    setEditingTask(task);
    openTaskForm();
  };

  const handleQuickEditOpen = (task: Task) => {
    setSelectedTask(task);
    setQuickEditTitle(task.title);
    setQuickEditDescription(task.description || '');
    setQuickEditPriority(task.priority);
    setQuickEditCategory(task.categoryId ? String(task.categoryId) : '');
    setQuickEditReminder(task.reminder || false);
    setQuickEditOpen(true);
  };

  const handleQuickEditSave = () => {
    if (!selectedTask) return;
    
    const updatedTask = {
      id: selectedTask.id,
      title: quickEditTitle,
      description: quickEditDescription || null,
      priority: quickEditPriority as 'low' | 'medium' | 'high',
      categoryId: quickEditCategory ? parseInt(quickEditCategory) : null,
      reminder: quickEditReminder
    };
    
    setEditingTask(selectedTask);
    updateQuickEditTask(updatedTask);
    setQuickEditOpen(false);
  };

  const updateQuickEditTask = (task: any) => {
    const existingTask = tasks.find(t => t.id === task.id);
    if (!existingTask) return;
    
    const updatedTask = { ...existingTask, ...task };
    setEditingTask(updatedTask);
    openTaskForm();
    // Let the user manually submit the form
  };

  const confirmDelete = (task: Task) => {
    setSelectedTask(task);
    setDeleteConfirmOpen(true);
  };

  const handleConfirmedDelete = () => {
    if (selectedTask) {
      onTaskDelete(selectedTask.id);
    }
    setDeleteConfirmOpen(false);
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
    <>
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
                        <>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-neutral-400 hover:text-neutral-700 p-1 rounded-full hover:bg-neutral-100"
                            onClick={() => handleQuickEditOpen(task)}
                          >
                            <i className="ri-pencil-line"></i>
                          </Button>
                          <Button 
                            variant="ghost" 
                            size="icon"
                            className="text-neutral-400 hover:text-blue-600 p-1 rounded-full hover:bg-neutral-100"
                            onClick={() => handleEditTask(task)}
                          >
                            <i className="ri-edit-box-line"></i>
                          </Button>
                        </>
                      )}
                      
                      <Button 
                        variant="ghost" 
                        size="icon"
                        className="text-neutral-400 hover:text-red-600 p-1 rounded-full hover:bg-neutral-100"
                        onClick={() => confirmDelete(task)}
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

      {/* Quick Edit Dialog */}
      <AlertDialog open={quickEditOpen} onOpenChange={setQuickEditOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Edit Task</AlertDialogTitle>
            <AlertDialogDescription>
              Make quick changes to your task.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="space-y-4 py-2">
            <div className="space-y-2">
              <Label htmlFor="quick-edit-title">Title</Label>
              <Input 
                id="quick-edit-title" 
                value={quickEditTitle} 
                onChange={(e) => setQuickEditTitle(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-edit-description">Description</Label>
              <Textarea 
                id="quick-edit-description" 
                value={quickEditDescription || ''} 
                onChange={(e) => setQuickEditDescription(e.target.value)} 
              />
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-edit-priority">Priority</Label>
              <Select 
                value={quickEditPriority} 
                onValueChange={setQuickEditPriority}
              >
                <SelectTrigger id="quick-edit-priority">
                  <SelectValue placeholder="Select priority" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="low">Low</SelectItem>
                  <SelectItem value="medium">Medium</SelectItem>
                  <SelectItem value="high">High</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div className="space-y-2">
              <Label htmlFor="quick-edit-category">Category</Label>
              <Select 
                value={quickEditCategory} 
                onValueChange={setQuickEditCategory}
              >
                <SelectTrigger id="quick-edit-category">
                  <SelectValue placeholder="Select category" />
                </SelectTrigger>
                <SelectContent>
                  {categories.map(category => (
                    <SelectItem key={category.id} value={String(category.id)}>
                      {category.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox 
                id="quick-edit-reminder" 
                checked={quickEditReminder} 
                onCheckedChange={(checked) => setQuickEditReminder(checked as boolean)} 
              />
              <Label htmlFor="quick-edit-reminder">Set reminder</Label>
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleQuickEditSave}>Save Changes</AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Delete Confirmation Dialog */}
      <AlertDialog open={deleteConfirmOpen} onOpenChange={setDeleteConfirmOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Task</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this task? This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleConfirmedDelete} className="bg-red-600 hover:bg-red-700">
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default TasksList;
