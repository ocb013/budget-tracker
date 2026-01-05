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

    if (isError)
        return (
            <div>
                Something went wrong: {(error as Error).message}
            </div>
        );

    return (
        <div className={clsx(cls.grid, className)}>
            <div className={cls.leftCol}>
                <AddTransactionForm />
                <BalanceSummary
                    totals={getTotals(data ?? [])}
                    isLoading={isLoading}
                />
            </div>

            <TransactionList
                items={data ?? []}
                isLoading={isLoading}
            />
        </div>
    );
};
