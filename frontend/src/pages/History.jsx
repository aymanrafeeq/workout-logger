import { useEffect, useState } from 'react';
import api from '../api';
import { Trash2, Calendar, Clock, Dumbbell } from 'lucide-react';

export default function History() {
  // We use 'sessions' because your backend now returns WorkoutSession[]
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetchHistory();
  }, []);

  const fetchHistory = async () => {
    try {
      // Backend returns the nested structure:
      // [{ id: 1, name: "Leg Day", date: "...", exercises: [...] }]
      const res = await api.get('/workouts');
      setSessions(res.data);
    } catch (err) {
      console.error("Failed to load history");
    } finally {
      setLoading(false);
    }
  };

  const deleteSession = async (id) => {
    if (!window.confirm("Delete this entire workout session?")) return;
    try {
      await api.delete(`/workouts/${id}`);
      fetchHistory(); // Reload list after delete
    } catch (err) {
      alert("Failed to delete session");
    }
  };

  if (loading) return <div className="text-center text-zinc-500 mt-20">Loading History...</div>;

  return (
    <div className="max-w-4xl mx-auto space-y-8 pb-20 animate-fade-in">
      <div>
        <h1 className="text-3xl font-black italic text-white uppercase tracking-tighter">Workout History</h1>
        <p className="text-zinc-400">Your completed sessions</p>
      </div>

      {sessions.length === 0 ? (
        <div className="text-center py-20 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800">
          <p className="text-zinc-500 text-lg">No sessions logged yet.</p>
        </div>
      ) : (
        <div className="space-y-6">
          {sessions.map((session) => (
            <div key={session.id} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg">
              
              {/* SESSION HEADER */}
              <div className="bg-zinc-950 px-6 py-4 border-b border-zinc-800 flex justify-between items-center">
                <div>
                  {/* Session Name (e.g., "Leg Day") */}
                  <h3 className="text-xl font-bold text-white mb-1 capitalize">{session.name}</h3>
                  <div className="flex items-center gap-2 text-zinc-500 text-sm">
                    <Calendar size={14} />
                    {new Date(session.date).toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}
                  </div>
                </div>
                <button 
                  onClick={() => deleteSession(session.id)}
                  className="p-2 text-zinc-600 hover:text-red-500 transition"
                  title="Delete Session"
                >
                  <Trash2 size={18} />
                </button>
              </div>

              {/* EXERCISE LIST INSIDE THE SESSION */}
              <div className="divide-y divide-zinc-800/50">
                {session.exercises && session.exercises.map((ex) => (
                  <div key={ex.id} className="p-4 flex justify-between items-center hover:bg-zinc-800/30 transition">
                    <div className="flex items-center gap-4">
                      {/* Exercise Icon */}
                      <div className="w-8 h-8 rounded-full bg-red-900/20 text-red-500 flex items-center justify-center font-bold text-xs border border-red-900/30">
                        <Dumbbell size={14} />
                      </div>
                      
                      {/* Exercise Details */}
                      <div>
                        <p className="font-bold text-white">{ex.name}</p>
                        <p className="text-xs text-zinc-500">
                          <span className="text-zinc-400">{ex.sets}</span> Sets × <span className="text-zinc-400">{ex.reps}</span> Reps
                        </p>
                      </div>
                    </div>

                    {/* Weight */}
                    <div className="text-right">
                      <span className="block text-lg font-black text-white italic">
                        {ex.weight} <span className="text-xs text-zinc-500 font-normal not-italic">kg</span>
                      </span>
                    </div>
                  </div>
                ))}
                
                {/* Fallback if session exists but exercises are empty */}
                {(!session.exercises || session.exercises.length === 0) && (
                  <div className="p-4 text-center text-zinc-600 text-sm italic">
                    No exercises recorded in this session.
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}