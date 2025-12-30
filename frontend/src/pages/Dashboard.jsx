import { useEffect, useState } from 'react';
import api from '../api';
import { 
  LineChart, Line, BarChart, Bar, 
  XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid 
} from 'recharts';
import { TrendingUp, Activity, CalendarCheck, Dumbbell, Filter } from 'lucide-react';

export default function Dashboard() {
  const [workouts, setWorkouts] = useState([]);
  const [selectedExercise, setSelectedExercise] = useState('');
  const [uniqueExercises, setUniqueExercises] = useState([]);
  
  // NEW: State for Time Range
  const [chartView, setChartView] = useState('daily'); // 'daily', 'weekly', 'monthly'
  
  const [stats, setStats] = useState({ totalSets: 0, totalWorkouts: 0 });

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await api.get('/workouts');
        const data = res.data;
        // Sort data by date ascending first
        data.sort((a, b) => new Date(a.date) - new Date(b.date));
        
        setWorkouts(data);

        const exercises = [...new Set(data.map(w => w.exercise))];
        setUniqueExercises(exercises);
        if (exercises.length > 0 && !selectedExercise) {
          setSelectedExercise(exercises[0]); 
        }

        const sets = data.reduce((acc, curr) => acc + curr.sets, 0);
        const uniqueDays = new Set(data.map(w => w.date.split('T')[0])).size;
        setStats({ totalSets: sets, totalWorkouts: uniqueDays });
      } catch (err) {
        console.error("Failed to fetch dashboard data");
      }
    };
    fetchData();
  }, []);

  // --- LOGIC: Group Data based on View Mode ---
  const getConsistencyData = () => {
    if (chartView === 'daily') {
      // Last 7 Active Days
      return workouts.reduce((acc, curr) => {
        const date = curr.date.split('T')[0].slice(5); // "MM-DD"
        const existing = acc.find(a => a.label === date);
        if (existing) existing.value += curr.sets;
        else acc.push({ label: date, value: curr.sets });
        return acc;
      }, []).slice(-7);
    } 
    
    else if (chartView === 'weekly') {
      // Group by Week Number
      return workouts.reduce((acc, curr) => {
        const d = new Date(curr.date);
        // Calculate Week Number
        const onejan = new Date(d.getFullYear(), 0, 1);
        const weekNum = Math.ceil((((d - onejan) / 86400000) + onejan.getDay() + 1) / 7);
        const label = `W${weekNum}`;
        
        const existing = acc.find(a => a.label === label);
        if (existing) existing.value += curr.sets;
        else acc.push({ label, value: curr.sets });
        return acc;
      }, []).slice(-8); // Show last 8 weeks
    } 
    
    else if (chartView === 'monthly') {
      // Group by Month Name (e.g., "Jan", "Feb")
      const monthNames = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];
      return workouts.reduce((acc, curr) => {
        const d = new Date(curr.date);
        const label = monthNames[d.getMonth()];
        
        const existing = acc.find(a => a.label === label);
        if (existing) existing.value += curr.sets;
        else acc.push({ label, value: curr.sets });
        return acc;
      }, []); // Show all months
    }
    return [];
  };

  const chartData = getConsistencyData();

  // --- CHART 2: Strength Progress (Max Weight per session) ---
  const strengthData = workouts
    .filter(w => w.exercise === selectedExercise)
    .map(w => ({
      date: w.date.split('T')[0].slice(5),
      weight: w.weight
    }));

  return (
    <div className="space-y-8 pb-20 animate-fade-in">
      
      <div>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Dashboard</h1>
        <p className="text-zinc-400">Track your consistency and gains</p>
      </div>

      {/* KPI Cards */}
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
        
        {/* CHART 1: Consistency with Time Range Switcher */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          <div className="mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <Activity size={20} className="text-red-500"/> Consistency
              </h3>
              <p className="text-sm text-zinc-500">Sets completed per period</p>
            </div>
            
            {/* Time Range Switcher */}
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

          <div className="h-72">
            <ResponsiveContainer width="100%" height="100%">
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

        {/* CHART 2: Strength Tracker */}
        <div className="bg-zinc-900 p-6 rounded-xl border border-zinc-800 shadow-lg">
          <div className="mb-6 flex justify-between items-start">
            <div>
              <h3 className="text-xl font-bold text-white flex items-center gap-2">
                <TrendingUp size={20} className="text-red-500"/> Progression
              </h3>
              <p className="text-sm text-zinc-500">Max Weight Over Time</p>
            </div>
            
            <select 
              className="bg-zinc-950 border border-zinc-800 text-white text-sm rounded-lg p-2 outline-none focus:border-red-600"
              value={selectedExercise}
              onChange={(e) => setSelectedExercise(e.target.value)}
            >
              {uniqueExercises.map(ex => <option key={ex} value={ex}>{ex}</option>)}
            </select>
          </div>

          <div className="h-72">
            {strengthData.length > 0 ? (
              <ResponsiveContainer width="100%" height="100%">
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
                <p>No data found</p>
              </div>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}