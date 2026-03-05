import React, { HTMLAttributes } from 'react';

interface BadgeProps extends HTMLAttributes<HTMLSpanElement> {
    variant?: 'success' | 'danger' | 'warning' | 'primary' | 'neutral';
    children: React.ReactNode;
}

export const Badge: React.FC<BadgeProps> = ({
    children,
    variant = 'neutral',
    className = '',
    ...props
}) => {
    const baseStyles = 'inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-semibold';

    const variants = {
        success: 'bg-success-bg text-success',
        danger: 'bg-danger-bg text-danger',
        warning: 'bg-warning-bg text-warning',
        primary: 'bg-blue-100 text-primary',
        neutral: 'bg-gray-100 text-gray-800',
    };

    const classes = `${baseStyles} ${variants[variant]} ${className}`.trim();

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
};
