import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import cls from './TransactionListSkeleton.module.scss';

export const TransactionListSkeleton = () => {
    return (
        <>
            {Array.from({ length: 7 }).map((_, i) => (
                <div key={i} className={cls.skeletonRow}>
                    <div className={cls.skeletonTopRow}>
                        <Skeleton height={14} width="55%" />
                        <Skeleton height={14} width="22%" />
                    </div>

                    <div className={cls.skeletonBottomRow}>
                        <Skeleton height={12} width="45%" />
                        <Skeleton height={12} width="18%" />
                    </div>
                </div>
            ))}
        </>
    );
};
