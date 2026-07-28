import { useEffect } from 'react';
import QuoteContainer from "./components/QuoteContainer"
import TaskList from "./components/TaskList"
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
        <div className="mx-auto p-4 flex flex-col gap-6 mb-20 max-w-7xl">
            <QuoteContainer />
            <TaskList />
        </div>
    );
};

export default Dashboard;