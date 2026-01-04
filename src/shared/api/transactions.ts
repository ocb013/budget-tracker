import type {
    NewTransactionInput,
    Transaction
} from '@/entities/transaction';
import { delay, readJson, writeJson } from './storage';

const STORAGE_KEY = 'budget-tracker:transactions';
const NETWORK_DELAY_MS = 250;

function sortByDateDesc(items: Transaction[]): Transaction[] {
    return [...items].sort((a, b) => b.date.localeCompare(a.date));
}

export async function getTransactions(): Promise<Transaction[]> {
    await delay(NETWORK_DELAY_MS);
    const items = readJson<Transaction[]>(STORAGE_KEY, []);
    return sortByDateDesc(items);
}

export async function addTransaction(
    input: NewTransactionInput
): Promise<Transaction> {
    await delay(NETWORK_DELAY_MS);

    const newItem: Transaction = {
        id: crypto.randomUUID(),
        ...input
    };

    const prev = readJson<Transaction[]>(STORAGE_KEY, []);
    const next = [newItem, ...prev];
    writeJson(STORAGE_KEY, next);

    return newItem;
}

export async function deleteTransaction(id: string): Promise<void> {
    await delay(NETWORK_DELAY_MS);
    const prev = readJson<Transaction[]>(STORAGE_KEY, []);
    const next = prev.filter((t) => t.id !== id);
    writeJson(STORAGE_KEY, next);
}
