import { useState, useEffect } from 'react';
import { Plus, Save, Trash2, Zap, PlayCircle, Timer } from 'lucide-react';

// --- DATA: Hardcore 7-Day Split Templates ---
const WORKOUT_TEMPLATES = {
  "Chest Day": {
    focus: "Day 1: Chest",
    exercises: "Barbell Bench Press, Incline Dumbbell Press, Cable Flys, Weighted Dips, Push-ups (Failure)",
    image: "https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?auto=format&fit=crop&w=800&q=80"
  },
  "Back Day": {
    focus: "Day 2: Back",
    exercises: "Deadlift, Pull-ups (Weighted), Barbell Rows, Lat Pulldowns, Face Pulls",
    image: "https://images.unsplash.com/photo-1526506118085-60ce8714f8c5?auto=format&fit=crop&w=800&q=80"
  },
  "Leg Day": {
    focus: "Day 3: Legs",
    exercises: "Barbell Squats, Leg Press, Walking Lunges, Leg Extensions, Standing Calf Raises",
    image: "https://images.unsplash.com/photo-1574680096145-d05b474e2155?auto=format&fit=crop&w=800&q=80"
  },
  "Shoulder Day": {
    focus: "Day 4: Shoulders",
    exercises: "Overhead Barbell Press, Lateral Raises, Front Plate Raise, Reverse Pec Deck, Shrugs",
    image: "https://images.unsplash.com/photo-1541534741688-6078c6bfb5c5?auto=format&fit=crop&w=800&q=80"
  },
  "Arm Day": {
    focus: "Day 5: Arms",
    exercises: "Barbell Curls, Hammer Curls, Tricep Pushdowns, Skullcrushers, Preacher Curls",
    image: "https://images.unsplash.com/photo-1581009146145-b5ef050c2e1e?auto=format&fit=crop&w=800&q=80"
  },
  "Hamstrings/Abs": {
    focus: "Day 6: Hamstrings & Abs",
    exercises: "Romanian Deadlift, Seated Leg Curls, Hanging Leg Raises, Cable Crunches, Planks",
    image: "https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&w=800&q=80"
  },
  "Rest Day": {
    focus: "Day 7: Active Recovery",
    exercises: "Light Cardio (30 mins), Full Body Stretching, Foam Rolling",
    image: "https://images.unsplash.com/photo-1518611012118-696072aa579a?auto=format&fit=crop&w=800&q=80"
  }
};

// --- DATA: Warmups ---
const WARMUPS = [
  {
    title: "Full Body Dynamic Flow",
    duration: "5 Mins",
    focus: "General Activation",
    image: "https://images.unsplash.com/photo-1571019613454-1cb2f99b2d8b?auto=format&fit=crop&w=800&q=80",
    link: "https://www.youtube.com/watch?v=-p0PA9Zt8zk",
    steps: ["Arm Circles (30s)", "Torso Twists (30s)", "Leg Swings (1m)", "Jumping Jacks (30s)"]
  },
  {
    title: "Upper Body Mobility",
    duration: "4 Mins",
    focus: "Shoulders & Chest",
    image: "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80",
    link: "https://www.youtube.com/watch?v=N48d8a8q6V4", 
    steps: ["Band Pull Aparts (1m)", "Shoulder Dislocations (1m)", "Dead Hangs (30s)"]
  },
  {
    title: "Lower Body Activation",
    duration: "6 Mins",
    focus: "Hips & Glutes",
    image: "https://images.unsplash.com/photo-1434608519344-49d77a699ded?auto=format&fit=crop&w=800&q=80",
    link: "https://www.youtube.com/watch?v=l41So05e7hA",
    steps: ["World's Greatest Stretch (2m)", "Glute Bridges (1m)", "Bodyweight Squats (1m)"]
  }
];

const RANDOM_COVERS = ["https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&w=800&q=80", "https://images.unsplash.com/photo-1599058945522-28d584b6f0ff?auto=format&fit=crop&w=800&q=80"];

