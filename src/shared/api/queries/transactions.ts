import type {
    NewTransactionInput,
    Transaction,
    UpdateTransactionInput
} from '@/entities/transaction/model/types';
import { sortByDateDesc } from '@/shared/lib/transaction/sortByDateDesc';
import {
    useMutation,
    useQuery,
    useQueryClient
} from '@tanstack/react-query';
import {
    addTransaction,
    deleteTransaction,
    getTransactions,
    updateTransaction
} from '../transactions';

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
        onMutate: async (input) => {
            await qc.cancelQueries({
                queryKey: transactionsKeys.all
            });

            const prev = qc.getQueryData<Transaction[]>(
                transactionsKeys.all
            );

            const optimisticId = `optimistic-${crypto.randomUUID()}`;

            const optimisticTx: Transaction = {
                id: optimisticId,
                ...input
            };

            qc.setQueryData<Transaction[]>(
                transactionsKeys.all,
                (old) => {
                    const items = old ?? [];
                    return sortByDateDesc([optimisticTx, ...items]);
                }
            );

            return { prev, optimisticId };
        },

        onError: (_err, _input, ctx) => {
            if (ctx?.prev) {
                qc.setQueryData(transactionsKeys.all, ctx.prev);
            }
        },

        onSuccess: (serverTx, _input, ctx) => {
            qc.setQueryData<Transaction[]>(
                transactionsKeys.all,
                (old) => {
                    const items = old ?? [];
                    return sortByDateDesc(
                        items.map((t) =>
                            t.id === ctx.optimisticId ? serverTx : t
                        )
                    );
                }
            );
        },

        onSettled: async () => {
            await qc.invalidateQueries({
                queryKey: transactionsKeys.all
            });
        }
    });
}

type UpdateTxVars = { id: string; patch: UpdateTransactionInput };

export function useUpdateTransactionMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: ({ id, patch }: UpdateTxVars) =>
            updateTransaction(id, patch),

        onMutate: async ({ id, patch }) => {
            await qc.cancelQueries({
                queryKey: transactionsKeys.all
            });

            const prev = qc.getQueryData<Transaction[]>(
                transactionsKeys.all
            );

            const prevTx = prev?.find((tx) => tx.id === id);

            if (!prevTx) {
                return { prev };
            }

            const optimisticTx: Transaction = {
                ...prevTx,
                ...patch
            };

            qc.setQueryData<Transaction[]>(
                transactionsKeys.all,
                (old) => {
                    const items = old ?? [];
                    return sortByDateDesc(
                        items.map((t) =>
                            t.id === id ? optimisticTx : t
                        )
                    );
                }
            );

            return { prev };
        },

        onError: (_err, _vars, ctx) => {
            if (ctx?.prev) {
                qc.setQueryData(transactionsKeys.all, ctx.prev);
            }
        },

        onSuccess: (serverTx) => {
            qc.setQueryData<Transaction[]>(
                transactionsKeys.all,
                (old) => {
                    const items = old ?? [];
                    return sortByDateDesc(
                        items.map((t) =>
                            t.id === serverTx.id ? serverTx : t
                        )
                    );
                }
            );
        },

        onSettled: async () => {
            await qc.invalidateQueries({
                queryKey: transactionsKeys.all
            });
        }
    });
}

export function useDeleteTransactionMutation() {
    const qc = useQueryClient();

    return useMutation({
        mutationFn: (id: string) => deleteTransaction(id),

        onMutate: async (id) => {
            await qc.cancelQueries({
                queryKey: transactionsKeys.all
            });

            const prev = qc.getQueryData<Transaction[]>(
                transactionsKeys.all
            );

            qc.setQueryData<Transaction[]>(
                transactionsKeys.all,
                (old) => {
                    const items = old ?? [];
                    return items.filter((t) => t.id !== id);
                }
            );

            return { prev };
        },

        onError: (_err, _input, ctx) => {
            if (ctx?.prev) {
                qc.setQueryData(transactionsKeys.all, ctx.prev);
            }
        },

        onSettled: async () => {
            await qc.invalidateQueries({
                queryKey: transactionsKeys.all
            });
        }
    });
}
