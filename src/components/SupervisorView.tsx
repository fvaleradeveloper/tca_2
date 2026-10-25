import React, { useState, useMemo } from 'react';
import { Vendedor, MesaAlert } from '../types';
import { 
  TrendingUp, 
  CheckCircle, 
  Users, 
  UserCheck, 
  Search, 
  Filter, 
  Phone, 
  CheckSquare, 
  Megaphone, 
  AlertTriangle, 
  ShieldCheck,
  Calendar,
  Layers,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';

interface SupervisorViewProps {
  vendedores: Vendedor[];
  alerts: MesaAlert[];
  withIGV: boolean;
  selectedSupervisor: string;
  onChangeSupervisor: (sup: string) => void;
  selectedZone: string;
  onChangeZone: (zone: string) => void;
  selectedDate: string;
  onChangeDate: (date: string) => void;
  onOpenBroadcast: () => void;
  onCallVendedor: (vendedor: Vendedor) => void;
  onAttendanceClick: (vendedor: Vendedor) => void;
}

export const SupervisorView: React.FC<SupervisorViewProps> = ({
  vendedores,
  alerts,
  withIGV,
  selectedSupervisor,
  onChangeSupervisor,
  selectedZone,
  onChangeZone,
  selectedDate,
  onChangeDate,
  onOpenBroadcast,
  onCallVendedor,
  onAttendanceClick,
}) => {
  const [breakdownType, setBreakdownType] = useState<'marcas' | 'categorias'>('marcas');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState<'all' | 'Presente' | 'Tardanza' | 'Baja Efectividad'>('all');
  const [currentPage, setCurrentPage] = useState<number>(1);
  const pageSize = 4;

  // Format currency helper based on IGV
  const formatSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${Math.round(val).toLocaleString('en-US')}`;
  };

  const formatShortSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${(val / 1000).toFixed(1)}K`;
  };

  // Filtered sellers
  const filteredVendedores = useMemo(() => {
    return vendedores.filter((v) => {
      const matchSearch =
        v.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        v.route.toLowerCase().includes(searchQuery.toLowerCase());
      
      if (!matchSearch) return false;

      if (statusFilter === 'all') return true;
      if (statusFilter === 'Presente') return v.attendanceStatus === 'Presente';
      if (statusFilter === 'Tardanza') return v.attendanceStatus === 'Tardanza';
      if (statusFilter === 'Baja Efectividad') {
        const eff = (v.completedVisits / v.totalVisits) * 100;
        return eff < 75;
      }
      return true;
    });
  }, [vendedores, searchQuery, statusFilter]);

  const totalPages = Math.ceil(filteredVendedores.length / pageSize) || 1;
  const paginatedVendedores = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredVendedores.slice(start, start + pageSize);
  }, [filteredVendedores, currentPage, pageSize]);

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Page Title & Control Bar */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs">
        <div className="flex flex-col gap-1">
          <span className="text-xs uppercase tracking-wider text-[#45464d] font-bold">
            Supervisión Operativa
          </span>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
            Mesa de Trabajo: Lima Norte - Alfa
          </h1>
          <p className="text-sm text-[#45464d]">
            Control de rendimiento, cumplimiento de cuotas y asistencia en tiempo real.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-[#45464d] mb-1">Supervisor</label>
            <select
              value={selectedSupervisor}
              onChange={(e) => onChangeSupervisor(e.target.value)}
              className="bg-white border border-[#c6c6cd] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs"
            >
              <option value="Carlos Mendoza (Líder Alfa)">Carlos Mendoza (Líder Alfa)</option>
              <option value="Ana Lucía Torres">Ana Lucía Torres</option>
              <option value="Jorge Ramirez">Jorge Ramirez</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-[#45464d] mb-1">Zona</label>
            <select
              value={selectedZone}
              onChange={(e) => onChangeZone(e.target.value)}
              className="bg-white border border-[#c6c6cd] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs"
            >
              <option value="Lima Norte">Lima Norte</option>
              <option value="Lima Sur">Lima Sur</option>
              <option value="Lima Este">Lima Este</option>
              <option value="Lima Centro">Lima Centro</option>
            </select>
          </div>

          <div className="flex flex-col">
            <label className="text-[11px] font-semibold text-[#45464d] mb-1">Fecha</label>
            <div className="relative">
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => onChangeDate(e.target.value)}
                className="bg-white border border-[#c6c6cd] rounded-lg px-3 py-1.5 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>

      {/* KPI Stats Cards (4 columns) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* KPI 1: Venta Total de Equipo */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
              Venta Total de Equipo
            </span>
            <span className="bg-[#6cf8bb]/40 text-[#00714d] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <TrendingUp className="w-3.5 h-3.5" /> +12.4%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#191c1e] tracking-tight font-mono">
              {formatSoles(148250)}
            </span>
            <span className="text-xs text-[#45464d] font-medium">
              / Meta: {formatShortSoles(135000)}
            </span>
          </div>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* KPI 2: Cumplimiento Promedio */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
              Cumplimiento Promedio
            </span>
            <span className="bg-[#6cf8bb]/40 text-[#00714d] text-xs font-bold px-2 py-0.5 rounded-full flex items-center gap-1">
              <CheckCircle className="w-3.5 h-3.5" /> Óptimo
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#191c1e] tracking-tight font-mono">
              94.8%
            </span>
            <span className="text-xs text-[#00714d] font-bold">
              +4.2% vs ayer
            </span>
          </div>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full transition-all duration-500" style={{ width: '94.8%' }}></div>
          </div>
        </div>

        {/* KPI 3: Vendedores Activos */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
              Vendedores Activos
            </span>
            <span className="bg-[#e6e8ea] text-[#191c1e] text-xs font-bold px-2 py-0.5 rounded-full">
              12 / 12 Planilla
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#191c1e] tracking-tight font-mono">
              100%
            </span>
            <span className="text-xs text-[#45464d]">
              Sin ausencias injustificadas
            </span>
          </div>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full transition-all duration-500" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* KPI 4: Asistencia Diaria */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl flex flex-col justify-between shadow-xs relative overflow-hidden">
          <div className="flex items-center justify-between mb-3">
            <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
              Asistencia Diaria
            </span>
            <span className="bg-[#6cf8bb]/40 text-[#00714d] text-xs font-bold px-2 py-0.5 rounded-full">
              Meta: 95%
            </span>
          </div>
          <div className="flex items-baseline gap-2">
            <span className="text-3xl font-extrabold text-[#191c1e] tracking-tight font-mono">
              96.5%
            </span>
            <span className="text-xs text-[#00714d] font-bold">
              Supera el estándar
            </span>
          </div>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-4 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full transition-all duration-500" style={{ width: '96.5%' }}></div>
          </div>
        </div>
      </div>

      {/* Middle Row: Rendimiento por Marca / Categoría + Alertas de Mesa */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Card (col-span-2): Rendimiento por Marca y Vendedor */}
        <div className="lg:col-span-2 bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl flex flex-col justify-between shadow-xs">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-5">
            <div>
              <h2 className="text-lg font-bold text-[#191c1e]">
                {breakdownType === 'marcas' ? 'Rendimiento por Marca y Vendedor' : 'Rendimiento por Categoría y Vendedor'}
              </h2>
              <p className="text-xs text-[#45464d] mt-0.5">
                {breakdownType === 'marcas'
                  ? 'Distribución de ventas por líneas principales (Nestlé, Alicorp, Gloria)'
                  : 'Distribución por categorías estratégicas (Lácteos, Abarrotes, Golosinas)'}
              </p>
            </div>
            <div className="flex items-center gap-1 bg-white border border-[#c6c6cd] p-0.5 rounded-lg self-start sm:self-auto">
              <button
                onClick={() => setBreakdownType('marcas')}
                className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                  breakdownType === 'marcas'
                    ? 'bg-[#131b2e] text-white shadow-xs'
                    : 'text-[#45464d] hover:text-[#191c1e]'
                }`}
              >
                Marcas
              </button>
              <button
                onClick={() => setBreakdownType('categorias')}
                className={`px-3 py-1 text-xs font-bold rounded transition-all cursor-pointer ${
                  breakdownType === 'categorias'
                    ? 'bg-[#131b2e] text-white shadow-xs'
                    : 'text-[#45464d] hover:text-[#191c1e]'
                }`}
              >
                Categorías
              </button>
            </div>
          </div>

          {/* Rep rows with stacked bar visualization */}
          <div className="flex flex-col gap-4 my-2">
            {vendedores.slice(0, 4).map((v) => {
              const b1 = breakdownType === 'marcas' ? v.brands.nestle : v.categories.lacteos;
              const b2 = breakdownType === 'marcas' ? v.brands.alicorp : v.categories.abarrotes;
              const b3 = breakdownType === 'marcas' ? v.brands.gloria : v.categories.golosinas;
              const label1 = breakdownType === 'marcas' ? 'Nestlé' : 'Lácteos';
              const label2 = breakdownType === 'marcas' ? 'Alicorp' : 'Abarrotes';
              const label3 = breakdownType === 'marcas' ? 'Gloria' : 'Golosinas';

              return (
                <div key={v.id} className="flex items-center gap-3">
                  <span className="w-28 text-xs font-semibold text-[#191c1e] truncate">
                    {v.name}
                  </span>
                  <div className="flex-1 flex h-6 bg-[#e6e8ea] rounded-full overflow-hidden gap-1 p-0.5">
                    {/* Segment 1 */}
                    <div
                      className="bg-[#131b2e] h-full rounded-l-full relative group transition-all duration-300"
                      style={{ width: `${b1}%` }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold tracking-tight">
                        {label1} {b1}%
                      </span>
                    </div>
                    {/* Segment 2 */}
                    <div
                      className="bg-[#006c49] h-full relative group transition-all duration-300"
                      style={{ width: `${b2}%` }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold tracking-tight">
                        {label2} {b2}%
                      </span>
                    </div>
                    {/* Segment 3 */}
                    <div
                      className="bg-[#76777d] h-full rounded-r-full relative group transition-all duration-300"
                      style={{ width: `${b3}%` }}
                    >
                      <span className="absolute inset-0 flex items-center justify-center text-[10px] text-white font-bold tracking-tight">
                        {label3} {b3}%
                      </span>
                    </div>
                  </div>
                  <span className="w-18 text-right text-xs font-bold text-[#191c1e] font-mono">
                    {formatShortSoles(v.currentSales)}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Footer Legend */}
          <div className="flex items-center justify-between pt-4 border-t border-[#e0e3e5] text-xs text-[#45464d] mt-2">
            <div className="flex items-center gap-4">
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#131b2e]"></span>{' '}
                {breakdownType === 'marcas' ? 'Nestlé' : 'Lácteos'}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#006c49]"></span>{' '}
                {breakdownType === 'marcas' ? 'Alicorp' : 'Abarrotes'}
              </span>
              <span className="flex items-center gap-1.5 font-medium">
                <span className="w-2.5 h-2.5 rounded-full bg-[#76777d]"></span>{' '}
                {breakdownType === 'marcas' ? 'Gloria' : 'Golosinas'}
              </span>
            </div>
            <span className="text-[11px] text-[#76777d]">Actualizado hace 15 min</span>
          </div>
        </div>

        {/* Right Card: Alertas de Mesa */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl flex flex-col justify-between shadow-xs">
          <div>
            <h2 className="text-lg font-bold text-[#191c1e] mb-0.5">Alertas de Mesa</h2>
            <p className="text-xs text-[#45464d] mb-4">
              Incidencias y avisos urgentes para supervisión
            </p>
          </div>

          <div className="flex flex-col gap-3 my-auto">
            {/* Alert 1 */}
            <div className="p-3.5 rounded-xl bg-[#ffdad6] text-[#93000a] flex items-start gap-3 border border-red-200">
              <AlertTriangle className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Baja efectividad en ruta Norte-B</span>
                <span className="text-[11px] leading-snug mt-0.5">
                  El vendedor Luis Huamán presenta 68% de conversión de visitas este turno.
                </span>
              </div>
            </div>

            {/* Alert 2 */}
            <div className="p-3.5 rounded-xl bg-[#6cf8bb]/30 text-[#00714d] flex items-start gap-3 border border-emerald-300">
              <ShieldCheck className="w-5 h-5 shrink-0 mt-0.5" />
              <div className="flex flex-col">
                <span className="text-xs font-bold">Meta superada en Nestlé</span>
                <span className="text-[11px] leading-snug mt-0.5">
                  El equipo superó el objetivo diario de distribución en 18% antes del mediodía.
                </span>
              </div>
            </div>
          </div>

          <button
            onClick={onOpenBroadcast}
            className="w-full mt-4 bg-[#131b2e] text-white py-2.5 rounded-xl text-xs font-bold flex items-center justify-center gap-2 hover:bg-black transition-all shadow-sm cursor-pointer"
          >
            <Megaphone className="w-4 h-4 text-emerald-400" />
            <span>Enviar Broadcast a la Mesa</span>
          </button>
        </div>
      </div>

      {/* Bottom Section: Ranking Detallado de Vendedores */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs flex flex-col gap-5">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-[#191c1e]">
              Ranking Detallado de Vendedores
            </h2>
            <p className="text-xs text-[#45464d] mt-0.5">
              Desempeño individual por cuota, efectividad y control de asistencia
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Search */}
            <div className="relative">
              <Search className="w-4 h-4 absolute left-3 top-2.5 text-[#76777d]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  setCurrentPage(1);
                }}
                placeholder="Buscar vendedor..."
                className="pl-9 pr-4 py-1.5 bg-white border border-[#c6c6cd] rounded-lg text-xs font-medium outline-none text-[#191c1e] placeholder:text-[#76777d] w-52 shadow-2xs"
              />
            </div>

            {/* Filter Dropdown */}
            <div className="relative">
              <select
                value={statusFilter}
                onChange={(e) => {
                  setStatusFilter(e.target.value as any);
                  setCurrentPage(1);
                }}
                className="px-3 py-1.5 bg-white border border-[#c6c6cd] rounded-lg text-xs font-semibold text-[#191c1e] outline-none shadow-2xs cursor-pointer"
              >
                <option value="all">Todos los Vendedores</option>
                <option value="Presente">Solo Presentes</option>
                <option value="Tardanza">Con Tardanza</option>
                <option value="Baja Efectividad">Efectividad &lt; 75%</option>
              </select>
            </div>
          </div>
        </div>

        {/* Sellers Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="bg-[#131b2e] text-white text-[11px] font-bold uppercase tracking-wider">
                <th className="py-3 px-4 rounded-l-lg">Vendedor</th>
                <th className="py-3 px-4">Estado Asistencia</th>
                <th className="py-3 px-4">Cumplimiento Cuota</th>
                <th className="py-3 px-4">Efectividad Visitas</th>
                <th className="py-3 px-4 text-right">Venta Actual</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Acciones rápidas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e5] text-xs text-[#191c1e]">
              {paginatedVendedores.map((v) => {
                const compliance = Math.round((v.currentSales / v.quotaTarget) * 100);
                const visitEffectiveness = ((v.completedVisits / v.totalVisits) * 100).toFixed(1);
                const isUnderperforming = compliance < 80 || parseFloat(visitEffectiveness) < 70;

                return (
                  <tr key={v.id} className="hover:bg-white/60 transition-colors">
                    {/* Vendedor */}
                    <td className="py-3.5 px-4 font-semibold flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs shrink-0">
                        {v.initials}
                      </div>
                      <div>
                        <p className="font-bold text-xs text-[#191c1e]">{v.name}</p>
                        <span className="text-[11px] text-[#76777d]">{v.route}</span>
                      </div>
                    </td>

                    {/* Estado Asistencia */}
                    <td className="py-3.5 px-4">
                      {v.attendanceStatus === 'Presente' ? (
                        <span className="inline-flex items-center gap-1.5 bg-[#6cf8bb]/30 text-[#00714d] text-[11px] font-bold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#006c49]"></span>
                          Presente ({v.checkInTime})
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 bg-[#ffdad6] text-[#ba1a1a] text-[11px] font-bold px-2.5 py-1 rounded-full">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#ba1a1a]"></span>
                          Tardanza ({v.checkInTime})
                        </span>
                      )}
                    </td>

                    {/* Cumplimiento Cuota */}
                    <td className="py-3.5 px-4">
                      <div className="flex items-center gap-2">
                        <div className="flex-1 bg-[#e6e8ea] h-2.5 rounded-full overflow-hidden w-28">
                          <div
                            className={`h-full rounded-full ${
                              isUnderperforming ? 'bg-[#ba1a1a]' : 'bg-[#006c49]'
                            }`}
                            style={{ width: `${Math.min(compliance, 100)}%` }}
                          ></div>
                        </div>
                        <span
                          className={`text-xs font-bold font-mono ${
                            isUnderperforming ? 'text-[#ba1a1a]' : 'text-[#191c1e]'
                          }`}
                        >
                          {compliance}%
                        </span>
                      </div>
                    </td>

                    {/* Efectividad Visitas */}
                    <td className="py-3.5 px-4">
                      <span
                        className={`text-xs font-bold block ${
                          parseFloat(visitEffectiveness) < 70 ? 'text-[#ba1a1a]' : 'text-[#006c49]'
                        }`}
                      >
                        {visitEffectiveness}%
                      </span>
                      <span className="text-[11px] text-[#76777d]">
                        {v.completedVisits}/{v.totalVisits} Visitas
                      </span>
                    </td>

                    {/* Venta Actual */}
                    <td className="py-3.5 px-4 text-right font-bold font-mono text-xs text-[#191c1e]">
                      {formatSoles(v.currentSales)}
                    </td>

                    {/* Acciones Rápidas */}
                    <td className="py-3.5 px-4 text-center">
                      <div className="flex items-center justify-center gap-2">
                        <button
                          onClick={() => onCallVendedor(v)}
                          className="p-1.5 rounded-lg bg-white border border-[#c6c6cd] text-[#191c1e] hover:bg-[#e6e8ea] transition-colors cursor-pointer"
                          title={`Llamar a ${v.name}`}
                        >
                          <Phone className="w-3.5 h-3.5" />
                        </button>
                        <button
                          onClick={() => onAttendanceClick(v)}
                          className="p-1.5 rounded-lg bg-white border border-[#c6c6cd] text-[#191c1e] hover:bg-[#e6e8ea] transition-colors cursor-pointer"
                          title="Registrar / Modificar Asistencia"
                        >
                          <CheckSquare className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Table Pagination */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-3 pt-3 border-t border-[#e0e3e5]">
          <span className="text-xs text-[#45464d]">
            Mostrando {paginatedVendedores.length} de {filteredVendedores.length} vendedores en la mesa
          </span>
          <div className="flex items-center gap-1.5">
            <button
              onClick={() => setCurrentPage((p) => Math.max(p - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 bg-white border border-[#c6c6cd] rounded-lg text-xs font-semibold text-[#191c1e] disabled:opacity-40 cursor-pointer"
            >
              Anterior
            </button>
            {Array.from({ length: totalPages }).map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentPage(idx + 1)}
                className={`w-7 h-7 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                  currentPage === idx + 1
                    ? 'bg-[#131b2e] text-white shadow-2xs'
                    : 'bg-white border border-[#c6c6cd] text-[#191c1e] hover:bg-[#e6e8ea]'
                }`}
              >
                {idx + 1}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(p + 1, totalPages))}
              disabled={currentPage === totalPages}
              className="px-3 py-1 bg-white border border-[#c6c6cd] rounded-lg text-xs font-semibold text-[#191c1e] disabled:opacity-40 cursor-pointer"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
