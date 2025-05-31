import React, {
    useState,
    useOptimistic,
    useActionState,
    startTransition,
} from 'react';
import EncryptionApp from './components/EncryptionApp';
import { createRoot } from 'react-dom/client';
import './index.css';

function App() {
    return (
        <div>
            <EncryptionApp />
        </div>
    );
}

export default App;
