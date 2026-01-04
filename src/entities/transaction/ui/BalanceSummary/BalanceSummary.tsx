import { formatCents } from '@/shared/lib/money';
import { Card } from '@/shared/ui/Card/Card';
import clsx from 'clsx';
import type { FC } from 'react';
import type { Totals } from '../../model/types';
import cls from './BalanceSummary.module.scss';

interface BalanceSummaryProps {
    className?: string;
    totals: Totals;
}

export const BalanceSummary: FC<BalanceSummaryProps> = ({
    className,
    totals
}) => {
    return (
        <Card
            className={clsx(cls.balanceSummary, className)}
            title="Balance Summary"
        >
            <div className={cls.container}>
                <span className={cls.label}>Your income</span>
                <div className={cls.total}>
                    {formatCents(totals.incomeCents)}
                </div>
            </div>

            <div className={cls.container}>
                <span className={cls.label}>Your expense</span>
                <div className={cls.total}>
                    {formatCents(totals.expenseCents)}
                </div>
            </div>

            <div className={cls.line} />

            <div className={cls.container}>
                <span className={cls.label}>Your balance</span>
                <div className={clsx(cls.balanceTotal)}>
                    {formatCents(totals.balanceCents)}
                </div>
            </div>
        </Card>
    );
};
