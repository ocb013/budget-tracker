import clsx from 'clsx';
import { useMemo, useState, type FC, type ReactNode } from 'react';
import cls from './TransactionList.module.scss';

import { useDeleteTransactionMutation } from '@/shared/api/queries/transactions';

import { CATEGORY_FILTERS, FILTER_TYPES } from '../../model/consts';
import {
    type CategoryFilter,
    type SortMode,
    type Transaction,
    type TypeFilter
} from '../../model/types';

import { Card } from '@/shared/ui/Card/Card';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import { TransactionFilters } from '../TransactionFilters/TransactionFilters';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import { TransactionSortToggle } from '../TransactionSortToggle/TransactionSortToggle';

interface TransactionListProps {
    isLoading?: boolean;
    className?: string;
    items: Transaction[];
    height?: number;
}

const TransactionListSkeleton = () => {
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
};

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
    const [typeFilter, setTypeFilter] = useState<TypeFilter>(
        FILTER_TYPES.ALL
    );

    const [categoryFilter, setCategoryFilter] =
        useState<CategoryFilter>(CATEGORY_FILTERS[0]);

    const filteredItems = useMemo(() => {
        let result = items;

        if (typeFilter !== FILTER_TYPES.ALL) {
            result = result.filter(
                (item) => item.type === typeFilter
            );
        }

        if (categoryFilter !== 'all') {
            result = result.filter(
                (item) => item.category === categoryFilter
            );
        }

        return result;
    }, [items, typeFilter, categoryFilter]);

    const visibleItems = useMemo(() => {
        if (sort === 'date') {
            return filteredItems;
        }

        return [...filteredItems].sort((a, b) => {
            const diff = b.amountCents - a.amountCents;
            if (diff !== 0) return diff;
            return b.date.localeCompare(a.date);
        });
    }, [filteredItems, sort]);

    const rightSlot = (
        <TransactionSortToggle value={sort} onChange={setSort} />
    );

    let content: ReactNode;

    if (isLoading) {
        content = <TransactionListSkeleton />;
    } else if (items.length === 0) {
        content = (
            <div className={cls.emptyState}>
                No transactions yet. Add your first one.
            </div>
        );
    } else if (visibleItems?.length === 0 || !visibleItems) {
        content = (
            <div className={cls.noResults}>
                <div className={cls.noResultsRow}>
                    <span className={cls.noResultsText}>
                        No results. Try clearing filters.
                    </span>

                    <button
                        type="button"
                        className={cls.clearButton}
                        onClick={() => {
                            setCategoryFilter('all');
                            setTypeFilter(FILTER_TYPES.ALL);
                        }}
                    >
                        Clear
                    </button>
                </div>
            </div>
        );
    } else {
        content = (
            <div className={cls.list}>
                {visibleItems.map((item) => (
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
                <div className={cls.filtersRow}>
                    <TransactionFilters
                        typeValue={typeFilter}
                        onTypeChange={setTypeFilter}
                        categoryValue={categoryFilter}
                        onCategoryChange={setCategoryFilter}
                    />
                </div>
                <div className={cls.scrollArea}>{content}</div>
            </Card>
        </div>
    );
};
