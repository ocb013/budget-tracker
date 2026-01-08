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

    it('deletes a transaction after confirmation', async () => {
        const user = userEvent.setup();
        vi.spyOn(window, 'confirm').mockReturnValue(true);

        renderWithProviders(<DashboardPage />);

        const txListHeading = screen.getByRole('heading', {
            name: /transaction list/i
        });
        const txListCard = txListHeading.parentElement as HTMLElement;
        const txList = within(txListCard);

        // Ensure visible
        expect(await txList.findByText('$12.34')).toBeInTheDocument();

        const deleteBtn = txList.getByRole('button', {
            name: /delete transaction/i
        });

        // Keyboard path (works even if pointer-events is none)
        deleteBtn.focus();
        await user.keyboard('{Enter}');

        // Removed optimistically
        expect(txList.queryByText('$12.34')).not.toBeInTheDocument();
        expect(txList.queryByText('Food')).not.toBeInTheDocument();
    });

    it('does not delete if user cancels confirmation', async () => {
        const user = userEvent.setup();
        vi.spyOn(window, 'confirm').mockReturnValue(false);

        renderWithProviders(<DashboardPage />);

        const txListHeading = screen.getByRole('heading', {
            name: /transaction list/i
        });
        const txListCard = txListHeading.parentElement as HTMLElement;
        const txList = within(txListCard);

        expect(await txList.findByText('$12.34')).toBeInTheDocument();

        const deleteBtn = txList.getByRole('button', {
            name: /delete transaction/i
        });

        deleteBtn.focus();
        await user.keyboard('{Enter}');

        // Still there
        expect(txList.getByText('$12.34')).toBeInTheDocument();
    });
});
