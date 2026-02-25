import { Home, Link2, Package, AlertTriangle, LogOut } from 'lucide-react'; // Importamos LogOut
import { Link, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext'; // Importamos el hook de auth

const Sidebar = () => {
  const location = useLocation();
  const { logout } = useAuth(); // Extraemos la función logout
  
  const menuItems = [
    { name: 'Dashboard', icon: Home, path: '/' },
    { name: 'Conectar Cuentas', icon: Link2, path: '/cuentas' },
    { name: 'Órdenes', icon: Package, path: '/ordenes' },
    { name: 'Errores', icon: AlertTriangle, path: '/errores' },
  ];

  return (
    <div className="h-screen w-64 bg-slate-900 text-white flex flex-col">
      <div className="p-6 text-2xl font-bold border-b border-slate-800 tracking-tight text-blue-400">
        ML-Andreani
      </div>
      
      <nav className="flex-1 p-4 space-y-2">
        {menuItems.map((item) => (
          <Link
            key={item.name}
            to={item.path}
            className={`flex items-center space-x-3 p-3 rounded-lg transition-colors ${
              location.pathname === item.path ? 'bg-blue-600 shadow-lg shadow-blue-900/20' : 'hover:bg-slate-800 text-slate-400 hover:text-white'
            }`}
          >
            <item.icon size={20} />
            <span>{item.name}</span>
          </Link>
        ))}
      </nav>

      {/* BOTÓN DE LOGOUT AL FINAL */}
      <div className="p-4 border-t border-slate-800">
        <button 
          onClick={logout}
          className="flex items-center space-x-3 p-3 rounded-lg hover:bg-red-900/20 text-red-400 hover:text-red-300 transition-colors w-full"
        >
          <LogOut size={20} />
          <span>Cerrar Sesión</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;