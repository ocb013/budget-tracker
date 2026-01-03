import clsx from 'clsx';
import type { FC } from 'react';
import cls from './DashboardPage.module.scss';

import { BudgetDashboard } from '@/widgets/budgetDashboard';

interface DashboardPageProps {
    className?: string;
}

export const DashboardPage: FC<DashboardPageProps> = ({
    className
}) => {
    return (
        <div className={clsx(cls.dashboardPage, className)}>
            <h1>Budget Tracker</h1>
            <BudgetDashboard />
        </div>
    );
};
