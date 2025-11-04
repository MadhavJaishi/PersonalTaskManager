import { IoKeyOutline } from "react-icons/io5"
import CredentialSearch from "./CredentialSearch"
import { FaPlus } from "react-icons/fa"
import passwordmgrVideo from "/passwordmgrVideo.mp4"
import { FiEye, FiEyeOff } from "react-icons/fi"
import { useState } from "react"
import AlertModal, { AlertModalProps } from "../../components/AlertModal"

const PasswordMgr = () => {
    const [passwordVisible, setPasswordVisible] = useState<number | null>(null);
    const [alertModal, setAlertModal] = useState<AlertModalProps>({
        visible: false,
        title: "",
        message: "",
        buttons: [],
    });
    const Credentials = [
        {
            app: "Gmail",
            username: "rajan@gmail.com",
            password: "jhgafsfbss"
        },
        {
            app: "Github",
            username: "madhavjaishi0@gmail.com",
            password: "jhgafsfbss"
        },
        {
            app: "Chess.com",
            username: "madhavjaishi0@gmail.com",
            password: "sdfhuioklkI"
        },
        {
            app: "Gmail",
            username: "rajan@gmail.com",
            password: "jhgafsfbss"
        },
        {
            app: "Github",
            username: "madhavjaishi0@gmail.com",
            password: "jhgafsfbss"
        },
        {
            app: "Chess.com",
            username: "madhavjaishi0@gmail.com",
            password: "sdfhuioklkI"
        },
        {
            app: "Gmail",
            username: "rajan@gmail.com",
            password: "jhgafsfbss"
        },
    ];
    const handleAddOrEditCredential = (name: string) => {

    }
    const handleDeleteCredential = (index: number) => {
        setAlertModal({
            visible: true,
            title: "Delete Credential",
            message: "Are you sure you want to delete this item? This action cannot be undone.",
            buttons: [
                { text: "Cancel", onClick: () => { setAlertModal(prev => ({ ...prev, visible: false })) } },
                { text: "Delete", onClick: () => { setAlertModal(prev => ({ ...prev, visible: false })) } },
            ],
        })
    }
    return (
        <div className="min-h-screen bg-[#F9FAFB] flex flex-col">
            <div className="flex flex-col gap-4 sm:flex-row justify-between items-center p-6 bg-white border-b border-gray-300 border-2 m-4 rounded-2xl">
                <div className="flex items-center gap-2 font-medium text-2xl" >
                    <IoKeyOutline size={24} className="" />
                    <h1>Password Manager</h1>
                </div>
                <div>
                    <CredentialSearch />
                </div>
            </div>
            <div className="flex flex-col lg:flex-row items-stretch">
                {/* Add Credential & Video */}
                <div className="flex flex-col gap-4 lg:w-1/3 w-full p-6 bg-white border-2 border-gray-300 m-4 rounded-2xl">
                    <button
                        onClick={() => { handleAddOrEditCredential("Add") }}
                        className="w-full flex flex-row gap-2 justify-center font-medium px-4 py-2 bg-blue-500 hover:bg-blue-700 text-white rounded-3xl"
                    >
                        <FaPlus size={24} />
                        Add Credential
                    </button>

                    <video
                        controls={false}
                        autoPlay
                        muted
                        loop
                        className="rounded-2xl mt-4 w-full"
                    >
                        <source src={passwordmgrVideo} type="video/mp4" />
                    </video>
                </div>

                {/* Credentials Table */}
                <div className="flex-col justify-between lg:w-2/3 w-full p-4 bg-white border-2 border-gray-300 m-4 rounded-2xl">
                    <div className="flex flex-row justify-between">
                        <h1>Your Credentials</h1>
                        <h1>Total Items: {0} items</h1>
                    </div>

                    <div className="overflow-x-auto rounded-2xl border border-gray-200 mt-4 flex-grow">
                        <table className="min-w-full table-auto border-collapse border-spacing-0 w-full">
                            <thead>
                                <tr className="bg-gray-100 border-b border-gray-200">
                                    <th className="px-4 py-2 text-left">App</th>
                                    <th className="px-4 py-2 text-left">Username/Email</th>
                                    <th className="px-4 py-2 text-left">Password</th>
                                    <th className="px-4 py-2 text-left">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {Credentials.map((credential, index) => (
                                    <tr key={index} className="border-b border-gray-200 last:border-0">
                                        <td className="px-4 py-2">{credential.app}</td>
                                        <td className="px-4 py-2">{credential.username}</td>
                                        <td className="px-4 py-2 flex flex-row items-center">
                                            <span
                                                className="font-mono"
                                                style={{ minWidth: 120, display: "inline-block" }}
                                            >
                                                {passwordVisible === index
                                                    ? credential.password
                                                    : "•••••••••••"}
                                            </span>
                                            {passwordVisible === index ? (
                                                <FiEyeOff
                                                    size={18}
                                                    onClick={() => setPasswordVisible(null)}
                                                    className="cursor-pointer"
                                                />
                                            ) : (
                                                <FiEye
                                                    size={18}
                                                    onClick={() => setPasswordVisible(index)}
                                                    className="cursor-pointer"
                                                />
                                            )}
                                        </td>
                                        <td className="px-4 py-2">
                                            <button onClick={() => { handleAddOrEditCredential("Edit") }} className="px-4 py-1 mb-1 xl:mb-0 bg-blue-500 hover:bg-blue-700 text-white rounded-md mr-2">
                                                Edit
                                            </button>
                                            <button onClick={() => { handleDeleteCredential(index) }} className="px-4 py-1 bg-red-500 hover:bg-red-700 text-white rounded-md">
                                                Delete
                                            </button>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>
            </div>
            <AlertModal
                visible={alertModal.visible}
                title={alertModal.title || "Alert"}
                message={alertModal.message}
                buttons={alertModal.buttons}
            />
        </div>
    )
}

export default PasswordMgr