import { useState } from 'react';
import api from '../api';
import { useNavigate, Link } from 'react-router-dom';

export default function Register() {
  const [form, setForm] = useState({ name: '', email: '', password: '' });
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      await api.post('/auth/register', form);
      navigate('/login');
    } catch (err) {
      alert('Registration failed');
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-900 p-4">
      <div className="bg-gray-800 p-8 rounded-2xl shadow-2xl w-full max-w-md border border-gray-700">
        <h2 className="text-2xl font-bold mb-6 text-center text-white">Create Account</h2>
        <form onSubmit={handleRegister} className="space-y-4">
          <input className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white" 
            placeholder="Full Name" onChange={e => setForm({...form, name: e.target.value})} />
          <input className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white" 
            placeholder="Email" onChange={e => setForm({...form, email: e.target.value})} />
          <input type="password" className="w-full bg-gray-900 border border-gray-600 p-3 rounded-lg text-white" 
            placeholder="Password" onChange={e => setForm({...form, password: e.target.value})} />
          <button className="w-full bg-blue-600 hover:bg-blue-700 py-3 rounded-lg font-bold transition">Register</button>
        </form>
        <p className="mt-6 text-center text-gray-400 text-sm">
          Already have an account? <Link to="/login" className="text-blue-400 hover:underline">Login</Link>
        </p>
      </div>
    </div>
  );
}