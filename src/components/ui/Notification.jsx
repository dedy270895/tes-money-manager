import React, { useEffect } from 'react';
import Icon from '../AppIcon';

const Notification = ({ message, type, onClose }) => {
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000); // Notification disappears after 3 seconds
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  if (!message) return null;

  const bgColor = type === 'success' ? 'bg-green-500' : 'bg-red-500';
  const iconName = type === 'success' ? 'CheckCircle' : 'XCircle';

  return (
    <div className={`fixed bottom-4 right-4 p-4 rounded-lg shadow-lg text-white flex items-center space-x-2 ${bgColor}`}>
      <Icon name={iconName} size={20} />
      <span>{message}</span>
      <button onClick={onClose} className="ml-auto">
        <Icon name="X" size={16} />
      </button>
    </div>
  );
};

export default Notification;