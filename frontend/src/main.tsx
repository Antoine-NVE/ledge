import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import UserProvider from './providers/UserProvider.tsx';
import TransactionsProvider from './providers/TransactionsProvider.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <TransactionsProvider>
                <App />
            </TransactionsProvider>
        </UserProvider>
    </StrictMode>
);
