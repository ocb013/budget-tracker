import type { TransactionCategory } from '@/entities/transaction';
import { Card } from '@/shared/ui/Card/Card';
import clsx from 'clsx';
import {
    useMemo,
    useState,
    type ChangeEvent,
    type FC,
    type FormEvent
} from 'react';
import { sanitizeAmountInput } from '../../lib/sanitizeAmountInput';
import { transactionCategories } from '../../model/categories';
import cls from './AddTransactionForm.module.scss';

type TransactionType = 'expense' | 'income';

interface AddTransactionFormProps {
    className?: string;
}

export const AddTransactionForm: FC<AddTransactionFormProps> = ({
    className
}) => {
    const [type, setType] = useState<TransactionType>('expense');
    const [amount, setAmount] = useState<string>('');
    const [category, setCategory] = useState<TransactionCategory>(
        transactionCategories[0]
    );

    const isSubmitDisabled = useMemo(() => {
        return amount.trim().length === 0;
    }, [amount]);

    const handleAmountChange = (e: ChangeEvent<HTMLInputElement>) => {
        setAmount(sanitizeAmountInput(e.target.value));
    };

    const onSubmit = (e: FormEvent) => {
        e.preventDefault();
        console.log({ type, amount, category });
    };

    return (
        <Card
            title="Add transaction"
            className={clsx(cls.addTransactionForm, className)}
        >
            <form className={cls.form} onSubmit={onSubmit}>
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
                        onClick={() => setType('income')}
                    >
                        Income
                    </button>

                    <button
                        type="button"
                        className={clsx(cls.typeButton, {
                            [cls.active]: type === 'expense'
                        })}
                        onClick={() => setType('expense')}
                    >
                        Expense
                    </button>
                </div>

                <label className={cls.field}>
                    <span className={cls.label}>Amount</span>
                    <input
                        className={cls.input}
                        type="text"
                        inputMode="decimal"
                        placeholder="0.00"
                        value={amount}
                        onChange={handleAmountChange}
                    />
                </label>

                <div className={cls.field}>
                    <span className={cls.label}>Category</span>
                    <div className={cls.categories}>
                        {transactionCategories.map((c) => (
                            <button
                                key={c}
                                type="button"
                                className={clsx(cls.categoryChip, {
                                    [cls.active]: c === category
                                })}
                                onClick={() => setCategory(c)}
                            >
                                {c}
                            </button>
                        ))}
                    </div>
                </div>

                <div className={cls.actions}>
                    <button
                        type="submit"
                        className={cls.submitButton}
                        disabled={isSubmitDisabled}
                    >
                        Add
                    </button>
                </div>
            </form>
        </Card>
    );
};
