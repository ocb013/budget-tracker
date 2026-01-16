import { LIST_PREFS_STORAGE_KEY } from '@/shared/constants/storage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it } from 'vitest';

import type { Transaction } from '../../model/types';
import { TransactionList } from './TransactionList';

const initialTx: Transaction = {
    id: 'tx-1',
    type: 'expense',
    amountCents: 1234,
    category: 'Food',
    date: '2026-01-02',
    description: 'Groceries'
};

describe('TransactionList prefs persistence', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(
            LIST_PREFS_STORAGE_KEY,
            JSON.stringify({
                sort: 'date',
                typeFilter: 'all',
                categoryFilter: 'all'
            })
        );
    });

    it('persists sort + type filter + category filter to localStorage', async () => {
        const user = userEvent.setup();

        renderWithProviders(<TransactionList items={[initialTx]} />);

        // Sort toggle
        const sortGroup = screen.getByRole('group', {
            name: /sort transactions/i
        });
        const sort = within(sortGroup);

        const amountButton = sort.getByRole('button', {
            name: /amount/i
        });
        await user.click(amountButton);

        // Filters
        const filterGroup = screen.getByRole('group', {
            name: /filter transactions/i
        });
        const filter = within(filterGroup);

        const typeSelect = filter.getByRole('combobox', {
            name: /transaction type/i
        });
        const categorySelect = filter.getByRole('combobox', {
            name: /transaction category/i
        });

        await user.selectOptions(typeSelect, 'income');
        await user.selectOptions(categorySelect, 'Food');

        // Persistence happens in useEffect -> waitFor
        await waitFor(() => {
            const raw = localStorage.getItem(LIST_PREFS_STORAGE_KEY);
            const prefs = raw ? JSON.parse(raw) : {};
            expect(prefs.sort).toBe('amount');
            expect(prefs.typeFilter).toBe('income');
            expect(prefs.categoryFilter).toBe('Food');
        });

        expect(amountButton).toBeDisabled();
    });

    it('clears filters and persists prefs', async () => {
        const user = userEvent.setup();
        renderWithProviders(<TransactionList items={[initialTx]} />);

        const sortGroup = screen.getByRole('group', {
            name: /sort transactions/i
        });
        const sort = within(sortGroup);

        const amountButton = sort.getByRole('button', {
            name: /amount/i
        });
        await user.click(amountButton);

        // Filters
        const filterGroup = screen.getByRole('group', {
            name: /filter transactions/i
        });
        const filter = within(filterGroup);

        const typeSelect = filter.getByRole('combobox', {
            name: /transaction type/i
        });
        const categorySelect = filter.getByRole('combobox', {
            name: /transaction category/i
        });

        await user.selectOptions(typeSelect, 'income');
        await user.selectOptions(categorySelect, 'Health');

        const txCard = screen.getByRole('region', {
            name: /transaction list/i
        });
        const tx = within(txCard);

        const clearBtn = await tx.findByRole('button', {
            name: /^clear filters$/i
        });

        expect(clearBtn).toBeInTheDocument();

        await user.click(clearBtn);

        await waitFor(() => {
            const raw = localStorage.getItem(LIST_PREFS_STORAGE_KEY);
            const prefs = raw ? JSON.parse(raw) : {};
            expect(prefs.typeFilter).toBe('all');
            expect(prefs.categoryFilter).toBe('all');
        });
    });
});
