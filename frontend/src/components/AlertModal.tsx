import React from "react";
import ReactModal from "react-modal";

interface ButtonProps {
    text: string;
    onClick: () => void;
}

export interface AlertModalProps {
    visible: boolean;
    title?: string;
    message?: string;
    buttons: ButtonProps[];
}

const AlertModal: React.FC<AlertModalProps> = ({
    visible,
    title = "Alert",
    message = "",
    buttons,
}) => {
    return (
        <ReactModal
            isOpen={visible}
            onRequestClose={() => { }}
            shouldCloseOnOverlayClick={true}
            contentLabel="Alert Modal"
            style={modalStyles}
            ariaHideApp={false} // prevents accessibility warning
        >
            <div className="flex flex-col items-center text-center">
                <h2 className="text-xl font-semibold text-gray-800 mb-2">{title}</h2>

                {message && <p className="text-gray-600 mb-6">{message}</p>}

                <div className="flex gap-3 mt-4">
                    {buttons.map((btn, index) => (
                        <button
                            key={index}
                            onClick={() => {
                                btn.onClick();
                            }}
                            className={`flex-1 px-6 py-2 rounded-md ${btn.text === "Delete" ? 'bg-red-600 hover:bg-red-700' : 'bg-blue-600 hover:bg-blue-700'} text-white font-medium transition`}
                        >
                            {btn.text}
                        </button>
                    ))}
                </div>
            </div>
        </ReactModal>
    );
};

const modalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: "rgba(0, 0, 0, 0.6)",
        zIndex: 1000,
        transition: "opacity 0.3s ease-in-out",
    },
    content: {
        top: "50%",
        left: "50%",
        right: "auto",
        bottom: "auto",
        marginRight: "-50%",
        transform: "translate(-50%, -50%)",
        width: "400px",
        maxWidth: "90%",
        padding: "20px",
        borderRadius: "12px",
        backgroundColor: "#fff",
        border: "none",
        boxShadow: "0 2px 10px rgba(0,0,0,0.3)",
    },
};

export default AlertModal;
