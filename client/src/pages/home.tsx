import React from 'react';
import Header from '@/components/Header';
import Sidebar from '@/components/Sidebar';
import TasksOverview from '@/components/TasksOverview';
import TasksList from '@/components/TasksList';
import UpcomingTasksCalendar from '@/components/UpcomingTasksCalendar';
import QuickActions from '@/components/QuickActions';
import TaskForm from '@/components/TaskForm';
import { useTasks } from '@/hooks/useTasks';
import { useCategories } from '@/hooks/useCategories';
import { useNotifications } from '@/hooks/useNotifications';
import { useTaskContext } from '@/context/TaskContext';
import { format } from 'date-fns';

const Home: React.FC = () => {
  const { 
    tasks, 
    isLoading: tasksLoading, 
    toggleTaskComplete, 
    deleteTask 
  } = useTasks();
  
  const { categories, isLoading: categoriesLoading } = useCategories();
  
  const { 
    isTaskFormOpen, 
    openTaskForm, 
    closeTaskForm,
    activeCategory,
    activeFilter
  } = useTaskContext();
  
  const { notifications } = useNotifications(tasks);
  
  // Filter tasks based on active category and filter
  const filteredTasks = React.useMemo(() => {
    if (tasksLoading) return [];
    
    let filtered = [...tasks];
    
    // Filter by category
    if (activeCategory !== 'all') {
      filtered = filtered.filter(task => task.categoryId === activeCategory);
    }
    
    // Apply additional filters
    switch (activeFilter) {
      case 'today':
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          return (
            dueDate.getDate() === today.getDate() &&
            dueDate.getMonth() === today.getMonth() &&
            dueDate.getFullYear() === today.getFullYear()
          );
        });
        break;
      case 'upcoming':
        filtered = filtered.filter(task => {
          if (!task.dueDate) return false;
          const dueDate = new Date(task.dueDate);
          const today = new Date();
          today.setHours(0, 0, 0, 0);
          return dueDate > today;
        });
        break;
      case 'priority':
        filtered = filtered.filter(task => task.priority === 'high');
        break;
      case 'completed':
        filtered = filtered.filter(task => task.completed);
        break;
      default:
        // 'all' - no additional filtering
        break;
    }
    
    return filtered;
  }, [tasks, activeCategory, activeFilter, tasksLoading]);
  
  // Calculate task stats
  const taskStats = React.useMemo(() => {
    const total = filteredTasks.length;
    const completed = filteredTasks.filter(task => task.completed).length;
    const pending = filteredTasks.filter(task => !task.completed).length;
    const inProgress = Math.max(0, total - completed - pending);
    
    return {
      total,
      completed,
      pending,
      inProgress,
      pendingPercent: total > 0 ? (pending / total) * 100 : 0,
      inProgressPercent: total > 0 ? (inProgress / total) * 100 : 0,
      completedPercent: total > 0 ? (completed / total) * 100 : 0,
    };
  }, [filteredTasks]);
  
  const today = format(new Date(), 'EEEE, d MMMM yyyy');

  if (tasksLoading || categoriesLoading) {
    return <div className="flex justify-center items-center h-screen">Loading...</div>;
  }

  return (
    <div className="min-h-screen flex flex-col bg-neutral-50 text-neutral-800">
      <Header />
      
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          <Sidebar categories={categories} taskCounts={
            categories.reduce((acc, category) => {
              acc[category.id] = tasks.filter(task => task.categoryId === category.id).length;
              return acc;
            }, {} as Record<number, number>)
          } />
          
          <div className="lg:col-span-9 space-y-6">
            <QuickActions date={today} onNewTask={openTaskForm} />
            
            <TasksOverview 
              pending={taskStats.pending}
              inProgress={taskStats.inProgress}
              completed={taskStats.completed}
              pendingPercent={taskStats.pendingPercent}
              inProgressPercent={taskStats.inProgressPercent}
              completedPercent={taskStats.completedPercent}
            />
            
            <TasksList 
              tasks={filteredTasks}
              categories={categories}
              onTaskComplete={toggleTaskComplete}
              onTaskDelete={deleteTask}
            />
            
            <UpcomingTasksCalendar tasks={tasks} />
          </div>
        </div>
      </main>
      
      {isTaskFormOpen && <TaskForm onClose={closeTaskForm} />}
    </div>
  );
};

export default Home;
