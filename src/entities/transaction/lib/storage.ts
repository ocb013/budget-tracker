import { LIST_PREFS_STORAGE_KEY } from '@/shared/constants/storage';
import { readJson } from '@/shared/lib/storage/storage';
import { CATEGORY_FILTERS, FILTER_TYPES } from '../model/consts';
import type { TransactionListPrefs } from '../model/types';

const DEFAULT_PREFS: Required<TransactionListPrefs> = {
    sort: 'date',
    typeFilter: FILTER_TYPES.ALL,
    categoryFilter: CATEGORY_FILTERS[0]
};

export const readListPrefs = () => {
    const prefs = {
        ...DEFAULT_PREFS,
        ...readJson(LIST_PREFS_STORAGE_KEY, {})
    };

    return prefs;
};
