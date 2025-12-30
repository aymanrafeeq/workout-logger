import { Link, useNavigate } from 'react-router-dom';
import { Dumbbell, LogOut, LayoutDashboard, Calendar, PlusCircle, Clock, Utensils } from 'lucide-react';

export default function Navbar() {
  const navigate = useNavigate();

  const logout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-zinc-950 border-b border-zinc-800 px-6 py-4 flex justify-between items-center sticky top-0 z-50 shadow-lg shadow-black/50">
      <Link to="/" className="flex items-center gap-2 text-red-500 font-black text-2xl italic tracking-tighter hover:text-red-400">
        <Dumbbell strokeWidth={3} /> FITJOURNEY
      </Link>

      <div className="flex items-center gap-6">
        <Link to="/" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">
          <LayoutDashboard size={18} /> <span className="hidden md:inline">Dashboard</span>
        </Link>
        <Link to="/programs" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">
          <Calendar size={18} /> <span className="hidden md:inline">Programs</span>
        </Link>
        <Link to="/history" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">
          <Clock size={18} /> <span className="hidden md:inline">History</span>
        </Link>
        <Link to="/nutrition" className="flex items-center gap-2 text-zinc-400 hover:text-white text-sm font-bold uppercase tracking-wide transition">
          <Utensils size={18} /> <span className="hidden md:inline">Nutrition</span>
        </Link>
        <Link to="/log" className="flex items-center gap-2 bg-red-600 hover:bg-red-700 text-white px-5 py-2 rounded-full text-sm font-bold transition-all shadow-lg shadow-red-900/30">
          <PlusCircle size={18} /> <span className="hidden md:inline">Log Workout</span>
        </Link>
        <button onClick={logout} className="text-zinc-600 hover:text-red-500 transition-colors">
          <LogOut size={20} />
        </button>
      </div>
    </nav>
  );
}