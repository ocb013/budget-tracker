import { TRANSACTION_CATEGORIES } from '@/entities/transaction';
import { TYPE_FILTERS } from './consts';

export const TYPE_FILTER_OPTIONS = [
    { value: TYPE_FILTERS.ALL, label: 'All' },
    { value: TYPE_FILTERS.INCOME, label: 'Income' },
    { value: TYPE_FILTERS.EXPENSE, label: 'Expense' }
] as const;

export const CATEGORY_FILTER_OPTIONS = [
    { value: 'all', label: 'All' },
    ...TRANSACTION_CATEGORIES.map((category) => ({
        value: category,
        label: category
    }))
] as const;
