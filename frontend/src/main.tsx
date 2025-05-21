import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App.tsx';
import { TransactionProvider } from './contexts/TransactionContext.tsx';
import { UserProvider } from './contexts/UserContext.tsx';

createRoot(document.getElementById('root')!).render(
    <StrictMode>
        <UserProvider>
            <TransactionProvider>
                <App />
            </TransactionProvider>
        </UserProvider>
    </StrictMode>
);
