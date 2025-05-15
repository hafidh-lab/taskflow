import React, { createContext, useContext, useState, ReactNode } from 'react';
import { Task } from '@shared/schema';

interface TaskContextType {
  activeTaskId: number | null;
  setActiveTaskId: (id: number | null) => void;
  isTaskFormOpen: boolean;
  openTaskForm: () => void;
  closeTaskForm: () => void;
  editingTask: Task | null;
  setEditingTask: (task: Task | null) => void;
  activeCategory: number | 'all';
  setActiveCategory: (category: number | 'all') => void;
  activeFilter: string;
  setActiveFilter: (filter: string) => void;
}

const TaskContext = createContext<TaskContextType | undefined>(undefined);

export function TaskProvider({ children }: { children: ReactNode }) {
  const [activeTaskId, setActiveTaskId] = useState<number | null>(null);
  const [isTaskFormOpen, setIsTaskFormOpen] = useState(false);
  const [editingTask, setEditingTask] = useState<Task | null>(null);
  const [activeCategory, setActiveCategory] = useState<number | 'all'>('all');
  const [activeFilter, setActiveFilter] = useState('all');

  const openTaskForm = () => {
    setIsTaskFormOpen(true);
  };

  const closeTaskForm = () => {
    setIsTaskFormOpen(false);
    setEditingTask(null);
  };

  return (
    <TaskContext.Provider
      value={{
        activeTaskId,
        setActiveTaskId,
        isTaskFormOpen,
        openTaskForm,
        closeTaskForm,
        editingTask,
        setEditingTask,
        activeCategory,
        setActiveCategory,
        activeFilter,
        setActiveFilter
      }}
    >
      {children}
    </TaskContext.Provider>
  );
}

export function useTaskContext() {
  const context = useContext(TaskContext);
  if (context === undefined) {
    throw new Error('useTaskContext must be used within a TaskProvider');
  }
  return context;
}
