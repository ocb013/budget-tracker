import type { CATEGORY_FILTERS, TYPE_FILTERS } from './consts';

export type TypeFilter =
    (typeof TYPE_FILTERS)[keyof typeof TYPE_FILTERS];

export type CategoryFilter = (typeof CATEGORY_FILTERS)[number];
