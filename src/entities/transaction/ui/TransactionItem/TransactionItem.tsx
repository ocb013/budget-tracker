import { formatCents } from '@/shared/lib/money/money';
import clsx from 'clsx';
import { useEffect, useId, useRef, useState, type FC } from 'react';
import type { Transaction } from '../../model/types';
import cls from './TransactionItem.module.scss';

const TRANSACTION_MODES = {
    IDLE: 'idle',
    DELETE: 'delete',
    EDIT: 'edit'
} as const;

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
    const [mode, setMode] = useState<
        (typeof TRANSACTION_MODES)[keyof typeof TRANSACTION_MODES]
    >(TRANSACTION_MODES.IDLE);

    const confirmId = useId();

    const isOptimistic = transaction.id.startsWith('optimistic-');
    const isDeleteDisabled = isOptimistic || isDeleting;

    const panelRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (mode !== 'idle') panelRef.current?.focus();
    }, [mode]);

    const openDelete = () => {
        if (isDeleteDisabled) return;
        setMode(TRANSACTION_MODES.DELETE);
    };

    const openEdit = () => {
        setMode(TRANSACTION_MODES.EDIT);
    };

    const handleDelete = () => {
        if (isDeleteDisabled) return;
        onDelete(transaction.id);
    };

    const handleCancel = () => {
        if (isDeleting) return;
        setMode(TRANSACTION_MODES.IDLE);
    };

    const onConfirmKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Escape') {
            e.preventDefault();
            handleCancel();
        }
    };

    const handleConfirm = () => {
        if (mode === TRANSACTION_MODES.DELETE) {
            handleDelete();
        }
    };

    const buttonText =
        mode === TRANSACTION_MODES.DELETE
            ? isDeleting
                ? 'Deleting…'
                : 'Delete'
            : mode === TRANSACTION_MODES.EDIT
              ? isDeleting
                  ? 'Saving…'
                  : 'Save'
              : '';

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
                <div className={cls.actionButtons}>
                    <button
                        type="button"
                        className={clsx(
                            cls.deleteButton,
                            (isDeleteDisabled ||
                                mode !== TRANSACTION_MODES.IDLE) &&
                                cls.hidden
                        )}
                        onClick={openDelete}
                        disabled={isDeleteDisabled}
                        aria-label="Delete transaction"
                        aria-expanded={mode === 'delete'}
                        aria-controls={confirmId}
                        title="Delete"
                    >
                        ×
                    </button>
                    <button
                        type="button"
                        className={clsx(
                            cls.editButton,
                            (isOptimistic ||
                                mode !== TRANSACTION_MODES.IDLE) &&
                                cls.hidden
                        )}
                        onClick={openEdit}
                        aria-label="Edit transaction"
                        title="Edit"
                    >
                        e
                    </button>
                </div>
            </div>

            {mode !== TRANSACTION_MODES.IDLE && (
                <div
                    id={confirmId}
                    className={cls.confirmRow}
                    role="group"
                    aria-label={
                        mode === TRANSACTION_MODES.DELETE
                            ? 'Confirm delete'
                            : 'Confirm save'
                    }
                    tabIndex={-1}
                    onKeyDown={onConfirmKeyDown}
                    ref={panelRef}
                >
                    <span className={cls.confirmText}>
                        {mode === TRANSACTION_MODES.DELETE &&
                            'Delete transaction ?'}
                        {mode === TRANSACTION_MODES.EDIT &&
                            'Edit transaction'}
                    </span>

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
                            className={
                                mode === TRANSACTION_MODES.DELETE
                                    ? cls.confirmDelete
                                    : cls.confirmEdit
                            }
                            onClick={handleConfirm}
                            disabled={isDeleteDisabled}
                        >
                            {buttonText}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};
