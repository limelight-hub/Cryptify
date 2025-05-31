import React from 'react';
import { render, screen } from '@testing-library/react';
import AboutCard from '../AboutCard';

test('renders AboutCard component', () => {
    render(<AboutCard />);
    const linkElement = screen.getByText(/about/i);
    expect(linkElement).toBeInTheDocument();
});