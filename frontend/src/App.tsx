import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
