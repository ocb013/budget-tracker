import type {
    CATEGORY_FILTERS,
    FILTER_TYPES,
    TRANSACTION_CATEGORIES
} from './consts';

export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
    (typeof TRANSACTION_CATEGORIES)[number];

export interface Transaction {
    id: string;
    type: TransactionType;
    amountCents: number;
    category: TransactionCategory;
    date: string; // YYYY-MM-DD
    description?: string;
}

export type NewTransactionInput = Omit<Transaction, 'id'>;

export interface Totals {
    incomeCents: number;
    expenseCents: number;
    balanceCents: number;
}

export type SortMode = 'date' | 'amount';

export type TypeFilter =
    (typeof FILTER_TYPES)[keyof typeof FILTER_TYPES];

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];

// for persistent storage
export type TransactionListPrefs = {
    sort?: SortMode;
    typeFilter?: TypeFilter;
    categoryFilter?: CategoryFilter;
};
