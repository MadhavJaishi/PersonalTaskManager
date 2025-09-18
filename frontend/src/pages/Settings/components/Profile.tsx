import { motion } from 'framer-motion';
import { useState } from 'react';

interface ProfileSectionProps {
    profilePic: string | null;
    name: string;
    email: string;
}

export default function Profile({
    profilePic,
    name,
    email
}: ProfileSectionProps) {
    const [editing, setEditing] = useState(false);
    const [profileData, setProfileData] = useState({
        name: name,
        email: email,
        profilePic: profilePic,
    })

    const handlePicChange = (e: any) => {
        const file = e.target.files[0];
        if (file) {
            saveChanges("profilePic", URL.createObjectURL(file));
        }
    };

    const saveChanges = (name: string, text: string) => {
        setProfileData((prev) => ({ ...prev, name: text }));
    };
    const updateData = () => {
    }

    return (
        <section className=" text-zinc-900 rounded-xl shadow-xl py-6 px-8 md:flex items-start space-y-6 md:space-y-0 md:space-x-8 transition-all duration-500">
            {/* Profile Picture */}
            <div className="flex-shrink-0">
                <motion.img
                    key={profilePic ?? 'placeholder'}
                    src={"../../../../../public/ProfileImg.jpeg"}
                    alt="Profile"
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5 }}
                    className="w-32 h-32 rounded-full object-cover border-4 border-gray-700 shadow-lg"
                />
                {editing && (
                    <input
                        type="file"
                        accept="image/*"
                        onChange={handlePicChange}
                        className="mt-4 pt-4 absolute flex flex-wrap file:bg-blue-600 file:text-white file:rounded-md file:px-4 file:py-2 cursor-pointer"
                    />
                )}
            </div>

            {/* Name & Email */}
            <div className="flex-1 space-y-4">
                <div>
                    <label className="block text-sm text-gray-600">Name</label>
                    {editing ? (
                        <input
                            type="text"
                            value={profileData.name}
                            onChange={(e) => saveChanges("name", e.target.value)}
                            placeholder="Enter your name"
                            className="w-full mt-1 px-4 py-2 text-zinc-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="text-l text-zinc-600 font-semibold">{name}</p>

                    )}
                </div>

                <div>
                    <label className="block text-sm text-gray-600">Email</label>
                    {editing ? (
                        <input
                            type="email"
                            value={profileData.email}
                            onChange={(e) => saveChanges("email", e.target.value)}
                            placeholder="you@example.com"
                            className="w-full mt-1 px-4 py-2 text-zinc-700 rounded-md border border-gray-600 focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    ) : (
                        <p className="text-zinc-600">{email}</p>
                    )}
                </div>

                {/* Buttons */}
                <div className="pt-4">
                    {editing ? (
                        <div className="flex float-end space-x-4">
                            <button
                                onClick={() => updateData()}
                                className="bg-blue-600 hover:bg-blue-700 px-6 py-2 rounded-lg font-semibold transition"
                            >
                                Save
                            </button>
                            <button
                                onClick={() => { }}
                                className="bg-gray-600 hover:bg-gray-700 px-6 py-2 rounded-lg font-semibold transition"
                            >
                                Cancel
                            </button>
                        </div>
                    ) : (
                        <button
                            onClick={() => setEditing(true)}
                            className="mt-4 text-blue-400 hover:underline font-semibold"
                        >
                            Edit Profile
                        </button>
                    )}
                </div>
            </div>
        </section>
    );
}
