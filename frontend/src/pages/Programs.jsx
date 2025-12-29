import { useState, useEffect } from 'react';
import { Plus, Save, Trash2 } from 'lucide-react';

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [name, setName] = useState('');
  const [exercises, setExercises] = useState('');

  useEffect(() => {
    const saved = localStorage.getItem('myPrograms');
    if (saved) setPrograms(JSON.parse(saved));
  }, []);

  const saveProgram = () => {
    if(!name || !exercises) return;
    const newProgram = { id: Date.now(), name, exercises: exercises.split(',').map(e => e.trim()) };
    const updated = [...programs, newProgram];
    setPrograms(updated);
    localStorage.setItem('myPrograms', JSON.stringify(updated));
    setName(''); setExercises('');
  };

  const deleteProgram = (id) => {
    const updated = programs.filter(p => p.id !== id);
    setPrograms(updated);
    localStorage.setItem('myPrograms', JSON.stringify(updated));
  };

  return (
    <div className="max-w-3xl mx-auto space-y-8 animate-fade-in">
      <div className="flex justify-between items-end">
        <h2 className="text-3xl font-bold text-white">Your Programs</h2>
      </div>
      
      {/* Creator */}
      <div className="bg-gray-800 p-6 rounded-xl border border-gray-700 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 text-blue-400">Create New Template</h3>
        <div className="space-y-4">
          <input className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white"
            placeholder="Program Name (e.g. Chest Day)" value={name} onChange={e => setName(e.target.value)} />
          <input className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white"
            placeholder="Exercises (e.g. Bench Press, Flys, Dips)" value={exercises} onChange={e => setExercises(e.target.value)} />
          <button onClick={saveProgram} className="w-full bg-gray-700 hover:bg-gray-600 text-white py-3 rounded-lg font-bold flex justify-center gap-2 transition">
            <Save size={20} /> Save Template
          </button>
        </div>
      </div>

      {/* List */}
      <div className="grid gap-4 md:grid-cols-2">
        {programs.map(p => (
          <div key={p.id} className="bg-gray-800 p-5 rounded-xl border border-gray-700 relative group">
            <button onClick={() => deleteProgram(p.id)} className="absolute top-4 right-4 text-gray-500 hover:text-red-400 opacity-0 group-hover:opacity-100 transition">
              <Trash2 size={18} />
            </button>
            <h3 className="font-bold text-xl text-white mb-2">{p.name}</h3>
            <div className="flex flex-wrap gap-2">
              {p.exercises.map((ex, i) => (
                <span key={i} className="bg-blue-900/30 text-blue-300 px-3 py-1 rounded-full text-xs font-medium border border-blue-500/20">
                  {ex}
                </span>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}