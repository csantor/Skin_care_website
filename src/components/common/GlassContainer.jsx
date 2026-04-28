import React from 'react';

const GlassContainer = ({ children, className = '', dark = false, ...props }) => {
  return (
    <div 
      className={`glass ${dark ? 'glass-dark' : ''} ${className}`}
      {...props}
    >
      {children}
    </div>
  );
};

export default GlassContainer;
