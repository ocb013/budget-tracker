import clsx from 'clsx';
import type { FC } from 'react';
import cls from './BudgetDashboard.module.scss';

import { getTotals, TransactionList } from '@/entities/transaction';
import { BalanceSummary } from '@/entities/transaction/ui/BalanceSummary/BalanceSummary';
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
        return <div>No transactions yet. Add your first one.</div>;

    return (
        <div className={clsx(cls.budgetDashboard, className)}>
            BudgetDashboard
            <BalanceSummary totals={getTotals(data)} />
            <TransactionList items={data} />
        </div>
    );
};
