import { useEffect, useState } from 'react';
import api from '../api';
import { Trash2, Calendar, Dumbbell, Clock } from 'lucide-react';

export default function History() {
  const [history, setHistory] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      const res = await api.get('/workouts');
      const rawData = res.data;

      // --- GROUPING LOGIC ---
      // The backend returns a flat list. We need to group items by Date + Time
      // to make them look like "Sessions".
      const grouped = rawData.reduce((acc, curr) => {
        const dateKey = curr.date.split('T')[0]; // YYYY-MM-DD
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(curr);
        return acc;
      }, {});

      // Convert object to array and sort descending (newest first)
      const sortedHistory = Object.entries(grouped)
        .sort((a, b) => new Date(b[0]) - new Date(a[0]));

      setHistory(sortedHistory);
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const deleteLog = async (id) => {
    if (!window.confirm("Delete this exercise log?")) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchHistory(); // Refresh list
    } catch (err) {
      alert("Failed to delete log");
    }
  };

  if (loading) return <div className="text-center text-zinc-500 mt-20">Loading History...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Workout History</h1>
        <p className="text-zinc-400">Your past battles</p>
      </div>

      {history.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800">
          <p className="text-zinc-500 text-lg">No workouts logged yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {history.map(([date, exercises]) => (
            <div key={date} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
              
              {/* Header: Date */}
              <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                <div className="flex items-center gap-3">
                  <div className="bg-zinc-800 p-2 rounded text-zinc-400">
                    <Calendar size={20} />
                  </div>
                  <span className="text-white font-bold text-lg">
                    {new Date(date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </span>
                </div>
                <div className="text-zinc-500 text-sm font-mono flex items-center gap-2">
                  <Clock size={14} /> {exercises.length} Exercises
                </div>
              </div>

              {/* List of Exercises */}
              <div className="divide-y divide-zinc-800/50">
                {exercises.map((log) => (
                  <div key={log.ID} className="p-4 hover:bg-zinc-800/30 transition flex justify-between items-center group">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center font-bold text-xs border border-red-900/30">
                        {log.exercise.charAt(0)}
                      </div>
                      <div>
                        <h4 className="font-bold text-white text-base">{log.exercise}</h4>
                        <div className="flex gap-4 text-sm text-zinc-400 mt-1">
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs">{log.sets} Sets</span>
                          <span className="bg-zinc-800 px-2 py-0.5 rounded text-xs">{log.reps} Reps</span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <span className="block text-xl font-black text-white italic">{log.weight}<span className="text-sm not-italic text-zinc-500 ml-1">kg</span></span>
                      </div>
                      <button 
                        onClick={() => deleteLog(log.ID)}
                        className="text-zinc-600 hover:text-red-500 opacity-0 group-hover:opacity-100 transition p-2"
                        title="Delete Entry"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}