import clsx from 'clsx';
import type { ChangeEvent, FC } from 'react';
import cls from './TransactionFilters.module.scss';

import {
    CATEGORY_FILTER_OPTIONS,
    TYPE_FILTER_OPTIONS
} from '../../model/config';
import type { CategoryFilter, TypeFilter } from '../../model/types';

interface TransactionFiltersProps {
    className?: string;
    typeValue: TypeFilter;
    onTypeChange: (v: TypeFilter) => void;
    categoryValue: CategoryFilter;
    onCategoryChange: (v: CategoryFilter) => void;
}

export const TransactionFilters: FC<TransactionFiltersProps> = ({
    className,
    typeValue,
    onTypeChange,
    categoryValue,
    onCategoryChange
}) => {
    const handleTypeChange = (e: ChangeEvent<HTMLSelectElement>) => {
        onTypeChange(e.target.value as TypeFilter);
    };

    const handleCategoryChange = (
        e: ChangeEvent<HTMLSelectElement>
    ) => {
        onCategoryChange(e.target.value as CategoryFilter);
    };

    return (
        <div
            className={clsx(cls.transactionFilters, className)}
            role="group"
            aria-label="Filter transactions"
        >
            <select
                className={cls.select}
                value={typeValue}
                onChange={handleTypeChange}
                aria-label="Transaction type"
            >
                {TYPE_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
            <select
                className={cls.select}
                value={categoryValue}
                onChange={handleCategoryChange}
                aria-label="Transaction category"
            >
                {CATEGORY_FILTER_OPTIONS.map((option) => (
                    <option key={option.value} value={option.value}>
                        {option.label}
                    </option>
                ))}
            </select>
        </div>
    );
};
