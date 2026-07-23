import React from 'react';

export type InputProps = React.InputHTMLAttributes<HTMLInputElement> & {
  variant?: 'form' | 'compact';
};

const variantClass: Record<NonNullable<InputProps['variant']>, string> = {
  form:
    'w-full h-12 px-1 border-0 border-b border-gray-400 bg-transparent text-black ' +
    'focus:outline-none focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors ' +
    'placeholder:italic placeholder:text-gray-400 ' +
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:border-gray-400',
  compact:
    'w-full border-0 border-b border-gray-400 bg-gray-50/50 p-2 text-sm ' +
    'focus:outline-none focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors ' +
    'placeholder:italic placeholder:text-gray-400 ' +
    'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-400',
};

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ variant = 'form', className = '', ...props }, ref) => (
    <input ref={ref} className={`${variantClass[variant]} ${className}`} {...props} />
  )
);
Input.displayName = 'Input';

export default Input;
