import { Card } from '@/shared/ui/Card/Card';
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
        <Card
            className={clsx(cls.transactionList, className)}
            title="Transaction List"
        >
            {items.length > 0 ? (
                items.map((item) => (
                    <TransactionItem
                        transaction={item}
                        key={item.id}
                    />
                ))
            ) : (
                <div>No transactions yet. Add your first one.</div>
            )}
        </Card>
    );
};
