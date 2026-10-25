import React, { useState } from 'react';
import { Vendedor, ClientVisit } from '../types';
import { CARLOS_GOMEZ_VISITS } from '../data/mockData';
import { 
  CheckCircle2, 
  Clock, 
  MapPin, 
  PlusCircle, 
  ShoppingBag, 
  TrendingUp, 
  AlertCircle,
  FileText,
  DollarSign,
  Phone
} from 'lucide-react';

interface VendedorViewProps {
  withIGV: boolean;
  selectedVendedor: Vendedor;
  onSelectVendedor: (v: Vendedor) => void;
  allVendedores: Vendedor[];
}

export const VendedorView: React.FC<VendedorViewProps> = ({
  withIGV,
  selectedVendedor,
  onSelectVendedor,
  allVendedores,
}) => {
  const [visits, setVisits] = useState<ClientVisit[]>(CARLOS_GOMEZ_VISITS);
  const [selectedVisit, setSelectedVisit] = useState<ClientVisit>(visits[4]); // Abarrotes Doña Juana (in progress)
  const [newOrderSKU, setNewOrderSKU] = useState('Gloria Azul 400g');
  const [newOrderQty, setNewOrderQty] = useState(10);
  const [orderRegisteredMessage, setOrderRegisteredMessage] = useState(false);

  const formatSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${Math.round(val).toLocaleString('en-US')}`;
  };

  const handleRegisterOrder = (e: React.FormEvent) => {
    e.preventDefault();
    const skuPrices: Record<string, number> = {
      'Gloria Azul 400g': 4.2,
      'Primor Clásico 900ml': 8.5,
      'Nescafé Tradición 50g': 7.9,
      'Fideos Don Vittorio 450g': 3.1,
    };

    const addedAmount = (skuPrices[newOrderSKU] || 5) * newOrderQty * 24; // packs of 24
    setVisits((prev) =>
      prev.map((vis) =>
        vis.id === selectedVisit.id
          ? {
              ...vis,
              status: 'completado',
              orderTotal: addedAmount,
              completedTime: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
            }
          : vis
      )
    );
    setOrderRegisteredMessage(true);
    setTimeout(() => setOrderRegisteredMessage(false), 2500);
  };

  return (
    <div className="flex flex-col w-full gap-4 pb-24 max-w-full overflow-x-hidden">
      {/* 1. TOMA DE PEDIDO - Lo primero que ve el vendedor */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-4 sm:p-6 rounded-xl shadow-xs w-full">
        <div className="flex items-center gap-2 mb-3 sm:mb-4">
          <ShoppingBag className="w-4 h-4 sm:w-5 sm:h-5 text-[#131b2e]" />
          <h3 className="font-bold text-sm sm:text-base text-[#191c1e]">
            Toma de Pedido Rápido
          </h3>
        </div>
        <p className="text-xs sm:text-sm text-[#45464d] mb-3 sm:mb-4">
          Cliente actual: <strong className="text-slate-900">{selectedVisit.clientName}</strong>
        </p>

        {orderRegisteredMessage ? (
          <div className="p-4 sm:p-5 bg-emerald-50 border border-emerald-300 rounded-xl text-center text-emerald-900">
            <CheckCircle2 className="w-8 h-8 sm:w-10 sm:h-10 text-emerald-600 mx-auto mb-2" />
            <h4 className="font-bold text-xs sm:text-sm">¡Pedido Registrado con Éxito!</h4>
            <p className="text-[10px] sm:text-[11px] mt-1">
              Enviado a almacén de despacho Callao para facturación.
            </p>
          </div>
        ) : (
          <form onSubmit={handleRegisterOrder} className="space-y-3 sm:space-y-4 w-full">
            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#45464d] mb-1">
                Seleccionar Producto / Línea
              </label>
              <select
                value={newOrderSKU}
                onChange={(e) => setNewOrderSKU(e.target.value)}
                className="w-full text-sm font-semibold p-2 sm:p-2.5 rounded-lg border border-[#c6c6cd] bg-white outline-none text-[#191c1e]"
              >
                <option value="Gloria Azul 400g">Leche Gloria Azul 400g (Pack x24)</option>
                <option value="Primor Clásico 900ml">Aceite Primor Clásico 900ml (Caja x12)</option>
                <option value="Nescafé Tradición 50g">Nescafé Tradición 50g (Display x24)</option>
                <option value="Fideos Don Vittorio 450g">Fideos Don Vittorio 450g (Fardo x20)</option>
              </select>
            </div>

            <div>
              <label className="block text-xs sm:text-sm font-semibold text-[#45464d] mb-1">
                Cantidad de Cajas / Fardos
              </label>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => setNewOrderQty((q) => Math.max(q - 1, 1))}
                  className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-white border border-[#c6c6cd] font-bold text-sm"
                >
                  -
                </button>
                <input
                  type="number"
                  value={newOrderQty}
                  onChange={(e) => setNewOrderQty(parseInt(e.target.value) || 1)}
                  className="flex-1 text-center font-mono font-bold text-xs sm:text-sm p-2 rounded-lg border border-[#c6c6cd] bg-white outline-none"
                />
                <button
                  type="button"
                  onClick={() => setNewOrderQty((q) => q + 1)}
                  className="w-8 sm:w-9 h-8 sm:h-9 rounded-lg bg-white border border-[#c6c6cd] font-bold text-sm"
                >
                  +
                </button>
              </div>
            </div>

            <div className="p-3 sm:p-4 bg-white border border-[#e0e3e5] rounded-lg">
              <div className="flex justify-between text-xs sm:text-sm text-slate-600 mb-1">
                <span>Subtotal Estimado:</span>
                <span className="font-mono">{formatSoles(newOrderQty * 95)}</span>
              </div>
              <div className="flex justify-between text-xs sm:text-sm font-bold text-[#191c1e] pt-1 border-t border-slate-100">
                <span>Total con IGV (18%):</span>
                <span className="font-mono text-emerald-700">
                  {formatSoles(newOrderQty * 95 * 1.18)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              className="w-full py-3 sm:py-2.5 bg-[#131b2e] hover:bg-black text-white font-bold text-xs sm:text-sm rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
            >
              <PlusCircle className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-400" />
              <span>Confirmar y Enviar Pedido</span>
            </button>
          </form>
        )}
      </div>

      {/* 2. Daily Progress Cards */}
      <div className="grid grid-cols-1 gap-4 w-full">
        {/* Sales vs Quota */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-4 sm:p-5 rounded-xl shadow-xs w-full">
          <span className="text-[10px] sm:text-xs font-bold text-[#45464d] uppercase">
            Venta del Día
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#191c1e] font-mono">
              {formatSoles(selectedVendedor.currentSales)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#00714d]">
              115% de cuota
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#76777d] mt-1">
            Meta diaria: {formatSoles(selectedVendedor.quotaTarget)}
          </p>
          <div className="w-full bg-[#e6e8ea] h-2 sm:h-2.5 rounded-full mt-2 sm:mt-3 overflow-hidden">
            <div className="bg-[#006c49] h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>

        {/* Visit Status */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-4 sm:p-5 rounded-xl shadow-xs w-full">
          <span className="text-[10px] sm:text-xs font-bold text-[#45464d] uppercase">
            Avance de Visitas de Hoy
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-[#191c1e] font-mono">
              {visits.filter((v) => v.status === 'completado').length} / {visits.length}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-[#00714d]">
              {Math.round((visits.filter((v) => v.status === 'completado').length / visits.length) * 100)}%
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#76777d] mt-1">
            {visits.filter((v) => v.status === 'pendiente').length} pendientes en hoja de ruta
          </p>
          <div className="w-full bg-[#e6e8ea] h-2 sm:h-2.5 rounded-full mt-2 sm:mt-3 overflow-hidden">
            <div className="bg-[#131b2e] h-full rounded-full" style={{ width: '62%' }}></div>
          </div>
        </div>

        {/* Commission Tracker */}
        <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-4 sm:p-5 rounded-xl shadow-xs w-full">
          <span className="text-[10px] sm:text-xs font-bold text-[#45464d] uppercase">
            Comisión Estimada (Día)
          </span>
          <div className="flex items-baseline gap-2 mt-2">
            <span className="text-xl sm:text-2xl font-extrabold text-emerald-700 font-mono">
              {formatSoles(380)}
            </span>
            <span className="text-[10px] sm:text-xs font-bold text-emerald-800 bg-emerald-100 px-1.5 py-0.5 rounded">
              Bono Superación
            </span>
          </div>
          <p className="text-[10px] sm:text-xs text-[#76777d] mt-1">
            Comisión base S/. 280 + Bono cuota &gt; 110%
          </p>
          <div className="w-full bg-[#e6e8ea] h-2 sm:h-2.5 rounded-full mt-2 sm:mt-3 overflow-hidden">
            <div className="bg-emerald-600 h-full rounded-full" style={{ width: '100%' }}></div>
          </div>
        </div>
      </div>

      {/* 3. Field Route Checklist */}
      <div className="bg-[#f2f4f6] border border-[#e0e3e5] p-4 sm:p-6 rounded-xl shadow-xs w-full">
        <div className="flex items-center justify-between mb-3 sm:mb-4 flex-wrap gap-2">
          <div>
            <h2 className="text-sm sm:text-base font-bold text-[#191c1e]">
              Hoja de Ruta de Visitas - Turno Mañana/Tarde
            </h2>
            <p className="text-[10px] sm:text-xs text-[#45464d]">
              Clientes bodegueros ordenados por secuencia óptima de recorrido
            </p>
          </div>
          <span className="text-[10px] sm:text-xs font-mono font-semibold text-slate-500">
            Distrito: Los Olivos / SMP
          </span>
        </div>

        <div className="space-y-2 sm:space-y-3">
          {visits.map((vis) => {
            const isSelected = selectedVisit.id === vis.id;
            return (
              <div
                key={vis.id}
                onClick={() => setSelectedVisit(vis)}
                className={`p-3 sm:p-4 rounded-xl border transition-all cursor-pointer flex items-center justify-between ${
                  isSelected
                    ? 'bg-white border-slate-900 shadow-xs'
                    : 'bg-white/80 border-[#e0e3e5] hover:bg-white'
                }`}
              >
                <div className="flex items-start gap-2 sm:gap-3">
                  <div className="mt-0.5 sm:mt-0 flex-shrink-0">
                    {vis.status === 'completado' ? (
                      <CheckCircle2 className="w-4 sm:w-5 h-4 sm:h-5 text-emerald-600" />
                    ) : vis.status === 'en_proceso' ? (
                      <Clock className="w-4 sm:w-5 h-4 sm:h-5 text-blue-600 animate-spin" />
                    ) : vis.status === 'rechazado' ? (
                      <AlertCircle className="w-4 sm:w-5 h-4 sm:h-5 text-red-600" />
                    ) : (
                      <div className="w-4 sm:w-5 h-4 sm:h-5 rounded-full border-2 border-slate-300"></div>
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-1.5">
                      <h4 className="font-bold text-xs sm:text-sm text-[#191c1e] truncate">
                        {vis.clientName}
                      </h4>
                      <span className="text-[9px] sm:text-[10px] text-slate-500 font-mono">({vis.scheduledTime})</span>
                    </div>
                    <p className="text-[9px] sm:text-[10px] text-[#45464d] flex items-center gap-1 mt-0.5">
                      <MapPin className="w-2.5 sm:w-3 h-2.5 sm:h-3 text-slate-400" />
                      {vis.address}, {vis.district}
                    </p>
                    {vis.notes && (
                      <p className="text-[9px] sm:text-[10px] text-slate-500 italic mt-1 bg-slate-50 px-2 py-0.5 rounded">
                        Nota: {vis.notes}
                      </p>
                    )}
                  </div>
                </div>

                <div className="text-right flex flex-col items-end flex-shrink-0">
                  {vis.orderTotal ? (
                    <span className="font-mono font-bold text-xs sm:text-sm text-emerald-700">
                      {formatSoles(vis.orderTotal)}
                    </span>
                  ) : (
                    <span className="text-[9px] sm:text-[10px] text-slate-400">Sin pedido</span>
                  )}

                  <span
                    className={`text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-full mt-1 ${
                      vis.status === 'completado'
                        ? 'bg-emerald-100 text-emerald-800'
                        : vis.status === 'en_proceso'
                        ? 'bg-blue-100 text-blue-800'
                        : vis.status === 'rechazado'
                        ? 'bg-red-100 text-red-800'
                        : 'bg-slate-100 text-slate-600'
                    }`}
                  >
                    {vis.status === 'completado'
                      ? 'Pedido Concretado'
                      : vis.status === 'en_proceso'
                      ? 'En Atención'
                      : vis.status === 'rechazado'
                      ? 'Rechazado / Reprog.'
                      : 'Por Visitar'}
                  </span>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
