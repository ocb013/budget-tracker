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
        <div className={clsx(cls.transactionItem, className)}>
            <div className="">{transaction.type}</div>
            <div className="">{transaction.category}</div>
            <div className="">
                {formatCents(transaction.amountCents)}
            </div>
            <div className="">{transaction.date}</div>

            {transaction.description && (
                <div className="">{transaction.description}</div>
            )}
        </div>
    );
};
