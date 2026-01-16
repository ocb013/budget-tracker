import { screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardPage } from '@/pages/dashboard';
import { TRANSACTIONS_STORAGE_KEY } from '@/shared/constants/storage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

vi.mock('@/shared/api/storage', async () => {
    const actual = await vi.importActual<
        typeof import('@/shared/api/storage')
    >('@/shared/api/storage');
    return { ...actual, delay: () => Promise.resolve() };
});

describe('DeleteTransaction flow', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(
            TRANSACTIONS_STORAGE_KEY,
            JSON.stringify([
                {
                    id: 'tx-1',
                    type: 'expense',
                    amountCents: 1234,
                    category: 'Food',
                    date: '2026-01-02',
                    description: 'Groceries'
                }
            ])
        );
    });

    it('deletes a transaction after inline confirmation', async () => {
        const user = userEvent.setup();

        renderWithProviders(<DashboardPage />);

        const txListHeading = screen.getByRole('heading', {
            name: /transaction list/i
        });
        const txListCard = txListHeading.closest('div')
            ?.parentElement as HTMLElement;
        const txList = within(txListCard);

        // Ensure visible
        expect(await txList.findByText('$12.34')).toBeInTheDocument();

        // Open confirm (keyboard path)
        const deleteXBtn = txList.getByRole('button', {
            name: /delete transaction/i
        });
        deleteXBtn.focus();
        await user.keyboard('{Enter}');

        // Confirm UI should appear
        const confirmDeleteBtn = await txList.findByRole('button', {
            name: /^delete$/i
        });

        await user.click(confirmDeleteBtn);

        // Removed optimistically
        expect(txList.queryByText('$12.34')).not.toBeInTheDocument();
        expect(
            txList.queryByText('Groceries')
        ).not.toBeInTheDocument();
        expect(
            txList.queryByText('2026-01-02')
        ).not.toBeInTheDocument();
    });

    it('does not delete if user cancels inline confirmation', async () => {
        const user = userEvent.setup();

        renderWithProviders(<DashboardPage />);

        const txListHeading = screen.getByRole('heading', {
            name: /transaction list/i
        });
        const txListCard = txListHeading.closest('div')
            ?.parentElement as HTMLElement;
        const txList = within(txListCard);

        expect(await txList.findByText('$12.34')).toBeInTheDocument();

        // Open confirm
        const deleteXBtn = txList.getByRole('button', {
            name: /delete transaction/i
        });
        deleteXBtn.focus();
        await user.keyboard('{Enter}');

        // Click Cancel
        const cancelBtn = await txList.findByRole('button', {
            name: /^cancel$/i
        });
        await user.click(cancelBtn);

        // Still there
        expect(txList.getByText('$12.34')).toBeInTheDocument();
        expect(txList.getByText('Groceries')).toBeInTheDocument();
        expect(txList.getByText('2026-01-02')).toBeInTheDocument();
    });
});
