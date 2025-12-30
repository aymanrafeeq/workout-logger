import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';
import { Dumbbell } from 'lucide-react';

export default function Login() {
  const [email, setEmail] = useState('');
  const [pass, setPass] = useState('');
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await api.post('/auth/login', { email, password: pass });
      localStorage.setItem('token', res.data.token);
      navigate('/');
    } catch (err) {
      alert('Invalid Credentials');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-black">
      {/* LEFT SIDE: Gym Image */}
      <div className="hidden lg:block w-1/2 relative overflow-hidden">
        <div className="absolute inset-0 bg-red-900/20 mix-blend-multiply z-10"></div>
        <img 
          src="https://images.unsplash.com/photo-1534438327276-14e5300c3a48?auto=format&fit=crop&q=80" 
          alt="Gym Background" 
          className="w-full h-full object-cover grayscale hover:grayscale-0 transition duration-700"
        />
        <div className="absolute bottom-10 left-10 z-20">
          <h1 className="text-5xl font-black text-white italic tracking-tighter">NO PAIN<br/>NO GAIN</h1>
          <p className="text-red-500 font-bold mt-2">JOIN THE ELITE</p>
        </div>
      </div>

      {/* RIGHT SIDE: Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-zinc-950">
        <div className="max-w-md w-full space-y-8 animate-fade-in">
          <div className="text-center">
            <div className="flex justify-center mb-4">
              <div className="p-3 bg-red-600 rounded-full shadow-lg shadow-red-600/20">
                <Dumbbell size={32} className="text-white" />
              </div>
            </div>
            <h2 className="text-3xl font-bold text-white tracking-tight">Welcome Back</h2>
            <p className="text-zinc-400 mt-2">Enter the zone.</p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="text-sm font-medium text-zinc-300">Email Address</label>
              <input 
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 focus:border-red-600 p-3 rounded-lg text-white outline-none transition-all" 
                placeholder="you@fitjourney.com" 
                onChange={e => setEmail(e.target.value)}
              />
            </div>
            <div>
              <label className="text-sm font-medium text-zinc-300">Password</label>
              <input 
                type="password"
                className="w-full mt-1 bg-zinc-900 border border-zinc-800 focus:border-red-600 p-3 rounded-lg text-white outline-none transition-all" 
                placeholder="••••••••" 
                onChange={e => setPass(e.target.value)}
              />
            </div>
            
            <button disabled={loading} className="w-full bg-red-600 hover:bg-red-700 text-white py-4 rounded-lg font-bold tracking-wide shadow-lg shadow-red-900/20 transition-all transform hover:scale-[1.02] disabled:opacity-50">
              {loading ? 'AUTHENTICATING...' : 'ENTER GYM'}
            </button>
          </form>

          <p className="text-center text-zinc-500 text-sm">
            Not a member? <Link to="/register" className="text-red-500 hover:text-red-400 font-bold hover:underline">Join Now</Link>
          </p>
        </div>
      </div>
    </div>
  );
}