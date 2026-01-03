import clsx from 'clsx';
import type { FC } from 'react';
import cls from './TransactionForm.module.scss';

interface TransactionFormProps {
    extraStyles?: string;
}

export const TransactionForm: FC<TransactionFormProps> = ({
    extraStyles
}) => {
    return (
        <div className={clsx(cls.transactionForm, extraStyles)}>
            TransactionForm
        </div>
    );
};
