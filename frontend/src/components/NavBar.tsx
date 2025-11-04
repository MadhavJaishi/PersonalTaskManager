import { FiSettings } from 'react-icons/fi';
import { useNavigate } from 'react-router-dom';
import { FaTasks } from 'react-icons/fa';
import { IoKeyOutline } from "react-icons/io5";
import { SlCalender } from "react-icons/sl";

const NavBar = () => {
    const username = 'Madhav';
    const navigate = useNavigate();
    return (
        <nav className="bg-white text-black px-6 py-3 flex justify-between items-center shadow-md">
            <div onClick={() => navigate("/dashboard")} className="flex items-center gap-2 cursor-pointer">
                <FaTasks size={20} className="text-blue-500" />
                <span className="text-lg font-semibold">ClearTrack</span>
            </div>

            <div className="flex items-center gap-4 cursor-pointer">
                <div className="flex items-center gap-1 sm:mr-4 hover:text-blue-400" onClick={() => navigate("/passwordmgr")}>
                    <IoKeyOutline size={20} className="invisible md:visible" />
                    <span className="md:text-lg font-semibold">PasswordMgr</span>
                </div>
                <div className="flex items-center gap-1 sm:mr-4 hover:text-blue-400" onClick={() => navigate("/calender")}>
                    <SlCalender size={20} className="invisible md:visible" />
                    <span className="md:text-lg font-semibold">Calender</span>
                </div>
                <div
                    onClick={() => navigate("/settings")}
                    className="flex flex-row gap-4 items-center hover:text-blue-400 transition cursor-pointer group"
                >
                    <div className="flex items-center gap-2">
                        <img
                            src={"../../../../../public/ProfileImg.jpeg"}
                            alt="Profile"
                            className="w-8 h-8 rounded-full border border-gray-700 transform transition-transform duration-100 group-hover:scale-110 group-hover:shadow-md"
                        />
                        <span className="text-sm font-medium">{username}</span>
                    </div>
                </div>

            </div>
        </nav>
    );
};

export default NavBar;
