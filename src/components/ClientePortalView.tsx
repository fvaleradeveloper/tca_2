import React, { useState } from 'react';
import { ProductoMaestro } from '../types';
import { Search, ShoppingCart, Calendar, Phone, Plus, CheckCircle2, Clock, X } from 'lucide-react';

interface ClientePortalViewProps {
  productosMaestros: ProductoMaestro[];
  onCrearPedidoRapido: (pedido: any) => void;
  onSolicitarVisita: (solicitud: any) => void;
  vendedorAsignado: { id: string; name: string; phone: string };
}

export const ClientePortalView: React.FC<ClientePortalViewProps> = ({
  productosMaestros,
  onCrearPedidoRapido,
  onSolicitarVisita,
  vendedorAsignado,
}) => {
  const [tab, setTab] = useState<'pedido' | 'visita' | 'mis-pedidos'>('pedido');
  const [carrito, setCarrito] = useState<Array<{ producto: ProductoMaestro; cantidad: number }>>([]);
  const [search, setSearch] = useState('');
  const [fechaPreferida, setFechaPreferida] = useState('');
  const [horaPreferida, setHoraPreferida] = useState('');
  const [motivo, setMotivo] = useState('');
  const [observaciones, setObservaciones] = useState('');
  const [msg, setMsg] = useState('');

  const filProd = productosMaestros.filter((p) =>
    p.activo && (p.descripcion.toLowerCase().includes(search.toLowerCase()) || p.codigo.toLowerCase().includes(search.toLowerCase()))
  );

  const agregar = (producto: ProductoMaestro) => {
    setCarrito((prev) => {
      const existe = prev.find((c) => c.producto.id === producto.id);
      if (existe) return prev.map((c) => c.producto.id === producto.id ? { ...c, cantidad: c.cantidad + 1 } : c);
      return [...prev, { producto, cantidad: 1 }];
    });
  };

  const cambiarCantidad = (id: string, cant: number) => {
    setCarrito((prev) => prev.map((c) => c.producto.id === id ? { ...c, cantidad: Math.max(1, cant) } : c).filter((c) => c.cantidad > 0));
  };

  const total = carrito.reduce((sum, c) => sum + c.producto.precioVenta * c.cantidad, 0);

  const enviarPedido = () => {
    if (carrito.length === 0) return;
    const items = carrito.map((c) => ({
      productoId: c.producto.id,
      descripcion: c.producto.descripcion,
      cantidad: c.cantidad,
      precioUnitario: c.producto.precioVenta,
      subtotal: c.producto.precioVenta * c.cantidad,
    }));
    onCrearPedidoRapido({ items, total, observacionesCliente: observaciones });
    setCarrito([]);
    setObservaciones('');
    setMsg('Pedido rápido enviado. El vendedor revisará y ajustará descuentos/ofertas antes de confirmar.');
    setTimeout(() => setMsg(''), 4000);
  };

  const enviarSolicitud = () => {
    if (!fechaPreferida || !horaPreferida) return;
    onSolicitarVisita({ fechaPreferida, horaPreferida, motivo });
    setFechaPreferida('');
    setHoraPreferida('');
    setMotivo('');
    setMsg('Solicitud de visita enviada al vendedor.');
    setTimeout(() => setMsg(''), 3000);
  };

  return (
    <div className="flex flex-col gap-4 pb-24 max-w-5xl mx-auto w-full">
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold text-[#191c1e] dark:text-[#f1f5f9]">Portal Cliente</h1>
            <p className="text-xs sm:text-sm text-[#45464d] dark:text-[#cbd5e1]">
              Vendedor asignado: <span className="font-semibold">{vendedorAsignado.name}</span> · {vendedorAsignado.phone}
            </p>
          </div>
          <a href={`tel:${vendedorAsignado.phone}`} className="flex items-center gap-2 px-3 py-2 bg-[#131b2e] text-white rounded-lg text-xs font-bold">
            <Phone className="w-4 h-4" /> Llamar a vendedor
          </a>
        </div>
        <div className="flex gap-2 mt-4">
          {[
            { id: 'pedido' as const, label: 'Pedido Rápido', icon: <ShoppingCart className="w-4 h-4" /> },
            { id: 'visita' as const, label: 'Solicitar Visita', icon: <Calendar className="w-4 h-4" /> },
          ].map((t) => (
            <button key={t.id} onClick={() => setTab(t.id)} className={`flex items-center gap-1.5 px-3 py-2 text-xs sm:text-sm font-bold rounded-lg ${tab === t.id ? 'bg-[#131b2e] text-white' : 'bg-white dark:bg-[#1e293b] text-[#45464d] dark:text-[#cbd5e1]'}`}>
              {t.icon}{t.label}
            </button>
          ))}
        </div>
        {msg && <div className="mt-3 p-2 bg-emerald-50 text-emerald-800 rounded-lg text-xs font-semibold flex items-center gap-2"><CheckCircle2 className="w-4 h-4" />{msg}</div>}
      </div>

      {tab === 'pedido' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
          <div className="lg:col-span-2 bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 rounded-xl shadow-xs">
            <div className="flex items-center gap-2 mb-3">
              <Search className="w-4 h-4 text-slate-400" />
              <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Buscar producto..." className="flex-1 p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b]" />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[400px] overflow-y-auto">
              {filProd.map((p) => (
                <button key={p.id} onClick={() => agregar(p)} className="p-3 text-left bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-lg hover:border-slate-900">
                  <div className="font-semibold text-sm text-[#191c1e] dark:text-[#f1f5f9]">{p.descripcion}</div>
                  <div className="text-xs text-[#45464d] dark:text-[#cbd5e1]">{p.marca} · {p.codigo}</div>
                  <div className="text-sm font-mono font-bold text-emerald-700 mt-1">S/. {p.precioVenta.toFixed(2)}</div>
                </button>
              ))}
            </div>
          </div>
          <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 rounded-xl shadow-xs">
            <h3 className="font-bold text-sm mb-3 flex items-center gap-2"><ShoppingCart className="w-4 h-4" />Mi Pedido Rápido</h3>
            {carrito.length === 0 && <p className="text-xs text-slate-500">Agrega productos</p>}
            <div className="space-y-2 max-h-[250px] overflow-y-auto">
              {carrito.map((c) => (
                <div key={c.producto.id} className="flex items-center justify-between p-2 bg-white dark:bg-[#1e293b] rounded-lg border border-[#e0e3e5] dark:border-[#334155]">
                  <div className="flex-1 min-w-0">
                    <div className="text-xs font-semibold truncate">{c.producto.descripcion}</div>
                    <div className="text-[10px] text-slate-500">S/. {c.producto.precioVenta.toFixed(2)}</div>
                  </div>
                  <div className="flex items-center gap-1">
                    <button onClick={() => cambiarCantidad(c.producto.id, c.cantidad - 1)} className="px-2 text-xs">-</button>
                    <span className="text-xs font-mono w-6 text-center">{c.cantidad}</span>
                    <button onClick={() => cambiarCantidad(c.producto.id, c.cantidad + 1)} className="px-2 text-xs">+</button>
                  </div>
                </div>
              ))}
            </div>
            <textarea value={observaciones} onChange={(e) => setObservaciones(e.target.value)} placeholder="Observaciones para el vendedor..." className="w-full mt-3 p-2 text-xs rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b]" rows={2} />
            <div className="flex justify-between text-sm font-bold mt-2"><span>Total</span><span className="font-mono">S/. {total.toFixed(2)}</span></div>
            <button onClick={enviarPedido} className="w-full mt-3 py-2 bg-[#131b2e] text-white text-xs font-bold rounded-lg">Enviar Pedido Rápido al Vendedor</button>
            <p className="text-[10px] text-slate-500 mt-2">El vendedor verá este adelanto y podrá colocar descuentos/ofertas antes de confirmar.</p>
          </div>
        </div>
      )}

      {tab === 'visita' && (
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 sm:p-6 rounded-xl shadow-xs max-w-xl">
          <h3 className="font-bold text-sm mb-4">Solicitar Visita del Vendedor</h3>
          <div className="space-y-3">
            <div>
              <label className="text-xs font-semibold">Fecha preferida</label>
              <input type="date" value={fechaPreferida} onChange={(e) => setFechaPreferida(e.target.value)} className="w-full mt-1 p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b]" />
            </div>
            <div>
              <label className="text-xs font-semibold">Hora preferida</label>
              <input type="time" value={horaPreferida} onChange={(e) => setHoraPreferida(e.target.value)} className="w-full mt-1 p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b]" />
            </div>
            <div>
              <label className="text-xs font-semibold">Motivo</label>
              <textarea value={motivo} onChange={(e) => setMotivo(e.target.value)} className="w-full mt-1 p-2 text-sm rounded-lg border border-[#c6c6cd] dark:border-[#475569] bg-white dark:bg-[#1e293b]" rows={3} placeholder="Ej. Necesito renovar stock" />
            </div>
            <button onClick={enviarSolicitud} className="w-full py-2 bg-[#131b2e] text-white text-xs font-bold rounded-lg">Solicitar Visita</button>
          </div>
        </div>
      )}
    </div>
  );
};
