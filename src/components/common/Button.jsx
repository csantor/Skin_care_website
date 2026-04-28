import React from 'react';

const Button = ({ children, variant = 'primary', className = '', ...props }) => {
  const baseStyles = 'px-8 py-3 font-manrope font-semibold transition-all duration-300 ease-in-out active:scale-95 disabled:opacity-50 disabled:pointer-events-none';
  
  const variants = {
    primary: 'premium-gradient text-white rounded-full',
    secondary: 'bg-surface-highest text-on-surface rounded-full',
    tertiary: 'text-primary px-3 rounded-none hover:bg-surface-low',
    ghost: 'bg-transparent text-primary hover:bg-surface-highest/50 rounded-full'
  };

  return (
    <button 
      className={`${baseStyles} ${variants[variant]} ${className}`}
      {...props}
    >
      {children}
    </button>
  );
};

export default Button;
