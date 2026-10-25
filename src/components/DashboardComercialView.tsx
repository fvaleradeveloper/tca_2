import React from 'react';
import { 
  TrendingUp, 
  BarChart3, 
  PieChart, 
  ShoppingBag, 
  Store, 
  CheckCircle2, 
  ArrowUpRight,
  Truck
} from 'lucide-react';

interface DashboardComercialViewProps {
  withIGV: boolean;
  selectedZone: string;
}

export const DashboardComercialView: React.FC<DashboardComercialViewProps> = ({
  withIGV,
  selectedZone,
}) => {
  const formatSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${Math.round(val).toLocaleString('en-US')}`;
  };

  const topSKUs = [
    { name: 'Leche Gloria Evaporada Entera 400g', brand: 'Gloria', units: '42,500 und', total: 178500, share: 88 },
    { name: 'Aceite Primor Clásico Premium 900ml', brand: 'Alicorp', units: '28,100 und', total: 224800, share: 79 },
    { name: 'Nescafé Tradición Frasco 50g', brand: 'Nestlé', units: '19,400 und', total: 155200, share: 92 },
    { name: 'Fideos Don Vittorio Spaghetti 450g', brand: 'Alicorp', units: '36,200 und', total: 108600, share: 85 },
    { name: 'D’Onofrio Bombones Surtidos Caja', brand: 'Nestlé', units: '12,800 und', total: 140800, share: 74 },
  ];

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Title */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#45464d] font-bold">
            Inteligencia Comercial y Ventas
          </span>
          <h1 className="text-2xl font-bold text-[#191c1e] tracking-tight">
            Dashboard Comercial Consolidado - Lima
          </h1>
          <p className="text-sm text-[#45464d]">
            Métricas ejecutivas de facturación MTD, rotación de SKUs y cobertura de mercado.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <span className="text-xs font-semibold px-3 py-1.5 bg-emerald-100 text-emerald-800 rounded-lg flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-600 animate-pulse"></span>
            Cierre MTD al 92.5% de Meta
          </span>
        </div>
      </div>

      {/* 4 Commercial Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
            Facturación Mes (MTD)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] font-mono">
              {formatSoles(1480200)}
            </span>
            <span className="text-xs text-[#00714d] font-bold flex items-center">
              <TrendingUp className="w-3.5 h-3.5" /> +8.4%
            </span>
          </div>
          <p className="text-xs text-[#76777d] mt-1">Meta mensual: {formatSoles(1600000)}</p>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full" style={{ width: '92.5%' }}></div>
          </div>
        </div>

        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
            Drop Size Promedio
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] font-mono">
              {formatSoles(428)}
            </span>
            <span className="text-xs text-[#00714d] font-bold">+5.8%</span>
          </div>
          <p className="text-xs text-[#76777d] mt-1">Ticket por pedido en bodegas</p>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full" style={{ width: '84%' }}></div>
          </div>
        </div>

        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
            Cobertura de Puntos de Venta
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] font-mono">
              94.2%
            </span>
            <span className="text-xs text-[#76777d]">1,840 / 1,950 POS</span>
          </div>
          <p className="text-xs text-[#76777d] mt-1">Censo activo canal tradicional</p>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full" style={{ width: '94.2%' }}></div>
          </div>
        </div>

        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-5 rounded-xl shadow-xs">
          <span className="text-xs font-bold text-[#45464d] uppercase tracking-wide">
            Tasa Rechazo / No Venta
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-2xl font-extrabold text-[#191c1e] font-mono">
              1.8%
            </span>
            <span className="text-xs text-[#00714d] font-bold">Rango Óptimo</span>
          </div>
          <p className="text-xs text-[#76777d] mt-1">Umbral máximo permitido: 3.0%</p>
          <div className="w-full bg-[#e6e8ea] h-2 rounded-full mt-3 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full" style={{ width: '18%' }}></div>
          </div>
        </div>
      </div>

      {/* Grid: Zone comparison & Brand breakdown */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Sales by Zone */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs">
          <h2 className="text-base font-bold text-[#191c1e] mb-1">
            Distribución de Facturación por Macro Zonas
          </h2>
          <p className="text-xs text-[#45464d] mb-4">
            Participación de ingresos en Lima Metropolitana
          </p>

          <div className="space-y-4">
            <div>
              <div className="flex justify-between text-xs font-bold text-[#191c1e] mb-1">
                <span>Lima Norte (Los Olivos, SMP, Comas, Independencia)</span>
                <span className="font-mono">{formatSoles(520000)} (35%)</span>
              </div>
              <div className="w-full bg-[#e6e8ea] h-3 rounded-full overflow-hidden">
                <div className="bg-[#131b2e] h-full rounded-full" style={{ width: '35%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#191c1e] mb-1">
                <span>Lima Centro (Callao, Cercado, Breña, La Victoria)</span>
                <span className="font-mono">{formatSoles(410000)} (28%)</span>
              </div>
              <div className="w-full bg-[#e6e8ea] h-3 rounded-full overflow-hidden">
                <div className="bg-[#006c49] h-full rounded-full" style={{ width: '28%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#191c1e] mb-1">
                <span>Lima Sur (SJM, Villa El Salvador, Chorrillos)</span>
                <span className="font-mono">{formatSoles(340000)} (23%)</span>
              </div>
              <div className="w-full bg-[#e6e8ea] h-3 rounded-full overflow-hidden">
                <div className="bg-[#3f465c] h-full rounded-full" style={{ width: '23%' }}></div>
              </div>
            </div>

            <div>
              <div className="flex justify-between text-xs font-bold text-[#191c1e] mb-1">
                <span>Lima Este (SJL, Ate Vitarte, Santa Anita)</span>
                <span className="font-mono">{formatSoles(210200)} (14%)</span>
              </div>
              <div className="w-full bg-[#e6e8ea] h-3 rounded-full overflow-hidden">
                <div className="bg-[#76777d] h-full rounded-full" style={{ width: '14%' }}></div>
              </div>
            </div>
          </div>
        </div>

        {/* Brand Share */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs">
          <h2 className="text-base font-bold text-[#191c1e] mb-1">
            Participación por Línea Proveedora (Nestlé / Alicorp / Gloria)
          </h2>
          <p className="text-xs text-[#45464d] mb-4">
            Volumen comercializado y cumplimiento de cuotas de fabricante
          </p>

          <div className="grid grid-cols-3 gap-3 mb-5">
            <div className="p-3 bg-white border border-[#e0e3e5] rounded-lg text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Nestlé Perú</span>
              <span className="text-lg font-extrabold text-[#191c1e] font-mono">44.2%</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">+2.1% vs mes ant.</span>
            </div>
            <div className="p-3 bg-white border border-[#e0e3e5] rounded-lg text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Alicorp</span>
              <span className="text-lg font-extrabold text-[#191c1e] font-mono">34.0%</span>
              <span className="text-[10px] text-emerald-700 font-semibold block mt-0.5">+1.5% vs mes ant.</span>
            </div>
            <div className="p-3 bg-white border border-[#e0e3e5] rounded-lg text-center">
              <span className="text-[11px] font-bold text-slate-500 block">Leche Gloria</span>
              <span className="text-lg font-extrabold text-[#191c1e] font-mono">21.8%</span>
              <span className="text-[10px] text-slate-500 font-semibold block mt-0.5">Estable</span>
            </div>
          </div>

          <div className="p-3 bg-white border border-[#e0e3e5] rounded-lg">
            <div className="flex items-center justify-between text-xs mb-2">
              <span className="font-bold text-[#191c1e]">Mix de Canales</span>
              <span className="text-[#76777d]">Bodegas vs Mayoristas</span>
            </div>
            <div className="flex h-4 rounded-full overflow-hidden gap-1 p-0.5 bg-slate-100">
              <div className="bg-[#131b2e] h-full rounded-l-full" style={{ width: '82%' }}></div>
              <div className="bg-[#006c49] h-full rounded-r-full" style={{ width: '18%' }}></div>
            </div>
            <div className="flex justify-between text-[11px] text-[#45464d] mt-1.5">
              <span>Canal Tradicional (Bodegas / Mercados): 82%</span>
              <span>Mayoristas / Distribuidores: 18%</span>
            </div>
          </div>
        </div>
      </div>

      {/* Top SKUs Table */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-6 rounded-xl shadow-xs">
        <h2 className="text-base font-bold text-[#191c1e] mb-1">
          Top 5 SKUs de Mayor Rotación en Campo
        </h2>
        <p className="text-xs text-[#45464d] mb-4">
          Artículos clave de distribución con mayor velocidad de reposición
        </p>

        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse text-xs">
            <thead>
              <tr className="bg-[#131b2e] text-white uppercase text-[10px] tracking-wider">
                <th className="py-2.5 px-4 rounded-l-lg">Producto / SKU</th>
                <th className="py-2.5 px-4">Marca</th>
                <th className="py-2.5 px-4">Unidades Vendidas</th>
                <th className="py-2.5 px-4 text-right">Facturación</th>
                <th className="py-2.5 px-4 text-center rounded-r-lg">Efectividad Colocación</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-[#e0e3e5] text-slate-800">
              {topSKUs.map((sku, i) => (
                <tr key={i} className="hover:bg-white/60">
                  <td className="py-3 px-4 font-semibold text-[#191c1e]">{sku.name}</td>
                  <td className="py-3 px-4">
                    <span className="px-2 py-0.5 rounded bg-slate-200 text-slate-800 font-bold text-[10px]">
                      {sku.brand}
                    </span>
                  </td>
                  <td className="py-3 px-4 font-mono">{sku.units}</td>
                  <td className="py-3 px-4 text-right font-mono font-bold text-[#191c1e]">
                    {formatSoles(sku.total)}
                  </td>
                  <td className="py-3 px-4 text-center">
                    <span className="text-emerald-700 font-bold font-mono">{sku.share}%</span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
