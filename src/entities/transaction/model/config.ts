import { FILTER_TYPES, TRANSACTION_CATEGORIES } from './consts';

export const TYPE_FILTER_OPTIONS = [
    { value: FILTER_TYPES.ALL, label: 'All' },
    { value: FILTER_TYPES.INCOME, label: 'Income' },
    { value: FILTER_TYPES.EXPENSE, label: 'Expense' }
] as const;

export const CATEGORY_FILTER_OPTIONS = [
    { value: 'all', label: 'All' },
    ...TRANSACTION_CATEGORIES.map((category) => ({
        value: category,
        label: category
    }))
] as const;
