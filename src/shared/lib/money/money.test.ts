import { describe, expect, it } from 'vitest';
import { formatCents, parseAmountToCents } from './money';

describe('formatCents', () => {
    it('formats positive cents', () => {
        expect(formatCents(0)).toBe('$0.00');
        expect(formatCents(1)).toBe('$0.01');
        expect(formatCents(10)).toBe('$0.10');
        expect(formatCents(100)).toBe('$1.00');
        expect(formatCents(1234)).toBe('$12.34');
    });

    it('formats negative cents with sign', () => {
        expect(formatCents(-1)).toBe('-$0.01');
        expect(formatCents(-1234)).toBe('-$12.34');
    });

    it('adds thousands separators (en-US)', () => {
        expect(formatCents(100_000)).toBe('$1,000.00');
        expect(formatCents(12_345_678)).toBe('$123,456.78');
    });
});

describe('parseAmountToCents', () => {
    it('parses whole dollars', () => {
        expect(parseAmountToCents('1')).toBe(100);
        expect(parseAmountToCents('12')).toBe(1200);
        expect(parseAmountToCents('00012')).toBe(1200);
    });

    it('parses decimals up to 2 places', () => {
        expect(parseAmountToCents('1.2')).toBe(120);
        expect(parseAmountToCents('1.20')).toBe(120);
        expect(parseAmountToCents('12.34')).toBe(1234);
        expect(parseAmountToCents('12.0')).toBe(1200);
        expect(parseAmountToCents('12.00')).toBe(1200);
    });

    it('accepts comma as decimal separator', () => {
        expect(parseAmountToCents('1,2')).toBe(120);
        expect(parseAmountToCents('12,34')).toBe(1234);
        expect(parseAmountToCents('  12,34  ')).toBe(1234);
    });

    it('rejects empty, whitespace, and zero/negative values', () => {
        expect(parseAmountToCents('')).toBeNull();
        expect(parseAmountToCents('   ')).toBeNull();
        expect(parseAmountToCents('0')).toBeNull();
        expect(parseAmountToCents('0.00')).toBeNull();
        // negatives are rejected by regex (good)
        expect(parseAmountToCents('-1')).toBeNull();
        expect(parseAmountToCents('-1.00')).toBeNull();
    });

    it('rejects invalid formats', () => {
        expect(parseAmountToCents('abc')).toBeNull();
        expect(parseAmountToCents('1.234')).toBeNull(); // more than 2 decimals
        expect(parseAmountToCents('1,234,56')).toBeNull(); // weird commas
        expect(parseAmountToCents('1.2.3')).toBeNull();
        expect(parseAmountToCents('.5')).toBeNull(); // requires leading digit by regex
        expect(parseAmountToCents('1.')).toBe(100); // allowed by your regex (\d{0,2})
    });

    it('handles very large numbers', () => {
        expect(parseAmountToCents('999999999.99')).toBe(
            99_999_999_999
        );
    });
});
