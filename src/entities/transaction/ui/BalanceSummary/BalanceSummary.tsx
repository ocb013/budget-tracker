import { formatCents } from '@/shared/lib/money';
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
        <div className={clsx(cls.balanceSummary, className)}>
            BalanceSummary
            <div>{formatCents(totals.incomeCents)}</div>
            <div>{formatCents(totals.balanceCents)}</div>
            <div>{formatCents(totals.expenseCents)}</div>
        </div>
    );
};
