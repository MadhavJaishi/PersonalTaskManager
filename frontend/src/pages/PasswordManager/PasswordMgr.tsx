import { useState, useEffect } from "react";
import { IoKeyOutline } from "react-icons/io5";
import CredentialSearch from "./CredentialSearch";
import { FaPlus, FaCopy } from "react-icons/fa";
import { FiEye, FiEyeOff } from "react-icons/fi";
import AlertModal, { AlertModalProps } from "../../components/AlertModal";
import Modal from "../../components/Modal";
import AddOrEditCredential, { CredentialItem } from "./AddOrEditCredential";
import { api } from "../../api-config/api";
import { useSelector } from "react-redux";
import type { RootState } from "../../redux/store";

const PasswordMgr = () => {
    const userId = useSelector((state: RootState) => state.userSliceReducer.id);
    const [credentials, setCredentials] = useState<CredentialItem[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchQuery, setSearchQuery] = useState("");
    const [passwordVisible, setPasswordVisible] = useState<number | string | null>(null);
    const [modalOpen, setModalOpen] = useState(false);
    const [editingCredential, setEditingCredential] = useState<CredentialItem | null>(null);
    const [copiedIndex, setCopiedIndex] = useState<number | string | null>(null);

    const [alertModal, setAlertModal] = useState<AlertModalProps>({
        visible: false,
        title: "",
        message: "",
        buttons: [],
    });

    const fetchCredentials = async () => {
        setLoading(true);
        try {
            const url = userId ? `/credentials/${userId}` : '/credentials';
            const response = await api.get(url);
            setCredentials(Array.isArray(response.data) ? response.data : response.data.credentials || []);
        } catch (error) {
            console.error("Failed to fetch credentials", error);
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        fetchCredentials();
    }, [userId]);

    const handleSaveCredential = async (item: CredentialItem) => {
        if (item.id) {
            // Edit existing credential
            const response = await api.put(`/credentials/editCredential/${item.id}`, item);
            const updated = response.data;
            setCredentials((prev) =>
                prev.map((c) => (String(c.id) === String(item.id) ? updated : c))
            );
        } else {
            // Add new credential
            const response = await api.post('/credentials/addCredential', {
                user_id: userId,
                ...item,
            });
            const created = response.data;
            setCredentials((prev) => [created, ...prev]);
        }
    };

    const handleDeleteCredential = (id: number | string) => {
        setAlertModal({
            visible: true,
            title: "Delete Credential",
            message: "Are you sure you want to delete this item? This action cannot be undone.",
            buttons: [
                {
                    text: "Cancel",
                    onClick: () => setAlertModal((prev) => ({ ...prev, visible: false })),
                },
                {
                    text: "Delete",
                    onClick: async () => {
                        try {
                            await api.delete(`/credentials/deleteCredential/${id}`);
                            setCredentials((prev) => prev.filter((c) => String(c.id) !== String(id)));
                        } catch (err) {
                            console.error("Failed to delete credential", err);
                        }
                        setAlertModal((prev) => ({ ...prev, visible: false }));
                    },
                },
            ],
        });
    };

    const handleCopyPassword = (pass: string, id: number | string) => {
        navigator.clipboard.writeText(pass);
        setCopiedIndex(id);
        setTimeout(() => setCopiedIndex(null), 2000);
    };

    const filteredCredentials = credentials.filter((c) => {
        if (!searchQuery.trim()) return true;
        const query = searchQuery.toLowerCase();
        return (
            c.app.toLowerCase().includes(query) ||
            c.username.toLowerCase().includes(query)
        );
    });

    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col p-4 sm:p-6 max-w-7xl mx-auto">
            {/* Header section */}
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4 p-6 bg-white border border-slate-200 shadow-sm rounded-2xl mb-6">
                <div className="flex items-center gap-3 font-bold text-2xl text-slate-800">
                    <div className="p-2 bg-blue-50 text-blue-600 rounded-xl">
                        <IoKeyOutline size={28} />
                    </div>
                    <div>
                        <h1>Password Manager</h1>
                        <p className="text-xs font-normal text-slate-500">Store and manage your app credentials securely</p>
                    </div>
                </div>

                <div className="flex items-center gap-3 w-full sm:w-auto">
                    <CredentialSearch searchQuery={searchQuery} onSearchChange={setSearchQuery} />
                    <button
                        onClick={() => {
                            setEditingCredential(null);
                            setModalOpen(true);
                        }}
                        className="flex items-center gap-2 font-medium px-4 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl shadow-sm transition text-sm shrink-0 cursor-pointer"
                    >
                        <FaPlus size={14} />
                        Add Credential
                    </button>
                </div>
            </div>

            {/* Content Table */}
            <div className="bg-white border border-slate-200 shadow-sm rounded-2xl p-6">
                <div className="flex flex-row justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-slate-800">Your Credentials</h2>
                    <span className="text-xs font-semibold px-3 py-1 bg-slate-100 text-slate-600 rounded-full">
                        Total Items: {filteredCredentials.length}
                    </span>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center py-16">
                        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                    </div>
                ) : filteredCredentials.length === 0 ? (
                    <div className="text-center py-16">
                        <p className="text-slate-500 font-medium">No credentials found.</p>
                        <p className="text-slate-400 text-xs mt-1">
                            {searchQuery ? "Try a different search query." : "Click 'Add Credential' to add your first login details."}
                        </p>
                    </div>
                ) : (
                    <div className="overflow-x-auto rounded-xl border border-slate-200">
                        <table className="min-w-full table-auto border-collapse w-full text-left text-sm text-slate-700">
                            <thead>
                                <tr className="bg-slate-50 border-b border-slate-200 text-xs font-bold text-slate-500 uppercase tracking-wider">
                                    <th className="px-6 py-3.5">App / Website</th>
                                    <th className="px-6 py-3.5">Username / Email</th>
                                    <th className="px-6 py-3.5">Password</th>
                                    <th className="px-6 py-3.5 text-right">Actions</th>
                                </tr>
                            </thead>
                            <tbody className="divide-y divide-slate-100">
                                {filteredCredentials.map((credential) => {
                                    const idKey = credential.id || credential.app + credential.username;
                                    const isVisible = passwordVisible === idKey;
                                    const isCopied = copiedIndex === idKey;

                                    return (
                                        <tr key={idKey} className="hover:bg-slate-50/80 transition">
                                            <td className="px-6 py-4 font-semibold text-slate-800">{credential.app}</td>
                                            <td className="px-6 py-4 text-slate-600">{credential.username}</td>
                                            <td className="px-6 py-4">
                                                <div className="flex items-center gap-3">
                                                    <span className="font-mono text-sm tracking-wider min-w-[120px] select-all">
                                                        {isVisible ? credential.password : "••••••••••••"}
                                                    </span>

                                                    <button
                                                        onClick={() => setPasswordVisible(isVisible ? null : idKey)}
                                                        className="text-slate-400 hover:text-slate-600 p-1 transition cursor-pointer"
                                                        title={isVisible ? "Hide Password" : "Show Password"}
                                                    >
                                                        {isVisible ? <FiEyeOff size={16} /> : <FiEye size={16} />}
                                                    </button>

                                                    <button
                                                        onClick={() => handleCopyPassword(credential.password, idKey)}
                                                        className="text-slate-400 hover:text-blue-600 p-1 transition cursor-pointer"
                                                        title="Copy Password"
                                                    >
                                                        <FaCopy size={14} className={isCopied ? "text-emerald-500" : ""} />
                                                    </button>
                                                    {isCopied && <span className="text-[10px] text-emerald-600 font-bold">Copied!</span>}
                                                </div>
                                            </td>
                                            <td className="px-6 py-4 text-right whitespace-nowrap">
                                                <button
                                                    onClick={() => {
                                                        setEditingCredential(credential);
                                                        setModalOpen(true);
                                                    }}
                                                    className="px-3 py-1.5 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-xs font-semibold mr-2 transition"
                                                >
                                                    Edit
                                                </button>
                                                <button
                                                    onClick={() => credential.id && handleDeleteCredential(credential.id)}
                                                    className="px-3 py-1.5 bg-rose-50 hover:bg-rose-100 text-rose-600 rounded-lg text-xs font-semibold transition"
                                                >
                                                    Delete
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>

            {/* Modal Form */}
            {modalOpen && (
                <Modal isOpen={modalOpen} setIsOpen={setModalOpen} title={editingCredential ? "Edit Credential" : "Add Credential"}>
                    <AddOrEditCredential
                        setIsOpen={setModalOpen}
                        credentialToEdit={editingCredential}
                        onSave={handleSaveCredential}
                    />
                </Modal>
            )}

            {/* Alert Modal */}
            <AlertModal
                visible={alertModal.visible}
                title={alertModal.title}
                message={alertModal.message}
                buttons={alertModal.buttons}
            />
        </div>
    );
};

export default PasswordMgr;