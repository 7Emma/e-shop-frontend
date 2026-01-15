import React from 'react';

const Table = ({ children, className = '', ...props }) => (
  <div className="overflow-x-auto">
    <table className={`w-full border-collapse ${className}`} {...props}>{children}</table>
  </div>
);

const TableHead = ({ children, className = '' }) => (
  <thead className={`bg-gray-100 border-b-2 border-gray-300 ${className}`}>{children}</thead>
);

const TableBody = ({ children, className = '' }) => <tbody className={className}>{children}</tbody>;

const TableRow = ({ children, className = '', hover = true, ...props }) => (
  <tr className={`border-b border-gray-200 ${hover ? 'hover:bg-gray-50' : ''} ${className}`} {...props}>{children}</tr>
);

const TableCell = ({ children, className = '', ...props }) => (
  <td className={`px-4 py-2 text-sm text-gray-700 ${className}`} {...props}>{children}</td>
);

const TableHeader = ({ children, className = '', ...props }) => (
  <th className={`px-4 py-2 text-left text-sm font-semibold text-gray-900 ${className}`} {...props}>{children}</th>
);

export { Table, TableHead, TableBody, TableRow, TableCell, TableHeader };
export default Table;
