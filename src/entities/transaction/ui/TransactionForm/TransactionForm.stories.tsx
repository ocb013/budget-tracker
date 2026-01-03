import type { Meta, StoryObj } from '@storybook/react-vite';
import { TransactionForm } from './TransactionForm';

const meta = {
    title: 'entities/TransactionForm',
    component: TransactionForm
} satisfies Meta<typeof TransactionForm>;

export default meta;
type Story = StoryObj<typeof meta>;

export const Primary: Story = {};

