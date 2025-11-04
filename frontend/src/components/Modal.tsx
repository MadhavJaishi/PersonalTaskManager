import type { ReactNode } from 'react';
import ReactModal from 'react-modal';
// import './modalCss.css';
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
        <ReactModal isOpen={isOpen}
            onRequestClose={closeModal}
            shouldCloseOnOverlayClick={true}
            contentLabel="Example Modal"
            style={{ ...modalStyles, ...customStyles }}
        >
            <div>
                {children}
            </div>
        </ReactModal>
    );
};

const modalStyles: ReactModal.Styles = {
    overlay: {
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        zIndex: 1000,
        transition: 'opacity 2s ease-in-out',
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
        transition: 'all 3s ease-in-out',
    },
};

export default Modal;
