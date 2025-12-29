import { useEffect, useState } from 'react';
import api from '../api';
import { LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from 'recharts';
import { Trophy, Activity, Calendar } from 'lucide-react';

export default function Dashboard() {
  const [data, setData] = useState([]);
  const [stats, setStats] = useState({ vol: 0, count: 0, prs: {} });

  useEffect(() => {
    api.get('/workouts').then(res => {
      const logs = res.data;
      // Calculate Stats
      let totalVol = 0;
      const records = {};
      
      logs.forEach(w => {
        totalVol += (w.weight * w.sets * w.reps);
        if (!records[w.exercise] || w.weight > records[w.exercise]) {
          records[w.exercise] = w.weight;
        }
      });

      // Prepare Chart Data
      const chartMap = logs.reduce((acc, curr) => {
        const date = curr.date.split('T')[0];
        const exist = acc.find(a => a.date === date);
        const vol = curr.weight * curr.sets * curr.reps;
        if(exist) exist.vol += vol;
        else acc.push({ date, vol });
        return acc;
      }, []);

      setData(chartMap.sort((a,b) => new Date(a.date) - new Date(b.date)).slice(-10));
      setStats({ vol: totalVol, count: logs.length, prs: records });
    });
  }, []);

  return (
    <div className="space-y-8 animate-fade-in">
      <h1 className="text-3xl font-bold text-white">Dashboard</h1>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-blue-900/50 text-blue-400 rounded-lg"><Activity /></div>
          <div><p className="text-gray-400 text-sm">Total Volume</p><p className="text-2xl font-bold text-white">{stats.vol.toLocaleString()} kg</p></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-purple-900/50 text-purple-400 rounded-lg"><Calendar /></div>
          <div><p className="text-gray-400 text-sm">Total Sets</p><p className="text-2xl font-bold text-white">{stats.count}</p></div>
        </div>
        <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg flex items-center gap-4">
          <div className="p-3 bg-yellow-900/50 text-yellow-400 rounded-lg"><Trophy /></div>
          <div><p className="text-gray-400 text-sm">PRs Set</p><p className="text-2xl font-bold text-white">{Object.keys(stats.prs).length}</p></div>
        </div>
      </div>

      {/* Chart */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 h-96 shadow-lg">
        <h3 className="font-bold text-lg mb-6 text-gray-200">Volume Progression</h3>
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#374151" />
            <XAxis dataKey="date" stroke="#9ca3af" />
            <YAxis stroke="#9ca3af" />
            <Tooltip contentStyle={{backgroundColor: '#1f2937', border: '1px solid #374151', color: '#fff'}} />
            <Line type="monotone" dataKey="vol" stroke="#3b82f6" strokeWidth={3} dot={{r:4, fill:'#3b82f6'}} />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* PR List */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {Object.entries(stats.prs).map(([name, weight]) => (
          <div key={name} className="bg-gray-800 p-4 rounded-xl border-l-4 border-yellow-500 shadow-sm">
            <p className="text-xs text-gray-400 uppercase tracking-wider">{name}</p>
            <p className="text-xl font-bold text-white">{weight} kg</p>
          </div>
        ))}
      </div>
    </div>
  );
}