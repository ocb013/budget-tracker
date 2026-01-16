import clsx from 'clsx';
import { type FC, type ReactNode, useId } from 'react';
import cls from './Card.module.scss';

interface CardProps {
    className?: string;
    title?: string;
    rightSlot?: ReactNode;
    children: ReactNode;
    titleId?: string;
}

export const Card: FC<CardProps> = ({
    className,
    title,
    rightSlot,
    children,
    titleId
}) => {
    const autoId = useId();
    const resolvedTitleId = title
        ? titleId ?? `card-title-${autoId}`
        : undefined;

    const hasHeader = Boolean(rightSlot || title);

    return (
        <section
            className={clsx(cls.card, className)}
            role="region"
            aria-labelledby={resolvedTitleId}
        >
            {hasHeader && (
                <div className={cls.header}>
                    {title && (
                        <h2
                            id={resolvedTitleId}
                            className={cls.cardTitle}
                        >
                            {title}
                        </h2>
                    )}
                    {rightSlot && (
                        <div className={cls.rightSlot}>
                            {rightSlot}
                        </div>
                    )}
                </div>
            )}

            {children}
        </section>
    );
};
