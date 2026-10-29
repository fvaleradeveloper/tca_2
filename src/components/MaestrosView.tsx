import React, { useState } from 'react';
import { ProductoMaestro, Cliente, Empleado, TipoCliente, EmpleadoRol } from '../types';
import { INITIAL_VENDEDORES } from '../data/mockData';
import { PRODUCTOS } from '../data/productosData';
import {
  Plus,
  Trash2,
  Edit2,
  Search,
  Database,
  Package,
  Users,
  UserCog,
  X,
  Check,
  Download,
} from 'lucide-react';

const initialProductos: ProductoMaestro[] = PRODUCTOS.slice(0, 20).map((p, i) => ({
  id: `pm-${i + 1}`,
  codigo: p.artId,
  descripcion: p.descripcion,
  marca: p.marca,
  proveedor: p.proveedor,
  categoria: 'General',
  precioVenta: Math.round(p.ventaConIGV * 0.85 * 100) / 100,
  precioCosto: Math.round(p.ventaConIGV * 0.7 * 100) / 100,
  stock: Math.floor(Math.random() * 500) + 10,
  unidad: 'UND',
  igv: true,
  activo: true,
}));

const initialClientes: Cliente[] = [
  {
    id: 'cli-1',
    codigo: 'CL-0001',
    razonSocial: 'Bodega Don Pepe',
    ruc: '20123456789',
    tipo: 'Bodega',
    direccion: 'Av. Antúnez de Mayolo 1240',
    distrito: 'Los Olivos',
    zona: 'Lima Norte',
    telefono: '01-4567890',
    celular: '+51 984 213 540',
    email: 'donpepe@bodega.com',
    vendedorAsignado: 'Carlos Gomez',
    vendedorId: 'v-1',
    formaPago: 'Contado',
    lineaCredito: 0,
    saldo: 0,
    activo: true,
    fechaRegistro: '2025-01-15',
    observaciones: 'Cliente habitual',
  },
  {
    id: 'cli-2',
    codigo: 'CL-0002',
    razonSocial: 'Minimarket Las Flores',
    ruc: '20234567890',
    tipo: 'Minimarket',
    direccion: 'Jr. Los Claveles 380',
    distrito: 'Los Olivos',
    zona: 'Lima Norte',
    telefono: '01-4678901',
    celular: '+51 972 654 112',
    email: 'lasflores@minimarket.com',
    vendedorAsignado: 'Carlos Gomez',
    vendedorId: 'v-1',
    formaPago: 'Crédito 15',
    lineaCredito: 5000,
    saldo: 1250,
    activo: true,
    fechaRegistro: '2025-02-10',
    observaciones: '',
  },
  {
    id: 'cli-3',
    codigo: 'CL-0003',
    razonSocial: 'Abarrotes Doña Juana',
    ruc: '20345678901',
    tipo: 'Bodega',
    direccion: 'Av. Universitaria 4150',
    distrito: 'San Martín de Porres',
    zona: 'Lima Norte',
    telefono: '01-4789012',
    celular: '+51 945 321 890',
    email: 'donajuana@abarrotes.com',
    vendedorAsignado: 'Carlos Gomez',
    vendedorId: 'v-1',
    formaPago: 'Crédito 30',
    lineaCredito: 8000,
    saldo: 3400,
    activo: true,
    fechaRegistro: '2025-03-05',
    observaciones: '',
  },
];

const initialEmpleados: Empleado[] = INITIAL_VENDEDORES.map((v, i) => ({
  id: v.id,
  codigo: `EMP-${String(i + 1).padStart(4, '0')}`,
  nombres: v.name.split(' ')[0],
  apellidos: v.name.split(' ').slice(1).join(' '),
  dni: `7${String(i).padStart(8, '0')}`,
  rol: 'Vendedor',
  cargo: 'Vendedor',
  telefono: v.phone,
  celular: v.phone,
  email: `${v.initials.toLowerCase()}@totalcalidad.com`,
  zona: v.zone,
  supervisorId: 'sup-1',
  supervisorNombre: v.supervisor,
  fechaIngreso: '2024-01-10',
  sueldoBase: 1500,
  comisionPorcentaje: 5,
  activo: true,
  direccion: 'Lima, Perú',
  distrito: v.zone,
}));

