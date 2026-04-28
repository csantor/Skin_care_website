import React from 'react';

const Card = ({ children, className = '', tonal = false, ...props }) => {
  return (
    <div 
      className={`p-6 rounded-xl transition-all duration-300 ${
        tonal ? 'bg-surface-lowest' : 'bg-surface-low'
      } ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default Card;
