import type { ReactNode } from 'react';
import ReactModal from 'react-modal';

interface ModalProps {
    isOpen: boolean;
    setIsOpen: (isOpen: boolean) => void;
    customStyles?: ReactModal.Styles;
    title: string;
    children: ReactNode;
}

const Modal = ({ isOpen, setIsOpen, customStyles, title, children }: ModalProps) => {
    function closeModal() {
        setIsOpen(false);
    }

    return (
        <ReactModal
            isOpen={isOpen}
            onRequestClose={closeModal} // triggers on ESC key or outside click
            shouldCloseOnOverlayClick={true} // optional (true by default)
            contentLabel="Example Modal"
            style={{ ...modalStyles, ...customStyles }}
        >
            <div>
                <button onClick={closeModal} className="float-right text-gray-500 hover:text-gray-700">
                    &times;
                </button>
                <h2 className="text-2xl font-bold mb-4">{title}</h2>
                {children}


            </div>
        </ReactModal>
    );
};

const modalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
    },
    content: {
        top: '50%',
        left: '50%',
        right: 'auto',
        bottom: 'auto',
        marginRight: '-50%',
        transform: 'translate(-50%, -50%)',
        height: '600px',
        width: '500px',
        padding: '20px',
        borderRadius: '10px',
        backgroundColor: '#fff',
        border: '1px solid #ccc',
        boxShadow: '0 2px 10px rgba(0,0,0,0.2)',
    },
};

export default Modal;
