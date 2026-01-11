import { useDeleteTransactionMutation } from '@/shared/api/queries/transactions';
import { Card } from '@/shared/ui/Card/Card';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import clsx from 'clsx';
import { useMemo, useState, type FC, type ReactNode } from 'react';
import type { SortMode, Transaction } from '../../model/types';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import { TransactionSortToggle } from '../TransactionSortToggle/TransactionSortToggle';
import cls from './TransactionList.module.scss';

interface TransactionListProps {
    isLoading?: boolean;
    className?: string;
    items: Transaction[];
    height?: number;
}

function TransactionListSkeleton() {
    return (
        <div className={cls.list}>
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
        </div>
    );
}

export const TransactionList: FC<TransactionListProps> = ({
    isLoading,
    className,
    items,
    height
}) => {
    const { mutate, isPending, variables } =
        useDeleteTransactionMutation();

    const deletingId = isPending ? variables : undefined;

    const [sort, setSort] = useState<SortMode>('date');

    const sortedItems = useMemo(() => {
        if (sort === 'date') {
            return items;
        }

        return [...items].sort((a, b) => {
            const diff = b.amountCents - a.amountCents;
            if (diff !== 0) return diff;
            return b.date.localeCompare(a.date);
        });
    }, [items, sort]);

    let content: ReactNode;

    if (isLoading) {
        content = <TransactionListSkeleton />;
    } else if (sortedItems.length === 0) {
        content = (
            <div className={cls.emptyState}>
                No transactions yet. Add your first one.
            </div>
        );
    } else {
        content = (
            <div className={cls.list}>
                {sortedItems.map((item) => (
                    <TransactionItem
                        transaction={item}
                        key={item.id}
                        onDelete={mutate}
                        isDeleting={deletingId === item.id}
                    />
                ))}
            </div>
        );
    }

    const rightSlot = (
        <TransactionSortToggle value={sort} onChange={setSort} />
    );

    return (
        <div
            className={clsx(cls.wrapper, className)}
            style={height ? { height } : undefined}
        >
            <Card
                title="Transaction List"
                rightSlot={rightSlot}
                className={cls.transactionList}
            >
                <div className={cls.scrollArea}>{content}</div>
            </Card>
        </div>
    );
};
