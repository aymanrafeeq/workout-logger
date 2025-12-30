import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import History from './pages/History';
import Logger from './pages/Logger';
import Login from './pages/Login';
import Register from './pages/Register';
import WhatsAppFloat from './components/WhatsAppFloat';
import Nutrition from './pages/Nutrition';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="container mx-auto p-4 md:p-6">{children}</div>
    <WhatsAppFloat />
  </>
);

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        
        <Route path="/" element={<PrivateRoute><Layout><Dashboard /></Layout></PrivateRoute>} />
        <Route path="/programs" element={<PrivateRoute><Layout><Programs /></Layout></PrivateRoute>} />
        <Route path="/history" element={<PrivateRoute><Layout><History /></Layout></PrivateRoute>} />
        <Route path="/nutrition" element={<PrivateRoute><Layout><Nutrition /></Layout></PrivateRoute>} />
        <Route path="/log" element={<PrivateRoute><Layout><Logger /></Layout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}