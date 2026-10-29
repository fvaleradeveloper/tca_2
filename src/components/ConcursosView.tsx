import React, { useState } from 'react';
import { Concurso, EscalaConcurso } from '../types';
import { CONCURSOS } from '../data/concursosData';
import { PRODUCTOS } from '../data/productosData';
import { INITIAL_VENDEDORES } from '../data/mockData';
import { generateConcursoPDF, generateConcursosListPDF } from '../utils/generateConcursoPDF';
import {
  Plus,
  Trash2,
  Edit2,
  FileDown,
  Search,
  Trophy,
  X,
  Check,
  ChevronDown,
  ChevronUp,
  Download,
} from 'lucide-react';

const emptyConcurso: Concurso = {
  id: '',
  nro: 0,
  proveedor: '',
  nombre: '',
  logo: '',
  tabla: '',
  columnaTabla: '',
  queSeMide: 'Venta en soles',
  metaTexto: '',
  unidadMeta: 'soles',
  incluyeIGV: false,
  compraMinimaCliente: 0,
  compraMinimaEn: '',
  enPedidoOMes: 'En todo el mes',
  tieneCandado: 'No',
  minimoCandado: 0,
  unidadCandado: '',
  escalas: [],
  premioEn: 'Soles',
  productoPremio: '',
  comoSePaga: 'Monto fijo',
  topePremio: 0,
  rankingN: 0,
  productosQueCuentan: '',
  quienesParticipan: '',
  desde: '',
  hasta: '',
  notasVendedor: [],
  notasInternas: '',
  revision: 'OK',
  asiLoVeVendedor: '',
  premioMaximo: 0,
};

