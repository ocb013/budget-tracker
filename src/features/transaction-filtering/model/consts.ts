import { TRANSACTION_CATEGORIES } from '@/entities/transaction';

export const TYPE_FILTERS = {
    ALL: 'all',
    INCOME: 'income',
    EXPENSE: 'expense'
} as const;

export const CATEGORY_FILTERS = [
    'all',
    ...TRANSACTION_CATEGORIES
] as const;
