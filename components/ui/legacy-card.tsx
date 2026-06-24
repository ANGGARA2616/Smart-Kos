import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-2xl shadow-[0_2px_10px_rgba(16,24,40,0.05)] border border-[#EAEDF3] overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 border-b border-[#EAEDF3] ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardBody: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`p-6 ${className}`} {...props}>
            {children}
        </div>
    );
};

export const CardFooter: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 border-t border-[#EAEDF3] bg-[#F9FAFC] ${className}`} {...props}>
            {children}
        </div>
    );
};