export const ConcursosView: React.FC = () => {
  const [concursos, setConcursos] = useState<Concurso[]>(CONCURSOS);
  const [search, setSearch] = useState('');
  const [expandedId, setExpandedId] = useState<string | null>(null);
  const [editing, setEditing] = useState<Concurso | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [form, setForm] = useState<Concurso>({ ...emptyConcurso, id: `c-${Date.now()}` });
  const [activeTab, setActiveTab] = useState<'concursos' | 'vendedores' | 'productos'>('concursos');
  const [searchVendedor, setSearchVendedor] = useState('');
  const [searchProducto, setSearchProducto] = useState('');

  const filtered = concursos.filter(
    (c) =>
      c.nombre.toLowerCase().includes(search.toLowerCase()) ||
      c.proveedor.toLowerCase().includes(search.toLowerCase())
  );

  const handleDelete = (id: string) => {
    if (window.confirm('¿Eliminar este concurso?')) {
      setConcursos((prev) => prev.filter((c) => c.id !== id));
    }
  };

  const handleEdit = (c: Concurso) => {
    setForm({ ...c });
    setEditing(c);
    setShowForm(true);
  };

  const handleNew = () => {
    setForm({ ...emptyConcurso, id: `c-${Date.now()}`, nro: concursos.length + 1 });
    setEditing(null);
    setShowForm(true);
  };

  const handleSave = () => {
    if (!form.nombre || !form.proveedor) {
      alert('Nombre y proveedor son obligatorios');
      return;
    }
    if (editing) {
      setConcursos((prev) => prev.map((c) => (c.id === editing.id ? form : c)));
    } else {
      setConcursos((prev) => [...prev, form]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const handleAddEscala = () => {
    setForm((prev) => ({
      ...prev,
      escalas: [...prev.escalas, { id: `e-${Date.now()}`, meta: 0, premio: 0 }],
    }));
  };

  const handleRemoveEscala = (idx: number) => {
    setForm((prev) => ({
      ...prev,
      escalas: prev.escalas.filter((_, i) => i !== idx),
    }));
  };

  const handleEscalaChange = (idx: number, field: 'meta' | 'premio', value: string) => {
    setForm((prev) => {
      const newEscalas = [...prev.escalas];
      newEscalas[idx] = { ...newEscalas[idx], [field]: parseFloat(value) || 0 };
      return { ...prev, escalas: newEscalas };
    });
  };

  return (
    <div className="flex flex-col gap-4 pb-24 w-full max-w-full">
      {/* Tabs */}
      <div className="flex gap-2 bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-2 rounded-xl shadow-xs">
        {[
          { id: 'concursos' as const, label: 'Concursos', count: concursos.length },
          { id: 'vendedores' as const, label: 'Vendedores', count: INITIAL_VENDEDORES.length },
          { id: 'productos' as const, label: 'Productos', count: PRODUCTOS.length },
        ].map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
              activeTab === t.id
                ? 'bg-[#131b2e] text-white'
                : 'text-[#45464d] dark:text-[#cbd5e1] hover:bg-white dark:bg-[#1e293b]'
            }`}
          >
            {t.label} ({t.count})
          </button>
        ))}
      </div>

      {activeTab === 'concursos' && (
        <>
      {/* Header */}
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <div className="flex items-center gap-2">
              <Trophy className="w-5 h-5 text-[#131b2e]" />
              <h2 className="text-lg sm:text-xl font-bold text-[#191c1e] dark:text-[#f1f5f9]">Gestión de Concursos</h2>
            </div>
            <p className="text-xs sm:text-sm text-[#45464d] dark:text-[#cbd5e1] mt-1">
              CRUD de hojas de concursos y generación de PDF.
            </p>
          </div>
          <div className="flex gap-2">
            <button
              onClick={handleNew}
              className="flex items-center gap-1.5 px-3 py-2 bg-[#131b2e] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              Nuevo Concurso
            </button>
            <button
              onClick={() => generateConcursosListPDF(concursos)}
              className="flex items-center gap-1.5 px-3 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs sm:text-sm font-bold rounded-lg shadow-xs transition-colors cursor-pointer"
            >
              <Download className="w-4 h-4" />
              PDF Lista
            </button>
          </div>
        </div>

        {/* Search */}
        <div className="mt-4 relative">
          <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400 dark:text-slate-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Buscar por nombre o proveedor..."
            className="w-full pl-9 pr-3 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] outline-none"
          />
        </div>
      </div>

      {/* Table/List */}
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-3 sm:p-4 rounded-xl shadow-xs overflow-x-auto">
        <table className="w-full text-xs sm:text-sm min-w-[600px]">
          <thead>
            <tr className="border-b border-[#e0e3e5] dark:border-[#334155]">
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">N°</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Nombre</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Proveedor</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Qué se mide</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Escalas</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Premio máx.</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Revisión</th>
              <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Acciones</th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((c) => (
              <tr
                key={c.id}
                className="border-b border-[#e0e3e5] dark:border-[#334155] hover:bg-white dark:bg-[#1e293b]/60 transition-colors"
              >
                <td className="py-2 px-2 font-mono">{c.nro}</td>
                <td className="py-2 px-2 font-semibold text-[#191c1e] dark:text-[#f1f5f9]">
                  <button
                    onClick={() => setExpandedId(expandedId === c.id ? null : c.id)}
                    className="flex items-center gap-1 cursor-pointer"
                  >
                    {expandedId === c.id ? (
                      <ChevronUp className="w-3 h-3" />
                    ) : (
                      <ChevronDown className="w-3 h-3" />
                    )}
                    {c.nombre}
                  </button>
                </td>
                <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{c.proveedor}</td>
                <td className="py-2 px-2">{c.queSeMide}</td>
                <td className="py-2 px-2">
                  {c.escalas.length > 0 ? `${c.escalas.length} escala(s)` : '-'}
                </td>
                <td className="py-2 px-2 font-mono font-bold text-emerald-700">
                  {c.premioMaximo}
                </td>
                <td className="py-2 px-2">
                  <span
                    className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${
                      c.revision === 'OK'
                        ? 'bg-emerald-100 text-emerald-800'
                        : 'bg-amber-100 text-amber-800'
                    }`}
                  >
                    {c.revision}
                  </span>
                </td>
                <td className="py-2 px-2">
                  <div className="flex items-center gap-1">
                    <button
                      onClick={() => generateConcursoPDF(c)}
                      title="Generar PDF"
                      className="p-1.5 rounded hover:bg-emerald-50 text-emerald-700 cursor-pointer"
                    >
                      <FileDown className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleEdit(c)}
                      title="Editar"
                      className="p-1.5 rounded hover:bg-blue-50 text-blue-700 cursor-pointer"
                    >
                      <Edit2 className="w-3.5 h-3.5" />
                    </button>
                    <button
                      onClick={() => handleDelete(c.id)}
                      title="Eliminar"
                      className="p-1.5 rounded hover:bg-red-50 text-red-700 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </td>
              </tr>
            ))}
            {filtered.length === 0 && (
              <tr>
                <td colSpan={8} className="py-6 text-center text-slate-400 dark:text-slate-500">
                  No hay concursos registrados.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Expanded detail */}
      {expandedId && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
          {(() => {
            const c = concursos.find((x) => x.id === expandedId);
            if (!c) return null;
            return (
              <div className="space-y-3">
                <div className="flex items-center justify-between">
                  <h3 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9]">{c.nombre}</h3>
                  <button
                    onClick={() => setExpandedId(null)}
                    className="p-1.5 rounded hover:bg-[#e6e8ea] dark:bg-[#475569] cursor-pointer"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs sm:text-sm">
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Proveedor:</span> {c.proveedor}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Logo:</span> {c.logo}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Qué se mide:</span> {c.queSeMide}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Unidad:</span> {c.unidadMeta}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Incluye IGV:</span> {c.incluyeIGV ? 'Sí' : 'No'}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Compra mínima:</span> {c.compraMinimaCliente} {c.compraMinimaEn}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Pedido/Mes:</span> {c.enPedidoOMes}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Candado:</span> {c.tieneCandado}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Premio en:</span> {c.premioEn}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Cómo se paga:</span> {c.comoSePaga}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Tope premio:</span> {c.topePremio}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Ranking N:</span> {c.rankingN || '-'}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Quiénes participan:</span> {c.quienesParticipan || '-'}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Desde:</span> {c.desde || '-'}
                  </div>
                  <div>
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1]">Hasta:</span> {c.hasta || '-'}
                  </div>
                </div>
                {c.escalas.length > 0 && (
                  <div className="mt-3">
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1] text-xs">Escalas:</span>
                    <div className="flex flex-wrap gap-2 mt-1">
                      {c.escalas.map((e, i) => (
                        <span
                          key={e.id}
                          className="px-2 py-1 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded text-xs font-mono"
                        >
                          E{i + 1}: {typeof e.meta === 'number' ? `S/ ${e.meta}` : e.meta} → {typeof e.premio === 'number' ? `S/ ${e.premio}` : e.premio}
                        </span>
                      ))}
                    </div>
                  </div>
                )}
                {c.notasVendedor.length > 0 && (
                  <div className="mt-3">
                    <span className="font-semibold text-[#45464d] dark:text-[#cbd5e1] text-xs">Notas vendedor:</span>
                    <ul className="list-disc list-inside text-xs text-[#45464d] dark:text-[#cbd5e1] mt-1">
                      {c.notasVendedor.map((n, i) => (
                        <li key={i}>{n}</li>
                      ))}
                    </ul>
                  </div>
                )}
                <div className="mt-3 p-3 bg-amber-50 border border-amber-200 rounded text-xs text-amber-900">
                  <span className="font-bold">Así lo verá el vendedor:</span>
                  <pre className="mt-1 whitespace-pre-wrap font-sans">{c.asiLoVeVendedor}</pre>
                </div>
              </div>
            );
          })()}
        </div>
      )}

      </>
      )}

      {activeTab === 'vendedores' && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs overflow-x-auto">
          <h3 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9] mb-4">Lista de Vendedores ({INITIAL_VENDEDORES.length})</h3>
          <table className="w-full text-xs sm:text-sm min-w-[500px]">
            <thead>
              <tr className="border-b border-[#e0e3e5] dark:border-[#334155]">
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">ID</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Nombre</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Ruta</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Zona</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Supervisor</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Teléfono</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Cuota</th>
              </tr>
            </thead>
            <tbody>
              {INITIAL_VENDEDORES.filter((v) =>
                v.name.toLowerCase().includes(searchVendedor.toLowerCase()) ||
                v.route.toLowerCase().includes(searchVendedor.toLowerCase()) ||
                v.zone.toLowerCase().includes(searchVendedor.toLowerCase())
              ).map((v) => (
                <tr key={v.id} className="border-b border-[#e0e3e5] dark:border-[#334155] hover:bg-white dark:bg-[#1e293b]/60">
                  <td className="py-2 px-2 font-mono text-[10px]">{v.id}</td>
                  <td className="py-2 px-2 font-semibold text-[#191c1e] dark:text-[#f1f5f9]">{v.initials} {v.name}</td>
                  <td className="py-2 px-2">{v.route}</td>
                  <td className="py-2 px-2">{v.zone}</td>
                  <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{v.supervisor}</td>
                  <td className="py-2 px-2 font-mono text-[10px]">{v.phone}</td>
                  <td className="py-2 px-2 font-mono font-bold text-emerald-700">S/. {v.quotaTarget.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <input
              type="text"
              value={searchVendedor}
              onChange={(e) => setSearchVendedor(e.target.value)}
              placeholder="Buscar vendedor..."
              className="w-full sm:w-64 text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] outline-none"
            />
          </div>
        </div>
      )}

      {activeTab === 'productos' && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs overflow-x-auto">
          <h3 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9] mb-4">Lista de Productos ({PRODUCTOS.length})</h3>
          <table className="w-full text-xs sm:text-sm min-w-[600px]">
            <thead>
              <tr className="border-b border-[#e0e3e5] dark:border-[#334155]">
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">ART_ID</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Proveedor</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Marca</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Descripción</th>
                <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Venta c/IGV</th>
              </tr>
            </thead>
            <tbody>
              {PRODUCTOS.filter((p) =>
                p.descripcion.toLowerCase().includes(searchProducto.toLowerCase()) ||
                p.proveedor.toLowerCase().includes(searchProducto.toLowerCase()) ||
                p.marca.toLowerCase().includes(searchProducto.toLowerCase()) ||
                p.artId.toLowerCase().includes(searchProducto.toLowerCase())
              ).map((p) => (
                <tr key={p.artId} className="border-b border-[#e0e3e5] dark:border-[#334155] hover:bg-white dark:bg-[#1e293b]/60">
                  <td className="py-2 px-2 font-mono text-[10px]">{p.artId}</td>
                  <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{p.proveedor}</td>
                  <td className="py-2 px-2 font-semibold">{p.marca}</td>
                  <td className="py-2 px-2">{p.descripcion}</td>
                  <td className="py-2 px-2 font-mono font-bold text-emerald-700">S/. {p.ventaConIGV.toLocaleString()}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <div className="mt-3">
            <input
              type="text"
              value={searchProducto}
              onChange={(e) => setSearchProducto(e.target.value)}
              placeholder="Buscar producto..."
              className="w-full sm:w-64 text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] outline-none"
            />
          </div>
        </div>
      )}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#191c1e] dark:text-[#f1f5f9]">
                {editing ? 'Editar Concurso' : 'Nuevo Concurso'}
              </h3>
              <button
                onClick={() => setShowForm(false)}
                className="p-1.5 rounded hover:bg-[#e6e8ea] dark:bg-[#475569] cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">N°</label>
                <input
                  type="number"
                  value={form.nro}
                  onChange={(e) => setForm({ ...form, nro: parseInt(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Nombre</label>
                <input
                  type="text"
                  value={form.nombre}
                  onChange={(e) => setForm({ ...form, nombre: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Proveedor</label>
                <input
                  type="text"
                  value={form.proveedor}
                  onChange={(e) => setForm({ ...form, proveedor: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Logo</label>
                <input
                  type="text"
                  value={form.logo}
                  onChange={(e) => setForm({ ...form, logo: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Tabla</label>
                <input
                  type="text"
                  value={form.tabla}
                  onChange={(e) => setForm({ ...form, tabla: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Columna de tabla</label>
                <input
                  type="text"
                  value={form.columnaTabla}
                  onChange={(e) => setForm({ ...form, columnaTabla: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Qué se mide</label>
                <select
                  value={form.queSeMide}
                  onChange={(e) => setForm({ ...form, queSeMide: e.target.value as any })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                >
                  <option value="Venta en soles">Venta en soles</option>
                  <option value="Clientes (coberturas)">Clientes (coberturas)</option>
                  <option value="Otro (meta en texto)">Otro (meta en texto)</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Meta en texto</label>
                <input
                  type="text"
                  value={form.metaTexto}
                  onChange={(e) => setForm({ ...form, metaTexto: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Unidad de la meta</label>
                <input
                  type="text"
                  value={form.unidadMeta}
                  onChange={(e) => setForm({ ...form, unidadMeta: e.target.value as any })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  checked={form.incluyeIGV}
                  onChange={(e) => setForm({ ...form, incluyeIGV: e.target.checked })}
                  className="w-4 h-4"
                />
                <label className="text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1]">Incluye IGV</label>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Compra mínima por cliente</label>
                <input
                  type="number"
                  value={form.compraMinimaCliente}
                  onChange={(e) => setForm({ ...form, compraMinimaCliente: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Compra mínima en</label>
                <input
                  type="text"
                  value={form.compraMinimaEn}
                  onChange={(e) => setForm({ ...form, compraMinimaEn: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Pedido o mes</label>
                <select
                  value={form.enPedidoOMes}
                  onChange={(e) => setForm({ ...form, enPedidoOMes: e.target.value as any })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                >
                  <option value="En un pedido">En un pedido</option>
                  <option value="En todo el mes">En todo el mes</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">¿Tiene candado?</label>
                <select
                  value={form.tieneCandado}
                  onChange={(e) => setForm({ ...form, tieneCandado: e.target.value as any })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                >
                  <option value="No">No</option>
                  <option value="Sí">Sí</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Mínimo del candado</label>
                <input
                  type="number"
                  value={form.minimoCandado}
                  onChange={(e) => setForm({ ...form, minimoCandado: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Unidad del candado</label>
                <input
                  type="text"
                  value={form.unidadCandado}
                  onChange={(e) => setForm({ ...form, unidadCandado: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Premio en</label>
                <select
                  value={form.premioEn}
                  onChange={(e) => setForm({ ...form, premioEn: e.target.value as any })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                >
                  <option value="Soles">Soles</option>
                  <option value="Producto">Producto</option>
                  <option value="Personal">Personal</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Producto del premio</label>
                <input
                  type="text"
                  value={form.productoPremio}
                  onChange={(e) => setForm({ ...form, productoPremio: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Cómo se paga</label>
                <select
                  value={form.comoSePaga}
                  onChange={(e) => setForm({ ...form, comoSePaga: e.target.value as any })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                >
                  <option value="Monto fijo">Monto fijo</option>
                  <option value="Por cada cliente o unidad">Por cada cliente o unidad</option>
                </select>
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Tope del premio</label>
                <input
                  type="number"
                  value={form.topePremio}
                  onChange={(e) => setForm({ ...form, topePremio: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Ranking (N mejores)</label>
                <input
                  type="number"
                  value={form.rankingN}
                  onChange={(e) => setForm({ ...form, rankingN: parseInt(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Productos que cuentan</label>
                <input
                  type="text"
                  value={form.productosQueCuentan}
                  onChange={(e) => setForm({ ...form, productosQueCuentan: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Quiénes participan</label>
                <input
                  type="text"
                  value={form.quienesParticipan}
                  onChange={(e) => setForm({ ...form, quienesParticipan: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Desde</label>
                <input
                  type="date"
                  value={form.desde}
                  onChange={(e) => setForm({ ...form, desde: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Hasta</label>
                <input
                  type="date"
                  value={form.hasta}
                  onChange={(e) => setForm({ ...form, hasta: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Premio máximo</label>
                <input
                  type="number"
                  value={form.premioMaximo}
                  onChange={(e) => setForm({ ...form, premioMaximo: parseFloat(e.target.value) || 0 })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
              <div>
                <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Revisión</label>
                <input
                  type="text"
                  value={form.revision}
                  onChange={(e) => setForm({ ...form, revision: e.target.value })}
                  className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                />
              </div>
            </div>

            {/* Notas vendedor */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Notas para el vendedor (una por línea)</label>
              <textarea
                value={form.notasVendedor.join('\n')}
                onChange={(e) => setForm({ ...form, notasVendedor: e.target.value.split('\n') })}
                rows={3}
                className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
              />
            </div>

            {/* Notas internas */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Notas internas</label>
              <textarea
                value={form.notasInternas}
                onChange={(e) => setForm({ ...form, notasInternas: e.target.value })}
                rows={2}
                className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
              />
            </div>

            {/* Así lo verá el vendedor */}
            <div className="mt-3">
              <label className="block text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] mb-1">Así lo verá el vendedor</label>
              <textarea
                value={form.asiLoVeVendedor}
                onChange={(e) => setForm({ ...form, asiLoVeVendedor: e.target.value })}
                rows={3}
                className="w-full text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
              />
            </div>

            {/* Escalas editor */}
            <div className="mt-4">
              <div className="flex items-center justify-between mb-2">
                <label className="text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1]">Escalas (Meta / Premio)</label>
                <button
                  onClick={handleAddEscala}
                  className="flex items-center gap-1 text-xs font-bold text-[#131b2e] hover:underline cursor-pointer"
                >
                  <Plus className="w-3 h-3" />
                  Agregar escala
                </button>
              </div>
              <div className="space-y-2">
                {form.escalas.map((e, idx) => (
                  <div key={e.id} className="flex items-center gap-2">
                    <span className="text-xs font-mono text-slate-500 dark:text-slate-400 dark:text-slate-500 w-16">E{idx + 1}</span>
                    <input
                      type="number"
                      value={e.meta}
                      onChange={(ev) => handleEscalaChange(idx, 'meta', ev.target.value)}
                      placeholder="Meta"
                      className="flex-1 text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                    />
                    <input
                      type="number"
                      value={e.premio}
                      onChange={(ev) => handleEscalaChange(idx, 'premio', ev.target.value)}
                      placeholder="Premio"
                      className="flex-1 text-sm p-2 rounded-lg border border-[#c6c6cd] dark:border-[#475569] outline-none"
                    />
                    <button
                      onClick={() => handleRemoveEscala(idx)}
                      className="p-1.5 rounded hover:bg-red-50 text-red-600 cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
                {form.escalas.length === 0 && (
                  <p className="text-xs text-slate-400 dark:text-slate-500">Sin escalas. Haga clic en "Agregar escala".</p>
                )}
              </div>
            </div>

            {/* Actions */}
            <div className="flex justify-end gap-2 mt-6">
              <button
                onClick={() => setShowForm(false)}
                className="px-4 py-2 text-xs sm:text-sm font-semibold rounded-lg border border-[#c6c6cd] dark:border-[#475569] hover:bg-[#f2f4f6] dark:bg-[#1e293b] cursor-pointer"
              >
                Cancelar
              </button>
              <button
                onClick={handleSave}
                className="flex items-center gap-1.5 px-4 py-2 bg-[#131b2e] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg cursor-pointer"
              >
                <Check className="w-4 h-4" />
                Guardar
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
