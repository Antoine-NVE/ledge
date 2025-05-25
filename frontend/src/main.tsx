import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import UserProvider from './providers/UserProvider.tsx';
import TransactionProvider from './providers/TransactionProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <TransactionProvider>
                <App />
            </TransactionProvider>
        </UserProvider>
    </StrictMode>
);
