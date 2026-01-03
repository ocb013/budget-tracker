export type TransactionType = 'income' | 'expense';

export type TransactionCategory =
    | 'Salary'
    | 'Freelance'
    | 'Food'
    | 'Transport'
    | 'Rent'
    | 'Health'
    | 'Shopping'
    | 'Entertainment'
    | 'Other';

export interface Transaction {
    id: string;
    type: TransactionType;
    amountCents: number;
    category: TransactionCategory;
    date: string; // YYYY-MM-DD
    description?: string;
}

export type NewTransactionInput = Omit<Transaction, 'id'>;
