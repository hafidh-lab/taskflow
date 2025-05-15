import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Task, InsertTask } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useTasks() {
  const { toast } = useToast();
  
  const tasksQuery = useQuery<Task[]>({
    queryKey: ['/api/tasks'],
  });

  const createTaskMutation = useMutation({
    mutationFn: async (task: Omit<InsertTask, 'userId'>) => {
      const response = await apiRequest('POST', '/api/tasks', task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Task created',
        description: 'Your task has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create task',
        description: error.message || 'There was an error creating your task.',
        variant: 'destructive',
      });
    },
  });

  const updateTaskMutation = useMutation({
    mutationFn: async ({ id, ...task }: { id: number } & Partial<InsertTask>) => {
      const response = await apiRequest('PUT', `/api/tasks/${id}`, task);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Task updated',
        description: 'Your task has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update task',
        description: error.message || 'There was an error updating your task.',
        variant: 'destructive',
      });
    },
  });

  const deleteTaskMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/tasks/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
      toast({
        title: 'Task deleted',
        description: 'Your task has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete task',
        description: error.message || 'There was an error deleting your task.',
        variant: 'destructive',
      });
    },
  });

  const toggleTaskCompleteMutation = useMutation({
    mutationFn: async ({ id, completed }: { id: number; completed: boolean }) => {
      const response = await apiRequest('PUT', `/api/tasks/${id}`, { completed });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/tasks'] });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update task',
        description: error.message || 'There was an error updating your task.',
        variant: 'destructive',
      });
    },
  });

  return {
    tasks: tasksQuery.data || [],
    isLoading: tasksQuery.isLoading,
    error: tasksQuery.error,
    createTask: createTaskMutation.mutate,
    updateTask: updateTaskMutation.mutate,
    deleteTask: deleteTaskMutation.mutate,
    toggleTaskComplete: toggleTaskCompleteMutation.mutate,
    isCreating: createTaskMutation.isPending,
    isUpdating: updateTaskMutation.isPending,
    isDeleting: deleteTaskMutation.isPending,
  };
}
