import DndProviderWrapper from './components/DndProviderWrapper';
import QuoteContainer from "./components/QuoteContainer"
import SearchBar from "./components/SearchBar"
import TaskList from "./components/TaskList"
import Presets from "./components/Presets"
import Routine from "./components/Routine"

const Dashboard = () => {
    return <>
        <DndProviderWrapper>
            <div className="mx-auto p-4 flex flex-col gap-6 mb-20">
                <QuoteContainer />
                <SearchBar />
                <div className="grid grid-cols-1 lg:grid-cols-10 gap-6">
                    <div className="col-span-7">
                        <TaskList />
                    </div>
                    <div className="col-span-3">
                        <Presets />
                    </div>
                </div>
            </div>
        </DndProviderWrapper>
    </>
}

export default Dashboard