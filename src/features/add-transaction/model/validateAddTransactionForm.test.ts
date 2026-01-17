import { describe, expect, it } from 'vitest';
import { validateAddTransactionForm } from './validateAddTransactionForm';

describe('validateAddTransactionForm', () => {
    it('returns errors for empty amount and date', () => {
        expect(
            validateAddTransactionForm({ amount: '', date: '' })
        ).toEqual({
            amount: 'Enter an amount',
            date: 'Enter a valid date'
        });
    });

    it('trims whitespace before validating', () => {
        expect(
            validateAddTransactionForm({ amount: '   ', date: '   ' })
        ).toEqual({
            amount: 'Enter an amount',
            date: 'Enter a valid date'
        });
    });

    it('returns empty object when valid', () => {
        expect(
            validateAddTransactionForm({
                amount: '12.34',
                date: '2026-01-07'
            })
        ).toEqual({});
    });

    it('returns only one error if only one field invalid', () => {
        expect(
            validateAddTransactionForm({
                amount: '',
                date: '2026-01-07'
            })
        ).toEqual({ amount: 'Enter an amount' });

        expect(
            validateAddTransactionForm({
                amount: '10',
                date: ''
            })
        ).toEqual({ date: 'Enter a valid date' });
    });
});
