import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { AlertTriangle, Clock, Terminal, Trash2 } from 'lucide-react';

const Errores = () => {
  const [errores, setErrores] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchErrores = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/errors');
      setErrores(response.data);
    } catch (error) {
      console.error("Error cargando logs", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchErrores();
  }, []);

  if (loading) return <div className="p-10 text-center text-slate-500">Cargando bitácora de errores...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <AlertTriangle className="text-red-500" /> Registro de Incidentes
        </h1>
        <p className="text-slate-500">Errores detectados durante la sincronización con Andreani.</p>
      </header>

      <div className="space-y-4">
        {errores.length === 0 ? (
          <div className="bg-white p-12 text-center rounded-xl border border-slate-200">
            <p className="text-slate-400">No se han registrado errores. ¡Todo funciona bien! ✅</p>
          </div>
        ) : (
          errores.map((error) => (
            <div key={error.id} className="bg-white rounded-xl border border-slate-200 overflow-hidden shadow-sm hover:border-red-200 transition-colors">
              <div className="p-4 flex items-start gap-4">
                <div className="p-2 bg-red-50 text-red-600 rounded-lg">
                  <AlertTriangle size={20} />
                </div>
                
                <div className="flex-1">
                  <div className="flex justify-between items-start">
                    <h3 className="font-bold text-slate-800">{error.error_mensaje}</h3>
                    <span className="flex items-center gap-1 text-xs text-slate-400 font-medium bg-slate-50 px-2 py-1 rounded">
                      <Clock size={12} />
                      {new Date(error.createdAt).toLocaleString()}
                    </span>
                  </div>
                  
                  {/* Visualizador de JSON (Payload) */}
                  <div className="mt-4 bg-slate-900 rounded-lg p-4 relative group">
                    <div className="flex items-center gap-2 text-slate-500 mb-2 text-xs font-mono uppercase tracking-widest">
                      <Terminal size={14} /> Datos recibidos (Payload)
                    </div>
                    <pre className="text-blue-300 text-xs font-mono overflow-x-auto whitespace-pre-wrap">
                      {JSON.stringify(JSON.parse(error.payload_recibido || '{}'), null, 2)}
                    </pre>
                  </div>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default Errores;