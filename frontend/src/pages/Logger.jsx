import { useState, useEffect } from 'react';
import api from '../api';
import { useNavigate } from 'react-router-dom';
import { Save, Plus } from 'lucide-react';

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

  const handleFinish = async () => {
    setLoading(true);
    const date = new Date().toISOString().split('T')[0];
    try {
      const promises = rows.map(row => {
        if (!row.exercise) return null;
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
      alert('Failed to save workout');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 mb-24">
      <div className="flex flex-col md:flex-row justify-between items-center gap-4">
        <h2 className="text-3xl font-bold text-white">Log Session</h2>
        <select onChange={loadProgram} className="bg-gray-800 border border-gray-600 p-2 rounded-lg text-sm text-gray-300 focus:border-blue-500 outline-none w-full md:w-auto">
          <option value="">Load Template...</option>
          {programs.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
        </select>
      </div>

      <div className="space-y-4">
        {rows.map((row, i) => (
          <div key={i} className="bg-gray-800 p-4 rounded-xl border border-gray-700 grid grid-cols-1 md:grid-cols-12 gap-4 items-center shadow-sm">
            <div className="md:col-span-5">
              <label className="text-xs text-gray-500 uppercase font-bold">Exercise</label>
              <input className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white mt-1" 
                value={row.exercise} onChange={e => updateRow(i, 'exercise', e.target.value)} />
            </div>
            <div className="md:col-span-3">
              <label className="text-xs text-gray-500 uppercase font-bold">Weight (kg)</label>
              <input type="number" className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white mt-1 text-center"
                value={row.weight} onChange={e => updateRow(i, 'weight', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Sets</label>
              <input type="number" className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white mt-1 text-center"
                value={row.sets} onChange={e => updateRow(i, 'sets', e.target.value)} />
            </div>
            <div className="md:col-span-2">
              <label className="text-xs text-gray-500 uppercase font-bold">Reps</label>
              <input type="number" className="w-full bg-gray-900 border border-gray-600 p-2 rounded text-white mt-1 text-center"
                value={row.reps} onChange={e => updateRow(i, 'reps', e.target.value)} />
            </div>
          </div>
        ))}
      </div>

      <button onClick={addRow} className="w-full py-3 border-2 border-dashed border-gray-700 text-gray-400 rounded-xl hover:border-blue-500 hover:text-blue-500 transition flex justify-center items-center gap-2 font-bold">
        <Plus size={20} /> Add Exercise
      </button>

      <button onClick={handleFinish} disabled={loading} className="fixed bottom-6 right-6 md:static md:w-full bg-green-600 hover:bg-green-700 text-white px-8 py-4 rounded-full md:rounded-xl shadow-2xl font-bold flex justify-center items-center gap-3 transition transform hover:scale-105">
        <Save size={20} /> {loading ? 'Saving...' : 'Finish Workout'}
      </button>
    </div>
  );
}