import { Card } from '@/shared/ui/Card/Card';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import clsx from 'clsx';
import type { FC, ReactNode } from 'react';
import type { Transaction } from '../../model/types';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import cls from './TransactionList.module.scss';

interface TransactionListProps {
    isLoading?: boolean;
    className?: string;
    items: Transaction[];
}

function TransactionListSkeleton() {
    return (
        <div className={cls.skeletonWrapper}>
            {Array.from({ length: 5 }).map((_, i) => (
                <div key={i} className={cls.skeletonItem}>
                    <div className={cls.skeletonTopRow}>
                        <Skeleton height={14} width="60%" />
                        <Skeleton height={14} width="25%" />
                    </div>

                    <div className={cls.skeletonBottomRow}>
                        <Skeleton height={12} width="45%" />
                        <Skeleton height={12} width="20%" />
                    </div>
                </div>
            ))}
        </div>
    );
}

export const TransactionList: FC<TransactionListProps> = ({
    isLoading,
    className,
    items
}) => {
    let content: ReactNode;

    if (isLoading) {
        content = <TransactionListSkeleton />;
    } else if (items.length === 0) {
        content = <div>No transactions yet. Add your first one.</div>;
    } else {
        content = items.map((item) => (
            <TransactionItem transaction={item} key={item.id} />
        ));
    }

    return (
        <Card
            className={clsx(cls.transactionList, className)}
            title="Transaction List"
        >
            {content}
        </Card>
    );
};
