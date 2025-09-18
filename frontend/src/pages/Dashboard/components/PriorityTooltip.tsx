import { useState } from "react";
import { FaChevronDown, FaChevronUp } from "react-icons/fa";

const PriorityTooltip = () => {
    const [showTooltip, setShowTooltip] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const [selected, setSelected] = useState("All");

    const options = ["All", "P3", "P2", "P1", "P0"];

    const handleSelect = (option: string) => {
        setSelected(option);
        setIsOpen(false);
    };

    const toggleIsOpen = () => {
        setIsOpen(!isOpen);
    };

    // const handleMouseLeave = () => {
    //     // Wait 200ms before closing
    //     setTimeout(() => {
    //         setIsOpen(false);
    //     }, 200);
    // };

    return (
        <div className="relative inline-block bg-blue-500 rounded-l">
            <button
                className="bg-blue-500 hover:bg-blue-800 text-xl text-white px-3 rounded-xl transition"
                onMouseEnter={() => setShowTooltip(true)}
                onMouseLeave={() => setShowTooltip(false)}
            >
                Priority
            </button>

            <div className="inline-block border border-green-800 z-100 h-full absolute"></div>

            <div className="relative inline-block text-left">
                <h1
                    onClick={() => toggleIsOpen()}
                    className="bg-blue-500 hover:bg-blue-800 text-xl text-white px-3 rounded-xl transition flex items-center justify-between"
                >
                    {selected}
                    {isOpen ? <FaChevronUp className="ml-2 text-sm" /> : <FaChevronDown className="ml-2 text-sm" />}

                </h1>

                {isOpen && (
                    <div className="absolute z-10 mt-2 w-full bg-white rounded-xl shadow-lg border border-gray-200">
                        {options.map((option) => (
                            <button
                                key={option}
                                onClick={() => handleSelect(option)}
                                className="w-full p-1 text-center text-black hover:bg-purple-200 rounded-xl transition"
                            >
                                {option}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            {showTooltip && (
                <div className="absolute top-full mb-2 left-1/2 -translate-x-1/2 w-66 rounded-2xl text-justify bg-slate-50 text-zinc-800 text-l leading-7 p-3 shadow-lg z-50 whitespace-normal">
                    <p><strong>P3</strong> - Urgent and Important</p>
                    <p><strong>P2</strong> - Important but Not Urgent</p>
                    <p><strong>P1</strong> - Urgent but Not Important</p>
                    <p><strong>P0</strong> - Not Urgent & Not Important</p>
                </div>
            )}
        </div>
    );
};

export default PriorityTooltip;