export default function Programs() {
  const [programs, setPrograms] = useState([]);
  const [isCreating, setIsCreating] = useState(false);
  const [view, setView] = useState('routines'); // 'routines' | 'warmups'
  
  // Form State
  const [name, setName] = useState('');
  const [difficulty, setDifficulty] = useState('Intermediate');
  const [exercises, setExercises] = useState('');
  const [templateImage, setTemplateImage] = useState(''); 

  useEffect(() => {
    const saved = localStorage.getItem('myPrograms');
    if (saved) setPrograms(JSON.parse(saved));
  }, []);

  const applyTemplate = (key) => {
    const template = WORKOUT_TEMPLATES[key];
    setName(template.focus);
    setExercises(template.exercises);
    setDifficulty('Advanced'); 
    setTemplateImage(template.image);
  };

  const saveProgram = () => {
    if(!name || !exercises) return alert("Please fill in Name and Exercises");
    const newProgram = { 
      id: Date.now(), name, difficulty, exercises: exercises.split(',').map(e => e.trim()),
      image: templateImage || RANDOM_COVERS[name.length % RANDOM_COVERS.length]
    };
    const updated = [...programs, newProgram];
    setPrograms(updated);
    localStorage.setItem('myPrograms', JSON.stringify(updated));
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
      
      {/* HEADER & TABS */}
      <div className="flex flex-col md:flex-row justify-between items-end gap-4 border-b border-zinc-800 pb-4">
        <div>
          <h2 className="text-3xl font-black italic text-white uppercase tracking-tighter">Training Center</h2>
          <p className="text-zinc-400">Manage your split & prep</p>
        </div>

        <div className="flex bg-zinc-900 p-1 rounded-lg border border-zinc-800">
          <button 
            onClick={() => setView('routines')} 
            className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition ${view === 'routines' ? 'bg-zinc-800 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
          >
            My Routines
          </button>
          <button 
            onClick={() => setView('warmups')} 
            className={`px-4 py-2 rounded-md text-sm font-bold uppercase transition ${view === 'warmups' ? 'bg-red-600 text-white shadow' : 'text-zinc-500 hover:text-white'}`}
          >
            Warm-Ups
          </button>
        </div>
      </div>

      {/* --- VIEW: ROUTINES --- */}
      {view === 'routines' && (
        <>
          <div className="flex justify-end">
            <button 
              onClick={() => setIsCreating(!isCreating)}
              className={`px-5 py-2.5 rounded-lg font-bold flex items-center gap-2 transition ${
                isCreating ? 'bg-zinc-700 text-white hover:bg-zinc-600' : 'bg-white text-black hover:bg-gray-200'
              }`}
            >
              {isCreating ? 'Cancel' : <><Plus size={20} /> Create Routine</>}
            </button>
          </div>

          {/* CREATION FORM */}
          {isCreating && (
            <div className="bg-zinc-900 p-6 rounded-2xl border border-zinc-800 shadow-2xl mb-8">
              <div className="flex items-center gap-2 mb-4"><Zap className="text-red-500" size={20} /><h3 className="text-xl font-bold text-white">Quick Templates</h3></div>
              <div className="flex flex-wrap gap-2 mb-6">
                {Object.keys(WORKOUT_TEMPLATES).map(key => (
                  <button key={key} onClick={() => applyTemplate(key)} className="px-3 py-1.5 rounded bg-zinc-800 hover:bg-red-600 border border-zinc-700 text-zinc-300 hover:text-white text-xs font-bold uppercase transition">
                    {key}
                  </button>
                ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
                <input className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-red-600 outline-none" placeholder="Routine Name" value={name} onChange={e => setName(e.target.value)} />
                <select className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white focus:border-red-600 outline-none" value={difficulty} onChange={e => setDifficulty(e.target.value)}>
                  <option>Beginner</option><option>Intermediate</option><option>Advanced</option>
                </select>
              </div>
              <textarea className="w-full bg-black border border-zinc-700 p-3 rounded-lg text-white h-24 mb-4 focus:border-red-600 outline-none" placeholder="Exercises..." value={exercises} onChange={e => setExercises(e.target.value)} />
              <button onClick={saveProgram} className="w-full bg-green-600 hover:bg-green-700 text-white py-3 rounded-lg font-bold uppercase">Save Routine</button>
            </div>
          )}

          {/* ROUTINE CARDS */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {programs.length === 0 && !isCreating && (
              <div className="col-span-full text-center py-20 bg-zinc-900/50 rounded-2xl border-2 border-dashed border-zinc-800">
                <p className="text-zinc-500 text-lg">No routines found.</p>
              </div>
            )}
            {programs.map(p => (
              <div key={p.id} className="group bg-zinc-900 rounded-2xl overflow-hidden border border-zinc-800 hover:border-red-600 transition shadow-lg relative">
                <div className="h-40 overflow-hidden relative">
                  <img src={p.image} alt={p.name} className="w-full h-full object-cover group-hover:scale-105 transition duration-500" onError={(e)=>{e.target.src=RANDOM_COVERS[0]}} />
                  <div className="absolute top-3 left-3"><span className="px-3 py-1 rounded-full text-xs font-bold uppercase bg-black/60 text-white backdrop-blur-sm">{p.difficulty}</span></div>
                  <button onClick={() => deleteProgram(p.id)} className="absolute top-3 right-3 bg-black/50 p-2 rounded-full text-white hover:bg-red-600 transition"><Trash2 size={16} /></button>
                </div>
                <div className="p-5">
                  <h3 className="text-xl font-bold text-white mb-4 italic">{p.name}</h3>
                  <div className="flex flex-wrap gap-2">
                    {p.exercises.slice(0, 3).map((ex, i) => <span key={i} className="text-xs bg-zinc-800 text-zinc-300 px-2 py-1 rounded border border-zinc-700">{ex}</span>)}
                    {p.exercises.length > 3 && <span className="text-xs text-zinc-500 px-2 py-1">+{p.exercises.length - 3}</span>}
                  </div>
                </div>
              </div>
            ))}
          </div>
        </>
      )}

      {/* --- VIEW: WARMUPS --- */}
      {view === 'warmups' && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {WARMUPS.map((warmup, i) => (
            <div key={i} className="bg-zinc-900 rounded-2xl border border-zinc-800 overflow-hidden shadow-lg group hover:border-red-600 transition-all">
              <div className="h-48 overflow-hidden relative">
                <div className="absolute inset-0 bg-black/30 z-10 group-hover:bg-black/10 transition"></div>
                <img src={warmup.image} alt={warmup.title} className="w-full h-full object-cover group-hover:scale-110 transition duration-700" />
                <a href={warmup.link} target="_blank" rel="noopener noreferrer" className="absolute inset-0 flex items-center justify-center z-20 opacity-0 group-hover:opacity-100 transition duration-300">
                  <div className="bg-red-600 text-white p-3 rounded-full shadow-xl transform scale-75 group-hover:scale-100 transition">
                    <PlayCircle size={32} fill="white" className="text-red-600" />
                  </div>
                </a>
              </div>
              <div className="p-6">
                <div className="flex justify-between items-start mb-2">
                  <span className="text-xs font-bold text-red-500 uppercase tracking-wider">{warmup.focus}</span>
                  <div className="flex items-center gap-1 text-zinc-500 text-xs"><Timer size={12} /> {warmup.duration}</div>
                </div>
                <h3 className="text-xl font-bold text-white mb-4">{warmup.title}</h3>
                <div className="space-y-2 mb-6">
                  {warmup.steps.map((step, idx) => (
                    <div key={idx} className="flex items-center gap-2 text-sm text-zinc-400">
                      <div className="w-1.5 h-1.5 rounded-full bg-red-600"></div>
                      {step}
                    </div>
                  ))}
                </div>
                <a href={warmup.link} target="_blank" rel="noopener noreferrer" className="block w-full text-center bg-white text-black hover:bg-gray-200 py-3 rounded-lg text-sm font-bold uppercase transition">
                  Watch Video Guide
                </a>
              </div>
            </div>
          ))}
        </div>
      )}

    </div>
  );
}