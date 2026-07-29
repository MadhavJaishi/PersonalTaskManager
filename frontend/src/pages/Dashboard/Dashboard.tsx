import { useEffect } from 'react';
import SummaryDashboard from "./components/SummaryDashboard";
import QuoteContainer from "./components/QuoteContainer";
import TaskList from "./components/TaskList";
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { setUser } from '../../redux/userSlice';

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();

    useEffect(() => {
        const storedUser = localStorage.getItem("user");
        if (storedUser) {
            try {
                dispatch(setUser(JSON.parse(storedUser)));
            } catch (e) {
                console.error("Failed to parse stored user", e);
            }
        }
    }, [dispatch]);

    return (
        <div className="mx-auto flex flex-col gap-2 mb-20 max-w-6xl w-full">
            {/* Top Row: Summary Dashboard (Left) & Quote Container (Right) */}
            <div className="p-4 w-full">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 items-stretch">
                    <SummaryDashboard />
                    <QuoteContainer />
                </div>
            </div>

            {/* Task List */}
            <TaskList />
        </div>
    );
};

export default Dashboard;