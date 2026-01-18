import clsx from 'clsx';
import { useEffect, useId, useRef, type FC } from 'react';
import cls from './TransactionItem.module.scss';

import { formatCents } from '@/shared/lib/money/money';
import type { Transaction } from '../../model/types';

interface TransactionItemProps {
    className?: string;
    transaction: Transaction;

    onDelete: (id: string) => void;
    isDeleting: boolean;

    onEdit: (tx: Transaction) => void;
    editingId: string | null;
    onCancelEdit: () => void;

    // ✅ controlled delete panel (so only ONE can be open in the list)
    isDeleteOpen: boolean;
    onToggleDelete: () => void;
    onCloseDelete: () => void;
}

export const TransactionItem: FC<TransactionItemProps> = ({
    className,
    transaction,
    onDelete,
    isDeleting,
    onEdit,
    editingId,
    onCancelEdit,
    isDeleteOpen,
    onToggleDelete,
    onCloseDelete
}) => {
    const confirmId = useId();
    const panelRef = useRef<HTMLDivElement>(null);

    const isEditTransactionOpen = transaction.id === editingId;

    const handleDelete = () => {
        if (isEditTransactionOpen) onCancelEdit();
        onDelete(transaction.id);
        onCloseDelete();
    };

    const handleEdit = () => {
        if (isEditTransactionOpen) {
            onCancelEdit();
            return;
        }

        if (isDeleteOpen) onCloseDelete();
        onEdit(transaction);
    };

    useEffect(() => {
        if (isDeleteOpen) panelRef.current?.focus();
    }, [isDeleteOpen]);

    const onPanelKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            onCloseDelete();
        }
    };

    const isOptimistic = transaction.id.startsWith('optimistic-');
    const isButtonsVisible =
        (isDeleteOpen || isEditTransactionOpen) && !isOptimistic;

    return (
        <div className={clsx(cls.item, className)}>
            <div className={cls.itemWrapper}>
                <div className={cls.content}>
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
                        </div>
                    </div>

                    <div className={cls.bottomRow}>
                        <div className={cls.metaLeft}>
                            {transaction.type === 'income'
                                ? 'Income'
                                : 'Expense'}
                        </div>
                        <div className={cls.date}>
                            {transaction.date}
                        </div>
                    </div>

                    {transaction.description?.trim() && (
                        <div className={cls.description}>
                            {transaction.description}
                        </div>
                    )}
                </div>

                <div
                    className={clsx(
                        cls.actionButtons,
                        isButtonsVisible && cls.actionButtonsActive
                    )}
                >
                    <button
                        type="button"
                        className={clsx(
                            cls.deleteButton,
                            isDeleteOpen && cls.deleteButtonActive
                        )}
                        onClick={onToggleDelete}
                        aria-label="Delete transaction"
                        aria-expanded={isDeleteOpen}
                        aria-controls={confirmId}
                        title="Delete"
                    >
                        ×
                    </button>

                    <button
                        type="button"
                        className={clsx(
                            cls.editButton,
                            isEditTransactionOpen &&
                                cls.editButtonActive
                        )}
                        onClick={handleEdit}
                        aria-label={
                            isEditTransactionOpen
                                ? 'Editing transaction'
                                : 'Edit transaction'
                        }
                        aria-pressed={isEditTransactionOpen}
                        title={
                            isEditTransactionOpen ? 'Editing' : 'Edit'
                        }
                    >
                        e
                    </button>
                </div>
            </div>

            {isDeleteOpen && (
                <div
                    id={confirmId}
                    className={cls.confirmRow}
                    role="group"
                    aria-label="Confirm delete"
                    tabIndex={-1}
                    onKeyDown={onPanelKeyDown}
                    ref={panelRef}
                >
                    <span className={cls.confirmText}>
                        Delete transaction?
                    </span>

                    <div className={cls.confirmActions}>
                        <button
                            type="button"
                            className={cls.confirmCancel}
                            onClick={onCloseDelete}
                            disabled={isDeleting}
                        >
                            Cancel
                        </button>

                        <button
                            type="button"
                            className={cls.confirmDelete}
                            onClick={handleDelete}
                            disabled={isDeleting}
                        >
                            {isDeleting ? 'Deleting…' : 'Delete'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
