import { useEffect, useState } from 'react';
import api from '../api';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { TrendingUp, Activity, CalendarCheck, Dumbbell, Trophy } from 'lucide-react';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [uniqueExercises, setUniqueExercises] = useState([]);
  const [chartView, setChartView] = useState('daily'); 
  const [loading, setLoading] = useState(true); 
  
  const [stats, setStats] = useState({ totalSets: 0, totalWorkouts: 0, prs: {} });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/workouts');
        const sessions = res.data || []; 

        // 1. FLATTEN DATA
        const flatExercises = sessions.flatMap(session => 
          (session.exercises || []).map(ex => ({
            ...ex,
            exercise: ex.name,
            date: session.date
          }))
        ).sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setWorkouts(flatExercises);

        // 2. SETUP DROPDOWNS
        const exercises = [...new Set(flatExercises.map(w => w.exercise))];
        setUniqueExercises(exercises);
        
        if (exercises.length > 0 && !selectedExercise) {
          setSelectedExercise(exercises[0]); 
        }

        // 3. CALCULATE PERSONAL RECORDS
        const records = {};
        flatExercises.forEach(log => {
          const currentMax = records[log.exercise] || 0;
          if (log.weight > currentMax) {
            records[log.exercise] = log.weight;
          }
        });

        // 4. SET STATS
        const totalSets = flatExercises.reduce((acc, curr) => acc + curr.sets, 0);
        setStats({ 
          totalSets, 
          totalWorkouts: sessions.length, 
          prs: records 
        });

      } catch (err) {
        console.error("Failed to fetch dashboard data", err);
      } finally {
        setLoading(false); 
      }
    };
    fetchData();
  }, []);

  // --- CHART LOGIC ---
  const getConsistencyData = () => {
    if (chartView === 'daily') {
      return workouts.reduce((acc, curr) => {
        const date = curr.date.split('T')[0].slice(5);
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

  const strengthData = workouts
    .filter(w => w.exercise === selectedExercise)
    .map(w => ({
      date: w.date.split('T')[0].slice(5),
      weight: w.weight
    }));

  if (loading) return <div className="p-8 text-zinc-500">Loading Dashboard...</div>;

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

      {/* --- PERSONAL RECORDS WALL --- */}
      <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
        <div className="flex items-center gap-2 mb-6">
          <Trophy className="text-yellow-500" />
          <h3 className="text-xl font-bold text-white">Personal Records</h3>
        </div>
        
        {stats.prs && Object.keys(stats.prs).length > 0 ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {Object.entries(stats.prs).map(([name, weight]) => (
              <div key={name} className="bg-black/40 p-4 rounded-lg border-l-4 border-yellow-500 hover:bg-black/60 transition">
                <p className="text-xs text-zinc-400 uppercase font-bold truncate mb-1" title={name}>{name}</p>
                <p className="text-2xl font-black text-white italic">{weight} <span className="text-sm font-normal text-zinc-600 not-italic">kg</span></p>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-8 text-zinc-500 border-2 border-dashed border-zinc-800 rounded-lg">
            Log your first workout to see your Records here.
          </div>
        )}
      </div>

      {/* CHARTS SECTION */}
      <div className="grid lg:grid-cols-2 gap-8">
        
        {/* CHART 1: CONSISTENCY */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-red-500"/> Consistency
              </h3>
              <p className="text-sm text-zinc-500">Sets completed per period</p>
            </div>
            
            <div className="flex bg-zinc-950 p-1 rounded-lg border border-zinc-800">
              {['daily', 'weekly', 'monthly'].map((view) => (
                <button
                  key={view}
                  onClick={() => setChartView(view)}
                  className={`px-3 py-1 text-xs font-bold uppercase rounded transition-all ${
                    chartView === view 
                      ? 'bg-red-600 text-white shadow-lg' 
                      : 'text-zinc-500 hover:text-white'
                  }`}
                >
                  {view}
                </button>
              ))}
            </div>
          </div>

          {/* FIX: Added minWidth and explicit height in pixels */}
          <div className="h-[300px] w-full">
            <ResponsiveContainer width="100%" height="100%" minWidth={0}>
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                <XAxis dataKey="label" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} />
                <Tooltip 
                  cursor={{fill: '#27272a', opacity: 0.4}}
                  contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff'}} 
                />
                <Bar dataKey="value" fill="#ef4444" radius={[4, 4, 0, 0]} barSize={chartView === 'monthly' ? 20 : 40} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* CHART 2: STRENGTH TRACKER */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          <div className="mb-6 flex justify-between items-start h-10">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-red-500"/> Progression
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

          {/* FIX: Added minWidth and explicit height in pixels */}
          <div className="h-75 w-full">
            {strengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%" minWidth={0}>
                <LineChart data={strengthData}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#27272a" vertical={false} />
                  <XAxis dataKey="date" stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} dy={10} />
                  <YAxis stroke="#71717a" fontSize={12} tickLine={false} axisLine={false} unit="kg" />
                  <Tooltip 
                    contentStyle={{backgroundColor: '#09090b', border: '1px solid #27272a', color: '#fff'}} 
                  />
                  <Line 
                    type="monotone" 
                    dataKey="weight" 
                    stroke="#ef4444" 
                    strokeWidth={3} 
                    dot={{r: 4, fill: '#09090b', stroke: '#ef4444', strokeWidth: 2}} 
                    activeDot={{r: 6, fill: '#ef4444'}}
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