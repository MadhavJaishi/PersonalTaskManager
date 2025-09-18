import { useEffect, useRef, useState } from 'react';
import { FaPlay, FaPause } from 'react-icons/fa';

const formatTime = (seconds: number) => {
    const hrs = String(Math.floor(seconds / 3600)).padStart(2, '0');
    const mins = String(Math.floor((seconds % 3600) / 60)).padStart(2, '0');
    const secs = String(seconds % 60).padStart(2, '0');
    return `${hrs}:${mins}:${secs}`;
};

const TaskClock = () => {
    const [isRunning, setIsRunning] = useState(false);
    const [elapsedTime, setElapsedTime] = useState(0); // in seconds
    const intervalRef = useRef(0);

    const toggleClock = () => {
        if (isRunning) {
            clearInterval(intervalRef.current);
            setIsRunning(false);
            logTimeToAPI(elapsedTime);
        } else {
            intervalRef.current = setInterval(() => {
                setElapsedTime((prev) => prev + 1);
            }, 1000);
            setIsRunning(true);
        }
    };

    const logTimeToAPI = async (timeInSeconds: number) => {
        try {
            await fetch('/api/log-time', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ timeInSeconds }),
            });
            console.log('Logged:', timeInSeconds, 'seconds');
        } catch (err) {
            console.error('Error logging time:', err);
        }
    };

    useEffect(() => {
        return () => clearInterval(intervalRef.current); // Cleanup
    }, []);

    return (
        <div className="flex items-center gap-4 text-gray-800">
            <span>Clock {formatTime(elapsedTime)}</span>
            <button onClick={toggleClock} className="text-blue-600 hover:text-blue-800">
                {isRunning ? <FaPause /> : <FaPlay />}
            </button>
        </div>
    );
};

export default TaskClock;
