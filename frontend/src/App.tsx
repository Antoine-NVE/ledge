import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import MonthPage from './pages/Month';

function App() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-100">
            <BrowserRouter>
                <Routes>
                    <Route path="/" element={<HomePage />} />
                    <Route path="/month/:month" element={<MonthPage />} />
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
