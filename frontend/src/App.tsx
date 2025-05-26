import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from './pages/Home';
import MonthPage from './pages/Month';
import WithNavbar from './layouts/WithNavbar';
import NoNavbar from './layouts/NoNavbar';
import ScrollToTop from './components/ScrollToTop';
import Login from './pages/Login';
import Register from './pages/Register';

function App() {
    return (
        <div className="min-h-screen bg-gray-100">
            <BrowserRouter>
                <ScrollToTop />
                <Routes>
                    <Route element={<WithNavbar />}>
                        <Route path="/" element={<HomePage />} />
                        <Route path="/month/:month" element={<MonthPage />} />
                    </Route>
                    <Route element={<NoNavbar />}>
                        {/* Add any routes that don't need a navbar here */}
                        <Route path="/register" element={<Register />} />
                        <Route path="/login" element={<Login />} />
                    </Route>
                </Routes>
            </BrowserRouter>
        </div>
    );
}

export default App;
