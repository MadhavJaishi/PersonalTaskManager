import { useState } from 'react';
import { useAuth } from '../../auth';
import { useSelector, useDispatch } from 'react-redux';
import type { RootState, AppDispatch } from '../../redux/store';
import { clearUser } from '../../redux/userSlice';

export default function Settings() {
    const { logout } = useAuth();
    const dispatch = useDispatch<AppDispatch>();
    const userState = useSelector((state: RootState) => state.userSliceReducer);

    const displayName = userState.username || 'Madhav';
    const displayEmail = userState.email || 'user@example.com';

    const [editingField, setEditingField] = useState<'password' | null>(null);
    const [passwords, setPasswords] = useState({
        currentPassword: '',
        newPassword: '',
        verifyPassword: '',
    });
    const [msg, setMsg] = useState<{ type: 'success' | 'error'; text: string } | null>(null);

    const updatePassword = (e: React.FormEvent) => {
        e.preventDefault();
        if (!passwords.currentPassword || !passwords.newPassword) {
            setMsg({ type: 'error', text: 'Please fill in both current and new password.' });
            return;
        }
        if (passwords.newPassword !== passwords.verifyPassword) {
            setMsg({ type: 'error', text: 'New passwords do not match.' });
            return;
        }
        setMsg({ type: 'success', text: 'Password updated successfully!' });
        setEditingField(null);
        setPasswords({ currentPassword: '', newPassword: '', verifyPassword: '' });
    };

    const handleLogout = () => {
        dispatch(clearUser());
        logout();
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] text-slate-800 p-6 sm:p-8 max-w-4xl mx-auto">
            <header className="mb-8 text-center sm:text-left">
                <h1 className="text-3xl font-bold text-slate-800">Account Settings</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Manage your profile details, security preferences, and session controls.
                </p>
            </header>

            {msg && (
                <div
                    className={`mb-6 p-4 rounded-xl text-sm font-medium border ${
                        msg.type === 'success'
                            ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                            : 'bg-rose-50 text-rose-700 border-rose-200'
                    }`}
                >
                    {msg.text}
                </div>
            )}

            <main className="space-y-6">
                {/* Profile Card */}
                <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <h2 className="text-lg font-bold text-slate-800 mb-4 border-b pb-3">User Profile</h2>

                    <div className="flex items-center gap-5">
                        <div className="w-16 h-16 rounded-full bg-blue-600 text-white font-bold text-2xl flex items-center justify-center shadow-sm shrink-0">
                            {displayName.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h3 className="text-xl font-bold text-slate-800">{displayName}</h3>
                            <p className="text-sm text-slate-500 font-medium">{displayEmail}</p>
                            <span className="inline-block mt-2 text-xs font-semibold px-2.5 py-0.5 bg-blue-50 text-blue-600 rounded-full border border-blue-100">
                                Active Account
                            </span>
                        </div>
                    </div>
                </section>

                {/* Password Section */}
                <section className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                    <div className="flex justify-between items-center mb-4 border-b pb-3">
                        <h2 className="text-lg font-bold text-slate-800">Security & Password</h2>
                        {editingField !== 'password' && (
                            <button
                                onClick={() => setEditingField('password')}
                                className="text-sm font-semibold text-blue-600 hover:text-blue-700 transition"
                            >
                                Change Password
                            </button>
                        )}
                    </div>

                    {editingField === 'password' ? (
                        <form onSubmit={updatePassword} className="space-y-4 max-w-md">
                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.currentPassword}
                                    onChange={(e) => setPasswords({ ...passwords, currentPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.newPassword}
                                    onChange={(e) => setPasswords({ ...passwords, newPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                />
                            </div>

                            <div>
                                <label className="block text-xs font-semibold text-slate-600 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    required
                                    value={passwords.verifyPassword}
                                    onChange={(e) => setPasswords({ ...passwords, verifyPassword: e.target.value })}
                                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-sm"
                                />
                            </div>

                            <div className="flex gap-3 pt-2">
                                <button
                                    type="submit"
                                    className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl text-sm shadow transition"
                                >
                                    Save Password
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setEditingField(null)}
                                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl text-sm transition"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    ) : (
                        <div className="flex justify-between items-center text-sm text-slate-600">
                            <span>Password status: <strong className="text-slate-800">Protected</strong></span>
                            <span className="text-xs text-slate-400">••••••••</span>
                        </div>
                    )}
                </section>

                {/* Logout Button */}
                <section className="pt-6">
                    <button
                        onClick={handleLogout}
                        className="w-full sm:w-auto px-6 py-3 bg-rose-600 hover:bg-rose-700 text-white font-semibold rounded-xl shadow-sm transition"
                    >
                        Log Out of ClearTrack
                    </button>
                </section>
            </main>
        </div>
    );
}