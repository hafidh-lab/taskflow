import React, { useState } from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Category } from '@shared/schema';
import { cn } from '@/lib/utils';
import { useCategories } from '@/hooks/useCategories';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogFooter, DialogDescription } from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, 
  AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle } from '@/components/ui/alert-dialog';

interface SidebarProps {
  categories: Category[];
  taskCounts: Record<number, number>;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, taskCounts }) => {
  const { activeCategory, setActiveCategory, activeFilter, setActiveFilter } = useTaskContext();
  const { updateCategory, deleteCategory } = useCategories();
  
  const [addCategoryOpen, setAddCategoryOpen] = useState(false);
  const [editCategoryOpen, setEditCategoryOpen] = useState(false);
  const [deleteCategoryOpen, setDeleteCategoryOpen] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState<Category | null>(null);
  const [newCategoryName, setNewCategoryName] = useState('');
  const [newCategoryIcon, setNewCategoryIcon] = useState('ri-list-check');
  
  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  
  const handleAddCategory = () => {
    setNewCategoryName('');
    setNewCategoryIcon('ri-list-check');
    setAddCategoryOpen(true);
  };
  
  const handleEditCategory = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setNewCategoryName(category.name);
    setNewCategoryIcon(category.icon);
    setEditCategoryOpen(true);
  };
  
  const handleDeleteCategory = (category: Category, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedCategory(category);
    setDeleteCategoryOpen(true);
  };
  
  const confirmAddCategory = () => {
    // This is handled in TaskForm component
    setAddCategoryOpen(false);
  };
  
  const confirmEditCategory = () => {
    if (selectedCategory && newCategoryName.trim()) {
      updateCategory({
        id: selectedCategory.id,
        name: newCategoryName.trim(),
        icon: newCategoryIcon
      });
      setEditCategoryOpen(false);
    }
  };
  
  const confirmDeleteCategory = () => {
    if (selectedCategory) {
      deleteCategory(selectedCategory.id);
      if (activeCategory === selectedCategory.id) {
        setActiveCategory('all');
      }
      setDeleteCategoryOpen(false);
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
    <>
      <aside className="lg:col-span-3">
        <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
          {/* Categories Section */}
          <div className="p-4">
            <div className="flex justify-between items-center mb-3">
              <h2 className="font-medium text-neutral-900">Categories</h2>
              <Button 
                variant="ghost" 
                size="sm" 
                className="h-8 w-8 p-0"
                onClick={handleAddCategory}
              >
                <i className="ri-add-line text-lg"></i>
              </Button>
            </div>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100",
                    activeCategory === 'all' && "bg-primary-50 text-primary-700 hover:bg-primary-50"
                  )}
                  onClick={() => setActiveCategory('all')}
                >
                  <i className="ri-list-check text-lg mr-2"></i>
                  <span className="text-sm font-medium">All Tasks</span>
                  <span className={cn(
                    "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                    activeCategory === 'all' 
                      ? "bg-primary-100 text-primary-700" 
                      : "bg-neutral-100 text-neutral-600"
                  )}>
                    {totalTasks}
                  </span>
                </Button>
              </li>
              
              {categories.map(category => (
                <li key={category.id}>
                  <div className="group relative">
                    <Button
                      variant="ghost"
                      className={cn(
                        "w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100",
                        activeCategory === category.id && "bg-primary-50 text-primary-700 hover:bg-primary-50"
                      )}
                      onClick={() => setActiveCategory(category.id)}
                    >
                      <i className={`${category.icon} text-lg mr-2`}></i>
                      <span className="text-sm font-medium">{category.name}</span>
                      <span className={cn(
                        "ml-auto text-xs font-medium px-2 py-0.5 rounded-full",
                        activeCategory === category.id 
                          ? "bg-primary-100 text-primary-700" 
                          : "bg-neutral-100 text-neutral-600"
                      )}>
                        {taskCounts[category.id] || 0}
                      </span>
                    </Button>
                    
                    <div className="absolute top-1 right-1 hidden group-hover:flex">
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-neutral-700"
                        onClick={(e) => handleEditCategory(category, e)}
                      >
                        <i className="ri-pencil-line text-sm"></i>
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="icon" 
                        className="h-6 w-6 p-0 text-neutral-400 hover:text-red-600"
                        onClick={(e) => handleDeleteCategory(category, e)}
                      >
                        <i className="ri-delete-bin-line text-sm"></i>
                      </Button>
                    </div>
                  </div>
                </li>
              ))}
              
              <li>
                <Button
                  variant="ghost"
                  className="w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-600 hover:bg-neutral-100"
                  onClick={handleAddCategory}
                >
                  <i className="ri-add-line text-lg mr-2"></i>
                  <span className="text-sm font-medium">Add Category</span>
                </Button>
              </li>
            </ul>
          </div>
          
          {/* Filters Section */}
          <div className="border-t border-neutral-200 p-4">
            <h2 className="font-medium text-neutral-900 mb-3">Filters</h2>
            <ul className="space-y-1">
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100",
                    activeFilter === 'today' && "bg-primary-50 text-primary-700 hover:bg-primary-50"
                  )}
                  onClick={() => setActiveFilter('today')}
                >
                  <i className="ri-time-line text-lg mr-2"></i>
                  <span className="text-sm font-medium">Today</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100",
                    activeFilter === 'upcoming' && "bg-primary-50 text-primary-700 hover:bg-primary-50"
                  )}
                  onClick={() => setActiveFilter('upcoming')}
                >
                  <i className="ri-calendar-line text-lg mr-2"></i>
                  <span className="text-sm font-medium">Upcoming</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100",
                    activeFilter === 'priority' && "bg-primary-50 text-primary-700 hover:bg-primary-50"
                  )}
                  onClick={() => setActiveFilter('priority')}
                >
                  <i className="ri-flag-line text-lg mr-2"></i>
                  <span className="text-sm font-medium">Priority</span>
                </Button>
              </li>
              
              <li>
                <Button
                  variant="ghost"
                  className={cn(
                    "w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-700 hover:bg-neutral-100",
                    activeFilter === 'completed' && "bg-primary-50 text-primary-700 hover:bg-primary-50"
                  )}
                  onClick={() => setActiveFilter('completed')}
                >
                  <i className="ri-checkbox-circle-line text-lg mr-2"></i>
                  <span className="text-sm font-medium">Completed</span>
                </Button>
              </li>
            </ul>
          </div>
        </div>
      </aside>
      
      {/* Add Category Dialog */}
      <Dialog open={addCategoryOpen} onOpenChange={setAddCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Add New Category</DialogTitle>
            <DialogDescription>
              Create a new category to organize your tasks.
            </DialogDescription>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="category-name" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="category-name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="category-icon" className="text-sm font-medium">
                Icon
              </label>
              <Select
                value={newCategoryIcon}
                onValueChange={setNewCategoryIcon}
              >
                <SelectTrigger id="category-icon">
                  <SelectValue>
                    <div className="flex items-center">
                      <i className={`${newCategoryIcon} mr-2`}></i>
                      <span>{iconOptions.find(icon => icon.value === newCategoryIcon)?.label || 'Select icon'}</span>
                    </div>
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setAddCategoryOpen(false)}>Cancel</Button>
            <Button onClick={confirmAddCategory} disabled={!newCategoryName.trim()}>
              Add Category
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Edit Category Dialog */}
      <Dialog open={editCategoryOpen} onOpenChange={setEditCategoryOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Edit Category</DialogTitle>
          </DialogHeader>
          
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <label htmlFor="edit-category-name" className="text-sm font-medium">
                Category Name
              </label>
              <Input
                id="edit-category-name"
                placeholder="Enter category name"
                value={newCategoryName}
                onChange={(e) => setNewCategoryName(e.target.value)}
              />
            </div>
            
            <div className="grid gap-2">
              <label htmlFor="edit-category-icon" className="text-sm font-medium">
                Icon
              </label>
              <Select
                value={newCategoryIcon}
                onValueChange={setNewCategoryIcon}
              >
                <SelectTrigger id="edit-category-icon">
                  <SelectValue>
                    <div className="flex items-center">
                      <i className={`${newCategoryIcon} mr-2`}></i>
                      <span>{iconOptions.find(icon => icon.value === newCategoryIcon)?.label || 'Select icon'}</span>
                    </div>
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
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setEditCategoryOpen(false)}>Cancel</Button>
            <Button onClick={confirmEditCategory} disabled={!newCategoryName.trim()}>
              Save Changes
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
      
      {/* Delete Category Confirmation */}
      <AlertDialog open={deleteCategoryOpen} onOpenChange={setDeleteCategoryOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Category</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this category? This action cannot be undone.
              {selectedCategory && taskCounts[selectedCategory.id] > 0 && (
                <p className="mt-2 text-amber-600">
                  This category contains {taskCounts[selectedCategory.id]} tasks that will not be deleted.
                </p>
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction 
              onClick={confirmDeleteCategory}
              className="bg-red-600 hover:bg-red-700 text-white"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};

export default Sidebar;
