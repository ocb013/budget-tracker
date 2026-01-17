import type { TRANSACTION_CATEGORIES } from './consts';

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

export type UpdateTransactionInput = Partial<Omit<Transaction, 'id'>>;

export interface Totals {
    incomeCents: number;
    expenseCents: number;
    balanceCents: number;
}
