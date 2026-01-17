import type { AddTransactionFormErrors } from './types';

export const validateAddTransactionForm = (args: {
    amount: string;
    date: string;
}) => {
    const { amount = '', date = '' } = args;

    const errors: AddTransactionFormErrors = {};

    if (!amount.trim()) {
        errors.amount = 'Enter an amount';
    }

    if (!date.trim()) {
        errors.date = 'Enter a valid date';
    }

    return errors;
};
