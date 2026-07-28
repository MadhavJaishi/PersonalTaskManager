import React, { useState } from 'react';

export interface CredentialItem {
    id?: number | string;
    app: string;
    username: string;
    password: string;
}

interface AddOrEditCredentialProps {
    setIsOpen: (isOpen: boolean) => void;
    credentialToEdit?: CredentialItem | null;
    onSave: (credential: CredentialItem) => Promise<void> | void;
}

const AddOrEditCredential: React.FC<AddOrEditCredentialProps> = ({
    setIsOpen,
    credentialToEdit,
    onSave,
}) => {
    const [app, setApp] = useState(credentialToEdit?.app || '');
    const [username, setUsername] = useState(credentialToEdit?.username || '');
    const [password, setPassword] = useState(credentialToEdit?.password || '');
    const [errorMsg, setErrorMsg] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!app.trim() || !username.trim() || !password.trim()) {
            setErrorMsg('All fields are required.');
            return;
        }

        setIsSubmitting(true);
        setErrorMsg('');
        try {
            await onSave({
                ...(credentialToEdit?.id ? { id: credentialToEdit.id } : {}),
                app: app.trim(),
                username: username.trim(),
                password: password.trim(),
            });
            setIsOpen(false);
        } catch (err: any) {
            setErrorMsg(err?.message || 'Failed to save credential.');
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4 p-1">
            <div className="flex items-center justify-between border-b pb-3">
                <h2 className="text-xl font-bold text-slate-800">
                    {credentialToEdit ? 'Edit Credential' : 'Add New Credential'}
                </h2>
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="text-2xl text-slate-400 hover:text-slate-600 transition"
                >
                    &times;
                </button>
            </div>

            {errorMsg && (
                <div className="p-3 text-sm text-rose-600 bg-rose-50 border border-rose-200 rounded-lg">
                    {errorMsg}
                </div>
            )}

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Application / Service Name <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={app}
                    onChange={(e) => setApp(e.target.value)}
                    placeholder="e.g. Gmail, GitHub, Netflix"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Username / Email Address <span className="text-rose-500">*</span>
                </label>
                <input
                    type="text"
                    required
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    placeholder="e.g. user@example.com or john_doe"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
            </div>

            <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">
                    Password <span className="text-rose-500">*</span>
                </label>
                <input
                    type="password"
                    required
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="Enter secure password"
                    className="w-full px-3 py-2 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none text-slate-800"
                />
            </div>

            <div className="flex justify-end gap-3 pt-4 border-t">
                <button
                    type="button"
                    onClick={() => setIsOpen(false)}
                    className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 font-medium rounded-xl transition"
                >
                    Cancel
                </button>
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="px-5 py-2 bg-blue-600 hover:bg-blue-700 text-white font-medium rounded-xl shadow transition disabled:opacity-50"
                >
                    {isSubmitting ? 'Saving...' : credentialToEdit ? 'Save Changes' : 'Add Credential'}
                </button>
            </div>
        </form>
    );
};

export default AddOrEditCredential;