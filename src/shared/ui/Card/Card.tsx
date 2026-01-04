import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import cls from './Card.module.scss';

interface CardProps {
    className?: string;
    title?: string;
    children: ReactNode;
}

export const Card: FC<CardProps> = ({
    className,
    title,
    children
}) => {
    return (
        <div className={clsx(cls.card, className)}>
            {title && <h2 className={cls.cardTitle}>{title}</h2>}
            {children}
        </div>
    );
};
