import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Zap } from 'lucide-react';

// --- DATA: Hardcore 7-Day Split Templates with Specific Images ---
const WORKOUT_TEMPLATES = {
  "Chest Day": {
    focus: "Day 1: Chest",
    exercises: "Barbell Bench Press, Incline Dumbbell Press, Cable Flys, Weighted Dips, Push-ups (Failure)",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80" // Bench Press
  },
 "Back Day": {
    focus: "Day 2: Back",
    exercises: "Deadlift, Pull-ups (Weighted), Barbell Rows, Lat Pulldowns, Face Pulls",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80"
  },
  "Leg Day": {
    focus: "Day 3: Legs (Quads/Calves)",
    exercises: "Barbell Squats, Leg Press, Walking Lunges, Leg Extensions, Standing Calf Raises",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80" // Squats
  },
  "Shoulder Day": {
    focus: "Day 4: Shoulders",
    exercises: "Overhead Barbell Press, Lateral Raises, Front Plate Raise, Reverse Pec Deck, Shrugs",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80" // Shoulders
  },
  "Arm Day": {
    focus: "Day 5: Arms",
    exercises: "Barbell Curls, Hammer Curls, Tricep Pushdowns, Skullcrushers, Preacher Curls",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80" // Arms
  },
  "Hamstrings/Abs": {
    focus: "Day 6: Hamstrings & Abs",
    exercises: "Romanian Deadlift, Seated Leg Curls, Hanging Leg Raises, Cable Crunches, Planks",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80" // Core/Strength
  },
  "Rest Day": {
    focus: "Day 7: Active Recovery",
    exercises: "Light Cardio (30 mins), Full Body Stretching, Foam Rolling",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80" // Stretching
  }
};

// Fallback images for custom routines
const RANDOM_COVERS = [
  "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80",
  "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80"
];

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  
  // Form State
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [exercises, setExercises] = useState('');
  // New state to hold the specific image from the template
  const [templateImage, setTemplateImage] = useState(''); 

  useEffect(() => {
    const saved = localStorage.getItem('myPrograms');
    if (saved) setPrograms(JSON.parse(saved));
  }, []);

  // --- LOGIC: Auto-fill form AND Image based on selection ---
  const applyTemplate = (key) => {
    const template = WORKOUT_TEMPLATES[key];
    setName(template.focus);
    setExercises(template.exercises);
    setDifficulty('Advanced'); 
    setTemplateImage(template.image); // Store the specific image
  };

  const saveProgram = () => {
    if(!name || !exercises) return alert("Please fill in Name and Exercises");
    
    const newProgram = { 
      id: Date.now(), 
      name, 
      difficulty,
      exercises: exercises.split(',').map(e => e.trim()),
      // Use the specific template image if it exists, otherwise pick random
      image: templateImage || RANDOM_COVERS[name.length % RANDOM_COVERS.length]
    };

    const updated = [...programs, newProgram];
    setPrograms(updated);
    localStorage.setItem('myPrograms', JSON.stringify(updated));
    
    // Reset
    setName(''); setExercises(''); setTemplateImage(''); setIsCreating(false);
  };

  const deleteProgram = (id) => {
    if(!window.confirm("Delete this routine?")) return;
    const updated = programs.filter(p => p.id !== id);
    setPrograms(updated);
    localStorage.setItem('myPrograms', JSON.stringify(updated));
  };

  return (
    <div className="max-w-6xl mx-auto space-y-8 animate-fade-in pb-20">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Workout Routines</h2>
          <p className="text-zinc-400">Select or build your split</p>
        </div>
        <button 
          onClick={() => setIsCreating(!isCreating)}
          className={`px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition ${
            isCreating ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-red-600 text-white hover:bg-red-700'
          }`}
        >
          {isCreating ? 'Cancel' : <><Plus size={20} /> New Routine</>}
        </button>
      </div>
      
      {/* CREATION FORM */}
      {isCreating && (
        <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl mb-8">
          <div className="flex items-center gap-2 mb-4">
            <Zap className="text-red-500" size={20} />
            <h3 className="text-xl font-bold text-white">Quick Auto-Fill</h3>
          </div>

          {/* TEMPLATE BUTTONS */}
          <div className="flex flex-wrap gap-2 mb-6">
            {Object.keys(WORKOUT_TEMPLATES).map(key => (
              <button
                key={key}
                onClick={() => applyTemplate(key)}
                className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-red-600 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold uppercase tracking-wider transition-colors"
              >
                {key}
              </button>
            ))}
          </div>

          <div className="h-px bg-zinc-800 w-full mb-6"></div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Routine Name</label>
              <input className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-red-600 outline-none"
                placeholder="e.g. Chest Day" value={name} onChange={e => setName(e.target.value)} />
            </div>
            <div>
              <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Difficulty</label>
              <select className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-red-600 outline-none"
                value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                <option>Beginner</option>
                <option>Intermediate</option>
                <option>Advanced</option>
              </select>
            </div>
          </div>
          
          <div className="mb-4">
            <label className="text-xs text-zinc-500 font-bold uppercase mb-1 block">Target Exercises</label>
            <textarea className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white h-32 focus:border-red-600 outline-none"
              placeholder="Exercises will appear here..." 
              value={exercises} onChange={e => setExercises(e.target.value)} />
          </div>
          
          <button onClick={saveProgram} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold uppercase tracking-wide">
            Save Routine
          </button>
        </div>
      )}

      {/* CARDS GRID */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {programs.length === 0 && !isCreating && (
          <div className="col-span-full text-center py-20 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800">
            <p className="text-zinc-500 text-lg">No routines found. Click "New Routine" to start.</p>
          </div>
        )}

        {programs.map(p => (
          <div key={p.id} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition-all shadow-lg hover:shadow-red-900/10 flex flex-col">
            <div className="h-40 overflow-hidden relative">
              <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500 grayscale group-hover:grayscale-0" />
              <div className="absolute top-3 left-3">
                <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                  p.difficulty === 'Beginner' ? 'bg-green-600 text-white' : 
                  p.difficulty === 'Intermediate' ? 'bg-yellow-600 text-white' : 'bg-red-600 text-white'
                }`}>
                  {p.difficulty}
                </span>
              </div>
              <button onClick={() => deleteProgram(p.id)} className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white hover:bg-red-600 transition">
                <Trash2 size={16} />
              </button>
            </div>

            <div className="p-5 flex-1 flex flex-col">
              <h3 className="text-xl font-bold text-white mb-4 italic">{p.name}</h3>
              <div className="mt-auto pt-4 border-t border-zinc-800">
                <div className="flex flex-wrap gap-2">
                  {p.exercises.slice(0, 3).map((ex, i) => (
                    <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">
                      {ex}
                    </span>
                  ))}
                  {p.exercises.length > 3 && (
                    <span className="text-xs text-zinc-500 px-2 py-1">+ {p.exercises.length - 3} more</span>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}