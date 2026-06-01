import { useEffect } from 'react';
import DndProviderWrapper from './components/DndProviderWrapper';
import QuoteContainer from "./components/QuoteContainer"
import TaskList from "./components/TaskList"
import { useDispatch } from 'react-redux';
import type { AppDispatch } from '../../redux/store';
import { setUser } from '../../redux/userSlice';

const Dashboard = () => {
    const dispatch = useDispatch<AppDispatch>();
    useEffect(() => {
        const user = localStorage.getItem("user");
        if (user) {
            dispatch(setUser(JSON.parse(user)));
        }
    }, [])
    return <>
        <DndProviderWrapper>
            <div className="mx-auto p-4 flex flex-col gap-6 mb-20">
                <QuoteContainer />

                {/* <div className=""> */}
                <TaskList />
                {/* </div> */}
            </div>
        </DndProviderWrapper>
    </>
}

export default Dashboard