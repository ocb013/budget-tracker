import clsx from 'clsx';
import type { FC } from 'react';
import cls from './Transaction.module.scss';

interface TransactionProps {
    extraStyles?: string;
}

export const Transaction: FC<TransactionProps> = ({
    extraStyles
}) => {
    return (
        <div className={clsx(cls.transaction, extraStyles)}>
            Transaction
        </div>
    );
};
