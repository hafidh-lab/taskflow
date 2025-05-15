import React, { useState, useEffect } from 'react';
import { useTasks } from '@/hooks/useTasks';
import { useNotifications } from '@/hooks/useNotifications';
import { AnimatePresence, motion } from 'framer-motion';

export const NotificationToast: React.FC = () => {
  const { tasks } = useTasks();
  const { notifications, dismissNotification } = useNotifications(tasks);
  
  // Only show the last notification
  const latestNotification = notifications.length > 0 ? notifications[notifications.length - 1] : null;
  
  // Auto-dismiss notifications after 5 seconds
  useEffect(() => {
    if (latestNotification) {
      const timer = setTimeout(() => {
        dismissNotification(latestNotification.id);
      }, 5000);
      
      return () => clearTimeout(timer);
    }
  }, [latestNotification, dismissNotification]);

  return (
    <div className="fixed bottom-6 right-6 z-50">
      <AnimatePresence>
        {latestNotification && (
          <motion.div
            key={latestNotification.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2 }}
            className="bg-white rounded-lg shadow-lg border border-neutral-200 p-4 flex items-start gap-3 max-w-md"
          >
            <div className="flex-shrink-0 p-1 rounded-full bg-primary-100 text-primary-700">
              <i className="ri-notification-3-line text-lg"></i>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-medium text-neutral-900">{latestNotification.title}</h4>
              <p className="text-sm text-neutral-600 mt-1">{latestNotification.message}</p>
            </div>
            <button 
              className="text-neutral-400 hover:text-neutral-700"
              onClick={() => dismissNotification(latestNotification.id)}
            >
              <i className="ri-close-line"></i>
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
