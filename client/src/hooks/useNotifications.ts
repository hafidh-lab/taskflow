import { useState, useEffect } from 'react';
import { Task } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';
import { formatDistanceToNow } from 'date-fns';

interface Notification {
  id: string;
  title: string;
  message: string;
  type: 'reminder' | 'info' | 'success' | 'error';
  isVisible: boolean;
  task?: Task;
}

export function useNotifications(tasks: Task[]) {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { toast } = useToast();
  
  useEffect(() => {
    // Check for upcoming tasks that have reminders enabled
    const now = new Date();
    const checkInterval = setInterval(() => {
      const upcomingTasks = tasks.filter(task => {
        if (!task.dueDate || !task.reminder || task.completed) return false;
        
        const dueDate = new Date(task.dueDate);
        const timeDiff = dueDate.getTime() - now.getTime();
        
        // Notify for tasks that are due in 30 minutes or less
        return timeDiff > 0 && timeDiff <= 30 * 60 * 1000;
      });
      
      upcomingTasks.forEach(task => {
        const dueDate = new Date(task.dueDate!);
        const timeUntilDue = formatDistanceToNow(dueDate, { addSuffix: true });
        
        // Generate a unique notification ID using the task ID and current time
        const notificationId = `task-${task.id}-${Date.now()}`;
        
        // Check if we've already notified for this task recently
        const alreadyNotified = notifications.some(n => 
          n.task?.id === task.id && Date.now() - parseInt(n.id.split('-')[2]) < 15 * 60 * 1000
        );
        
        if (!alreadyNotified) {
          const newNotification: Notification = {
            id: notificationId,
            title: 'Task Reminder',
            message: `Your task "${task.title}" is due ${timeUntilDue}.`,
            type: 'reminder',
            isVisible: true,
            task,
          };
          
          setNotifications(prev => [...prev, newNotification]);
          
          // Also show as a toast
          toast({
            title: 'Task Reminder',
            description: `Your task "${task.title}" is due ${timeUntilDue}.`,
          });
        }
      });
    }, 60000); // Check every minute
    
    return () => clearInterval(checkInterval);
  }, [tasks, toast]);
  
  const dismissNotification = (id: string) => {
    setNotifications(prev => 
      prev.map(notification => 
        notification.id === id 
          ? { ...notification, isVisible: false } 
          : notification
      )
    );
    
    // Remove dismissed notifications after animation completes
    setTimeout(() => {
      setNotifications(prev => prev.filter(notification => notification.id !== id));
    }, 300);
  };
  
  const addNotification = (notification: Omit<Notification, 'id' | 'isVisible'>) => {
    const newNotification: Notification = {
      ...notification,
      id: `manual-${Date.now()}`,
      isVisible: true,
    };
    
    setNotifications(prev => [...prev, newNotification]);
    
    // Also show as a toast
    toast({
      title: notification.title,
      description: notification.message,
      variant: notification.type === 'error' ? 'destructive' : 'default',
    });
  };
  
  return {
    notifications: notifications.filter(n => n.isVisible),
    dismissNotification,
    addNotification,
  };
}
