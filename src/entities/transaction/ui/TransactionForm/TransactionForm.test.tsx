import { render, screen } from '@testing-library/react';
import { TransactionForm } from './TransactionForm';

describe('TransactionForm', () => {
    it('renders correctly', () => {
        render(<TransactionForm />);

        expect(
            screen.getByText('TransactionForm')
        ).toBeInTheDocument();
    });

    it('applies extraStyles class', () => {
        render(<TransactionForm extraStyles="custom-class" />);

        const element = screen.getByText('TransactionForm');
        expect(element).toHaveClass('custom-class');
    });
});
