import React from 'react';

const Input = ({ 
  label, 
  type = 'text', 
  placeholder, 
  value, 
  onChange, 
  error = null, 
  disabled = false,
  className = '',
  ...props 
}) => (
  <div className="flex flex-col gap-1">
    {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
    <input
      type={type}
      placeholder={placeholder}
      value={value}
      onChange={onChange}
      disabled={disabled}
      className={`px-3 py-2 border rounded transition ${error ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200'} disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
    {error && <span className="text-xs text-red-600">{error}</span>}
  </div>
);

export default Input;
