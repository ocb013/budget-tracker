import clsx from 'clsx';
import { useMemo, useState, type FC, type ReactNode } from 'react';
import cls from './TransactionList.module.scss';

import {
    TransactionItem,
    type Transaction
} from '@/entities/transaction';
import {
    CATEGORY_FILTERS,
    TransactionFilters,
    TYPE_FILTERS,
    type CategoryFilter,
    type TypeFilter
} from '@/features/transaction-filtering';
import {
    TransactionSortToggle,
    type SortMode
} from '@/features/transaction-sorting';

import { useDeleteTransactionMutation } from '@/shared/api/queries/transactions';

import { readListPrefs } from '../../lib/prefs';
import { useFilterList } from '../../lib/useFilterList';
import { useUpdatePrefs } from '../../lib/useUpdatePrefs';

import { Card } from '@/shared/ui/Card/Card';
import { NoResults } from '../NoResults/NoResults';
import { TransactionListSkeleton } from '../TransactionListSkeleton/TransactionListSkeleton';

interface TransactionListProps {
    className?: string;
    items: Transaction[];
    height?: number;
    isLoading?: boolean;
}

export const TransactionList: FC<TransactionListProps> = ({
    className,
    items,
    isLoading,
    height
}) => {
    const { mutate, isPending, variables } =
        useDeleteTransactionMutation();
    const deletingId = isPending ? variables : undefined;

    const initialPrefs = useMemo(() => readListPrefs(), []);

    const [sort, setSort] = useState<SortMode>(initialPrefs.sort);
    const [typeFilter, setTypeFilter] = useState<TypeFilter>(
        initialPrefs.typeFilter
    );
    const [categoryFilter, setCategoryFilter] =
        useState<CategoryFilter>(initialPrefs.categoryFilter);

    useUpdatePrefs({ sort, typeFilter, categoryFilter });

    const clearFilters = () => {
        setCategoryFilter(CATEGORY_FILTERS[0]);
        setTypeFilter(TYPE_FILTERS.ALL);
    };

    const { visibleItems } = useFilterList({
        items,
        categoryFilter,
        sort,
        typeFilter
    });

    let content: ReactNode;

    if (isLoading) {
        content = (
            <div className={cls.list}>
                <TransactionListSkeleton />
            </div>
        );
    } else if (items.length === 0) {
        content = (
            <div className={cls.emptyState}>
                No transactions yet. Add your first one.
            </div>
        );
    } else if (visibleItems.length === 0) {
        content = <NoResults onClear={clearFilters} />;
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
                rightSlot={
                    <TransactionSortToggle
                        value={sort}
                        onChange={setSort}
                    />
                }
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
