const routine = [
    { id: 1, title: 'FreshUp', range: '07:00 - 07:15' },
    { id: 2, title: 'Morning Walk/Run', range: '07:15 - 08:15' },
    { id: 3, title: 'Breakfast/SocialMedia', range: '08:15 - 09:00' },
    { id: 4, title: 'ReadBook', range: '09:00 - 09:25' },
    { id: 5, title: 'Office', range: '09:25 - 18:45' },
    { id: 6, title: 'EaseUp', range: '18:45 - 19:30' },
    { id: 7, title: 'Dinner', range: '19:30 - 21:00' },
    { id: 8, title: 'Walk', range: '21:00 - 21:30' },
    { id: 9, title: 'Study', range: '21:30 - 23:00' },
    { id: 10, title: 'Sleep', range: '23:00 - 07:00' },
]
const Routine = () => {
    const formatRangeToMins = (range: string): number => {
        const [start, end] = range.split('-').map(str => str.trim());
        const toMinutes = (time: string): number => {
            const [hour, minute] = time.split(':').map(Number);
            return hour * 60 + minute;
        };

        return toMinutes(end) - toMinutes(start);
    };
    return (
        <div className="text-gray-800 p-4 rounded-xl shadow overflow-y-scroll">
            <div className="flex justify-between items-center mb-4 px-3">
                <h2 className="text-2xl font-semibold">Daily Routine</h2>
                {/* <button className="bg-blue-500 text-white px-3 py-1 rounded hover:bg-blue-600 transition">
                    + Edit Routine
                </button> */}
            </div>

            <div className="flex flex-col gap-4 p-2 rounded-2xl h-180 overflow-y-auto scrollbar-hide">
                {routine.map((data) => (
                    <div
                        key={data.id}
                        className="flex flex-col p-4 shadow rounded-2xl text-zinc-700 bg-rose-50
                      transition-transform duration-300
                      hover:scale-102 origin-top
                      hover:shadow-lg"
                    >
                        <h3 className="text-lg font-semibold">{data.title}</h3>
                        <p className="text-xs text-gray-500 mt-1">
                            Estimated: {data.range}
                        </p>
                        <h2>{formatRangeToMins(data.range)} mins</h2>
                    </div>
                ))}
            </div>
        </div>
    );
};


export default Routine