import React, { useMemo, useState } from "react";
import { eachDayOfInterval, endOfMonth, format, isSameDay, parseISO, startOfMonth, startOfWeek, endOfWeek, subMonths, addMonths } from "date-fns";
import BirthdayList from "./components/BirthdayList";

type DayCell = {
    date: Date;
    inMonth: boolean;
};

const toISODay = (d: Date) => format(d, "yyyy-MM-dd");
const monthKeyFor = (d: Date) => format(d, "yyyy-MM");

const buildMonthGrid = (visibleMonth: Date): DayCell[] => {
    const monthStart = startOfMonth(visibleMonth);
    const monthEnd = endOfMonth(visibleMonth);
    const gridStart = startOfWeek(monthStart, { weekStartsOn: 0 });
    const gridEnd = endOfWeek(monthEnd, { weekStartsOn: 0 });
    const days = eachDayOfInterval({ start: gridStart, end: gridEnd });
    return days.map((d) => ({ date: d, inMonth: d >= monthStart && d <= monthEnd }));
};

const Calendar: React.FC = () => {
    const [visibleMonth, setVisibleMonth] = useState<Date>(new Date());
    const grid = useMemo(() => buildMonthGrid(visibleMonth), [visibleMonth]);

    // Points keyed by ISO date -> array of strings
    const [dayPoints, setDayPoints] = useState<Record<string, string[]>>({});
    // Points keyed by month key (yyyy-MM) -> array of strings
    const [monthPoints, setMonthPoints] = useState<Record<string, string[]>>({});

    // UI state
    const [activeDateIso, setActiveDateIso] = useState<string | null>(null);
    const [newPointText, setNewPointText] = useState("");
    const [newMonthPointText, setNewMonthPointText] = useState("");

    const handlePrev = () => setVisibleMonth((m) => subMonths(m, 1));
    const handleNext = () => setVisibleMonth((m) => addMonths(m, 1));

    const openDatePanel = (d: Date) => {
        const iso = toISODay(d);
        setActiveDateIso(iso);
        setNewPointText("");
    };

    const addPointToDate = () => {
        if (!activeDateIso || newPointText.trim() === "") return;
        setDayPoints((prev) => {
            const arr = prev[activeDateIso] ?? [];
            return { ...prev, [activeDateIso]: [...arr, newPointText.trim()] };
        });
        setNewPointText("");
    };

    const removePointFromDate = (dateIso: string, idx: number) => {
        setDayPoints((prev) => {
            const arr = (prev[dateIso] ?? []).filter((_, i) => i !== idx);
            const copy = { ...prev };
            if (arr.length === 0) delete copy[dateIso];
            else copy[dateIso] = arr;
            return copy;
        });
    };

    const addPointToMonth = () => {
        const key = monthKeyFor(visibleMonth);
        if (newMonthPointText.trim() === "") return;
        setMonthPoints((prev) => ({ ...prev, [key]: [...(prev[key] ?? []), newMonthPointText.trim()] }));
        setNewMonthPointText("");
    };

    const removePointFromMonth = (idx: number) => {
        const key = monthKeyFor(visibleMonth);
        setMonthPoints((prev) => {
            const arr = (prev[key] ?? []).filter((_, i) => i !== idx);
            const copy = { ...prev };
            if (arr.length === 0) delete copy[key];
            else copy[key] = arr;
            return copy;
        });
    };

    // Helper to count points for a date
    const countForDate = (iso: string) => (dayPoints[iso] ? dayPoints[iso].length : 0);
    // Helper to get month points for visible month
    const visibleMonthPoints = monthPoints[monthKeyFor(visibleMonth)] ?? [];

    return (
        <div className="max-w-4xl h-full mx-auto p-4">
            <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-2">
                    <button onClick={handlePrev} className="px-3 py-1 rounded-md hover:bg-gray-100">◀</button>
                    <div className="text-lg font-semibold">{format(visibleMonth, "MMMM yyyy")}</div>
                    <button onClick={handleNext} className="px-3 py-1 rounded-md hover:bg-gray-100">▶</button>
                </div>

                <div className="text-sm text-gray-600">Click a day to add points. Month points appear on the right below the calendar.</div>
            </div>

            <div className="grid grid-cols-7 gap-1 text-sm">
                {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(d => (
                    <div key={d} className="text-center font-medium py-1">{d}</div>
                ))}

                {grid.map((cell) => {
                    const iso = toISODay(cell.date);
                    const isToday = isSameDay(cell.date, new Date());
                    const pointsCount = countForDate(iso);

                    return (
                        <button
                            key={iso}
                            onClick={() => openDatePanel(cell.date)}
                            className={`h-20 p-1 rounded-md border text-left focus:outline-none focus:ring-2 focus:ring-sky-300 transition relative ${cell.inMonth ? '' : 'opacity-50'}`}
                            aria-label={`Day ${format(cell.date, 'do MMM yyyy')}${cell.inMonth ? '' : ' (not in month)'} - ${pointsCount} points`}
                        >
                            <div className="flex items-start justify-between">
                                <div className={`text-xs pl-2 ${isToday ? 'font-bold underline' : ''}`}>{format(cell.date, 'd')}</div>
                                {pointsCount > 0 && (
                                    <div className="text-xs bg-sky-600 text-white rounded-full w-5 h-5 flex items-center justify-center text-[10px]">{pointsCount}</div>
                                )}
                            </div>

                            {/* subtle marker when there are points */}
                            {pointsCount > 0 && (
                                <div className="absolute left-0 right-0 bottom-0 h-1 bg-sky-200 rounded-b-md pointer-events-none"></div>
                            )}
                        </button>
                    );
                })}
            </div>

            {/* Panels below the calendar: left = per-date points, right = month points */}
            <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Left: per-date points for visible month */}
                <div>
                    <div className="mb-2 font-semibold">Per‑date points (visible month)</div>
                    <div className="space-y-3 bg-white border rounded-md p-3 max-h-80 overflow-y-auto">

                        {/** Show grouped points for each date in the visible month */}
                        {(() => {
                            // Collect dates in visible month with points
                            const start = new Date(visibleMonth.getFullYear(), visibleMonth.getMonth(), 1);
                            const end = endOfMonth(visibleMonth);
                            const days = eachDayOfInterval({ start, end });
                            const items = days
                                .map((d) => ({ iso: toISODay(d), date: d }))
                                .filter((it) => (dayPoints[it.iso] ?? []).length > 0);

                            if (items.length === 0) return <div className="text-sm text-gray-500">No per-date points for this month. Click a date above to add one.</div>;

                            return items.map((it) => (
                                <div key={it.iso} className="border rounded p-2">
                                    <div className="flex items-start gap-2">
                                        <div className="text-xs font-medium w-24">{format(it.date, 'do MMM yyyy')}</div>
                                        <div className="flex-1">
                                            {(dayPoints[it.iso] ?? []).map((p, idx) => (
                                                <div key={idx} className="flex items-center gap-2 py-1">
                                                    <div className="text-sm">{p}</div>
                                                    <button onClick={() => removePointFromDate(it.iso, idx)} className="ml-auto text-xs px-2 py-0.5 border rounded">RemoveC</button>
                                                </div>
                                            ))}
                                        </div>
                                        <div>
                                            <button onClick={() => setActiveDateIso(it.iso)} className="text-xs px-2 py-1 border rounded">Edit</button>
                                        </div>
                                    </div>
                                </div>
                            ));
                        })()}
                    </div>

                    {/* Inline editor panel for currently active date */}
                    {activeDateIso && (
                        <div className="mt-4 bg-white border rounded-md p-3">
                            <div className="flex items-center justify-between">
                                <div className="font-medium">Edit points for {format(parseISO(activeDateIso), 'do MMM yyyy')}</div>
                                <button onClick={() => setActiveDateIso(null)} className="text-sm px-2 py-1 border rounded">Close</button>
                            </div>

                            <div className="mt-3 grid grid-cols-1 gap-2">
                                <div className="flex gap-2">
                                    <input
                                        value={newPointText}
                                        onChange={(e) => setNewPointText(e.target.value)}
                                        placeholder="Add point (press Add)"
                                        className="flex-1 px-2 py-1 border rounded"
                                    />
                                    <button onClick={addPointToDate} className="px-3 py-1 bg-sky-600 text-white rounded-md">Add</button>
                                </div>

                                <div className="space-y-1">
                                    {(dayPoints[activeDateIso] ?? []).length === 0 && <div className="text-sm text-gray-500">No points yet for this date.</div>}
                                    {(dayPoints[activeDateIso] ?? []).map((p, idx) => (
                                        <div key={idx} className="flex items-center gap-2">
                                            <div className="text-sm">{p}</div>
                                            <button onClick={() => removePointFromDate(activeDateIso, idx)} className="ml-auto text-xs px-2 py-0.5 border rounded">Remove</button>
                                        </div>
                                    ))}
                                </div>
                            </div>
                        </div>
                    )}
                </div>

                {/* Right: month-level points for the visible month */}
                <div>
                    <div className="mb-2 font-semibold">Month‑level points ({format(visibleMonth, 'MMMM yyyy')})</div>
                    <div className="bg-white border rounded-md p-3 max-h-80 overflow-y-auto">

                        <div className="flex gap-2 mb-3">
                            <input
                                value={newMonthPointText}
                                onChange={(e) => setNewMonthPointText(e.target.value)}
                                placeholder="Add month-level point"
                                className="flex-1 px-2 py-1 border rounded"
                            />
                            <button onClick={addPointToMonth} className="px-3 py-1 bg-sky-600 text-white rounded-md">Add</button>
                        </div>

                        {visibleMonthPoints.length === 0 && <div className="text-sm text-gray-500">No month-level points yet.</div>}

                        <div className="space-y-2">
                            {visibleMonthPoints.map((p, idx) => (
                                <div key={idx} className="flex items-center gap-2">
                                    <div className="text-sm">{p}</div>
                                    <button onClick={() => removePointFromMonth(idx)} className="ml-auto text-xs px-2 py-0.5 border rounded">Remove</button>
                                </div>
                            ))}
                        </div>

                        {/* Small visual: show count badge under calendar for month-level points */}
                        <div className="mt-4 text-xs text-gray-500">Month points count: <span className="font-medium">{visibleMonthPoints.length}</span></div>
                    </div>
                </div>
            </div>

            <div className="mt-4 text-xs text-gray-500">Notes: click any date to add multiple points. Month-level points apply to the whole visible month and are shown on the right.</div>

            <BirthdayList />

            <div className="pb-20"></div>
        </div>
    );
};

export default Calendar;
