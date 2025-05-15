import React from 'react';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';

const Header: React.FC = () => {
  return (
    <header className="bg-white border-b border-neutral-200 py-4 px-4 sm:px-6 sticky top-0 z-10">
      <div className="max-w-7xl mx-auto flex justify-between items-center">
        <div className="flex items-center">
          <div className="flex items-center gap-2 font-semibold text-xl text-primary-600">
            <i className="ri-check-double-line text-2xl"></i>
            <span>Taskflow</span>
          </div>
        </div>
        
        <div className="flex items-center gap-4">
          <Button variant="ghost" size="icon" className="text-neutral-500 hover:text-neutral-700 transition-colors p-2 rounded-full hover:bg-neutral-100">
            <i className="ri-notification-3-line text-xl"></i>
          </Button>
          
          <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-md bg-neutral-100 text-neutral-600 hover:bg-neutral-200 transition-colors">
            <i className="ri-search-line"></i>
            <span className="text-sm">Search tasks</span>
          </div>
          
          <Avatar className="h-8 w-8 bg-primary-100 text-primary-700 hover:bg-primary-200 transition-colors cursor-pointer">
            <AvatarFallback className="text-sm font-medium">JD</AvatarFallback>
          </Avatar>
        </div>
      </div>
    </header>
  );
};

export default Header;
