import clsx from 'clsx';
import type { FC } from 'react';
import type { Transaction } from '../../model/types';
import { TransactionItem } from '../TransactionItem/TransactionItem';
import cls from './TransactionList.module.scss';

interface TransactionListProps {
    className?: string;
    items: Transaction[];
}

export const TransactionList: FC<TransactionListProps> = ({
    className,
    items
}) => {
    return (
        <div className={clsx(cls.transactionList, className)}>
            {items.map((item) => (
                <TransactionItem transaction={item} key={item.id} />
            ))}
        </div>
    );
};
