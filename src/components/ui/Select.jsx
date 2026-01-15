import React from 'react';

const Select = ({ 
  label, 
  value, 
  onChange, 
  options = [],
  error = null,
  disabled = false,
  placeholder = 'Select an option',
  className = '',
  ...props 
}) => {
  return (
    <div className="flex flex-col gap-1">
      {label && <label className="text-sm font-medium text-gray-700">{label}</label>}
      <select
        value={value}
        onChange={onChange}
        disabled={disabled}
        className={`px-3 py-2 border rounded transition ${error ? 'border-red-500 focus:outline-none focus:ring-2 focus:ring-red-200' : 'border-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-200'} disabled:bg-gray-100 disabled:cursor-not-allowed ${className}`}
        {...props}
      >
        <option value="">{placeholder}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-600">{error}</span>}
    </div>
  );
};

export default Select;
