import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const Card: React.FC<CardProps> = ({
  title,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
}) => (
  <div className={`rounded-lg shadow-sm border border-gray-200 bg-white ${className}`}>
    {title && (
      <div
        className={`px-4 py-3 font-semibold text-base border-b border-[#08778f] bg-[#0a8ca8] text-white ${titleClassName}`}
      >
        {title}
      </div>
    )}
    <div className={`p-4 ${contentClassName}`}>{children}</div>
  </div>
);

export default Card;
