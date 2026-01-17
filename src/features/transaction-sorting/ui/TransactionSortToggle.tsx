import clsx from 'clsx';
import type { FC } from 'react';

import type { SortMode } from '../model/types';
import cls from './TransactionSortToggle.module.scss';

interface TransactionSortToggleProps {
    value: SortMode;
    onChange: (mode: SortMode) => void;
}

export const TransactionSortToggle: FC<
    TransactionSortToggleProps
> = ({ value, onChange }) => {
    return (
        <div
            className={cls.sortToggle}
            role="group"
            aria-label="Sort transactions"
        >
            <button
                type="button"
                className={clsx(cls.sortButton, {
                    [cls.sortActive]: value === 'date'
                })}
                aria-pressed={value === 'date'}
                onClick={() => onChange('date')}
                disabled={value === 'date'}
            >
                Date
            </button>

            <button
                type="button"
                className={clsx(cls.sortButton, {
                    [cls.sortActive]: value === 'amount'
                })}
                aria-pressed={value === 'amount'}
                onClick={() => onChange('amount')}
                disabled={value === 'amount'}
            >
                Amount
            </button>
        </div>
    );
};
