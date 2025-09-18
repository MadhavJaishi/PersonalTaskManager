import { FiSettings } from 'react-icons/fi';
import { FaTasks } from 'react-icons/fa';
import { useNavigate } from 'react-router-dom';

const NavBar = () => {
    const username = 'Madhav';
    const navigate = useNavigate();
    return (
        <nav className="bg-white text-black px-6 py-3 flex justify-between items-center shadow-md">
            {/* Left: App Icon + Name */}
            <div className="flex items-center gap-2">
                <FaTasks size={20} className="text-blue-500" />
                <span className="text-lg font-semibold">ClearTrack</span>
            </div>

            {/* Right: Settings + Profile */}
            <div className="flex items-center gap-4">
                <button onClick={() => navigate("/settings")} className="hover:text-blue-400 transition">
                    <FiSettings size={20} />
                </button>
                <div className="flex items-center gap-2">
                    <img
                        src={"../../../../../public/ProfileImg.jpeg"}
                        alt="Profile"
                        className="w-8 h-8 rounded-full border border-gray-700"
                    />
                    <span className="text-sm font-medium">{username}</span>
                </div>
            </div>
        </nav>
    );
};

export default NavBar;
