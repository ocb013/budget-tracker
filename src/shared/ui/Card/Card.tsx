import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import cls from './Card.module.scss';

interface CardProps {
    className?: string;
    title?: string;
    rightSlot?: ReactNode;
    children: ReactNode;
}

export const Card: FC<CardProps> = ({
    className,
    title,
    rightSlot,
    children
}) => {
    const hasHeader = rightSlot || title;

    return (
        <div className={clsx(cls.card, className)}>
            {hasHeader && (
                <div className={cls.header}>
                    {title && (
                        <h2 className={cls.cardTitle}>{title}</h2>
                    )}
                    {rightSlot && (
                        <div className={cls.rightSlot}>
                            {rightSlot}
                        </div>
                    )}
                </div>
            )}
            {children}
        </div>
    );
};
