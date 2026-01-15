import React from 'react';

const Alert = ({ 
  children, 
  type = 'info', 
  onClose = null,
  className = '',
  ...props 
}) => {
  const types = {
    info: 'bg-blue-50 border border-blue-200 text-blue-800',
    success: 'bg-green-50 border border-green-200 text-green-800',
    warning: 'bg-yellow-50 border border-yellow-200 text-yellow-800',
    error: 'bg-red-50 border border-red-200 text-red-800',
  };

  return (
    <div className={`rounded-lg p-4 flex justify-between items-center ${types[type]} ${className}`} {...props}>
      <div>{children}</div>
      {onClose && (
        <button onClick={onClose} className="ml-2 text-lg font-bold opacity-70 hover:opacity-100">×</button>
      )}
    </div>
  );
};

export default Alert;
