import React, { useEffect, useState } from 'react';
import { Link2, CheckCircle, PlusCircle, RefreshCw } from 'lucide-react';
import api from '../api/axios'; // Importamos el config de Axios que creamos

const Cuentas = () => {
  const [cuentasDB, setCuentasDB] = useState([]);
  const [loading, setLoading] = useState(true);

  // Función para traer las cuentas desde el Backend
  const fetchCuentas = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/accounts');
      setCuentasDB(response.data);
    } catch (error) {
      console.error("Error cargando cuentas", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCuentas();
  }, []);

  // Lógica para armar los 5 slots
  const slots = Array.from({ length: 5 }, (_, i) => {
    const cuentaEncontrada = cuentasDB[i]; // Vemos si hay algo en la posición i
    return cuentaEncontrada 
      ? { ...cuentaEncontrada, conectada: true } 
      : { id: `empty-${i}`, nombre: 'Disponible', conectada: false };
  });

  const handleConnect = (index) => {
    const nombreSugerido = `Tienda_${index + 1}`;
    window.location.href = `http://localhost:3000/auth/ml/connect?nombre=${nombreSugerido}`;
  };

  if (loading) return <div className="flex justify-center p-20"><RefreshCw className="animate-spin text-blue-600" size={48} /></div>;

  return (
    <div className="max-w-6xl mx-auto p-6">
      <header className="mb-10 flex justify-between items-end">
        <div>
          <h1 className="text-3xl font-bold text-slate-800">Conexiones Mercado Libre</h1>
          <p className="text-slate-500">Estado de tus 5 slots de integración.</p>
        </div>
        <div className="text-sm font-medium text-blue-600 bg-blue-50 px-3 py-1 rounded-md">
          {cuentasDB.length} / 5 Cuentas Activas
        </div>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {slots.map((slot, index) => (
          <div key={slot.id} className={`bg-white rounded-2xl p-8 border-2 transition-all ${slot.conectada ? 'border-green-100 shadow-md' : 'border-dashed border-slate-200 opacity-80'}`}>
            <div className="flex justify-between items-start mb-6">
              <div className={`p-4 rounded-xl ${slot.conectada ? 'bg-green-50 text-green-600' : 'bg-slate-50 text-slate-400'}`}>
                <Link2 size={28} />
              </div>
              {slot.conectada && <CheckCircle className="text-green-500" size={24} />}
            </div>
            
            <h3 className="text-xl font-bold text-slate-700 mb-1">
              {slot.conectada ? slot.nombre_tienda : `Slot #${index + 1}`}
            </h3>
            <p className="text-slate-400 text-sm mb-8">
              {slot.conectada ? `ID ML: ${slot.ml_user_id}` : 'Sin vinculación'}
            </p>

            {!slot.conectada ? (
              <button 
                onClick={() => handleConnect(index)}
                className="w-full py-3 bg-slate-800 hover:bg-black text-white rounded-xl font-semibold flex items-center justify-center space-x-2 transition-all"
              >
                <PlusCircle size={20} />
                <span>Vincular Tienda</span>
              </button>
            ) : (
              <button className="w-full py-3 border border-slate-200 text-slate-400 rounded-xl font-semibold cursor-default">
                Cuenta Activa
              </button>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default Cuentas;