import { useState, useRef, useEffect } from "react";
import { FaChevronDown, FaFilter } from "react-icons/fa";

interface PriorityOption {
    value: string;
    label: string;
    desc: string;
    color: string;
    pillColor: string;
}

interface PriorityTooltipProps {
    selected?: string;
    onChange?: (option: string) => void;
}

const PriorityTooltip = ({ selected: propSelected, onChange }: PriorityTooltipProps) => {
    const [isOpen, setIsOpen] = useState(false);
    const [localSelected, setLocalSelected] = useState("All");
    const dropdownRef = useRef<HTMLDivElement>(null);

    const isControlled = propSelected !== undefined && onChange !== undefined;
    const selected = isControlled ? propSelected : localSelected;

    const options: PriorityOption[] = [
        { 
            value: "All", 
            label: "All Priorities", 
            desc: "Show all tasks in your board", 
            color: "bg-slate-400",
            pillColor: "from-slate-500 to-slate-600"
        },
        { 
            value: "3", 
            label: "P3 - Urgent & Important", 
            desc: "Do it now! Critical immediate tasks", 
            color: "bg-rose-500",
            pillColor: "from-rose-500 to-red-600"
        },
        { 
            value: "2", 
            label: "P2 - Important but Not Urgent", 
            desc: "Decide when! Strategy and planning", 
            color: "bg-amber-500",
            pillColor: "from-amber-400 to-orange-500"
        },
        { 
            value: "1", 
            label: "P1 - Urgent but Not Important", 
            desc: "Delegate it! Minor disruptions", 
            color: "bg-blue-500",
            pillColor: "from-blue-500 to-indigo-600"
        },
        { 
            value: "0", 
            label: "P0 - Not Urgent & Not Important", 
            desc: "Drop it! Low value background tasks", 
            color: "bg-slate-400",
            pillColor: "from-slate-400 to-zinc-500"
        }
    ];

    // Find the currently selected option to display it on the button
    const currentOption = options.find(o => 
        selected === o.value || 
        selected.startsWith(`P${o.value}`) || 
        (selected === "All" && o.value === "All")
    ) || options[0];

    const handleSelect = (optionValue: string) => {
        // Map to original user strings to maintain absolute compatibility
        const originalStrings: Record<string, string> = {
            "All": "All",
            "3": "P3-Urgent and Important",
            "2": "P2-Important but Not Urgent",
            "1": "P1-Urgent but Not Important",
            "0": "P0-Not Urgent & Not Important"
        };
        const selectedValue = originalStrings[optionValue];

        if (isControlled) {
            onChange(selectedValue);
        } else {
            setLocalSelected(selectedValue);
        }
        setIsOpen(false);
    };

    // Close dropdown when clicking outside
    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsOpen(false);
            }
        };
        document.addEventListener("mousedown", handleClickOutside);
        return () => document.removeEventListener("mousedown", handleClickOutside);
    }, []);

    return (
        <div className="relative inline-block text-left animate-fade-in" ref={dropdownRef}>
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="flex items-center gap-2 px-3 py-2 bg-white hover:bg-slate-50 text-slate-700 font-semibold border border-slate-200 rounded-xl shadow-sm hover:shadow transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500/50 cursor-pointer"
            >
                <FaFilter className="text-slate-400 text-xs shrink-0" />
                <span className="text-slate-400 font-medium text-sm hidden sm:inline">Priority:</span>
                <span className={`px-2 py-0.5 rounded-lg text-xs font-bold text-white bg-gradient-to-r ${currentOption.pillColor}`}>
                    {currentOption.value === "All" ? "All" : `P${currentOption.value}`}
                </span>
                <FaChevronDown className={`text-slate-400 text-[10px] transition-transform duration-200 shrink-0 ${isOpen ? 'rotate-180' : ''}`} />
            </button>

            {isOpen && (
                <div className="absolute right-0 mt-2 w-80 rounded-2xl bg-white border border-slate-100 shadow-2xl z-50 overflow-hidden p-1.5 origin-top-right transition-all duration-200">
                    <div className="px-3 py-1.5 text-[11px] font-bold text-slate-400 uppercase tracking-wider border-b border-slate-50 mb-1">
                        Filter by Priority
                    </div>
                    <div className="space-y-1">
                        {options.map((option) => {
                            const isSelected = selected === option.value || 
                                              selected.startsWith(`P${option.value}`) || 
                                              (selected === "All" && option.value === "All");
                            return (
                                <button
                                    key={option.value}
                                    onClick={() => handleSelect(option.value)}
                                    className={`w-full flex items-start gap-3 p-2.5 rounded-xl text-left transition-all duration-150 ${
                                        isSelected
                                            ? 'bg-blue-50/80 text-blue-900 font-medium'
                                            : 'text-slate-700 hover:bg-slate-50 hover:translate-x-[2px]'
                                    }`}
                                >
                                    <span className={`w-2 h-2 rounded-full mt-1.5 shrink-0 ${option.color} ring-4 ${isSelected ? 'ring-blue-100' : 'ring-transparent'}`} />
                                    <div>
                                        <div className="font-semibold text-xs text-slate-800">{option.label}</div>
                                        <div className="text-[10px] text-slate-400 mt-0.5 leading-normal">{option.desc}</div>
                                    </div>
                                </button>
                            );
                        })}
                    </div>
                </div>
            )}
        </div>
    );
};

export default PriorityTooltip;
