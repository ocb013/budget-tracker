import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { DashboardPage } from '@/pages/dashboard';
import { TRANSACTIONS_STORAGE_KEY } from '@/shared/constants/storage';
import { renderWithProviders } from '@/shared/test/renderWithProviders';

// Make delay() instant to keep tests fast and deterministic
vi.mock('@/shared/api/storage', async () => {
    const actual = await vi.importActual<
        typeof import('@/shared/api/storage')
    >('@/shared/api/storage');
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

        // Scope assertions to the Transaction List card, since $10.00 also appears in Balance Summary
        const txListHeading = screen.getByRole('heading', {
            name: /transaction list/i
        });

        const txListCard =
            txListHeading.closest('div')?.parentElement;
        expect(txListCard).toBeTruthy();

        const txList = within(txListCard as HTMLElement);

        expect(await txList.findByText('$10.00')).toBeInTheDocument();

        // After success: amount cleared and input focused (focus runs in a microtask)
        await waitFor(() => {
            expect(amountInput.value).toBe('');
            expect(amountInput).toHaveFocus();
        });
    });
});
