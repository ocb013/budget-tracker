import clsx from 'clsx';
import type { FC } from 'react';
import cls from './DashboardPage.module.scss';

import { useTransactionsQuery } from '@/shared/api/queries/transactions';

interface DashboardPageProps {
    extraStyles?: string;
}

export const DashboardPage: FC<DashboardPageProps> = ({
    extraStyles
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
        <div className={clsx(cls.dashboardPage, extraStyles)}>
            <h1>Budget Tracker</h1>
            <pre>{JSON.stringify(data, null, 2)}</pre>
        </div>
    );
};
