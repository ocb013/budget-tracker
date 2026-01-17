import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardPage } from '@/pages/dashboard';
import { TRANSACTIONS_STORAGE_KEY } from '@/shared/constants/storage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

// Make delay() instant to keep tests fast and deterministic
vi.mock('@/shared/api/transactions', async () => {
    const actual = await vi.importActual<
        typeof import('@/shared/api/transactions')
    >('@/shared/api/transactions');
    return { ...actual, delay: () => Promise.resolve() };
});

describe('AddTransaction flow', () => {
    beforeEach(() => {
        localStorage.clear();
        localStorage.setItem(
            TRANSACTIONS_STORAGE_KEY,
            JSON.stringify([])
        );
    });

    it('adds a transaction optimistically and focuses amount input after success', async () => {
        const user = userEvent.setup();

        renderWithProviders(<DashboardPage />);

        const amountInput = screen.getByLabelText(
            'Amount'
        ) as HTMLInputElement;

        await user.clear(amountInput);
        await user.type(amountInput, '10');

        await user.click(
            screen.getByRole('button', { name: /^add$/i })
        );

        const txCard = screen.getByRole('region', {
            name: /transaction list/i
        });
        const tx = within(txCard);

        expect(await tx.findByText('$10.00')).toBeInTheDocument();

        // After success: amount cleared and input focused (focus runs in a microtask)
        await waitFor(() => {
            expect(amountInput.value).toBe('');
            expect(amountInput).toHaveFocus();
        });
    });
});
