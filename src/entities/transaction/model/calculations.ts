import type { Transaction, TransactionType } from './types';

export function sumByType(
    transactions: readonly Transaction[],
    type: TransactionType
): number {
    return transactions
        .filter((t) => t.type === type)
        .reduce((acc, t) => acc + t.amountCents, 0);
}

export function getTotals(transactions: readonly Transaction[]) {
    const incomeCents = sumByType(transactions, 'income');
    const expenseCents = sumByType(transactions, 'expense');
    const balanceCents = incomeCents - expenseCents;

    return { incomeCents, expenseCents, balanceCents };
}
