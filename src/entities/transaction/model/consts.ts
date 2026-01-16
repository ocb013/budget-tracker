export const TRANSACTION_CATEGORIES = [
    'Salary',
    'Freelance',
    'Food',
    'Transport',
    'Rent',
    'Health',
    'Shopping',
    'Entertainment',
    'Other'
] as const;

export const FILTER_TYPES = {
    ALL: 'all',
    INCOME: 'income',
    EXPENSE: 'expense'
} as const;

export const CATEGORY_FILTERS = [
    'all',
    ...TRANSACTION_CATEGORIES
] as const;
