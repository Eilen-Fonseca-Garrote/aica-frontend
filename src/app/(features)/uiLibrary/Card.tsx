import React from 'react';

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
  titleClassName?: string;
  contentClassName?: string;
}

const Card = ({
  title,
  children,
  className = '',
  titleClassName = '',
  contentClassName = '',
}: CardProps) => (
  <div className={`rounded-lg shadow-sm border border-gray-200 bg-white ${className}`}>
    {title && (
      <div
        className={`px-4 py-3 font-semibold text-base border-b border-[var(--app-primary-hover)] bg-[var(--app-primary-color)] text-white ${titleClassName}`}
      >
        {title}
      </div>
    )}
    <div className={`p-4 ${contentClassName}`}>{children}</div>
  </div>
);

export default Card;
