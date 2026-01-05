import clsx from 'clsx';
import type { CSSProperties, FC } from 'react';
import cls from './Skeleton.module.scss';

interface SkeletonProps {
    className?: string;
    height?: string | number;
    width?: string | number;
    borderRadius?: number | string;
}

export const Skeleton: FC<SkeletonProps> = ({
    className,
    height,
    width,
    borderRadius
}) => {
    const style: CSSProperties = {
        height,
        width,
        borderRadius
    };

    return (
        <div
            className={clsx(cls.skeleton, className)}
            style={style}
        />
    );
};
