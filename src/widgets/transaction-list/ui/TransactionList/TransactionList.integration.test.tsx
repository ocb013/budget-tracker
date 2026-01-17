import { renderWithProviders } from '@/shared/test/renderWithProviders';
import { screen, waitFor, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { useEffect, useState } from 'react';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import type { Transaction } from '@/entities/transaction';
import { TransactionList } from './TransactionList';

const initialTx: Transaction = {
    id: 'tx-1',
    type: 'expense',
    amountCents: 1234,
    category: 'Food',
    date: '2026-01-02',
    description: 'Groceries'
};

let setItemsRef: React.Dispatch<
    React.SetStateAction<Transaction[]>
> | null = null;

const mutateMock = vi.fn((id: string) => {
    setItemsRef?.((prev) => prev.filter((t) => t.id !== id));
});

vi.mock('@/shared/api/queries/transactions', () => ({
    useDeleteTransactionMutation: () => ({
        mutate: (id: string) => mutateMock(id),
        isPending: false,
        variables: undefined
    })
}));

function Host({ items }: { items: Transaction[] }) {
    const [state, setState] = useState<Transaction[]>(items);

    useEffect(() => {
        setItemsRef = setState;
        return () => {
            setItemsRef = null;
        };
    }, []);

    return <TransactionList items={state} />;
}

describe('TransactionList delete confirm', () => {
    beforeEach(() => {
        mutateMock.mockClear();
    });

    it('deletes when user confirms', async () => {
        const user = userEvent.setup();

        renderWithProviders(<Host items={[initialTx]} />);

        const txCard = screen.getByRole('region', {
            name: /transaction list/i
        });
        const tx = within(txCard);

        expect(tx.getByText('$12.34')).toBeInTheDocument();

        const deleteBtn = tx.getByLabelText(/delete transaction/i);
        deleteBtn.focus();
        await user.click(deleteBtn);

        await user.click(
            await tx.findByRole('button', { name: /^delete$/i })
        );

        expect(mutateMock).toHaveBeenCalledTimes(1);
        expect(mutateMock).toHaveBeenCalledWith('tx-1');

        await waitFor(() => {
            expect(tx.queryByText('$12.34')).not.toBeInTheDocument();
        });
    });

    it('does not call delete when user cancels', async () => {
        const user = userEvent.setup();

        renderWithProviders(<Host items={[initialTx]} />);

        const txCard = screen.getByRole('region', {
            name: /transaction list/i
        });
        const tx = within(txCard);

        expect(tx.getByText('$12.34')).toBeInTheDocument();

        const deleteBtn = tx.getByLabelText(/delete transaction/i);
        deleteBtn.focus();
        await user.click(deleteBtn);

        await user.click(
            await tx.findByRole('button', { name: /^cancel$/i })
        );

        expect(mutateMock).not.toHaveBeenCalled();

        // item still there
        expect(tx.getByText('$12.34')).toBeInTheDocument();
        expect(tx.getByText('Groceries')).toBeInTheDocument();
        expect(tx.getByText('2026-01-02')).toBeInTheDocument();
    });
});
