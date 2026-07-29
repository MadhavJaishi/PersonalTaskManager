import { useEffect } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { fetchTaskList } from '../Dashboard/redux/tasklist';
import type { RootState, AppDispatch } from '../../redux/store';
import { FaCheckCircle, FaClock, FaTasks, FaChartLine, FaExclamationTriangle } from 'react-icons/fa';

const Analytics = () => {
    const dispatch = useDispatch<AppDispatch>();
    const tasks = useSelector((state: RootState) => state.tasklistSliceReducer.tasks) || [];
    const loading = useSelector((state: RootState) => state.tasklistSliceReducer.loading);
    const userId = useSelector((state: RootState) => state.userSliceReducer.id);

    useEffect(() => {
        dispatch(fetchTaskList({ userId: userId || undefined }));
    }, [dispatch, userId]);

    // Metrics calculations
    const totalTasks = tasks.length;
    const completedTasks = tasks.filter((t) => Boolean(t.is_completed)).length;
    const pendingTasks = totalTasks - completedTasks;
    const completionRate = totalTasks > 0 ? Math.round((completedTasks / totalTasks) * 100) : 0;

    const totalTargetSecs = tasks.reduce((sum, t) => sum + (t.targetDuration || 0), 0);
    const totalSpentSecs = tasks.reduce((sum, t) => sum + (t.timeSpent || 0), 0);

    const totalTargetMins = Math.round(totalTargetSecs / 60);
    const totalSpentMins = Math.round(totalSpentSecs / 60);

    // Priority counts
    const priorityCounts = {
        P3: tasks.filter((t) => String(t.priority) === '3').length,
        P2: tasks.filter((t) => String(t.priority) === '2').length,
        P1: tasks.filter((t) => String(t.priority) === '1').length,
        P0: tasks.filter((t) => String(t.priority) === '0' || t.priority === null).length,
    };

    return (
        <div className="min-h-screen bg-[#F9FAFB] p-6 max-w-7xl mx-auto">
            {/* Header */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold text-slate-800">Productivity Analytics</h1>
                <p className="text-slate-500 text-sm mt-1">
                    Real-time insights and stats based on your task manager performance.
                </p>
            </div>

            {loading ? (
                <div className="flex justify-center items-center py-20">
                    <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-blue-600"></div>
                </div>
            ) : (
                <div className="space-y-8">
                    {/* KPI Stat Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-blue-50 text-blue-600 rounded-xl text-2xl">
                                <FaTasks />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{totalTasks}</div>
                                <div className="text-xs font-semibold text-slate-400">Total Tasks</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-emerald-50 text-emerald-600 rounded-xl text-2xl">
                                <FaCheckCircle />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{completedTasks}</div>
                                <div className="text-xs font-semibold text-slate-400">Completed Tasks</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-amber-50 text-amber-600 rounded-xl text-2xl">
                                <FaClock />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{totalSpentMins}m</div>
                                <div className="text-xs font-semibold text-slate-400">Total Time Spent</div>
                            </div>
                        </div>

                        <div className="bg-white border border-slate-200 rounded-2xl p-5 shadow-sm flex items-center gap-4">
                            <div className="p-3 bg-purple-50 text-purple-600 rounded-xl text-2xl">
                                <FaChartLine />
                            </div>
                            <div>
                                <div className="text-2xl font-bold text-slate-800">{completionRate}%</div>
                                <div className="text-xs font-semibold text-slate-400">Completion Rate</div>
                            </div>
                        </div>
                    </div>

                    {/* Task Progress & Priority Breakdown */}
                    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                        {/* Overall Completion Progress */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Task Completion Rate</h2>
                            <div className="space-y-4">
                                <div className="flex justify-between items-center text-sm font-semibold text-slate-600">
                                    <span>Progress ({completedTasks} / {totalTasks})</span>
                                    <span className="text-blue-600 font-bold">{completionRate}%</span>
                                </div>
                                <div className="w-full bg-slate-100 rounded-full h-4 overflow-hidden">
                                    <div
                                        className="bg-gradient-to-r from-blue-500 to-indigo-600 h-4 rounded-full transition-all duration-500"
                                        style={{ width: `${completionRate}%` }}
                                    ></div>
                                </div>

                                <div className="grid grid-cols-2 gap-4 pt-4 border-t border-slate-100 text-center">
                                    <div className="bg-slate-50 p-3 rounded-xl">
                                        <span className="text-xs text-slate-400 block font-medium">Pending Tasks</span>
                                        <span className="text-lg font-bold text-slate-700">{pendingTasks}</span>
                                    </div>
                                    <div className="bg-emerald-50 p-3 rounded-xl">
                                        <span className="text-xs text-emerald-600 block font-medium">Done Tasks</span>
                                        <span className="text-lg font-bold text-emerald-700">{completedTasks}</span>
                                    </div>
                                </div>
                            </div>
                        </div>

                        {/* Priority Breakdown */}
                        <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm">
                            <h2 className="text-lg font-bold text-slate-800 mb-4">Tasks by Priority Level</h2>
                            <div className="space-y-3">
                                <div className="flex items-center justify-between p-3 bg-rose-50 border border-rose-100 rounded-xl">
                                    <span className="font-semibold text-xs text-rose-800">P3 - High / Critical</span>
                                    <span className="font-bold text-rose-700">{priorityCounts.P3} tasks</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-amber-50 border border-amber-100 rounded-xl">
                                    <span className="font-semibold text-xs text-amber-800">P2 - Medium / Important</span>
                                    <span className="font-bold text-amber-700">{priorityCounts.P2} tasks</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-blue-50 border border-blue-100 rounded-xl">
                                    <span className="font-semibold text-xs text-blue-800">P1 - Low / Standard</span>
                                    <span className="font-bold text-blue-700">{priorityCounts.P1} tasks</span>
                                </div>
                                <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-100 rounded-xl">
                                    <span className="font-semibold text-xs text-slate-700">P0 - Background / Minimal</span>
                                    <span className="font-bold text-slate-600">{priorityCounts.P0} tasks</span>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Time Analysis Card */}
                    <div className="bg-white border border-slate-200 rounded-2xl p-6 shadow-sm mb-20">
                        <h2 className="text-lg font-bold text-slate-800 mb-4">Time Efficiency Breakdown</h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 items-center">
                            <div>
                                <p className="text-slate-600 text-sm mb-4 leading-relaxed">
                                    You have estimated a total target duration of <strong className="text-slate-800">{totalTargetMins} minutes</strong> across all scheduled tasks.
                                    So far, you have logged <strong className="text-slate-800">{totalSpentMins} minutes</strong> of actual effort.
                                </p>
                                <div className="flex items-center gap-3">
                                    <FaExclamationTriangle className="text-amber-500 text-lg shrink-0" />
                                    <span className="text-xs text-slate-500 font-medium">
                                        Tip: Consistently updating your time spent input helps maintain accurate productivity insights!
                                    </span>
                                </div>
                            </div>

                            <div className="bg-slate-50 p-4 rounded-2xl border border-slate-100 space-y-3">
                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                        <span>Target Duration:</span>
                                        <span>{totalTargetMins} mins</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div className="bg-blue-500 h-2 rounded-full w-full"></div>
                                    </div>
                                </div>

                                <div>
                                    <div className="flex justify-between text-xs font-semibold text-slate-500 mb-1">
                                        <span>Logged Effort:</span>
                                        <span>{totalSpentMins} mins</span>
                                    </div>
                                    <div className="w-full bg-slate-200 rounded-full h-2">
                                        <div
                                            className="bg-amber-500 h-2 rounded-full transition-all duration-300"
                                            style={{
                                                width: `${totalTargetMins > 0 ? Math.min(100, Math.round((totalSpentMins / totalTargetMins) * 100)) : 0}%`,
                                            }}
                                        ></div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default Analytics;