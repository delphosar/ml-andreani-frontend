import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Package, Truck, Search, Filter, RefreshCw } from 'lucide-react';

const Ordenes = () => {
  const [ordenes, setOrdenes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [filterTienda, setFilterTienda] = useState('todas');

  const fetchOrdenes = async () => {
    try {
      setLoading(true);
      const response = await api.get('/api/orders');
      setOrdenes(response.data);
    } catch (error) {
      console.error("Error al traer órdenes", error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrdenes();
  }, []);

  // Obtener lista única de nombres de tiendas para el filtro
  const tiendasDisponibles = [...new Set(ordenes.map(o => o.TiendaML?.nombre_tienda))].filter(Boolean);

  // Lógica de Filtrado Combinado
  const ordenesFiltradas = ordenes.filter(orden => {
    const matchesSearch = 
      orden.cliente_nombre.toLowerCase().includes(searchTerm.toLowerCase()) ||
      orden.ml_order_id.toString().includes(searchTerm);
    
    const matchesTienda = 
      filterTienda === 'todas' || 
      orden.TiendaML?.nombre_tienda === filterTienda;

    return matchesSearch && matchesTienda;
  });

  const getStatusBadge = (status) => {
    const styles = {
      pendiente: 'bg-yellow-100 text-yellow-700 border-yellow-200',
      etiquetado: 'bg-blue-100 text-blue-700 border-blue-200',
      error: 'bg-red-100 text-red-700 border-red-200',
    };
    return styles[status] || 'bg-slate-100 text-slate-700';
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center p-20 text-slate-500">
      <RefreshCw className="animate-spin mb-4" size={32} />
      <span>Cargando historial de ventas...</span>
    </div>
  );

  return (
    <div className="max-w-6xl mx-auto p-4">
      <div className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2 mb-6">
          <Package className="text-blue-600" /> Monitor de Envíos
        </h1>

        {/* BARRA DE FILTROS */}
        <div className="flex flex-col md:flex-row gap-4 bg-white p-4 rounded-xl shadow-sm border border-slate-200">
          <div className="flex-1 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text"
              placeholder="Buscar por cliente o ID de orden..."
              className="w-full pl-10 pr-4 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          
          <div className="flex items-center gap-2">
            <Filter size={18} className="text-slate-400" />
            <select 
              className="border border-slate-200 rounded-lg px-4 py-2 bg-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              value={filterTienda}
              onChange={(e) => setFilterTienda(e.target.value)}
            >
              <option value="todas">Todas las cuentas</option>
              {tiendasDisponibles.map(tienda => (
                <option key={tienda} value={tienda}>{tienda}</option>
              ))}
            </select>
          </div>

          <button 
            onClick={fetchOrdenes}
            className="p-2 text-slate-500 hover:bg-slate-100 rounded-lg transition-colors"
            title="Refrescar datos"
          >
            <RefreshCw size={20} />
          </button>
        </div>
      </div>

      {/* TABLA */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Orden ML</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tienda</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Cliente</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase">Tracking Andreani</th>
                <th className="p-4 text-xs font-semibold text-slate-500 uppercase text-center">Estado</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {ordenesFiltradas.length === 0 ? (
                <tr>
                  <td colSpan="5" className="p-20 text-center text-slate-400">
                    No se encontraron órdenes que coincidan con la búsqueda.
                  </td>
                </tr>
              ) : (
                ordenesFiltradas.map((orden) => (
                  <tr key={orden.id} className="hover:bg-slate-50/50 transition-colors">
                    <td className="p-4 font-mono text-sm text-blue-600 font-bold">#{orden.ml_order_id}</td>
                    <td className="p-4">
                      <span className="bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium border border-slate-200">
                        {orden.TiendaML?.nombre_tienda || 'Sin cuenta'}
                      </span>
                    </td>
                    <td className="p-4 text-slate-700 font-medium">{orden.cliente_nombre}</td>
                    <td className="p-4">
                      {orden.andreani_tracking ? (
                        <span className="flex items-center gap-1 text-slate-600">
                          <Truck size={14} className="text-blue-500" /> {orden.andreani_tracking}
                        </span>
                      ) : (
                        <span className="text-slate-300 italic">No generado</span>
                      )}
                    </td>
                    <td className="p-4 text-center">
                      <span className={`px-3 py-1 rounded-full text-[10px] font-black border tracking-wider ${getStatusBadge(orden.status_proceso)}`}>
                        {orden.status_proceso.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default Ordenes;