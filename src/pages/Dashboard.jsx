import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, Tag, AlertCircle, ArrowRight, CheckCircle2 } from 'lucide-react';
import { Link } from 'react-router-dom';

const Dashboard = () => {
  const [stats, setStats] = useState({ cuentasActivas: 0, etiquetasHoy: 0, erroresRecientes: 0 });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const response = await api.get('/api/stats');
        setStats(response.data);
      } catch (error) {
        console.error("Error al cargar stats", error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  const cards = [
    {
      title: 'Cuentas Conectadas',
      value: `${stats.cuentasActivas} / 5`,
      icon: Users,
      color: 'text-blue-600',
      bg: 'bg-blue-50',
      link: '/cuentas'
    },
    {
      title: 'Etiquetas Generadas (Hoy)',
      value: stats.etiquetasHoy,
      icon: Tag,
      color: 'text-green-600',
      bg: 'bg-green-50',
      link: '/ordenes'
    },
    {
      title: 'Errores (Últimas 24hs)',
      value: stats.erroresRecientes,
      icon: AlertCircle,
      color: stats.erroresRecientes > 0 ? 'text-red-600' : 'text-slate-400',
      bg: stats.erroresRecientes > 0 ? 'bg-red-50' : 'bg-slate-50',
      link: '/errores'
    }
  ];

  if (loading) return <div className="p-10 text-slate-500">Cargando resumen...</div>;

  return (
    <div className="max-w-6xl mx-auto">
      <header className="mb-10">
        <h1 className="text-3xl font-bold text-slate-800">Bienvenido al Panel de Control</h1>
        <p className="text-slate-500">Estado general de tu integración Mercado Libre - Andreani.</p>
      </header>

      {/* TARJETAS DE ESTADÍSTICAS */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-12">
        {cards.map((card, idx) => (
          <Link key={idx} to={card.link} className="bg-white p-6 rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow group">
            <div className="flex justify-between items-start mb-4">
              <div className={`p-3 rounded-xl ${card.bg} ${card.color}`}>
                <card.icon size={24} />
              </div>
              <ArrowRight className="text-slate-300 group-hover:text-slate-500 transition-colors" size={20} />
            </div>
            <h3 className="text-slate-500 font-medium">{card.title}</h3>
            <p className={`text-3xl font-bold mt-1 ${card.color}`}>{card.value}</p>
          </Link>
        ))}
      </div>

      {/* SECCIÓN DE ESTADO DEL SISTEMA */}
      <div className="bg-white rounded-2xl border border-slate-200 p-8 flex flex-col md:flex-row items-center gap-8">
        <div className="flex-1 text-center md:text-left">
          <h2 className="text-xl font-bold text-slate-800 mb-2 flex items-center justify-center md:justify-start gap-2">
            <CheckCircle2 className="text-green-500" /> Sistema Operativo
          </h2>
          <p className="text-slate-500">
            El servidor está escuchando Webhooks de Mercado Libre en tiempo real. 
            Las etiquetas se procesan automáticamente cuando el envío es "Acordar con el vendedor".
          </p>
        </div>
        <div className="flex gap-4">
           <span className="flex items-center gap-2 text-sm font-bold text-green-600 bg-green-50 px-4 py-2 rounded-full border border-green-100">
             <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse" />
             Backend Online
           </span>
           <span className="flex items-center gap-2 text-sm font-bold text-blue-600 bg-blue-50 px-4 py-2 rounded-full border border-blue-100">
             V 1.0.0
           </span>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;