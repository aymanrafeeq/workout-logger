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
      alert(err.response?.data?.error || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <div className="flex justify-center text-blue-500 mb-6"><Dumbbell size={48} /></div>
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Welcome Back</h2>
        
        <form onSubmit={handleLogin} className="space-y-4">
          <input className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white focus:border-blue-500 outline-none transition" 
            placeholder="Email" onChange={e => setEmail(e.target.value)} />
          <input type="password" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white focus:border-blue-500 outline-none transition" 
            placeholder="Password" onChange={e => setPass(e.target.value)} />
          <button disabled={loading} className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition disabled:opacity-50">
            {loading ? 'Signing In...' : 'Sign In'}
          </button>
        </form>
        
        <p className="mt-6 text-center text-gray-400 text-sm">
          No account? <Link to="/register" className="text-blue-400 hover:underline">Register</Link>
        </p>
      </div>
    </div>
  );
}