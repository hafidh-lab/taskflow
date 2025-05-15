import React from 'react';
import { useTaskContext } from '@/context/TaskContext';
import { Button } from '@/components/ui/button';
import { Category } from '@shared/schema';
import { cn } from '@/lib/utils';

interface SidebarProps {
  categories: Category[];
  taskCounts: Record<number, number>;
}

const Sidebar: React.FC<SidebarProps> = ({ categories, taskCounts }) => {
  const { activeCategory, setActiveCategory, activeFilter, setActiveFilter } = useTaskContext();
  
  const totalTasks = Object.values(taskCounts).reduce((sum, count) => sum + count, 0);
  
  return (
    <aside className="lg:col-span-3">
      <div className="bg-white rounded-xl shadow-sm border border-neutral-200 overflow-hidden">
        {/* Categories Section */}
        <div className="p-4">
          <h2 className="font-medium text-neutral-900 mb-3">Categories</h2>
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
              </li>
            ))}
            
            <li>
              <Button
                variant="ghost"
                className="w-full flex items-center justify-start py-2 px-3 rounded-md text-neutral-600 hover:bg-neutral-100"
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
  );
};

export default Sidebar;