export const MaestrosView: React.FC = () => {
  const [tab, setTab] = useState<'productos' | 'clientes' | 'empleados'>('productos');
  const [productos, setProductos] = useState<ProductoMaestro[]>(initialProductos);
  const [clientes, setClientes] = useState<Cliente[]>(initialClientes);
  const [empleados, setEmpleados] = useState<Empleado[]>(initialEmpleados);

  // Productos
  const [prodForm, setProdForm] = useState<Partial<ProductoMaestro>>({});
  const [prodEditId, setProdEditId] = useState<string | null>(null);
  const [showProdForm, setShowProdForm] = useState(false);
  const [searchProd, setSearchProd] = useState('');

  // Clientes
  const [cliForm, setCliForm] = useState<Partial<Cliente>>({});
  const [cliEditId, setCliEditId] = useState<string | null>(null);
  const [showCliForm, setShowCliForm] = useState(false);
  const [searchCli, setSearchCli] = useState('');

  // Empleados
  const [empForm, setEmpForm] = useState<Partial<Empleado>>({});
  const [empEditId, setEmpEditId] = useState<string | null>(null);
  const [showEmpForm, setShowEmpForm] = useState(false);
  const [searchEmp, setSearchEmp] = useState('');

  const saveProducto = () => {
    if (!prodForm.descripcion) return;
    if (prodEditId) {
      setProductos((p) => p.map((x) => (x.id === prodEditId ? { ...x, ...prodForm } as ProductoMaestro : x)));
    } else {
      setProductos((p) => [
        ...p,
        { id: `pm-${Date.now()}`, codigo: prodForm.codigo || '', ...prodForm } as ProductoMaestro,
      ]);
    }
    setShowProdForm(false);
    setProdEditId(null);
    setProdForm({});
  };

  const saveCliente = () => {
    if (!cliForm.razonSocial) return;
    if (cliEditId) {
      setClientes((p) => p.map((x) => (x.id === cliEditId ? { ...x, ...cliForm } as Cliente : x)));
    } else {
      setClientes((p) => [
        ...p,
        { id: `cli-${Date.now()}`, codigo: cliForm.codigo || `CL-${String(p.length + 1).padStart(4, '0')}`, fechaRegistro: new Date().toISOString().split('T')[0], ...cliForm } as Cliente,
      ]);
    }
    setShowCliForm(false);
    setCliEditId(null);
    setCliForm({});
  };

  const saveEmpleado = () => {
    if (!empForm.nombres) return;
    if (empEditId) {
      setEmpleados((p) => p.map((x) => (x.id === empEditId ? { ...x, ...empForm } as Empleado : x)));
    } else {
      setEmpleados((p) => [
        ...p,
        { id: `emp-${Date.now()}`, codigo: empForm.codigo || `EMP-${String(p.length + 1).padStart(4, '0')}`, ...empForm } as Empleado,
      ]);
    }
    setShowEmpForm(false);
    setEmpEditId(null);
    setEmpForm({});
  };

  const delProducto = (id: string) => confirm('¿Eliminar producto?') && setProductos((p) => p.filter((x) => x.id !== id));
  const delCliente = (id: string) => confirm('¿Eliminar cliente?') && setClientes((p) => p.filter((x) => x.id !== id));
  const delEmpleado = (id: string) => confirm('¿Eliminar empleado?') && setEmpleados((p) => p.filter((x) => x.id !== id));

  const filProd = productos.filter((p) =>
    p.descripcion.toLowerCase().includes(searchProd.toLowerCase()) ||
    p.codigo.toLowerCase().includes(searchProd.toLowerCase()) ||
    p.marca.toLowerCase().includes(searchProd.toLowerCase())
  );

  const filCli = clientes.filter((c) =>
    c.razonSocial.toLowerCase().includes(searchCli.toLowerCase()) ||
    c.ruc.toLowerCase().includes(searchCli.toLowerCase()) ||
    c.codigo.toLowerCase().includes(searchCli.toLowerCase())
  );

  const filEmp = empleados.filter((e) =>
    e.nombres.toLowerCase().includes(searchEmp.toLowerCase()) ||
    e.apellidos.toLowerCase().includes(searchEmp.toLowerCase()) ||
    e.codigo.toLowerCase().includes(searchEmp.toLowerCase()) ||
    e.rol.toLowerCase().includes(searchEmp.toLowerCase())
  );

  return (
    <div className="flex flex-col gap-4 pb-24 w-full max-w-full">
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
        <div className="flex items-center gap-2 mb-4">
          <Database className="w-5 h-5 text-[#131b2e] dark:text-[#f1f5f9]" />
          <h2 className="text-lg sm:text-xl font-bold text-[#191c1e] dark:text-[#f1f5f9]">Maestros / CRUD</h2>
        </div>
        <div className="flex gap-2">
          {[
            { id: 'productos' as const, label: 'Productos', icon: <Package className="w-4 h-4" />, count: productos.length },
            { id: 'clientes' as const, label: 'Clientes', icon: <Users className="w-4 h-4" />, count: clientes.length },
            { id: 'empleados' as const, label: 'Empleados / Vendedores / Supervisores / Auxiliares', icon: <UserCog className="w-4 h-4" />, count: empleados.length },
          ].map((t) => (
            <button
              key={t.id}
              onClick={() => setTab(t.id)}
              className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg transition-colors cursor-pointer ${
                tab === t.id ? 'bg-[#131b2e] dark:bg-[#0f172a] text-white' : 'text-[#45464d] dark:text-[#cbd5e1] hover:bg-white dark:hover:bg-[#475569]'
              }`}
            >
              {t.icon}
              {t.label} ({t.count})
            </button>
          ))}
        </div>
      </div>

      {/* PRODUCTOS */}
      {tab === 'productos' && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9]">CRUD Productos</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchProd} onChange={(e) => setSearchProd(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9] outline-none" />
              </div>
              <button onClick={() => { setProdForm({}); setProdEditId(null); setShowProdForm(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#131b2e] dark:bg-[#0f172a] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg cursor-pointer"><Plus className="w-4 h-4" />Nuevo</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[700px]">
              <thead>
                <tr className="border-b border-[#e0e3e5] dark:border-[#334155]">
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Código</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Descripción</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Marca</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Proveedor</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">P.Venta</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Stock</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Activo</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filProd.map((p) => (
                  <tr key={p.id} className="border-b border-[#e0e3e5] dark:border-[#334155] hover:bg-white/60 dark:hover:bg-[#334155]/60">
                    <td className="py-2 px-2 font-mono text-[#191c1e] dark:text-[#f1f5f9]">{p.codigo}</td>
                    <td className="py-2 px-2 text-[#191c1e] dark:text-[#f1f5f9]">{p.descripcion}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{p.marca}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{p.proveedor}</td>
                    <td className="py-2 px-2 font-mono font-bold text-emerald-700 dark:text-emerald-400">S/. {p.precioVenta.toLocaleString()}</td>
                    <td className="py-2 px-2 font-mono text-[#191c1e] dark:text-[#f1f5f9]">{p.stock}</td>
                    <td className="py-2 px-2">{p.activo ? 'Sí' : 'No'}</td>
                    <td className="py-2 px-2">
                      <div className="flex gap-1">
                        <button onClick={() => { setProdForm(p); setProdEditId(p.id); setShowProdForm(true); }} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => delProducto(p.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* CLIENTES */}
      {tab === 'clientes' && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9]">CRUD Clientes</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchCli} onChange={(e) => setSearchCli(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9] outline-none" />
              </div>
              <button onClick={() => { setCliForm({}); setCliEditId(null); setShowCliForm(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#131b2e] dark:bg-[#0f172a] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg cursor-pointer"><Plus className="w-4 h-4" />Nuevo</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[800px]">
              <thead>
                <tr className="border-b border-[#e0e3e5] dark:border-[#334155]">
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Código</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Razón Social</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">RUC</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Tipo</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Distrito/Zona</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Vendedor</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Forma Pago</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Línea Crédito</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Activo</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filCli.map((c) => (
                  <tr key={c.id} className="border-b border-[#e0e3e5] dark:border-[#334155] hover:bg-white/60 dark:hover:bg-[#334155]/60">
                    <td className="py-2 px-2 font-mono text-[#191c1e] dark:text-[#f1f5f9]">{c.codigo}</td>
                    <td className="py-2 px-2 font-semibold text-[#191c1e] dark:text-[#f1f5f9]">{c.razonSocial}</td>
                    <td className="py-2 px-2 font-mono text-[#45464d] dark:text-[#cbd5e1]">{c.ruc}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{c.tipo}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{c.distrito} / {c.zona}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{c.vendedorAsignado}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{c.formaPago}</td>
                    <td className="py-2 px-2 font-mono text-emerald-700 dark:text-emerald-400">S/. {c.lineaCredito.toLocaleString()}</td>
                    <td className="py-2 px-2">{c.activo ? 'Sí' : 'No'}</td>
                    <td className="py-2 px-2">
                      <div className="flex gap-1">
                        <button onClick={() => { setCliForm(c); setCliEditId(c.id); setShowCliForm(true); }} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => delCliente(c.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* EMPLEADOS */}
      {tab === 'empleados' && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4">
            <h3 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9]">CRUD Empleados / Vendedores / Supervisores / Auxiliares</h3>
            <div className="flex gap-2">
              <div className="relative">
                <Search className="w-4 h-4 absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                <input type="text" value={searchEmp} onChange={(e) => setSearchEmp(e.target.value)} placeholder="Buscar..." className="pl-9 pr-3 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9] outline-none" />
              </div>
              <button onClick={() => { setEmpForm({ activo: true }); setEmpEditId(null); setShowEmpForm(true); }} className="flex items-center gap-1.5 px-3 py-2 bg-[#131b2e] dark:bg-[#0f172a] hover:bg-black text-white text-xs sm:text-sm font-bold rounded-lg cursor-pointer"><Plus className="w-4 h-4" />Nuevo</button>
            </div>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-xs sm:text-sm min-w-[900px]">
              <thead>
                <tr className="border-b border-[#e0e3e5] dark:border-[#334155]">
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Código</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Apellidos y Nombres</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">DNI</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Rol/Cargo</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Teléfono</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Zona</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Supervisor</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Sueldo Base</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Comisión %</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Activo</th>
                  <th className="text-left py-2 px-2 font-bold text-[#45464d] dark:text-[#cbd5e1]">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {filEmp.map((e) => (
                  <tr key={e.id} className="border-b border-[#e0e3e5] dark:border-[#334155] hover:bg-white/60 dark:hover:bg-[#334155]/60">
                    <td className="py-2 px-2 font-mono text-[#191c1e] dark:text-[#f1f5f9]">{e.codigo}</td>
                    <td className="py-2 px-2 font-semibold text-[#191c1e] dark:text-[#f1f5f9]">{e.apellidos}, {e.nombres}</td>
                    <td className="py-2 px-2 font-mono text-[#45464d] dark:text-[#cbd5e1]">{e.dni}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{e.rol} / {e.cargo}</td>
                    <td className="py-2 px-2 font-mono text-[#45464d] dark:text-[#cbd5e1]">{e.celular || e.telefono}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{e.zona}</td>
                    <td className="py-2 px-2 text-[#45464d] dark:text-[#cbd5e1]">{e.supervisorNombre || '-'}</td>
                    <td className="py-2 px-2 font-mono text-[#191c1e] dark:text-[#f1f5f9]">S/. {e.sueldoBase.toLocaleString()}</td>
                    <td className="py-2 px-2 font-mono text-[#191c1e] dark:text-[#f1f5f9]">{e.comisionPorcentaje}%</td>
                    <td className="py-2 px-2">{e.activo ? 'Sí' : 'No'}</td>
                    <td className="py-2 px-2">
                      <div className="flex gap-1">
                        <button onClick={() => { setEmpForm(e); setEmpEditId(e.id); setShowEmpForm(true); }} className="p-1.5 rounded hover:bg-blue-50 dark:hover:bg-blue-900/30 text-blue-700 dark:text-blue-400"><Edit2 className="w-3.5 h-3.5" /></button>
                        <button onClick={() => delEmpleado(e.id)} className="p-1.5 rounded hover:bg-red-50 dark:hover:bg-red-900/30 text-red-700 dark:text-red-400"><Trash2 className="w-3.5 h-3.5" /></button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Modal Producto */}
      {showProdForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#191c1e] dark:text-[#f1f5f9]">{prodEditId ? 'Editar Producto' : 'Nuevo Producto'}</h3>
              <button onClick={() => setShowProdForm(false)} className="p-1.5 rounded hover:bg-[#e6e8ea] dark:hover:bg-[#475569]"><X className="w-5 h-5 text-[#45464d] dark:text-[#cbd5e1]" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Código" value={prodForm.codigo || ''} onChange={(e) => setProdForm({ ...prodForm, codigo: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Descripción" value={prodForm.descripcion || ''} onChange={(e) => setProdForm({ ...prodForm, descripcion: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Marca" value={prodForm.marca || ''} onChange={(e) => setProdForm({ ...prodForm, marca: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Proveedor" value={prodForm.proveedor || ''} onChange={(e) => setProdForm({ ...prodForm, proveedor: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Categoría" value={prodForm.categoria || ''} onChange={(e) => setProdForm({ ...prodForm, categoria: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input type="number" placeholder="Precio Venta" value={prodForm.precioVenta || ''} onChange={(e) => setProdForm({ ...prodForm, precioVenta: parseFloat(e.target.value) })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input type="number" placeholder="Precio Costo" value={prodForm.precioCosto || ''} onChange={(e) => setProdForm({ ...prodForm, precioCosto: parseFloat(e.target.value) })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input type="number" placeholder="Stock" value={prodForm.stock || ''} onChange={(e) => setProdForm({ ...prodForm, stock: parseInt(e.target.value) })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowProdForm(false)} className="px-4 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] text-[#45464d] dark:text-[#cbd5e1]">Cancelar</button>
              <button onClick={saveProducto} className="px-4 py-2 text-sm rounded-lg bg-[#131b2e] dark:bg-[#0f172a] text-white font-bold">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Cliente */}
      {showCliForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#191c1e] dark:text-[#f1f5f9]">{cliEditId ? 'Editar Cliente' : 'Nuevo Cliente'}</h3>
              <button onClick={() => setShowCliForm(false)} className="p-1.5 rounded hover:bg-[#e6e8ea] dark:hover:bg-[#475569]"><X className="w-5 h-5 text-[#45464d] dark:text-[#cbd5e1]" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Código" value={cliForm.codigo || ''} onChange={(e) => setCliForm({ ...cliForm, codigo: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Razón Social" value={cliForm.razonSocial || ''} onChange={(e) => setCliForm({ ...cliForm, razonSocial: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="RUC" value={cliForm.ruc || ''} onChange={(e) => setCliForm({ ...cliForm, ruc: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <select value={cliForm.tipo || 'Bodega'} onChange={(e) => setCliForm({ ...cliForm, tipo: e.target.value as TipoCliente })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]">
                <option value="Bodega">Bodega</option><option value="Minimarket">Minimarket</option><option value="Supermercado">Supermercado</option><option value="Mayorista">Mayorista</option><option value="Hotel/Restaurante">Hotel/Restaurante</option>
              </select>
              <input placeholder="Dirección" value={cliForm.direccion || ''} onChange={(e) => setCliForm({ ...cliForm, direccion: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Distrito" value={cliForm.distrito || ''} onChange={(e) => setCliForm({ ...cliForm, distrito: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Zona" value={cliForm.zona || ''} onChange={(e) => setCliForm({ ...cliForm, zona: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Celular" value={cliForm.celular || ''} onChange={(e) => setCliForm({ ...cliForm, celular: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Vendedor Asignado" value={cliForm.vendedorAsignado || ''} onChange={(e) => setCliForm({ ...cliForm, vendedorAsignado: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <select value={cliForm.formaPago || 'Contado'} onChange={(e) => setCliForm({ ...cliForm, formaPago: e.target.value as any })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]">
                <option value="Contado">Contado</option><option value="Crédito 7">Crédito 7</option><option value="Crédito 15">Crédito 15</option><option value="Crédito 30">Crédito 30</option>
              </select>
              <input type="number" placeholder="Línea de Crédito" value={cliForm.lineaCredito || ''} onChange={(e) => setCliForm({ ...cliForm, lineaCredito: parseFloat(e.target.value) })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowCliForm(false)} className="px-4 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] text-[#45464d] dark:text-[#cbd5e1]">Cancelar</button>
              <button onClick={saveCliente} className="px-4 py-2 text-sm rounded-lg bg-[#131b2e] dark:bg-[#0f172a] text-white font-bold">Guardar</button>
            </div>
          </div>
        </div>
      )}

      {/* Modal Empleado */}
      {showEmpForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm z-[60] flex items-center justify-center p-4">
          <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-4 sm:p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-bold text-lg text-[#191c1e] dark:text-[#f1f5f9]">{empEditId ? 'Editar Empleado' : 'Nuevo Empleado'}</h3>
              <button onClick={() => setShowEmpForm(false)} className="p-1.5 rounded hover:bg-[#e6e8ea] dark:hover:bg-[#475569]"><X className="w-5 h-5 text-[#45464d] dark:text-[#cbd5e1]" /></button>
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              <input placeholder="Código" value={empForm.codigo || ''} onChange={(e) => setEmpForm({ ...empForm, codigo: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Nombres" value={empForm.nombres || ''} onChange={(e) => setEmpForm({ ...empForm, nombres: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Apellidos" value={empForm.apellidos || ''} onChange={(e) => setEmpForm({ ...empForm, apellidos: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="DNI" value={empForm.dni || ''} onChange={(e) => setEmpForm({ ...empForm, dni: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <select value={empForm.rol || 'Vendedor'} onChange={(e) => setEmpForm({ ...empForm, rol: e.target.value as EmpleadoRol, cargo: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]">
                <option value="Vendedor">Vendedor</option><option value="Supervisor">Supervisor</option><option value="Auxiliar">Auxiliar</option><option value="Jefe de Ventas">Jefe de Ventas</option><option value="Cobrador">Cobrador</option><option value="Logística">Logística</option><option value="Administrativo">Administrativo</option>
              </select>
              <input placeholder="Cargo" value={empForm.cargo || ''} onChange={(e) => setEmpForm({ ...empForm, cargo: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Celular" value={empForm.celular || ''} onChange={(e) => setEmpForm({ ...empForm, celular: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Email" value={empForm.email || ''} onChange={(e) => setEmpForm({ ...empForm, email: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Zona" value={empForm.zona || ''} onChange={(e) => setEmpForm({ ...empForm, zona: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input placeholder="Supervisor" value={empForm.supervisorNombre || ''} onChange={(e) => setEmpForm({ ...empForm, supervisorNombre: e.target.value })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input type="number" placeholder="Sueldo Base" value={empForm.sueldoBase || ''} onChange={(e) => setEmpForm({ ...empForm, sueldoBase: parseFloat(e.target.value) })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
              <input type="number" placeholder="Comisión %" value={empForm.comisionPorcentaje || ''} onChange={(e) => setEmpForm({ ...empForm, comisionPorcentaje: parseFloat(e.target.value) })} className="p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b] text-[#191c1e] dark:text-[#f1f5f9]" />
            </div>
            <div className="flex justify-end gap-2 mt-4">
              <button onClick={() => setShowEmpForm(false)} className="px-4 py-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] text-[#45464d] dark:text-[#cbd5e1]">Cancelar</button>
              <button onClick={saveEmpleado} className="px-4 py-2 text-sm rounded-lg bg-[#131b2e] dark:bg-[#0f172a] text-white font-bold">Guardar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
