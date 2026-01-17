import type {
    CategoryFilter,
    TypeFilter
} from '@/features/transaction-filtering';
import type { SortMode } from '@/features/transaction-sorting';

export type TransactionListPrefs = {
    sort?: SortMode;
    typeFilter?: TypeFilter;
    categoryFilter?: CategoryFilter;
};
