import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

const Card: React.FC<CardProps> = ({ title, children, className = '' }) => (
  <div className={`rounded-lg shadow border border-gray-200 bg-white ${className}`}>
    {title && (
      <div className="bg-green-600 text-white px-4 py-2 font-semibold text-lg">
        {title}
      </div>
    )}
    <div className="p-4">{children}</div>
  </div>
);

export default Card;
