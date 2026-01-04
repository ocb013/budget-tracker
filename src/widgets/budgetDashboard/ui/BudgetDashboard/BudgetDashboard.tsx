import clsx from 'clsx';
import type { FC } from 'react';
import cls from './BudgetDashboard.module.scss';

import { getTotals, TransactionList } from '@/entities/transaction';
import { BalanceSummary } from '@/entities/transaction/ui/BalanceSummary/BalanceSummary';
import { AddTransactionForm } from '@/features/addTransaction';
import { useTransactionsQuery } from '@/shared/api/queries/transactions';

interface BudgetDashboardProps {
    className?: string;
}

export const BudgetDashboard: FC<BudgetDashboardProps> = ({
    className
}) => {
    const { data, isLoading, isError, error } =
        useTransactionsQuery();

    if (isLoading) return <div>Loading transactions…</div>;

    if (isError)
        return (
            <div>
                Something went wrong: {(error as Error).message}
            </div>
        );

    if (!data || data.length === 0)
        return (
            <div className={clsx(cls.grid, className)}>
                <div className={cls.leftCol}>
                    <AddTransactionForm />
                    <div className={cls.card}>
                        <h2 className={cls.cardTitle}>
                            Balance Summary
                        </h2>
                        <BalanceSummary totals={getTotals([])} />
                    </div>
                </div>

                <div className={cls.card}>
                    <h2 className={cls.cardTitle}>
                        Transaction List
                    </h2>
                    <div>
                        No transactions yet. Add your first one.
                    </div>
                </div>
            </div>
        );

    return (
        <div className={clsx(cls.grid, className)}>
            <div className={cls.leftCol}>
                <AddTransactionForm />
                <BalanceSummary totals={getTotals(data)} />
            </div>

            <TransactionList items={data} />
        </div>
    );
};
