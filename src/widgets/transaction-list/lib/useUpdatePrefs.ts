import type {
    CategoryFilter,
    TypeFilter
} from '@/features/transaction-filtering';
import type { SortMode } from '@/features/transaction-sorting';
import { LIST_PREFS_STORAGE_KEY } from '@/shared/constants/storage';
import { writeJson } from '@/shared/lib/storage/storage';
import { useEffect } from 'react';
import type { TransactionListPrefs } from '../model/types';

interface UpdatePrefsProps {
    sort: SortMode;
    categoryFilter: CategoryFilter;
    typeFilter: TypeFilter;
}

export const useUpdatePrefs = ({
    sort,
    categoryFilter,
    typeFilter
}: UpdatePrefsProps) => {
    useEffect(() => {
        writeJson<TransactionListPrefs>(LIST_PREFS_STORAGE_KEY, {
            sort,
            categoryFilter,
            typeFilter
        });
    }, [categoryFilter, sort, typeFilter]);
};
