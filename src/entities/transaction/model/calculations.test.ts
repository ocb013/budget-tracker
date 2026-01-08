import { describe, expect, it } from 'vitest';
import { getTotals, sumByType } from './calculations';
import type { Transaction } from './types';

const tx = (overrides: Partial<Transaction>): Transaction => ({
    id: 'id',
    type: 'expense',
    amountCents: 0,
    category: 'Other',
    date: '2026-01-01',
    ...overrides
});

describe('sumByType', () => {
    it('sums amounts by type', () => {
        const items: Transaction[] = [
            tx({ id: '1', type: 'income', amountCents: 100 }),
            tx({ id: '2', type: 'income', amountCents: 250 }),
            tx({ id: '3', type: 'expense', amountCents: 50 })
        ];

        expect(sumByType(items, 'income')).toBe(350);
        expect(sumByType(items, 'expense')).toBe(50);
    });

    it('returns 0 for empty list', () => {
        expect(sumByType([], 'income')).toBe(0);
        expect(sumByType([], 'expense')).toBe(0);
    });
});

describe('getTotals', () => {
    it('returns totals for empty list', () => {
        expect(getTotals([])).toEqual({
            incomeCents: 0,
            expenseCents: 0,
            balanceCents: 0
        });
    });

    it('computes income, expense and balance', () => {
        const items: Transaction[] = [
            tx({ id: '1', type: 'income', amountCents: 5000 }),
            tx({ id: '2', type: 'expense', amountCents: 1200 }),
            tx({ id: '3', type: 'expense', amountCents: 800 })
        ];

        expect(getTotals(items)).toEqual({
            incomeCents: 5000,
            expenseCents: 2000,
            balanceCents: 3000
        });
    });

    it('handles only expenses', () => {
        const items: Transaction[] = [
            tx({ id: '1', type: 'expense', amountCents: 1000 })
        ];

        expect(getTotals(items)).toEqual({
            incomeCents: 0,
            expenseCents: 1000,
            balanceCents: -1000
        });
    });

    it('handles only income', () => {
        const items: Transaction[] = [
            tx({ id: '1', type: 'income', amountCents: 2500 })
        ];

        expect(getTotals(items)).toEqual({
            incomeCents: 2500,
            expenseCents: 0,
            balanceCents: 2500
        });
    });
});
