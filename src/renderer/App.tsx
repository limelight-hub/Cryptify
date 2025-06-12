import React from 'react';
import EncryptionApp from './components/EncryptionApp';
import ErrorBoundary from './components/ErrorBoundary';
import { ThemeProvider } from './context/ThemeContext';
import './index.css';

function App() {
    return (
        <ErrorBoundary>
            <ThemeProvider>
                <EncryptionApp />
            </ThemeProvider>
        </ErrorBoundary>
    );
}

export default App;
