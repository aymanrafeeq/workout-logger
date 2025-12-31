import { useEffect, useState } from 'react';
import api from '../api';
import {
  LineChart, Line, BarChart, Bar,
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid
} from 'recharts';
import { TrendingUp, Activity, CalendarCheck, Dumbbell } from 'lucide-react';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [chartView, setChartView] = useState('daily'); // 'daily', 'weekly', 'monthly'
  const [stats, setStats] = useState({ totalSets: 0, totalWorkouts: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/workouts');
        const sessions = res.data; // Array of WorkoutSession (Nested)

        // --- 1. FLATTEN DATA FOR CHARTS ---
        // Convert [{session, exercises: [ex1, ex2]}] -> [ex1, ex2, ...]
        const flatExercises = sessions.flatMap(session =>
          session.exercises.map(ex => ({
            ...ex,
            exercise: ex.name, // Map 'name' -> 'exercise' for chart logic
            date: session.date
          }))
        ).sort((a, b) => new Date(a.date) - new Date(b.date));

        setWorkouts(flatExercises);

        // --- 2. SETUP DROPDOWNS & STATS ---
        const exercises = [...new Set(flatExercises.map(w => w.exercise))];
        setUniqueExercises(exercises);
        if (exercises.length > 0 && !selectedExercise) {
          setSelectedExercise(exercises[0]);
        }

        const totalSets = flatExercises.reduce((acc, curr) => acc + curr.sets, 0);
        // Use sessions.length for total workouts count
        setStats({ totalSets, totalWorkouts: sessions.length });

      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  // --- CHART LOGIC 1: CONSISTENCY ---
  const getConsistencyData = () => {
    if (chartView === 'daily') {
      return workouts.reduce((acc, curr) => {
        const date = curr.date.split('T')[0].slice(5); // "MM-DD"
        const existing = acc.find(a => a.label === date);
        if (existing) existing.value += curr.sets;
        else acc.push({ label: date, value: curr.sets });
        return acc;
      }, []).slice(-7);
    }
    else if (chartView === 'weekly') {
      return workouts.reduce((acc, curr) => {
        const d = new Date(curr.date);
        const onejan = new Date(d.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        const label = `W${weekNum}`;
        const existing = acc.find(a => a.label === label);
        if (existing) existing.value += curr.sets;
        else acc.push({ label, value: curr.sets });
        return acc;
      }, []).slice(-8);
    }
    else if (chartView === 'monthly') {
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return workouts.reduce((acc, curr) => {
        const d = new Date(curr.date);
        const label = monthNames[d.getMonth()];
        const existing = acc.find(a => a.label === label);
        if (existing) existing.value += curr.sets;
        else acc.push({ label, value: curr.sets });
        return acc;
      }, []);
    }
    return [];
  };

  const chartData = getConsistencyData();

  // --- CHART LOGIC 2: STRENGTH PROGRESS ---
  const strengthData = workouts
    .filter(w => w.exercise === selectedExercise)
    .map(w => ({
      date: w.date.split('T')[0].slice(5),
      weight: w.weight
    }));

  return (
    <div className="space-y-8 pb-20 animate-fade-in">

      {/* HEADER */}
      <div>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Dashboard</h1>
        <p className="text-zinc-400">Track your consistency and gains</p>
      </div>

      {/* KPI CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-red-600/10 text-red-500 rounded-lg border border-red-600/20">
            <CalendarCheck size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Sessions Logged</p>
            <p className="text-4xl font-black text-white italic">{stats.totalWorkouts}</p>
          </div>
        </div>
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-zinc-800 text-white rounded-lg border border-zinc-700">
            <Activity size={28} />
          </div>
          <div>
            <p className="text-zinc-500 text-sm font-bold uppercase tracking-wider">Total Volume (Sets)</p>
            <p className="text-4xl font-black text-white italic">{stats.totalSets}</p>
          </div>
        </div>
      </div>

      <div className="grid lg:grid-cols-2 gap-8">

        {/* CHART 1: CONSISTENCY */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-red-500" /> Consistency
              </h3>
              <p className="text-sm text-zinc-500">Sets completed per period</p>
            </div>

            {/* Time Range Switcher */}
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              {['daily', 'weekly', 'monthly'].map((view) => (
                <button
                  key={view}
                  onClick={() => setChartView(view)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded transition-all ${chartView === view
                    ? 'bg-red-600 text-white shadow-lg'
                    : 'text-zinc-500 hover:text-white'
                    }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip
                  cursor={{ fill: '#27272a', opacity: 0.4 }}
                  contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff' }}
                />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={chartView === 'monthly' ? 20 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: STRENGTH TRACKER */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-red-500" /> Progression
              </h3>
              <p className="text-sm text-zinc-500">Max Weight Over Time</p>
            </div>

            {uniqueExercises.length > 0 && (
              <select
                className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg p-2 outline-none focus:border-red-600"
                value={selectedExercise}
                onChange={(e) => setSelectedExercise(e.target.value)}
              >
                {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
              </select>
            )}
          </div>

          <div className="h-72">
            {strengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={strengthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                  <Tooltip
                    contentStyle={{ backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="weight"
                    stroke="#ef4444"
                    strokeWidth={3}
                    dot={{ r: 4, fill: '#09090b', stroke: '#ef4444', strokeWidth: 2 }}
                    activeDot={{ r: 6, fill: '#ef4444' }}
                  />
                </LineChart>
              </ResponsiveContainer>
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-zinc-600">
                <Dumbbell size={40} className="mb-2 opacity-50" />
                <p>No data found for this exercise</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}