import { describe, expect, it } from 'vitest';
import { getTotals, sumByType } from './calculations';
import type { Transaction } from './types';

function t(overrides: Partial<Transaction> = {}): Transaction {
    return {
        id: overrides.id ?? crypto.randomUUID(),
        type: overrides.type ?? 'expense',
        amountCents: overrides.amountCents ?? 1000,
        category: overrides.category ?? 'Other',
        date: overrides.date ?? '2026-01-02',
        description: overrides.description
    };
}

describe('transaction calculations', () => {
    it('sumByType sums only matching type', () => {
        const transactions: Transaction[] = [
            t({ type: 'income', amountCents: 5000 }),
            t({ type: 'expense', amountCents: 1200 }),
            t({ type: 'income', amountCents: 2500 })
        ];

        expect(sumByType(transactions, 'income')).toBe(7500);
        expect(sumByType(transactions, 'expense')).toBe(1200);
    });

    it('getTotals returns income/expense/balance in cents', () => {
        const transactions: Transaction[] = [
            t({ type: 'income', amountCents: 10000 }),
            t({ type: 'expense', amountCents: 4000 }),
            t({ type: 'expense', amountCents: 500 })
        ];

        expect(getTotals(transactions)).toEqual({
            incomeCents: 10000,
            expenseCents: 4500,
            balanceCents: 5500
        });
    });

    it('handles empty list', () => {
        expect(getTotals([])).toEqual({
            incomeCents: 0,
            expenseCents: 0,
            balanceCents: 0
        });
    });
});
