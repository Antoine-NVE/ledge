import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import MonthPage from './pages/Month';
import Public from './layouts/Public';
import Private from './layouts/Private';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';
import Profile from './pages/Profile';
import VerifyEmail from './pages/VerifyEmail';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route element={<Private />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/month/:month" element={<MonthPage />} />
                        <Route path="/profile" element={<Profile />} />'
                    </Route>
                    <Route element={<Public />}>
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/verify-email/:token" element={<VerifyEmail />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
