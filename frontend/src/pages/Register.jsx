import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    if (loading) return;
    setLoading(true);
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      const msg = err.response?.data?.error || 'Registration failed';
      alert(msg);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div className="min-h-screen flex bg-black">
      {/* LEFT SIDE: Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-black/40 z-10"></div>
        <img
          src="https://images.unsplash.com/photo-1517836357463-d25dfeac3438?auto=format&fit=crop&q=80"
          alt="Gym Background"
          className="w-full h-full object-cover"
        />
        <div className="absolute bottom-10 left-10 z-20">
          <h1 className="text-5xl font-black text-white italic tracking-tighter">BUILD<br />YOUR LEGACY</h1>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <h2 className="text-4xl font-black text-white italic uppercase">Join the Squad</h2>
            <p className="text-zinc-400 mt-2">Start your journey today.</p>
          </div>

          <form onSubmit={handleRegister} className="space-y-4">
            <input
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 p-4 rounded-lg text-white outline-none"
              placeholder="Full Name"
              onChange={e => setForm({ ...form, name: e.target.value })}
            />
            <input
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 p-4 rounded-lg text-white outline-none"
              placeholder="Email Address"
              onChange={e => setForm({ ...form, email: e.target.value })}
            />
            <input
              type="password"
              className="w-full bg-zinc-900 border border-zinc-800 focus:border-red-600 p-4 rounded-lg text-white outline-none"
              placeholder="Create Password"
              onChange={e => setForm({ ...form, password: e.target.value })}
            />
            <button
              type="submit"
              disabled={loading}
              className={`w-full py-4 rounded-lg font-black tracking-wide uppercase transition-all flex items-center justify-center gap-2
    ${loading
                  ? 'bg-zinc-700 text-zinc-400 cursor-not-allowed' // Style when loading
                  : 'bg-white text-black hover:bg-gray-200'       // Style when active
                }`}
            >
              {loading ? (
                <>
                  <Loader2 className="animate-spin" size={20} />
                  Creating Account...
                </>
              ) : (
                'Create Account'
              )}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm">
            Already have an account? <Link to="/login" className="text-red-500 font-bold hover:underline">Login</Link>
          </p>
        </div>
      </div>
    </div>
  );
}