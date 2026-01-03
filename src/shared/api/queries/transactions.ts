import type {
    NewTransactionInput,
    Transaction
} from '@/entities/transaction/model/types';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
import { addTransaction, getTransactions } from '../transactions';

export const transactionsKeys = {
    all: ['transactions'] as const
};

export function useTransactionsQuery() {
    return useQuery<Transaction[]>({
        queryKey: transactionsKeys.all,
        queryFn: getTransactions,
        staleTime: 30_000
    });
}

export function useAddTransactionMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (input: NewTransactionInput) =>
            addTransaction(input),
        onSuccess: async () => {
            await qc.invalidateQueries({
                queryKey: transactionsKeys.all
            });
        }
    });
}
