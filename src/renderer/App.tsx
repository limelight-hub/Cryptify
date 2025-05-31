import React, {
    useState,
    useOptimistic,
    useActionState,
    startTransition,
} from 'react';
import EncryptionApp from './components/EncryptionApp';
import { createRoot } from 'react-dom/client';
import './index.css';
import { ThemeProvider } from './context/ThemeContext';

function App() {
    return (
        <ThemeProvider>
            <EncryptionApp />
        </ThemeProvider>
    );
}

export default App;
