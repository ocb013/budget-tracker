import type { FC } from 'react';
import cls from './NoResults.module.scss';

interface NoResultsProps {
    onClear?: () => void;
}

export const NoResults: FC<NoResultsProps> = ({ onClear }) => {
    return (
        <div className={cls.noResults}>
            <div className={cls.noResultsRow}>
                <span className={cls.noResultsText}>
                    No results. Try clearing filters.
                </span>

                <button
                    type="button"
                    className={cls.clearButton}
                    aria-label="Clear filters"
                    onClick={onClear}
                >
                    Clear filters
                </button>
            </div>
        </div>
    );
};
