import React, { useState, useMemo, useEffect } from "react";
import { ChevronDown, ChevronRight, Plus } from "lucide-react";

// Hindu months in calendar order for sorting
const HINDU_MONTHS = [
    "Baisakh", "Jestha", "Ashadh", "Shrawan", "Bhadra",
    "Ashwin", "Kartik", "Mangsir", "Poush", "Magh",
    "Falgun", "Chaitra"
];

type Birthday = {
    title: string;
    date: string; // e.g. "Mangsir 17"
};

const initialData: Birthday[] = [
    { title: "Ram", date: "Mangsir 17" },
    { title: "Sita", date: "Baisakh 03" },
    { title: "Hari", date: "Falgun 21" },
    { title: "Ram", date: "Mangsir 17" },
    { title: "Sita", date: "Baisakh 03" },
    { title: "Hari", date: "Falgun 21" },
    { title: "Ram", date: "Mangsir 17" },
    { title: "Sita", date: "Baisakh 03" },
    { title: "Hari", date: "Falgun 21" },
];

const BirthdayList: React.FC = () => {
    const [isOpen, setIsOpen] = useState(true);
    const [birthdays, setBirthdays] = useState<Birthday[]>(initialData);
    const [newTitle, setNewTitle] = useState("");
    const [newDate, setNewDate] = useState("");
    const [isAdding, setIsAdding] = useState(false);

    useEffect(() => {
        setIsOpen(false);
        setIsAdding(false);
    }, [])

    const sortedBirthdays = useMemo(() => {
        return [...birthdays].sort((a, b) => {
            const [monthA, dayA] = a.date.split(" ");
            const [monthB, dayB] = b.date.split(" ");

            const indexA = HINDU_MONTHS.indexOf(monthA);
            const indexB = HINDU_MONTHS.indexOf(monthB);

            if (indexA !== indexB) {
                return indexA - indexB;
            }
            return Number(dayA) - Number(dayB);
        });
    }, [birthdays]);

    const addBirthday = () => {
        if (!newTitle.trim() || !newDate.trim()) return;

        setBirthdays((prev) => [...prev, { title: newTitle.trim(), date: newDate.trim() }]);
        setNewTitle("");
        setNewDate("");
        setIsAdding(false);
    };

    return (
        <div className="border mt-4 max-w-4xl rounded-md p-4 w-full shadow-sm max-h-[200px] overflow-y-auto">

            <div className="flex items-center justify-between cursor-pointer">
                <h2 className="font-semibold text-lg">Birthday Dates</h2>
                <div className="flex items-center justify-center gap-4">
                    <button
                        className="flex items-center gap-2 text-sm px-3 py-1 border rounded-md hover:bg-gray-100"
                        onClick={() => { setIsAdding(prev => !prev), setIsOpen(true) }}
                    >
                        {isAdding ? <ChevronDown size={20} /> : <ChevronRight size={20} />} Add Birthday
                    </button>
                    <div onClick={() => { setIsOpen(!isOpen), setIsAdding(false) }} className="p-2 hover:bg-gray-100 rounded-md">
                        {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
                    </div>
                </div>
            </div>

            {isOpen && (
                <div className="flex flex-row justify-between gap-4 mt-3 ">
                    {/* Birthday List */}
                    <ul className="flex-1 space-y-2">
                        {sortedBirthdays.map((item, index) => (
                            <li key={index} className="text-l p-1 border border-zinc-800 rounded-md">
                                <span className="font-large">{item.title}</span> — {item.date}
                            </li>
                        ))}
                    </ul>

                    {/* Add Form */}
                    {isAdding && (
                        <div className="flex flex-col flex-1 gap-2 rounded-md bg-gray-50">
                            <input
                                value={newTitle}
                                onChange={(e) => setNewTitle(e.target.value)}
                                placeholder="Name e.g. Ganesh"
                                className="px-2 py-1 border rounded"
                            />
                            <input
                                value={newDate}
                                onChange={(e) => setNewDate(e.target.value)}
                                placeholder="Date e.g. Mangsir 17"
                                className="px-2 py-1 border rounded"
                            />
                            <div className="flex gap-2">
                                <button
                                    onClick={addBirthday}
                                    className="px-3 py-1 bg-sky-600 text-white rounded-md"
                                >
                                    Add
                                </button>
                                <button
                                    onClick={() => setIsAdding(false)}
                                    className="px-3 py-1 border rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </div>
                    )}
                </div>
            )}

        </div>
    );
};

export default BirthdayList;
