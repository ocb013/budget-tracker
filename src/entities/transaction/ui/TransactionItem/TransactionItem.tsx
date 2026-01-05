import { formatCents } from '@/shared/lib/money';
import clsx from 'clsx';
import type { FC } from 'react';
import type { Transaction } from '../../model/types';
import cls from './TransactionItem.module.scss';

interface TransactionItemProps {
    className?: string;
    transaction: Transaction;
}

export const TransactionItem: FC<TransactionItemProps> = ({
    className,
    transaction
}) => {
    return (
        <div className={clsx(cls.item, className)}>
            <div className={cls.topRow}>
                <div className={cls.category}>
                    {transaction.category}
                </div>
                <div
                    className={clsx(cls.amount, {
                        [cls.income]: transaction.type === 'income',
                        [cls.expense]: transaction.type === 'expense'
                    })}
                >
                    {formatCents(transaction.amountCents)}
                </div>
            </div>

            <div className={cls.bottomRow}>
                <div className={cls.metaLeft}>
                    {transaction.description?.trim()
                        ? transaction.description
                        : transaction.type === 'income'
                        ? 'Income'
                        : 'Expense'}
                </div>
                <div className={cls.date}>{transaction.date}</div>
            </div>
        </div>
    );
};
