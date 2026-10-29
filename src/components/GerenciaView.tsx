import React, { useState } from 'react';
import { 
  Building2, 
  TrendingUp, 
  DollarSign, 
  Percent, 
  Truck, 
  ShieldCheck, 
  CheckCircle2, 
  Award,
  Sliders,
  AlertCircle
} from 'lucide-react';

interface GerenciaViewProps {
  withIGV: boolean;
}

export const GerenciaView: React.FC<GerenciaViewProps> = ({ withIGV }) => {
  const [approvedCreditMessage, setApprovedCreditMessage] = useState(false);

  const formatSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${Math.round(val).toLocaleString('en-US')}`;
  };

  const zonesData = [
    {
      zone: 'Lima Norte',
      supervisor: 'Carlos Mendoza (Líder Alfa)',
      reps: 12,
      sales: 1480200,
      quota: 1550000,
      compliance: 95.5,
      margin: 29.1,
      status: 'Líder Regional',
    },
    {
      zone: 'Lima Centro',
      supervisor: 'Jorge Ramirez',
      reps: 10,
      sales: 1120400,
      quota: 1200000,
      compliance: 93.4,
      margin: 28.6,
      status: 'En Meta',
    },
    {
      zone: 'Lima Sur',
      supervisor: 'Ana Lucía Torres',
      reps: 9,
      sales: 890300,
      quota: 920000,
      compliance: 96.8,
      margin: 27.9,
      status: 'Superando Meta',
    },
    {
      zone: 'Lima Este',
      supervisor: 'Miguel Salcedo',
      reps: 8,
      sales: 640100,
      quota: 710000,
      compliance: 90.1,
      margin: 28.0,
      status: 'Atención Requerida',
    },
  ];

  const handleApproveCredit = () => {
    setApprovedCreditMessage(true);
    setTimeout(() => setApprovedCreditMessage(false), 3000);
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Executive Title */}
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#45464d] dark:text-[#cbd5e1] font-bold">
            Dirección General & Finanzas
          </span>
          <h1 className="text-2xl font-bold text-[#191c1e] dark:text-[#f1f5f9] tracking-tight">
            Panel de Control Ejecutivo - Vista Gerencia
          </h1>
          <p className="text-sm text-[#45464d] dark:text-[#cbd5e1]">
            Rendimiento consolidado, rentabilidad bruta por zona y acuerdos comerciales.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleApproveCredit}
            className="px-3.5 py-2 bg-[#131b2e] hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-2 cursor-pointer transition-colors"
          >
            <Award className="w-3.5 h-3.5 text-emerald-400" />
            <span>Autorizar Bonificación Mensual</span>
          </button>
        </div>
      </div>

      {approvedCreditMessage && (
        <div className="p-3 bg-emerald-50 border border-emerald-300 text-emerald-900 text-xs font-semibold rounded-xl flex items-center gap-2 animate-in fade-in duration-200">
          <CheckCircle2 className="w-4 h-4 text-emerald-600 shrink-0" />
          <span>
            Autorización de escala de bonificaciones MTD aprobada y transferida al sistema de nóminas.
          </span>
        </div>
      )}

      {/* 4 Executive C-Level Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] dark:text-[#cbd5e1] uppercase">
            Facturación Consolidada Lima
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] dark:text-[#f1f5f9] font-mono">
              {formatSoles(4131000)}
            </span>
            <span className="text-xs text-[#00714d] font-bold">+11.2%</span>
          </div>
          <p className="text-xs text-[#76777d] dark:text-[#94a3b8] mt-1">Presupuesto: {formatSoles(4380000)}</p>
          <div className="w-full bg-[#e6e8ea] dark:bg-[#475569] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full" style={{ width: '94.3%' }}></div>
          </div>
        </div>

        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] dark:text-[#cbd5e1] uppercase">
            Margen Bruto Ponderado
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-emerald-700 font-mono">
              28.4%
            </span>
            <span className="text-xs text-emerald-800 font-bold bg-emerald-100 px-1.5 py-0.5 rounded">
              +0.9% vs Meta
            </span>
          </div>
          <p className="text-xs text-[#76777d] dark:text-[#94a3b8] mt-1">Meta corporativa anual: 27.5%</p>
          <div className="w-full bg-[#e6e8ea] dark:bg-[#475569] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full" style={{ width: '88%' }}></div>
          </div>
        </div>

        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] dark:text-[#cbd5e1] uppercase">
            Fuerza de Ventas Activa
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] dark:text-[#f1f5f9] font-mono">
              39 Vendedores
            </span>
            <span className="text-xs text-[#45464d] dark:text-[#cbd5e1]">4 Zonas</span>
          </div>
          <p className="text-xs text-[#76777d] dark:text-[#94a3b8] mt-1">Cero rotación no planificada este mes</p>
          <div className="w-full bg-[#e6e8ea] dark:bg-[#475569] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] dark:text-[#cbd5e1] uppercase">
            Entrega On-Time & In-Full (OTIF)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] dark:text-[#f1f5f9] font-mono">
              97.1%
            </span>
            <span className="text-xs text-[#00714d] font-bold">Excelente</span>
          </div>
          <p className="text-xs text-[#76777d] dark:text-[#94a3b8] mt-1">Despachos completados desde Callao</p>
          <div className="w-full bg-[#e6e8ea] dark:bg-[#475569] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full" style={{ width: '97.1%' }}></div>
          </div>
        </div>
      </div>

      {/* Regional Comparison Matrix */}
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-6 rounded-xl shadow-xs">
        <h2 className="text-base font-bold text-[#191c1e] dark:text-[#f1f5f9] mb-1">
          Matriz de Rendimiento Regional - Lima Metropolitana
        </h2>
        <p className="text-xs text-[#45464d] dark:text-[#cbd5e1] mb-4">
          Comparativo de facturación, cuotas y rentabilidad bruta por mesa de trabajo
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#131b2e] text-white uppercase text-[10px] tracking-wider">
                <th className="py-3 px-4 rounded-l-lg">Zona Operativa</th>
                <th className="py-3 px-4">Líder Supervisor</th>
                <th className="py-3 px-4 text-center">Fuerza de Ventas</th>
                <th className="py-3 px-4 text-right">Facturación Actual</th>
                <th className="py-3 px-4 text-right">Cuota Asignada</th>
                <th className="py-3 px-4 text-center">Cumplimiento</th>
                <th className="py-3 px-4 text-center">Margen Bruto</th>
                <th className="py-3 px-4 text-center rounded-r-lg">Diagnóstico</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e5] text-slate-800">
              {zonesData.map((z, idx) => (
                <tr key={idx} className="hover:bg-white dark:bg-[#1e293b]/60">
                  <td className="py-3 px-4 font-bold text-[#191c1e] dark:text-[#f1f5f9]">{z.zone}</td>
                  <td className="py-3 px-4 font-semibold text-slate-700 dark:text-slate-200">{z.supervisor}</td>
                  <td className="py-3 px-4 text-center font-mono">{z.reps} ejecutivos</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#191c1e] dark:text-[#f1f5f9]">
                    {formatSoles(z.sales)}
                  </td>
                  <td className="py-3 px-4 text-right font-mono text-slate-600 dark:text-slate-300">
                    {formatSoles(z.quota)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span
                      className={`font-mono font-bold px-2 py-0.5 rounded-full ${
                        z.compliance >= 95
                          ? 'bg-emerald-100 text-emerald-800'
                          : z.compliance >= 90
                          ? 'bg-blue-100 text-blue-800'
                          : 'bg-amber-100 text-amber-800'
                      }`}
                    >
                      {z.compliance}%
                    </span>
                  </td>
                  <td className="py-3 px-4 text-center font-mono font-bold text-slate-800">
                    {z.margin}%
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-[11px] font-semibold text-slate-600 dark:text-slate-300">
                      {z.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Strategic Supplier Rebates */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="p-5 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-[#191c1e] dark:text-[#f1f5f9]">Rebate Anual Nestlé</h4>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
              Alcanzado
            </span>
          </div>
          <p className="text-2xl font-mono font-extrabold text-[#191c1e] dark:text-[#f1f5f9]">3.2%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            Meta de volumen superada en líneas de Lácteos y Chocolatería.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-[#191c1e] dark:text-[#f1f5f9]">Rebate Anual Alicorp</h4>
            <span className="px-2 py-0.5 bg-blue-100 text-blue-800 text-[10px] font-bold rounded">
              En Camino (96%)
            </span>
          </div>
          <p className="text-2xl font-mono font-extrabold text-[#191c1e] dark:text-[#f1f5f9]">2.8%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            Foco en aceites Primor y fideos Don Vittorio en Lima Norte.
          </p>
        </div>

        <div className="p-5 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-xl shadow-xs">
          <div className="flex items-center justify-between mb-2">
            <h4 className="font-bold text-xs text-[#191c1e] dark:text-[#f1f5f9]">Rebate Leche Gloria</h4>
            <span className="px-2 py-0.5 bg-emerald-100 text-emerald-800 text-[10px] font-bold rounded">
              Alcanzado
            </span>
          </div>
          <p className="text-2xl font-mono font-extrabold text-[#191c1e] dark:text-[#f1f5f9]">2.0%</p>
          <p className="text-[11px] text-slate-500 dark:text-slate-400 dark:text-slate-500 mt-1">
            Distribución intensiva cumplida en canal bodegas tradicionales.
          </p>
        </div>
      </div>
    </div>
  );
};
