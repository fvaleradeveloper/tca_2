import React, { useState } from 'react';
import { Vendedor } from '../types';
import { 
  FileSpreadsheet, 
  Download, 
  Printer, 
  Filter, 
  Calendar, 
  CheckCircle2, 
  FileText,
  Table
} from 'lucide-react';

interface ReportesExportarViewProps {
  vendedores: Vendedor[];
  withIGV: boolean;
}

export const ReportesExportarView: React.FC<ReportesExportarViewProps> = ({
  vendedores,
  withIGV,
}) => {
  const [selectedBrand, setSelectedBrand] = useState('Todas');
  const [selectedZone, setSelectedZone] = useState('Todas');
  const [reportType, setReportType] = useState('Cierre Diario Operativo');
  const [downloadSuccess, setDownloadSuccess] = useState(false);

  const formatSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${Math.round(val).toLocaleString('en-US')}`;
  };

  // Filtered rows
  const filtered = vendedores.filter((v) => {
    if (selectedZone !== 'Todas' && v.zone !== selectedZone) return false;
    return true;
  });

  const totalFilteredSales = filtered.reduce((acc, v) => acc + v.currentSales, 0);

  // Generate real CSV download
  const handleExportCSV = () => {
    const headers = ['Vendedor', 'Ruta', 'Zona', 'Supervisor', 'Asistencia', 'Hora Marcacion', 'Venta Actual S/.', 'Cuota S/.', 'Cumplimiento %', 'Efectividad Visitas'];
    const rows = filtered.map((v) => {
      const salesVal = withIGV ? v.currentSales : Math.round(v.currentSales / 1.18);
      const quotaVal = withIGV ? v.quotaTarget : Math.round(v.quotaTarget / 1.18);
      const comp = Math.round((v.currentSales / v.quotaTarget) * 100);
      const eff = Math.round((v.completedVisits / v.totalVisits) * 100);
      return [
        `"${v.name}"`,
        `"${v.route}"`,
        `"${v.zone}"`,
        `"${v.supervisor}"`,
        `"${v.attendanceStatus}"`,
        `"${v.checkInTime}"`,
        salesVal,
        quotaVal,
        `${comp}%`,
        `${eff}% (${v.completedVisits}/${v.totalVisits})`,
      ].join(',');
    });

    const csvContent = 'data:text/csv;charset=utf-8,\uFEFF' + [headers.join(','), ...rows].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `total_calidad_reporte_${withIGV ? 'con_igv' : 'sin_igv'}_${new Date().toISOString().slice(0, 10)}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);

    setDownloadSuccess(true);
    setTimeout(() => setDownloadSuccess(false), 2500);
  };

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Title */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#45464d] font-bold">
            Auditoría Comercial & Exportación
          </span>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
            Centro de Reportes y Descargas
          </h1>
          <p className="text-sm text-[#45464d]">
            Construcción de consultas personalizadas, liquidación de rutas y exportación a Excel / CSV.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handlePrint}
            className="px-3.5 py-2 bg-white border border-[#c6c6cd] hover:bg-slate-100 text-[#191c1e] text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Imprimir Vista</span>
          </button>
          <button
            onClick={handleExportCSV}
            className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
          >
            <Download className="w-3.5 h-3.5" />
            <span>Descargar CSV / Excel</span>
          </button>
        </div>
      </div>

      {downloadSuccess && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>¡Archivo CSV exportado exitosamente! Descarga iniciada en su navegador.</span>
        </div>
      )}

      {/* Query Filters */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs">
        <h3 className="text-xs font-bold text-[#45464d] uppercase tracking-wider mb-4 flex items-center gap-1.5">
          <Filter className="w-3.5 h-3.5" />
          <span>Parámetros de Consulta</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          <div>
            <label className="block text-[11px] font-semibold text-[#45464d] mb-1">
              Tipo de Informe
            </label>
            <select
              value={reportType}
              onChange={(e) => setReportType(e.target.value)}
              className="w-full bg-white border border-[#c6c6cd] rounded-lg px-3 py-2 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs"
            >
              <option value="Cierre Diario Operativo">Cierre Diario Operativo</option>
              <option value="Liquidación de Preventa">Liquidación de Preventa</option>
              <option value="Auditoría de Asistencia">Auditoría de Asistencia</option>
              <option value="Efectividad de Cobertura">Efectividad de Cobertura</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#45464d] mb-1">
              Filtrar por Zona
            </label>
            <select
              value={selectedZone}
              onChange={(e) => setSelectedZone(e.target.value)}
              className="w-full bg-white border border-[#c6c6cd] rounded-lg px-3 py-2 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs"
            >
              <option value="Todas">Todas las Zonas</option>
              <option value="Lima Norte">Lima Norte</option>
              <option value="Lima Sur">Lima Sur</option>
              <option value="Lima Este">Lima Este</option>
              <option value="Lima Centro">Lima Centro</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#45464d] mb-1">
              Línea de Fabricante
            </label>
            <select
              value={selectedBrand}
              onChange={(e) => setSelectedBrand(e.target.value)}
              className="w-full bg-white border border-[#c6c6cd] rounded-lg px-3 py-2 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs"
            >
              <option value="Todas">Todas las Líneas</option>
              <option value="Nestle">Nestlé Perú</option>
              <option value="Alicorp">Alicorp Consumo</option>
              <option value="Gloria">Leche Gloria</option>
            </select>
          </div>

          <div>
            <label className="block text-[11px] font-semibold text-[#45464d] mb-1">
              Rango de Fecha
            </label>
            <input
              type="date"
              defaultValue="2023-10-24"
              className="w-full bg-white border border-[#c6c6cd] rounded-lg px-3 py-2 text-xs font-semibold text-[#191c1e] outline-none shadow-2xs"
            />
          </div>
        </div>
      </div>

      {/* Preview Summary Strip */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold uppercase">Registros Filtrados</span>
          <p className="text-xl font-bold font-mono text-[#191c1e] mt-1">{filtered.length} Vendedores</p>
        </div>
        <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold uppercase">Facturación Total del Reporte</span>
          <p className="text-xl font-bold font-mono text-[#191c1e] mt-1">{formatSoles(totalFilteredSales)}</p>
        </div>
        <div className="p-4 bg-white border border-[#e0e3e5] rounded-xl shadow-xs">
          <span className="text-[11px] text-slate-500 font-bold uppercase">Régimen Fiscal</span>
          <p className="text-xl font-bold font-mono text-emerald-700 mt-1">
            {withIGV ? 'Valores con IGV (18%)' : 'Valores Base (Sin IGV)'}
          </p>
        </div>
      </div>

      {/* Data Table Preview */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-sm font-bold text-[#191c1e] flex items-center gap-2">
            <Table className="w-4 h-4 text-slate-500" />
            <span>Vista Previa de la Consulta ({reportType})</span>
          </h3>
          <span className="text-xs text-[#76777d]">Formato de exportación listo para Excel</span>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#131b2e] text-white uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-3 rounded-l-lg">Vendedor</th>
                <th className="py-2.5 px-3">Ruta</th>
                <th className="py-2.5 px-3">Zona</th>
                <th className="py-2.5 px-3">Marcación</th>
                <th className="py-2.5 px-3 text-right">Venta Actual</th>
                <th className="py-2.5 px-3 text-right">Cuota Asignada</th>
                <th className="py-2.5 px-3 text-center">Cumplimiento</th>
                <th className="py-2.5 px-3 text-center rounded-r-lg">Efectividad Visitas</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e5] text-slate-800">
              {filtered.map((v) => {
                const comp = Math.round((v.currentSales / v.quotaTarget) * 100);
                const eff = Math.round((v.completedVisits / v.totalVisits) * 100);
                return (
                  <tr key={v.id} className="hover:bg-white/60">
                    <td className="py-3 px-3 font-semibold text-[#191c1e]">{v.name}</td>
                    <td className="py-3 px-3">{v.route}</td>
                    <td className="py-3 px-3 text-slate-600">{v.zone}</td>
                    <td className="py-3 px-3">
                      <span
                        className={`px-2 py-0.5 rounded text-[10px] font-bold ${
                          v.attendanceStatus === 'Presente'
                            ? 'bg-emerald-100 text-emerald-800'
                            : 'bg-red-100 text-red-800'
                        }`}
                      >
                        {v.attendanceStatus} ({v.checkInTime})
                      </span>
                    </td>
                    <td className="py-3 px-3 text-right font-mono font-bold text-[#191c1e]">
                      {formatSoles(v.currentSales)}
                    </td>
                    <td className="py-3 px-3 text-right font-mono text-slate-600">
                      {formatSoles(v.quotaTarget)}
                    </td>
                    <td className="py-3 px-3 text-center font-mono font-bold">
                      <span className={comp >= 100 ? 'text-emerald-700' : 'text-slate-800'}>
                        {comp}%
                      </span>
                    </td>
                    <td className="py-3 px-3 text-center font-mono">
                      {eff}% ({v.completedVisits}/{v.totalVisits})
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
