import type {
    NewTransactionInput,
    Transaction
} from '@/entities/transaction';
import { sortByDateDesc } from '../lib/transaction/sortByDateDesc';
import { readJson, writeJson } from '../lib/storage/storage';

// small async delay to simulate network
export async function delay(ms: number): Promise<void> {
    await new Promise((res) => setTimeout(res, ms));
}

const STORAGE_KEY = 'budget-tracker:transactions';
const NETWORK_DELAY_MS = 250;

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
