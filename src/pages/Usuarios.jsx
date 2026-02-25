import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import { Users, UserPlus, Trash2, ShieldCheck, Shield } from 'lucide-react';
import Swal from 'sweetalert2';

const Usuarios = () => {
  const [usuarios, setUsuarios] = useState([]);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ email: '', password: '', role: 'admin' });
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState(null);

  const fetchUsuarios = async () => {
    try {
      setLoading(true);
      const res = await api.get('/api/users');
      setUsuarios(res.data);
    } catch (err) {
      console.error('Error cargando usuarios', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUsuarios();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSubmitting(true);
    try {
      await api.post('/api/users', form);
      setForm({ email: '', password: '', role: 'admin' });
      await fetchUsuarios();
    } catch (err) {
      setError(err.response?.data?.error || 'Error al crear usuario');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: '¿Eliminar usuario?',
      text: '¿Seguro que querés eliminar este usuario?',
      icon: 'warning',
      showCancelButton: true,
      confirmButtonColor: '#ef4444',
      cancelButtonColor: '#94a3b8',
      confirmButtonText: 'Sí, eliminar',
      cancelButtonText: 'Cancelar',
    });
    if (!result.isConfirmed) return;
    try {
      await api.delete(`/api/users/${id}`);
      await fetchUsuarios();
    } catch (err) {
      Swal.fire({
        icon: 'error',
        title: 'Error',
        text: err.response?.data?.error || 'Error al eliminar usuario',
        confirmButtonColor: '#3b82f6',
      });
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8">
        <h1 className="text-2xl font-bold text-slate-800 flex items-center gap-2">
          <Users className="text-blue-500" /> Gestión de Usuarios
        </h1>
        <p className="text-slate-500">Administrá los usuarios con acceso al dashboard.</p>
      </header>

      {/* Formulario de creación */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm p-6 mb-8">
        <h2 className="text-lg font-semibold text-slate-700 flex items-center gap-2 mb-4">
          <UserPlus size={20} className="text-blue-500" /> Nuevo usuario
        </h2>
        <form onSubmit={handleSubmit} className="flex flex-col sm:flex-row gap-3">
          <input
            type="email"
            placeholder="Email"
            required
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <input
            type="password"
            placeholder="Contraseña"
            required
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            className="flex-1 border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          />
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
            className="border border-slate-200 rounded-lg px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
          >
            <option value="admin">admin</option>
            <option value="super_admin">super_admin</option>
          </select>
          <button
            type="submit"
            disabled={submitting}
            className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2 rounded-lg text-sm font-medium transition-colors disabled:opacity-50"
          >
            {submitting ? 'Creando...' : 'Crear'}
          </button>
        </form>
        {error && <p className="text-red-500 text-sm mt-2">{error}</p>}
      </div>

      {/* Tabla de usuarios */}
      <div className="bg-white rounded-xl border border-slate-200 shadow-sm overflow-hidden">
        {loading ? (
          <p className="p-8 text-center text-slate-500">Cargando usuarios...</p>
        ) : usuarios.length === 0 ? (
          <p className="p-8 text-center text-slate-400">No hay usuarios registrados.</p>
        ) : (
          <table className="w-full text-sm">
            <thead>
              <tr className="bg-slate-50 border-b border-slate-200">
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Email</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Rol</th>
                <th className="text-left px-6 py-3 text-slate-500 font-medium">Creado</th>
                <th className="px-6 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {usuarios.map((u) => (
                <tr key={u.id} className="hover:bg-slate-50 transition-colors">
                  <td className="px-6 py-4 text-slate-700 font-medium">{u.email}</td>
                  <td className="px-6 py-4">
                    {u.role === 'super_admin' ? (
                      <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 px-2 py-1 rounded text-xs font-medium">
                        <ShieldCheck size={12} /> super_admin
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1 bg-slate-100 text-slate-600 px-2 py-1 rounded text-xs font-medium">
                        <Shield size={12} /> admin
                      </span>
                    )}
                  </td>
                  <td className="px-6 py-4 text-slate-400">{new Date(u.createdAt).toLocaleDateString()}</td>
                  <td className="px-6 py-4 text-right">
                    <button
                      onClick={() => handleDelete(u.id)}
                      className="p-2 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                      title="Eliminar usuario"
                    >
                      <Trash2 size={16} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
};

export default Usuarios;
