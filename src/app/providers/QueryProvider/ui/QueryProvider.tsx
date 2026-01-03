import { QueryClientProvider } from '@tanstack/react-query';
import type { FC, ReactNode } from 'react';
import { createQueryClient } from '../model/queryClient';

const qc = createQueryClient();

interface QueryProviderProps {
    children: ReactNode;
}

export const QueryProvider: FC<QueryProviderProps> = ({
    children
}) => {
    return (
        <QueryClientProvider client={qc}>
            {children}
        </QueryClientProvider>
    );
};
