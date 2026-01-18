import clsx from 'clsx';
import { useRef, useState, type FC } from 'react';
import cls from './BudgetDashboard.module.scss';

import { getTotals, type Transaction } from '@/entities/transaction';
import { BalanceSummary } from '@/entities/transaction/ui/BalanceSummary/BalanceSummary';
import { AddTransactionForm } from '@/features/add-transaction';
import { useTransactionsQuery } from '@/shared/api/queries/transactions';
import { useElementHeight } from '@/shared/lib/dom/useElementHeight';
import { TransactionList } from '@/widgets/transaction-list';

interface BudgetDashboardProps {
    className?: string;
}

export const BudgetDashboard: FC<BudgetDashboardProps> = ({
    className
}) => {
    const { data, isLoading, isError, error } =
        useTransactionsQuery();

    const [editingTx, setEditingTx] = useState<Transaction | null>(
        null
    );
    const startEdit = (tx: Transaction) => setEditingTx(tx);
    const cancelEdit = () => setEditingTx(null);

    const leftColRef = useRef<HTMLDivElement | null>(null);
    const leftColHeight = useElementHeight(leftColRef);

    if (isError)
        return (
            <div>
                Something went wrong: {(error as Error).message}
            </div>
        );

    return (
        <div className={clsx(cls.grid, className)}>
            <div className={cls.leftCol} ref={leftColRef}>
                <AddTransactionForm
                    mode={editingTx ? 'edit' : 'add'}
                    initialTx={editingTx}
                    onCancelEdit={cancelEdit}
                />
                <BalanceSummary
                    totals={getTotals(data ?? [])}
                    isLoading={isLoading}
                />
            </div>

            <TransactionList
                items={data ?? []}
                isLoading={isLoading}
                height={leftColHeight || undefined}
                onEdit={startEdit}
                editingId={editingTx?.id || null}
                onCancelEdit={cancelEdit}
            />
        </div>
    );
};
