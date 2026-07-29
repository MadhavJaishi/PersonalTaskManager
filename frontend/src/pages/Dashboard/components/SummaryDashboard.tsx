import React, { useMemo, useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { motion } from 'framer-motion';
import {
  CheckCircle2,
  Sun,
  SunMedium,
  Moon,
  TrendingUp,
  Target,
  Clock,
  Hourglass,
  Pencil,
  Check
} from 'lucide-react';
import type { RootState, AppDispatch } from '../../../redux/store';
import { fetchTaskList } from '../redux/tasklist';

const SummaryDashboard: React.FC = () => {
  const dispatch = useDispatch<AppDispatch>();
  const user = useSelector((state: RootState) => state.userSliceReducer);
  const tasks = useSelector((state: RootState) => state.tasklistSliceReducer.tasks);
  const userId = user?.id;
  console.log("iusygdhvbj", user)

  // Target hours state with localStorage persistence (Default: 3 hours)
  const [targetHours, setTargetHours] = useState<number>(() => {
    const saved = localStorage.getItem('daily_target_hours');
    if (saved) {
      const parsed = parseFloat(saved);
      if (!isNaN(parsed) && parsed > 0) return parsed;
    }
    return 3;
  });

  const [isEditingTarget, setIsEditingTarget] = useState(false);
  const [tempTargetInput, setTempTargetInput] = useState(String(targetHours));

  // Ensure task list is fetched if not already in store
  useEffect(() => {
    if (!tasks || tasks.length === 0) {
      dispatch(fetchTaskList({ userId: userId || undefined }));
    }
  }, [dispatch, userId]);

  // Handle saving target hours to localStorage
  const handleSaveTarget = () => {
    const parsed = parseFloat(tempTargetInput);
    if (!isNaN(parsed) && parsed > 0) {
      const formatted = Math.round(parsed * 100) / 100;
      setTargetHours(formatted);
      localStorage.setItem('daily_target_hours', String(formatted));
    }
    setIsEditingTarget(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleSaveTarget();
    } else if (e.key === 'Escape') {
      setIsEditingTarget(false);
      setTempTargetInput(String(targetHours));
    }
  };

  // Time-aware greeting
  const greetingInfo = useMemo(() => {
    const hour = new Date().getHours();
    if (hour >= 5 && hour < 12) {
      return { text: 'Good Morning', icon: Sun, color: 'text-amber-500', bg: 'bg-amber-50' };
    } else if (hour >= 12 && hour < 17) {
      return { text: 'Good Afternoon', icon: SunMedium, color: 'text-orange-500', bg: 'bg-orange-50' };
    } else {
      return { text: 'Good Evening', icon: Moon, color: 'text-indigo-500', bg: 'bg-indigo-50' };
    }
  }, []);

  const GreetingIcon = greetingInfo.icon;
  const username = user?.username || (user?.email ? user.email.split('@')[0] : 'User');

  // Helper to format seconds into readable hours and minutes
  const formatSecToHoursMins = (totalSec: number) => {
    if (!totalSec || totalSec <= 0) return '0h 0m';
    const totalMins = Math.round(totalSec / 60);
    const hrs = Math.floor(totalMins / 60);
    const mins = totalMins % 60;
    if (hrs > 0 && mins > 0) return `${hrs}h ${mins}m`;
    if (hrs > 0) return `${hrs}h`;
    return `${mins}m`;
  };

  // Real data calculations strictly from Redux task list & persistent target hours
  const stats = useMemo(() => {
    const totalTasks = (tasks || []).length;
    const completedTasks = (tasks || []).filter(t => Boolean(t.is_completed)).length;

    // Target duration in seconds from persistent state (or task list if preferred)
    const targetSec = targetHours * 3600;
    const totalLoggedSec = (tasks || []).reduce((acc, t) => acc + (Number(t.timeSpent) || 0), 0);
    const remainingSec = Math.max(0, targetSec - totalLoggedSec);

    // Calculate progress percentage based on target hours
    let progressPercent = 0;
    if (targetSec > 0) {
      progressPercent = Math.min(100, Math.round((totalLoggedSec / targetSec) * 100));
    } else if (totalTasks > 0) {
      progressPercent = Math.round((completedTasks / totalTasks) * 100);
    }

    const formatHoursDecimal = (hrs: number) => {
      const h = Math.floor(hrs);
      const m = Math.round((hrs - h) * 60);
      if (m > 0) return `${h}h ${m}m`;
      return `${h}h`;
    };

    return {
      completedTasks,
      totalTasks,
      targetStr: formatHoursDecimal(targetHours),
      loggedStr: formatSecToHoursMins(totalLoggedSec),
      remainingStr: formatSecToHoursMins(remainingSec),
      progressPercent,
    };
  }, [tasks, targetHours]);

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className='w-full h-full flex flex-col'
    >
      <div className='bg-white border border-slate-100 rounded-2xl p-5 shadow-sm flex flex-col justify-between h-full relative overflow-hidden'>
        <div className='space-y-3.5'>
          {/* Header Row: Greeting & Completed Count */}
          <div className='flex items-center justify-between gap-2'>
            <div className='flex items-center gap-2'>
              <span
                className={`p-1.5 rounded-lg ${greetingInfo.bg} ${greetingInfo.color} inline-flex items-center justify-center shrink-0`}
              >
                <GreetingIcon className='w-4 h-4' />
              </span>
              <h2 className='text-sm sm:text-base font-bold text-slate-800 tracking-tight truncate'>
                {greetingInfo.text},{" "}
                <span className='text-blue-600'>
                  {username || ""}
                </span>
              </h2>
            </div>
            <span className='text-[11px] font-semibold bg-emerald-50 border border-emerald-200/60 text-emerald-700 px-2.5 py-0.5 rounded-full flex items-center gap-1 shrink-0'>
              <CheckCircle2 className='w-3 h-3 text-emerald-600' />
              {stats.completedTasks} / {stats.totalTasks} Completed
            </span>
          </div>

          {/* Today's Progress Bar */}
          <div>
            <div className='flex items-center justify-between text-xs font-semibold mb-1'>
              <span className='flex items-center gap-1 text-[11px] uppercase tracking-wider font-bold text-slate-500'>
                <TrendingUp className='w-3.5 h-3.5 text-blue-600' />
                Today's Progress
              </span>
              <span className='text-blue-600 font-extrabold'>
                {stats.progressPercent}%
              </span>
            </div>
            <div className='w-full h-2.5 bg-slate-100 rounded-full overflow-hidden p-0.5 border border-slate-200/80'>
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${stats.progressPercent}%` }}
                transition={{ duration: 0.8, ease: "easeOut" }}
                className='h-full rounded-full bg-gradient-to-r from-blue-600 via-indigo-600 to-emerald-500'
              />
            </div>
          </div>

          {/* Time Metrics Row */}
          <div className='grid grid-cols-3 gap-2 pt-2 border-t border-slate-100'>
            {/* Target Card with Edit capability */}
            <div className='bg-slate-50/80 hover:bg-slate-100/80 transition-colors rounded-xl p-2 text-center border border-slate-100 relative group'>
              <span className='text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1 mb-0.5'>
                <Target className='w-2.5 h-2.5 text-blue-600' />
                Target
              </span>

              {isEditingTarget ? (
                <div className='flex items-center justify-center gap-1 mt-0.5'>
                  <input
                    type='number'
                    min='0.5'
                    max='24'
                    step='0.5'
                    value={tempTargetInput}
                    onChange={(e) => setTempTargetInput(e.target.value)}
                    onKeyDown={handleKeyDown}
                    autoFocus
                    className='w-12 text-xs font-bold text-slate-800 bg-white border border-blue-400 rounded px-1 text-center outline-none focus:ring-1 focus:ring-blue-500'
                  />
                  <button
                    onClick={handleSaveTarget}
                    className='p-0.5 bg-blue-600 text-white rounded hover:bg-blue-700 transition-colors'
                    title='Save target'
                  >
                    <Check className='w-3 h-3' />
                  </button>
                </div>
              ) : (
                <div
                  onClick={() => {
                    setTempTargetInput(String(targetHours));
                    setIsEditingTarget(true);
                  }}
                  className='cursor-pointer flex items-center justify-center gap-1 group-hover:text-blue-600 transition-colors'
                  title='Click to edit daily target hours'
                >
                  <span className='text-xs font-extrabold text-slate-800 group-hover:text-blue-600'>
                    {stats.targetStr}
                  </span>
                  <Pencil className='w-2.5 h-2.5 text-slate-400 group-hover:text-blue-600 opacity-60 group-hover:opacity-100 transition-opacity' />
                </div>
              )}
            </div>

            {/* Logged Card */}
            <div className='bg-slate-50/80 rounded-xl p-2 text-center border border-slate-100'>
              <span className='text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1 mb-0.5'>
                <Clock className='w-2.5 h-2.5 text-indigo-600' />
                Logged
              </span>
              <span className='text-xs font-extrabold text-indigo-600'>
                {stats.loggedStr}
              </span>
            </div>

            {/* Remaining Card */}
            <div className='bg-slate-50/80 rounded-xl p-2 text-center border border-slate-100'>
              <span className='text-[10px] uppercase font-bold text-slate-500 flex items-center justify-center gap-1 mb-0.5'>
                <Hourglass className='w-2.5 h-2.5 text-amber-600' />
                Remaining
              </span>
              <span className='text-xs font-extrabold text-amber-600'>
                {stats.remainingStr}
              </span>
            </div>
          </div>
        </div>
      </div>
    </motion.div>
  );
};

export default SummaryDashboard;
