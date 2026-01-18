import clsx from 'clsx';
import { useRef, type ChangeEvent, type FC } from 'react';
import cls from './AddTransactionForm.module.scss';

import {
    TRANSACTION_CATEGORIES,
    type Transaction
} from '@/entities/transaction';
import { Card } from '@/shared/ui/Card/Card';
import { useAddTransactionForm } from '../../model/useAddTransactionForm';

interface AddTransactionFormProps {
    className?: string;
    mode: 'add' | 'edit';
    initialTx: Transaction | null;
    onCancelEdit: () => void;
}

export const AddTransactionForm: FC<AddTransactionFormProps> = ({
    className
}) => {
    const amountRef = useRef<HTMLInputElement | null>(null);

    const {
        type,
        amount,
        date,
        description,
        category,
        isPending,
        onSubmit,
        errors,
        handleAmountChange,
        handleChangeType,
        handleChangeDescription,
        handleChangeCategory,
        handleDateChange,
        submitError
    } = useAddTransactionForm({
        onSuccess: () => {
            queueMicrotask(() => amountRef.current?.focus());
        }
    });

    const isSubmitDisabled = isPending || amount.trim().length === 0;

    return (
        <Card
            title="Add transaction"
            className={clsx(cls.addTransactionForm, className)}
        >
            <form className={cls.form} onSubmit={onSubmit} noValidate>
                <div
                    className={cls.typeToggle}
                    role="group"
                    aria-label="Transaction type"
                >
                    <button
                        type="button"
                        className={clsx(cls.typeButton, {
                            [cls.active]: type === 'income'
                        })}
                        onClick={() => handleChangeType('income')}
                    >
                        Income
                    </button>

                    <button
                        type="button"
                        className={clsx(cls.typeButton, {
                            [cls.active]: type === 'expense'
                        })}
                        onClick={() => handleChangeType('expense')}
                    >
                        Expense
                    </button>
                </div>

                <label className={cls.field}>
                    <span className={cls.label}>Amount</span>
                    <input
                        className={clsx(cls.input, {
                            [cls.inputError]: !!errors.amount
                        })}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                        aria-invalid={!!errors.amount}
                        ref={amountRef}
                    />
                    {errors.amount && (
                        <div className={cls.errorText}>
                            {errors.amount}
                        </div>
                    )}
                </label>

                <div className={cls.field}>
                    <span className={cls.label}>Category</span>
                    <div className={cls.categories}>
                        {TRANSACTION_CATEGORIES.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={clsx(cls.categoryChip, {
                                    [cls.active]: c === category
                                })}
                                onClick={() =>
                                    handleChangeCategory(c)
                                }
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <label className={cls.field}>
                    <span className={cls.label}>Date</span>
                    <input
                        className={clsx(cls.input, {
                            [cls.inputError]: !!errors.date
                        })}
                        type="date"
                        value={date}
                        onChange={handleDateChange}
                        aria-invalid={!!errors.date}
                    />
                    {errors.date && (
                        <div className={cls.errorText}>
                            {errors.date}
                        </div>
                    )}
                </label>

                <label className={cls.field}>
                    <span className={cls.label}>
                        Description (optional)
                    </span>
                    <input
                        className={cls.input}
                        type="text"
                        value={description}
                        onChange={(
                            e: ChangeEvent<HTMLInputElement>
                        ) => handleChangeDescription(e.target.value)}
                        placeholder="e.g. Groceries at Safeway"
                    />
                </label>

                <div className={cls.actions}>
                    <button
                        type="submit"
                        className={cls.submitButton}
                        disabled={isSubmitDisabled}
                    >
                        {isPending ? 'Adding…' : 'Add'}
                    </button>

                    {submitError && (
                        <div className={cls.submitError}>
                            Something went wrong. Please try again.
                        </div>
                    )}
                </div>
            </form>
        </Card>
    );
};
