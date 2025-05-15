import { useQuery, useMutation } from '@tanstack/react-query';
import { queryClient, apiRequest } from '@/lib/queryClient';
import { Category, InsertCategory } from '@shared/schema';
import { useToast } from '@/hooks/use-toast';

export function useCategories() {
  const { toast } = useToast();
  
  const categoriesQuery = useQuery<Category[]>({
    queryKey: ['/api/categories'],
  });

  const createCategoryMutation = useMutation({
    mutationFn: async (category: Omit<InsertCategory, 'userId'>) => {
      const response = await apiRequest('POST', '/api/categories', category);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Category created',
        description: 'Your category has been created successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to create category',
        description: error.message || 'There was an error creating your category.',
        variant: 'destructive',
      });
    },
  });

  const updateCategoryMutation = useMutation({
    mutationFn: async ({ id, ...category }: { id: number } & Partial<InsertCategory>) => {
      const response = await apiRequest('PUT', `/api/categories/${id}`, category);
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Category updated',
        description: 'Your category has been updated successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to update category',
        description: error.message || 'There was an error updating your category.',
        variant: 'destructive',
      });
    },
  });

  const deleteCategoryMutation = useMutation({
    mutationFn: async (id: number) => {
      await apiRequest('DELETE', `/api/categories/${id}`);
      return id;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/categories'] });
      toast({
        title: 'Category deleted',
        description: 'Your category has been deleted successfully.',
      });
    },
    onError: (error) => {
      toast({
        title: 'Failed to delete category',
        description: error.message || 'There was an error deleting your category.',
        variant: 'destructive',
      });
    },
  });

  return {
    categories: categoriesQuery.data || [],
    isLoading: categoriesQuery.isLoading,
    error: categoriesQuery.error,
    createCategory: createCategoryMutation.mutate,
    updateCategory: updateCategoryMutation.mutate,
    deleteCategory: deleteCategoryMutation.mutate,
    isCreating: createCategoryMutation.isPending,
    isUpdating: updateCategoryMutation.isPending,
    isDeleting: deleteCategoryMutation.isPending,
  };
}
