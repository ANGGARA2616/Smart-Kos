import React, { HTMLAttributes } from 'react';

interface CardProps extends HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

export const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div
            className={`bg-white rounded-xl shadow-[0_2px_10px_rgba(0,0,0,0.08)] border border-gray-100 overflow-hidden ${className}`}
            {...props}
        >
            {children}
        </div>
    );
};

export const CardHeader: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    return (
        <div className={`px-6 py-4 border-b border-gray-100 ${className}`} {...props}>
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
        <div className={`px-6 py-4 border-t border-gray-100 bg-gray-50 ${className}`} {...props}>
            {children}
        </div>
    );
};
