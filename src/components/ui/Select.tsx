import React from 'react';
import { ChevronDown } from 'lucide-react';

export type SelectProps = React.SelectHTMLAttributes<HTMLSelectElement> & {
  variant?: 'form' | 'compact';
  wrapperClassName?: string;
};

const variantClass: Record<NonNullable<SelectProps['variant']>, string> = {
  form:
    'w-full h-12 px-1 pr-6 appearance-none border-0 border-b border-gray-400 bg-transparent ' +
    'focus:outline-none focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors ' +
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:border-gray-400',
  compact:
    'w-full appearance-none border-0 border-b border-gray-400 bg-gray-50/50 p-2 pr-6 text-sm ' +
    'focus:outline-none focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors ' +
    'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-400',
};

const chevronClass: Record<NonNullable<SelectProps['variant']>, string> = {
  form: 'absolute right-0 bottom-3 w-5 h-5',
  compact: 'absolute right-2 top-1/2 -translate-y-1/2 w-4 h-4',
};

const Select = React.forwardRef<HTMLSelectElement, SelectProps>(
  ({ variant = 'form', className = '', wrapperClassName = '', value, children, ...props }, ref) => {
    const isEmpty = value === '' || value === undefined || value === null;

    return (
      <div className={`relative ${wrapperClassName}`}>
        <select
          ref={ref}
          value={value}
          className={`${variantClass[variant]} ${isEmpty ? 'italic text-gray-400' : 'text-black'} ${className}`}
          {...props}
        >
          {children}
        </select>
        <ChevronDown className={`${chevronClass[variant]} text-gray-400 pointer-events-none`} />
      </div>
    );
  }
);
Select.displayName = 'Select';

export default Select;
