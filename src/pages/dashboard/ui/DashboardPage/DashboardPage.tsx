import { BudgetDashboard } from '@/widgets/budget-dashboard';
import clsx from 'clsx';
import type { FC } from 'react';
import cls from './DashboardPage.module.scss';

interface DashboardPageProps {
    className?: string;
}

export const DashboardPage: FC<DashboardPageProps> = ({
    className
}) => {
    return (
        <div className={clsx(cls.dashboardPage, className)}>
            <div className="container">
                <header className={cls.header}>
                    <a href="/">
                        <h1 className={cls.title}>Budget Tracker</h1>
                    </a>
                    <p className={cls.subtitle}>
                        Track your income and expenses
                    </p>
                </header>

                <BudgetDashboard />
            </div>
        </div>
    );
};
