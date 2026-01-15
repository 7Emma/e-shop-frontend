import React from 'react';

const Card = ({ children, className = '', ...props }) => (
  <div className={`bg-white rounded-lg shadow-md p-4 ${className}`} {...props}>{children}</div>
);

const CardHeader = ({ children, className = '' }) => (
  <div className={`border-b pb-2 mb-3 ${className}`}>{children}</div>
);

const CardTitle = ({ children, className = '' }) => (
  <h2 className={`text-lg font-bold text-gray-900 ${className}`}>{children}</h2>
);

const CardContent = ({ children, className = '' }) => (
  <div className={`${className}`}>{children}</div>
);

const CardFooter = ({ children, className = '' }) => (
  <div className={`border-t pt-3 mt-3 flex gap-2 ${className}`}>{children}</div>
);

export { Card, CardHeader, CardTitle, CardContent, CardFooter };
export default Card;
