import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Navbar from './Navbar';
import Dashboard from './pages/Dashboard';
import Programs from './pages/Programs';
import Logger from './pages/Logger';
import Login from './pages/Login';
import Register from './pages/Register';

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem('token');
  return token ? children : <Navigate to="/login" />;
};

const Layout = ({ children }) => (
  <>
    <Navbar />
    <div className="container mx-auto p-4 md:p-6">{children}</div>
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
        <Route path="/log" element={<PrivateRoute><Layout><Logger /></Layout></PrivateRoute>} />
      </Routes>
    </BrowserRouter>
  );
}