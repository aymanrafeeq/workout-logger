import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Save, Plus, Trash2, Dumbbell } from 'lucide-react';

export default function Logger() {
  const navigate = useNavigate();
  const [programs, setPrograms] = useState([]);
  
  // State for the Workout Session
  const [sessionName, setSessionName] = useState('');
  const [rows, setRows] = useState([{ name: '', weight: '', sets: '', reps: '' }]);
  const [loading, setLoading] = useState(false);

  // Load saved templates from Local Storage
  useEffect(() => {
    const saved = localStorage.getItem('myPrograms');
    if (saved) setPrograms(JSON.parse(saved));
  }, []);

  // Auto-fill form when a template is selected
  const loadProgram = (e) => {
    const progId = e.target.value;
    const prog = programs.find(p => p.id == progId);
    
    if (!prog) return;
    
    // Auto-fill Session Name
    setSessionName(prog.name);
    
    // Auto-fill Rows (Map template exercises to logger rows)
    const newRows = prog.exercises.map(ex => ({ 
      name: ex, 
      weight: '', 
      sets: '', 
      reps: '' 
    }));
    setRows(newRows);
  };

  const updateRow = (i, field, val) => {
    const newRows = [...rows];
    newRows[i][field] = val;
    setRows(newRows);
  };

  const addRow = () => {
    setRows([...rows, { name: '', weight: '', sets: '', reps: '' }]);
  };

  const removeRow = (index) => {
    if (rows.length > 1) {
      setRows(rows.filter((_, i) => i !== index));
    }
  };

  const handleFinish = async () => {
    // --- 1. VALIDATION ---
    if (!sessionName.trim()) {
      alert("⚠️ Please give this workout a name (e.g. 'Push Day')");
      return;
    }

    const isValid = rows.every(row => 
      row.name.trim() !== '' && 
      row.weight !== '' && 
      row.sets !== '' && 
      row.reps !== ''
    );

    if (!isValid) {
      alert("⚠️ Please fill in all fields (Weight, Sets, Reps) for every exercise.");
      return;
    }

    // --- 2. API CALL ---
    setLoading(true);
    try {
      // Construct Nested JSON for the new Backend
      const payload = {
        name: sessionName,
        date: new Date().toISOString(),
        exercises: rows.map(r => ({
          name: r.name,
          weight: parseFloat(r.weight),
          sets: parseInt(r.sets),
          reps: parseInt(r.reps)
        }))
      };

      await api.post('/workouts', payload);
      navigate('/history'); // Success! Go to history
    } catch (err) {
      console.error(err);
      alert('Failed to save workout. Check server connection.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-8 mb-24 animate-fade-in">
      
      {/* HEADER & TEMPLATE SELECTOR */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Log Session</h2>
          <p className="text-zinc-400">Track your numbers</p>
        </div>
        
        <div className="w-full md:w-auto">
          <select 
            onChange={loadProgram} 
            className="w-full bg-zinc-900 border border-zinc-700 p-3 rounded-lg text-sm text-zinc-300 focus:border-red-600 outline-none cursor-pointer hover:border-zinc-600 transition"
          >
            <option value="">Load Template...</option>
            {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
          </select>
        </div>
      </div>

      {/* SESSION NAME INPUT */}
      <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-lg">
        <label className="text-xs text-zinc-500 font-bold uppercase mb-2 flex items-center gap-1">
          Session Name <span className="text-red-500">*</span>
        </label>
        <div className="flex items-center gap-3">
          <div className="bg-red-600/10 p-2 rounded-lg">
            <Dumbbell className="text-red-600" size={24} />
          </div>
          <input 
            className={`w-full bg-black border p-3 rounded-lg text-white font-bold text-lg outline-none transition-colors ${
              !sessionName.trim() ? 'border-red-900/50 focus:border-red-600' : 'border-zinc-700 focus:border-zinc-500'
            }`}
            placeholder="e.g. Monday Chest Day"
            value={sessionName}
            onChange={e => setSessionName(e.target.value)}
          />
        </div>
      </div>

      {/* EXERCISE ROWS */}
      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="bg-zinc-900 p-5 rounded-xl border border-zinc-800 shadow-lg relative group transition-all hover:border-zinc-700">
            
            {/* Delete Button (Visible on Hover or always on mobile) */}
            {rows.length > 1 && (
              <button 
                onClick={() => removeRow(i)} 
                className="absolute -top-2 -right-2 bg-red-600 text-white p-1.5 rounded-full opacity-100 md:opacity-0 group-hover:opacity-100 transition-opacity shadow-lg hover:bg-red-700"
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
                  className={`w-full bg-black border p-3 rounded-lg text-white outline-none ${
                    !row.name ? 'border-red-900/50 focus:border-red-600' : 'border-zinc-700 focus:border-zinc-500'
                  }`}
                  placeholder="e.g. Squat" 
                  value={row.name} 
                  onChange={e => updateRow(i, 'name', e.target.value)} 
                />
              </div>

              {/* Weight */}
              <div className="md:col-span-3">
                <label className="text-xs text-zinc-500 font-bold uppercase mb-1 flex items-center gap-1">
                  Weight (kg) <span className="text-red-500">*</span>
                </label>
                <input 
                  type="number" min="0"
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
                  type="number" min="1"
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
                  type="number" min="1"
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
        className="w-full py-4 border-2 border-dashed border-zinc-800 text-zinc-500 rounded-xl hover:border-red-600 hover:text-red-500 transition font-bold uppercase flex items-center justify-center gap-2"
      >
        <Plus size={20} /> Add Exercise
      </button>

      {/* Floating Save Button */}
      <div className="fixed bottom-6 right-6 left-6 md:static md:w-full z-40">
        <button 
          onClick={handleFinish} 
          disabled={loading} 
          className="w-full bg-green-600 hover:bg-green-700 text-white py-4 rounded-xl font-black uppercase shadow-lg shadow-green-900/20 flex justify-center items-center gap-3 transition-transform hover:scale-[1.01] disabled:opacity-70 disabled:grayscale"
        >
          {loading ? 'Saving...' : <><Save size={20} /> Finish Workout</>}
        </button>
      </div>
    </div>
  );
}