import { useState, type ChangeEvent, type FormEvent } from 'react';

import type {
    NewTransactionInput,
    TransactionCategory,
    TransactionType
} from '@/entities/transaction';

import type { AddTransactionFormErrors } from './types';

import { TRANSACTION_CATEGORIES } from '@/entities/transaction';
import { useAddTransactionMutation } from '@/shared/api/queries/transactions';
import { todayISO } from '@/shared/lib/date';
import { parseAmountToCents } from '@/shared/lib/money/money';
import { sanitizeAmountInput } from '../lib/sanitizeAmountInput';
import { validateAddTransactionForm } from './validateAddTransactionForm';

type AddTransactionFormState = {
    type: TransactionType;
    amount: string; // UI string
    category: TransactionCategory;
    date: string;
    description: string;
};

const initialFormState: AddTransactionFormState = {
    type: 'expense',
    amount: '',
    category: TRANSACTION_CATEGORIES[0],
    date: todayISO(),
    description: ''
};

export const useAddTransactionForm = (opts?: {
    onSuccess?: () => void;
}) => {
    const [form, setForm] =
        useState<AddTransactionFormState>(initialFormState);
    const [errors, setErrors] = useState<AddTransactionFormErrors>(
        {}
    );

    const {
        mutate,
        isPending,
        error: submitError
    } = useAddTransactionMutation();

    const clearFieldError = (key: keyof AddTransactionFormErrors) => {
        if (!errors[key]) return;
        setErrors((prev) => {
            const next = { ...prev };
            delete next[key];
            return next;
        });
    };

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearFieldError('amount');
        setForm((prev) => ({
            ...prev,
            amount: sanitizeAmountInput(e.target.value)
        }));
    };

    const handleDateChange = (e: ChangeEvent<HTMLInputElement>) => {
        clearFieldError('date');
        setForm((prev) => ({ ...prev, date: e.target.value }));
    };

    const handleChangeType = (type: TransactionType) => {
        setForm((prev) => ({ ...prev, type }));
    };

    const handleChangeDescription = (description: string) => {
        setForm((prev) => ({ ...prev, description }));
    };

    const handleChangeCategory = (category: TransactionCategory) => {
        setForm((prev) => ({ ...prev, category }));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        setErrors({});

        const validateErrors = validateAddTransactionForm({
            amount: form.amount,
            date: form.date
        });

        if (Object.keys(validateErrors).length > 0) {
            setErrors(validateErrors);
            return;
        }

        const amountCents = parseAmountToCents(form.amount);
        if (amountCents === null) {
            setErrors({ amount: 'Enter a valid amount' });
            return;
        }

        const payload: NewTransactionInput = {
            type: form.type,
            amountCents,
            category: form.category,
            date: form.date,
            description: form.description.trim() || undefined
        };

        mutate(payload, {
            onSuccess: () => {
                setForm((prev) => ({
                    ...prev,
                    amount: '',
                    description: ''
                }));
                opts?.onSuccess?.();
            }
        });
    };

    return {
        // values
        type: form.type,
        amount: form.amount,
        date: form.date,
        description: form.description,
        category: form.category,

        // async state
        isPending,
        submitError,

        // validation
        errors,

        // handlers
        onSubmit,
        handleAmountChange,
        handleDateChange,
        handleChangeType,
        handleChangeDescription,
        handleChangeCategory
    };
};
