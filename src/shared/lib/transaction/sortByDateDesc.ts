import type { Transaction } from '@/entities/transaction';

export function sortByDateDesc(items: Transaction[]): Transaction[] {
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
}
