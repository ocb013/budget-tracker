import { formatCents } from '@/shared/lib/money/money';
import clsx from 'clsx';
import { useEffect, useState, type FC } from 'react';
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
    const [isConfirming, setIsConfirming] = useState(false);

    const isOptimistic = transaction.id.startsWith('optimistic-');
    const isDeleteDisabled = isOptimistic || isDeleting;

    const openConfirm = () => {
        if (isDeleteDisabled) return;
        setIsConfirming(true);
    };

    const handleConfirm = () => {
        if (isDeleteDisabled) return;
        onDelete(transaction.id);
    };

    const handleCancel = () => {
        if (isDeleting) return;
        setIsConfirming(false);
    };

    useEffect(() => {
        if (!isConfirming) return;

        const onKeyDown = (e: KeyboardEvent) => {
            if (e.key === 'Escape') handleCancel();
        };

        window.addEventListener('keydown', onKeyDown);
        return () => window.removeEventListener('keydown', onKeyDown);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [isConfirming, isDeleting]);

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
                            (isOptimistic ||
                                isDeleting ||
                                isConfirming) &&
                                cls.hidden
                        )}
                        onClick={openConfirm}
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

            {isConfirming && (
                <div
                    className={cls.confirmRow}
                    role="group"
                    aria-label="Confirm delete"
                >
                    <span className={cls.confirmText}>Delete?</span>

                    <div className={cls.confirmActions}>
                        <button
                            type="button"
                            className={cls.confirmCancel}
                            onClick={handleCancel}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className={cls.confirmDelete}
                            onClick={handleConfirm}
                            disabled={isDeleteDisabled}
                        >
                            {isDeleting ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
