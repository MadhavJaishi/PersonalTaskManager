import { Routes, Route, Navigate } from 'react-router-dom';
import Signin from './SignIn/Signin';
import Dashboard from './Dashboard/Dashboard';
import Calendar from './Calendar/Calendar';
import Analytics from './Analytics/Analytics';
import Settings from './Settings/Settings';
import { useAuth } from '../auth';
import NavBar from '../components/NavBar';
import Footer from '../components/Footer';
import PasswordMgr from './PasswordManager/PasswordMgr';

export default function AppRoutes() {
    const { isLoggedIn } = useAuth();

    if (!isLoggedIn) {
        return (
            <Routes>
                <Route path="/login" element={<Signin />} />
                <Route path="*" element={<Navigate to="/login" replace />} />
            </Routes>
        );
    }

    return (
        <div className="bg-[#F9FAFB] min-h-screen flex flex-col justify-between">
            <div>
                <NavBar />
                <Routes>
                    <Route path="/dashboard" element={<Dashboard />} />
                    <Route path="/calendar" element={<Calendar />} />
                    <Route path="/calender" element={<Navigate to="/calendar" replace />} />
                    <Route path="/analytics" element={<Analytics />} />
                    <Route path="/settings" element={<Settings />} />
                    <Route path="/passwordmgr" element={<PasswordMgr />} />
                    <Route path="*" element={<Navigate to="/dashboard" replace />} />
                </Routes>
            </div>
            <Footer />
        </div>
    );
}
