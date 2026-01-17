import type {
    NewTransactionInput,
    Transaction,
    UpdateTransactionInput
} from '@/entities/transaction';
import { TRANSACTIONS_STORAGE_KEY } from '../constants/storage';
import { readJson, writeJson } from '../lib/storage/storage';
import { sortByDateDesc } from '../lib/transaction/sortByDateDesc';

// small async delay to simulate network
export async function delay(ms: number): Promise<void> {
    await new Promise((res) => setTimeout(res, ms));
}

const NETWORK_DELAY_MS = 250;

export async function getTransactions(): Promise<Transaction[]> {
    await delay(NETWORK_DELAY_MS);
    const items = readJson<Transaction[]>(
        TRANSACTIONS_STORAGE_KEY,
        []
    );
    return sortByDateDesc(items);
}

export async function updateTransaction(
    id: string,
    patch: UpdateTransactionInput
): Promise<Transaction> {
    await delay(NETWORK_DELAY_MS);

    const prev = readJson<Transaction[]>(
        TRANSACTIONS_STORAGE_KEY,
        []
    );

    const prevTransaction = prev.find((tx) => tx.id === id);
    if (!prevTransaction) {
        throw new Error('Transaction not found');
    }

    const newTransaction: Transaction = {
        ...prevTransaction,
        ...patch,
        id
    };

    const next = prev.map((tx) =>
        tx.id === id ? newTransaction : tx
    );

    writeJson(TRANSACTIONS_STORAGE_KEY, next);

    return newTransaction;
}

export async function addTransaction(
    input: NewTransactionInput
): Promise<Transaction> {
    await delay(NETWORK_DELAY_MS);

    const newItem: Transaction = {
        id: crypto.randomUUID(),
        ...input
    };

    const prev = readJson<Transaction[]>(
        TRANSACTIONS_STORAGE_KEY,
        []
    );
    const next = [newItem, ...prev];
    writeJson(TRANSACTIONS_STORAGE_KEY, next);

    return newItem;
}

export async function deleteTransaction(id: string): Promise<void> {
    await delay(NETWORK_DELAY_MS);
    const prev = readJson<Transaction[]>(
        TRANSACTIONS_STORAGE_KEY,
        []
    );
    const next = prev.filter((t) => t.id !== id);
    writeJson(TRANSACTIONS_STORAGE_KEY, next);
}
