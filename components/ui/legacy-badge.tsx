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
        success: 'bg-[#E7F7EE] text-[#16A572]',
        danger: 'bg-[#FDECEC] text-[#E5484D]',
        warning: 'bg-[#FFF4E0] text-[#B7791F]',
        primary: 'bg-[#EAF0FF] text-[#2F6BFF]',
        neutral: 'bg-[#EEF1F7] text-[#5A6477]',
    };

    const classes = `${baseStyles} ${variants[variant]} ${className}`.trim();

    return (
        <span className={classes} {...props}>
            {children}
        </span>
    );
};
