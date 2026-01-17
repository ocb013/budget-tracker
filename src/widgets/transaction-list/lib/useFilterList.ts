import { useMemo } from 'react';

import {
    CATEGORY_FILTERS,
    TYPE_FILTERS,
    type CategoryFilter,
    type TypeFilter
} from '@/features/transaction-filtering';
import type { SortMode } from '@/features/transaction-sorting';

import type { Transaction } from '@/entities/transaction';

interface TransactionListProps {
    items: Transaction[];
    sort: SortMode;
    typeFilter: TypeFilter;
    categoryFilter: CategoryFilter;
}

export const useFilterList = ({
    items,
    sort,
    typeFilter,
    categoryFilter
}: TransactionListProps) => {
    const filteredItems = useMemo(() => {
        let result = items;

        if (typeFilter !== TYPE_FILTERS.ALL) {
            result = result.filter(
                (item) => item.type === typeFilter
            );
        }

        if (categoryFilter !== CATEGORY_FILTERS[0]) {
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

    return { visibleItems };
};
