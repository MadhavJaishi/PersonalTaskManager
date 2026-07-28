import { useNavigate, useLocation } from 'react-router-dom';
import { TbPasswordUser } from "react-icons/tb";
import { SlCalender } from "react-icons/sl";
import { IoBarChart } from "react-icons/io5";
import { useSelector } from 'react-redux';
import type { RootState } from '../redux/store';

const NavBar = () => {
    const navigate = useNavigate();
    const location = useLocation();
    const userState = useSelector((state: RootState) => state.userSliceReducer);

    const displayName = userState.username || userState.email?.split('@')[0] || 'User';

    const isActive = (path: string) => location.pathname === path;

    return (
        <nav className="bg-white text-slate-800 px-6 py-3.5 flex justify-between items-center shadow-sm border-b border-slate-200 sticky top-0 z-40">
            {/* Logo */}
            <div onClick={() => navigate("/dashboard")} className="flex items-center gap-2 cursor-pointer group">
                <div className="w-8 h-8 rounded-xl bg-blue-600 flex items-center justify-center text-white font-bold text-lg shadow-sm group-hover:scale-105 transition">
                    C
                </div>
                <span className="text-xl font-bold tracking-tight text-slate-900">ClearTrack</span>
            </div>

            {/* Navigation Links */}
            <div className="flex items-center gap-6">
                <button
                    onClick={() => navigate("/dashboard")}
                    className={`text-sm font-semibold transition ${isActive("/dashboard") ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"}`}
                >
                    Dashboard
                </button>

                <button
                    onClick={() => navigate("/analytics")}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition ${isActive("/analytics") ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"}`}
                >
                    <IoBarChart size={17} />
                    <span>Analytics</span>
                </button>

                <button
                    onClick={() => navigate("/calendar")}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition ${isActive("/calendar") ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"}`}
                >
                    <SlCalender size={16} />
                    <span>Calendar</span>
                </button>

                <button
                    onClick={() => navigate("/passwordmgr")}
                    className={`flex items-center gap-1.5 text-sm font-semibold transition ${isActive("/passwordmgr") ? "text-blue-600 font-bold" : "text-slate-600 hover:text-blue-600"}`}
                >
                    <TbPasswordUser size={18} />
                    <span>Passwords</span>
                </button>

                {/* Profile */}
                <div
                    onClick={() => navigate("/settings")}
                    className="flex items-center gap-2 pl-2 border-l border-slate-200 cursor-pointer group hover:text-blue-600 transition"
                >
                    <div className="w-8 h-8 rounded-full bg-slate-100 border border-slate-300 flex items-center justify-center font-bold text-slate-700 text-xs">
                        {displayName.charAt(0).toUpperCase()}
                    </div>
                    <span className="text-sm font-semibold text-slate-800 group-hover:text-blue-600 hidden sm:inline">
                        {displayName}
                    </span>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
