import React from 'react';

export type TextareaProps = React.TextareaHTMLAttributes<HTMLTextAreaElement> & {
  variant?: 'form' | 'compact';
};

const variantClass: Record<NonNullable<TextareaProps['variant']>, string> = {
  form:
    'w-full px-1 py-2 border-0 border-b border-gray-400 bg-transparent text-black ' +
    'focus:outline-none focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors ' +
    'placeholder:italic placeholder:text-gray-400 ' +
    'disabled:bg-gray-100 disabled:cursor-not-allowed disabled:hover:border-gray-400',
  compact:
    'w-full border-0 border-b border-gray-400 bg-gray-50/50 p-2 text-sm ' +
    'focus:outline-none focus:border-primary focus:ring-0 hover:border-gray-600 transition-colors ' +
    'placeholder:italic placeholder:text-gray-400 ' +
    'disabled:bg-gray-200 disabled:cursor-not-allowed disabled:hover:border-gray-400',
};

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ variant = 'form', className = '', ...props }, ref) => (
    <textarea ref={ref} className={`${variantClass[variant]} ${className}`} {...props} />
  )
);
Textarea.displayName = 'Textarea';

export default Textarea;
