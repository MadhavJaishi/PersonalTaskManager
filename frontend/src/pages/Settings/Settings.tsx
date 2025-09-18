import { useState } from 'react';
import { motion } from 'framer-motion';
import Profile from './components/Profile';

const profileData = {
    name: "Madhav",
    email: "madhavjaishi@gmail.com",
    profilePic: "../../../../../public/ProfileImg.jpeg",
};

const tasksOverview = [
    {
        title: 'Pending Misses',
        description: 'Manage your tasks efficiently.',
    },
    {
        title: 'Milestones Met',
        description: 'Keep track of your achievements.',
    },
    {
        title: 'Outstanding Effort',
        description: 'Recognize your hard work.',
    }
]

export default function Settings() {
    const [notificationsEnabled, setNotificationsEnabled] = useState(true);

    // Editing field tracker
    const [editingField, setEditingField] = useState<
        | 'name'
        | 'email'
        | 'password'
        | 'profilePic'
        | 'timezone'
        | 'language'
        | 'notifications'
        | null
    >(null);

    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
    });
    const updatePassword = () => {
        setEditingField(null);
    }
    const [tempNotifications, setTempNotifications] = useState(notificationsEnabled);


    const saveNotifications = () => {
        setNotificationsEnabled(tempNotifications);
        setEditingField(null);
    };

    const handleLogout = () => alert('Logged out!');

    // Animations for editing panel
    const containerVariants = {
        hidden: { opacity: 0, height: 0 },
        visible: { opacity: 1, height: 'auto' },
        exit: { opacity: 0, height: 0 },
    };

    return (
        <div className=" text-zinc-800 p-8 font-sans">
            <header className="max-w-7xl mx-auto mb-4">
                <h1 className="text-4xl font-bold text-center">User Settings</h1>
                <p className="text-center text-gray-400 mt-2 max-w-xl mx-auto">
                    Manage your account details, preferences, and security settings here.
                </p>
            </header>

            <main className="max-w-7xl mx-auto space-y-2">
                {/* Profile Picture */}
                <div className='gap-0'>
                    <h1 className='md:pl-10 text-[#9BC09C] pl-6 font-bold text-xl pt-5'>Profile Settings</h1>
                    <Profile profilePic={profileData.profilePic} name={profileData.name} email={profileData.email} />
                </div>
                {/* Password */}
                <section className=" rounded-xl shadow-lg p-6">
                    <div>
                        <label className="text-xl text-[#9BC09C] font-semibold mb-1">Password</label>
                        {editingField === 'password' ? (
                            <div className="space-y-4">
                                <input
                                    type="password"
                                    placeholder="Current password"
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full rounded-md bg-gray-700 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="password"
                                    placeholder="New password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full rounded-md bg-gray-700 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <input
                                    type="password"
                                    placeholder="Verify New password"
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full rounded-md bg-gray-700 px-4 py-3 text-gray-100 placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500"
                                />
                                <div className="flex justify-end space-x-4">
                                    <button
                                        onClick={updatePassword}
                                        className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                                    >
                                        Save
                                    </button>
                                    <button
                                        onClick={setPasswords.bind(null, { currentPassword: '', newPassword: '' })}
                                        className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition"
                                    >
                                        Cancel
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="flex justify-between items-center">
                                <span>••••••••</span>
                                <button
                                    onClick={() => {
                                        setPasswords({
                                            currentPassword: '',
                                            newPassword: '',
                                        })
                                        setEditingField('password');
                                    }}
                                    className="text-blue-400 hover:underline font-semibold"
                                >
                                    Edit
                                </button>
                            </div>
                        )}
                    </div>
                </section>

                <section className=" rounded-xl shadow-lg p-6 flex flex-col gap-3">
                    <div>
                        <h1 className='text-3xl text-[#9BC09C] font-bold text-center'>Tasks Overview</h1>
                    </div>

                    <div className="w-7/12 h-0.5 bg-blue-100 mx-auto -mt-3 mb-2"></div>

                    <div className='flex flex-row justify-around items-center'>
                        {tasksOverview.map((task, index) => (
                            <div key={index} className='p-6 rounded-lg shadow-md w-1/3'>
                                <h2 className='text-xl font-semibold text-center'>{task.title}</h2>
                                <p className='text-gray-400 text-center'>{task.description}</p>
                                <div>
                                    <button className='mt-4 w-full bg-blue-400 hover:bg-purple-700 text-white font-semibold py-2 px-4 rounded-lg transition'>
                                        View Details
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                {/* Logout */}
                <section className="max-w-7xl mx-auto text-center m-12">
                    <button
                        onClick={handleLogout}
                        className="w-full max-w-xs mx-auto py-3 text-white bg-purple-500 hover:bg-purple-700 rounded-xl font-semibold transition"
                    >
                        Logout
                    </button>
                </section>
            </main>
        </div>
    );
}