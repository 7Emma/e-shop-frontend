import React from 'react';

const Checkbox = ({ 
  label, 
  checked = false, 
  onChange, 
  disabled = false,
  className = '',
  ...props 
}) => (
  <div className="flex items-center gap-2">
    <input
      type="checkbox"
      checked={checked}
      onChange={onChange}
      disabled={disabled}
      className={`w-4 h-4 rounded border-gray-300 accent-blue-600 disabled:cursor-not-allowed ${className}`}
      {...props}
    />
    {label && <label className={`text-sm text-gray-700 ${disabled ? 'opacity-50' : ''}`}>{label}</label>}
  </div>
);

export default Checkbox;
