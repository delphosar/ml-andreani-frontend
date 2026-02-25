import { Routes, Route, Navigate } from 'react-router-dom'; // Importar Navigate
import { useAuth } from './context/AuthContext'; // Importar useAuth
import Sidebar from './components/Sidebar';
import Cuentas from './pages/Cuentas';
import Ordenes from './pages/Ordenes';
import Errores from './pages/Errores';
import Dashboard from './pages/Dashboard';
import Login from './pages/Login';

const PrivateLayout = ({ children }) => {
  const { token } = useAuth();
  
  if (!token) return <Navigate to="/login" />;

  return (
    <div className="flex bg-slate-100 min-h-screen">
      <Sidebar />
      <main className="flex-1 p-8 overflow-y-auto">
        {children}
      </main>
    </div>
  );
};

function App() {
  return (
    // No hace falta el <Router> aquí si ya lo pusiste en main.jsx
    <Routes>
      <Route path="/login" element={<Login />} />
      
      <Route path="/" element={<PrivateLayout><Dashboard /></PrivateLayout>} />
      <Route path="/cuentas" element={<PrivateLayout><Cuentas /></PrivateLayout>} />
      <Route path="/ordenes" element={<PrivateLayout><Ordenes /></PrivateLayout>} />
      <Route path="/errores" element={<PrivateLayout><Errores /></PrivateLayout>} />
      
      <Route path="*" element={<Navigate to="/" />} />
    </Routes>
  );
}

export default App;