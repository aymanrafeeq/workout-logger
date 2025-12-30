import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, AlertCircle } from 'lucide-react';

export default function Logger() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  const [rows, setRows] = useState([{ exercise: '', weight: '', sets: '', reps: '' }]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('myPrograms');
    if (saved) setPrograms(JSON.parse(saved));
  }, []);

  const loadProgram = (e) => {
    const prog = programs.find(p => p.id == e.target.value);
    if (!prog) return;
    setRows(prog.exercises.map(ex => ({ exercise: ex, weight: '', sets: '', reps: '' })));
  };

  const updateRow = (i, field, val) => {
    const newRows = [...rows];
    newRows[i][field] = val;
    setRows(newRows);
  };

  const addRow = () => setRows([...rows, { exercise: '', weight: '', sets: '', reps: '' }]);

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleFinish = async () => {
    // --- 1. VALIDATION CHECK ---
    const isValid = rows.every(row => 
      row.exercise.trim() !== '' && 
      row.weight !== '' && 
      row.sets !== '' && 
      row.reps !== ''
    );

    if (!isValid) {
      alert("⚠️ Please fill in Weight, Sets, and Reps for ALL exercises.");
      return; 
    }

    setLoading(true);
    const date = new Date().toISOString().split('T')[0];
    try {
      const promises = rows.map(row => {
        return api.post('/workouts', {
          exercise: row.exercise,
          weight: parseFloat(row.weight),
          sets: parseInt(row.sets),
          reps: parseInt(row.reps),
          date: date
        });
      });
      await Promise.all(promises);
      navigate('/');
    } catch (err) {
      alert('Failed to save workout. Check console for details.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-24 animate-fade-in">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Log Session</h2>
          <p className="text-zinc-400">Track your numbers</p>
        </div>
        
        {/* Template Loader */}
        <select onChange={loadProgram} className="bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-sm text-zinc-300 focus:border-red-600 outline-none w-full md:w-auto">
          <option value="">Load Template...</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-lg relative group">
            
            {/* Delete Button (Visible on Hover) */}
            {rows.length > 1 && (
              <button 
                onClick={() => removeRow(i)}
                className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-700 shadow-lg"
                title="Remove Exercise"
              >
                <Trash2 size={14} />
              </button>
            )}

            <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
              {/* Exercise Name */}
              <div className="md:col-span-5">
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  Exercise <span className="text-red-500">*</span>
                </label>
                <input 
                  className={`w-full bg-black border p-3 rounded-lg text-white outline-none transition-colors ${
                    !row.exercise ? 'border-red-900/50 focus:border-red-600' : 'border-zinc-700 focus:border-zinc-500'
                  }`}
                  placeholder="e.g. Bench Press"
                  value={row.exercise} 
                  onChange={e => updateRow(i, 'exercise', e.target.value)}
                  required
                />
              </div>

              {/* Weight */}
              <div className="md:col-span-3">
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="0"
                  className={`w-full bg-black border p-3 rounded-lg text-white text-center outline-none ${
                    row.weight === '' ? 'border-red-900/50 focus:border-red-600' : 'border-zinc-700 focus:border-zinc-500'
                  }`}
                  placeholder="0"
                  value={row.weight} 
                  onChange={e => updateRow(i, 'weight', e.target.value)}
                />
              </div>

              {/* Sets */}
              <div className="md:col-span-2">
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  Sets <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  className={`w-full bg-black border p-3 rounded-lg text-white text-center outline-none ${
                    row.sets === '' ? 'border-red-900/50 focus:border-red-600' : 'border-zinc-700 focus:border-zinc-500'
                  }`}
                  placeholder="0"
                  value={row.sets} 
                  onChange={e => updateRow(i, 'sets', e.target.value)}
                />
              </div>

              {/* Reps */}
              <div className="md:col-span-2">
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  Reps <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" 
                  min="1"
                  className={`w-full bg-black border p-3 rounded-lg text-white text-center outline-none ${
                    row.reps === '' ? 'border-red-900/50 focus:border-red-600' : 'border-zinc-700 focus:border-zinc-500'
                  }`}
                  placeholder="0"
                  value={row.reps} 
                  onChange={e => updateRow(i, 'reps', e.target.value)}
                />
              </div>
            </div>
          </div>
        ))}
      </div>

      <button 
        onClick={addRow} 
        className="w-full py-4 border-2 border-dashed border-zinc-800 text-zinc-500 rounded-xl hover:border-red-600 hover:text-red-500 transition flex justify-center items-center gap-2 font-bold uppercase tracking-wide"
      >
        <Plus size={20} /> Add Exercise
      </button>

      {/* Floating Action Button for Mobile, Big Bar for Desktop */}
      <div className="fixed bottom-6 right-6 left-6 md:static md:w-full z-50">
        <button 
          onClick={handleFinish} 
          disabled={loading} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black uppercase tracking-wide shadow-lg shadow-green-900/20 flex justify-center items-center gap-3 transition-transform hover:scale-[1.01] disabled:opacity-70 disabled:grayscale"
        >
          {loading ? (
            'Saving Workout...' 
          ) : (
            <>
              <Save size={20} /> Finish Workout
            </>
          )}
        </button>
      </div>
    </div>
  );
}