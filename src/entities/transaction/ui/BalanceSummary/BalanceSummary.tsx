import { formatCents } from '@/shared/lib/money/money';
import { Card } from '@/shared/ui/Card/Card';
import { Skeleton } from '@/shared/ui/Skeleton/Skeleton';
import clsx from 'clsx';
import type { FC } from 'react';
import type { Totals } from '../../model/types';
import cls from './BalanceSummary.module.scss';

interface BalanceSummaryProps {
    isLoading?: boolean;
    className?: string;
    totals: Totals;
}

function BalanceValueSkeleton({ size }: { size: 'small' | 'big' }) {
    const isSmall = size === 'small';

    return (
        <div className={cls.balanceSkeleton}>
            <span className={isSmall ? cls.total : cls.balanceTotal}>
                $
            </span>
            <Skeleton
                height={isSmall ? 18 : 24}
                width={isSmall ? 80 : 120}
            />
        </div>
    );
}

export const BalanceSummary: FC<BalanceSummaryProps> = ({
    isLoading,
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
                    {isLoading ? (
                        <BalanceValueSkeleton size="small" />
                    ) : (
                        formatCents(totals.incomeCents)
                    )}
                </div>
            </div>

            <div className={cls.container}>
                <span className={cls.label}>Your expense</span>
                <div className={cls.total}>
                    {isLoading ? (
                        <BalanceValueSkeleton size="small" />
                    ) : (
                        formatCents(totals.expenseCents)
                    )}
                </div>
            </div>

            <div className={cls.line} />

            <div className={cls.container}>
                <span className={cls.label}>Your balance</span>
                <div className={cls.balanceTotal}>
                    {isLoading ? (
                        <BalanceValueSkeleton size="big" />
                    ) : (
                        formatCents(totals.balanceCents)
                    )}
                </div>
            </div>
        </Card>
    );
};
