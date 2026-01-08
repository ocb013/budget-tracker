import { formatCents } from '@/shared/lib/money/money';
import clsx from 'clsx';
import type { FC } from 'react';
import type { Transaction } from '../../model/types';
import cls from './TransactionItem.module.scss';

interface TransactionItemProps {
    className?: string;
    transaction: Transaction;
    onDelete: (id: string) => void;
    isDeleting: boolean;
}

export const TransactionItem: FC<TransactionItemProps> = ({
    className,
    transaction,
    onDelete,
    isDeleting
}) => {
    const isOptimistic = transaction.id.startsWith('optimistic-');

    const handleDelete = () => {
        if (isDeleting || isOptimistic) return;
        const ok = window.confirm('Delete this transaction?');
        if (ok) onDelete(transaction.id);
    };

    return (
        <div className={clsx(cls.item, className)}>
            <div className={cls.topRow}>
                <div className={cls.category}>
                    {transaction.category}
                </div>

                <div className={cls.right}>
                    <div
                        className={clsx(cls.amount, {
                            [cls.income]:
                                transaction.type === 'income',
                            [cls.expense]:
                                transaction.type === 'expense'
                        })}
                    >
                        {formatCents(transaction.amountCents)}
                    </div>

                    <button
                        type="button"
                        className={clsx(
                            cls.deleteButton,
                            (isOptimistic || isDeleting) && cls.hidden
                        )}
                        onClick={handleDelete}
                        disabled={isOptimistic || isDeleting}
                        aria-label="Delete transaction"
                        title="Delete"
                    >
                        ×
                    </button>
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
