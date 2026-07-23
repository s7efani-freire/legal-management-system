import React from 'react';

export type ButtonVariant = 'primary' | 'neutral' | 'outline' | 'danger';

export type ButtonProps = React.ButtonHTMLAttributes<HTMLButtonElement> & {
  variant?: ButtonVariant;
  fullWidthOnMobile?: boolean;
};

const variantClass: Record<ButtonVariant, string> = {
  primary: 'bg-primary text-white hover:bg-primary-dark disabled:bg-gray-400',
  neutral: 'bg-gray-400 text-white hover:bg-gray-500 disabled:bg-gray-300',
  outline: 'border border-gray-300 bg-transparent text-gray-700 hover:bg-gray-50 disabled:opacity-60',
  danger: 'bg-red-600 text-white hover:bg-red-700 disabled:bg-red-300',
};

const Button = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ variant = 'primary', fullWidthOnMobile = false, className = '', type = 'button', ...props }, ref) => (
    <button
      ref={ref}
      type={type}
      className={[
        fullWidthOnMobile ? 'w-full sm:w-auto' : '',
        'px-4 py-2 rounded-lg font-medium transition-colors disabled:cursor-not-allowed',
        variantClass[variant],
        className,
      ]
        .filter(Boolean)
        .join(' ')}
      {...props}
    />
  )
);
Button.displayName = 'Button';

export default Button;
