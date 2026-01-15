import React from 'react';

const Spinner = ({ size = 'md', color = 'blue', className = '', ...props }) => {
  const sizes = { sm: 'w-4 h-4', md: 'w-8 h-8', lg: 'w-12 h-12' };
  const colors = { blue: 'border-blue-500', red: 'border-red-500', green: 'border-green-500', gray: 'border-gray-500' };
  return <div className={`${sizes[size]} border-4 border-gray-200 border-t-${colors[color]} rounded-full animate-spin ${className}`} {...props} />;
};

export default Spinner;
