import React, { useEffect } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { RadioGroup, RadioGroupItem } from '@/components/ui/radio-group';
import { Checkbox } from '@/components/ui/checkbox';
import { useCategories } from '@/hooks/useCategories';
import { useTasks } from '@/hooks/useTasks';
import { useTaskContext } from '@/context/TaskContext';
import { formatDateForInput, formatTimeForInput, combineDateAndTime } from '@/lib/date';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';

const taskFormSchema = z.object({
  title: z.string().min(1, 'Title is required').max(100),
  description: z.string().optional(),
  date: z.string().optional(),
  time: z.string().optional(),
  categoryId: z.coerce.number(),
  priority: z.enum(['low', 'medium', 'high']),
  reminder: z.boolean().default(false),
});

type TaskFormValues = z.infer<typeof taskFormSchema>;

interface TaskFormProps {
  onClose: () => void;
}

const TaskForm: React.FC<TaskFormProps> = ({ onClose }) => {
  const { categories, createCategory } = useCategories();
  const { createTask, updateTask, isCreating, isUpdating } = useTasks();
  const { editingTask } = useTaskContext();
  const [newCategoryName, setNewCategoryName] = React.useState('');
  const [newCategoryIcon, setNewCategoryIcon] = React.useState('ri-list-check');
  const [selectedTab, setSelectedTab] = React.useState('details');
  
  let defaultValues: TaskFormValues = {
    title: '',
    description: '',
    date: new Date().toISOString().split('T')[0],
    time: new Date().toLocaleTimeString('en-US', { 
      hour12: false, 
      hour: '2-digit', 
      minute: '2-digit'
    }),
    categoryId: categories.length > 0 ? categories[0].id : 0,
    priority: 'medium',
    reminder: false,
  };
  
  if (editingTask) {
    const dueDate = editingTask.dueDate ? new Date(editingTask.dueDate) : new Date();
    defaultValues = {
      title: editingTask.title,
      description: editingTask.description || '',
      date: formatDateForInput(dueDate),
      time: formatTimeForInput(dueDate),
      categoryId: editingTask.categoryId || (categories.length > 0 ? categories[0].id : 0),
      priority: editingTask.priority as 'low' | 'medium' | 'high',
      reminder: editingTask.reminder || false,
    };
  }
  
  const form = useForm<TaskFormValues>({
    resolver: zodResolver(taskFormSchema),
    defaultValues
  });
  
  // Update form values when editingTask changes
  useEffect(() => {
    if (editingTask) {
      const dueDate = editingTask.dueDate ? new Date(editingTask.dueDate) : new Date();
      form.reset({
        title: editingTask.title,
        description: editingTask.description || '',
        date: formatDateForInput(dueDate),
        time: formatTimeForInput(dueDate),
        categoryId: editingTask.categoryId || (categories.length > 0 ? categories[0].id : 0),
        priority: editingTask.priority as 'low' | 'medium' | 'high',
        reminder: editingTask.reminder || false,
      });
    }
  }, [editingTask, form, categories]);
  
  const onSubmit = (data: TaskFormValues) => {
    // Combine date and time into a single Date object if both are provided
    let dueDate: Date | undefined;
    if (data.date && data.time) {
      dueDate = combineDateAndTime(data.date, data.time);
    }
    
    const taskData = {
      title: data.title,
      description: data.description,
      dueDate,
      categoryId: data.categoryId,
      priority: data.priority,
      reminder: data.reminder,
    };
    
    if (editingTask) {
      updateTask({ id: editingTask.id, ...taskData });
    } else {
      createTask(taskData);
    }
    
    onClose();
  };
  
  const isSubmitting = isCreating || isUpdating;
  
  const handleNewCategory = () => {
    if (newCategoryName.trim()) {
      createCategory({
        name: newCategoryName.trim(),
        icon: newCategoryIcon
      });
      setNewCategoryName('');
    }
  };
  
  const iconOptions = [
    { value: 'ri-home-line', label: 'Home' },
    { value: 'ri-briefcase-line', label: 'Work' },
    { value: 'ri-book-line', label: 'Learning' },
    { value: 'ri-shopping-cart-line', label: 'Shopping' },
    { value: 'ri-heart-line', label: 'Health' },
    { value: 'ri-calendar-line', label: 'Calendar' },
    { value: 'ri-list-check', label: 'Tasks' }
  ];

  return (
    <Dialog open={true} onOpenChange={() => !isSubmitting && onClose()}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{editingTask ? 'Edit Task' : 'New Task'}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" value={selectedTab} onValueChange={setSelectedTab}>
          <TabsList className="grid w-full grid-cols-2">
            <TabsTrigger value="details">Task Details</TabsTrigger>
            <TabsTrigger value="categories">Categories</TabsTrigger>
          </TabsList>
          
          <TabsContent value="details">
            <Form {...form}>
              <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                <FormField
                  control={form.control}
                  name="title"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Title</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="Task title" 
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Description</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="Task description" 
                          rows={3}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid grid-cols-2 gap-4">
                  <FormField
                    control={form.control}
                    name="date"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Date</FormLabel>
                        <FormControl>
                          <Input 
                            type="date" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="time"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Time</FormLabel>
                        <FormControl>
                          <Input 
                            type="time" 
                            {...field} 
                          />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="categoryId"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Category</FormLabel>
                      <Select 
                        onValueChange={field.onChange} 
                        value={String(field.value)}
                      >
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="Select a category" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          {categories.map(category => (
                            <SelectItem key={category.id} value={String(category.id)}>
                              <div className="flex items-center">
                                <i className={`${category.icon} mr-2`}></i>
                                <span>{category.name}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="priority"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Priority</FormLabel>
                      <FormControl>
                        <RadioGroup
                          onValueChange={field.onChange}
                          value={field.value}
                          className="flex gap-3"
                        >
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="low" className="text-green-600" />
                            </FormControl>
                            <FormLabel className="text-sm text-neutral-700 cursor-pointer">Low</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="medium" className="text-amber-600" />
                            </FormControl>
                            <FormLabel className="text-sm text-neutral-700 cursor-pointer">Medium</FormLabel>
                          </FormItem>
                          <FormItem className="flex items-center space-x-2 space-y-0">
                            <FormControl>
                              <RadioGroupItem value="high" className="text-red-600" />
                            </FormControl>
                            <FormLabel className="text-sm text-neutral-700 cursor-pointer">High</FormLabel>
                          </FormItem>
                        </RadioGroup>
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="reminder"
                  render={({ field }) => (
                    <FormItem className="flex items-center space-x-2 space-y-0">
                      <FormControl>
                        <Checkbox
                          checked={field.value}
                          onCheckedChange={field.onChange}
                        />
                      </FormControl>
                      <FormLabel className="text-sm text-neutral-700 cursor-pointer">
                        Set reminder notification
                      </FormLabel>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <DialogFooter className="mt-6">
                  <Button
                    type="button"
                    variant="outline"
                    onClick={onClose}
                    disabled={isSubmitting}
                  >
                    Cancel
                  </Button>
                  <Button type="submit" disabled={isSubmitting}>
                    {isSubmitting ? (
                      <div className="flex items-center">
                        <i className="ri-loader-4-line animate-spin mr-2"></i>
                        {editingTask ? 'Updating...' : 'Creating...'}
                      </div>
                    ) : (
                      editingTask ? 'Update Task' : 'Create Task'
                    )}
                  </Button>
                </DialogFooter>
              </form>
            </Form>
          </TabsContent>
          
          <TabsContent value="categories">
            <div className="space-y-4">
              <div className="grid gap-4">
                <h3 className="text-sm font-medium">Current Categories</h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map(category => (
                    <Badge key={category.id} variant="outline" className="flex items-center gap-1 p-2">
                      <i className={`${category.icon}`}></i>
                      <span>{category.name}</span>
                    </Badge>
                  ))}
                </div>
                
                <div className="border-t border-neutral-200 pt-4 mt-2">
                  <h3 className="text-sm font-medium mb-2">Add New Category</h3>
                  <div className="grid gap-2">
                    <div className="flex gap-2">
                      <Input 
                        placeholder="Category name" 
                        value={newCategoryName}
                        onChange={(e) => setNewCategoryName(e.target.value)}
                      />
                      <Select 
                        value={newCategoryIcon}
                        onValueChange={setNewCategoryIcon}
                      >
                        <SelectTrigger className="w-[120px]">
                          <SelectValue>
                            <i className={newCategoryIcon}></i>
                          </SelectValue>
                        </SelectTrigger>
                        <SelectContent>
                          {iconOptions.map(icon => (
                            <SelectItem key={icon.value} value={icon.value}>
                              <div className="flex items-center">
                                <i className={`${icon.value} mr-2`}></i>
                                <span>{icon.label}</span>
                              </div>
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <Button 
                      type="button" 
                      onClick={handleNewCategory}
                      disabled={!newCategoryName.trim()}
                    >
                      Add Category
                    </Button>
                  </div>
                </div>
              </div>
              
              <DialogFooter>
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => setSelectedTab('details')}
                >
                  Back to Task
                </Button>
              </DialogFooter>
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default TaskForm;
