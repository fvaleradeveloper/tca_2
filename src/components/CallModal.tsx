import React, { useState } from 'react';
import { Vendedor } from '../types';
import { X, Phone, PhoneCall, Check, MessageSquare } from 'lucide-react';

interface CallModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendedor: Vendedor | null;
  onLogCallNote: (vendedorId: string, note: string) => void;
}

export const CallModal: React.FC<CallModalProps> = ({
  isOpen,
  onClose,
  vendedor,
  onLogCallNote,
}) => {
  const [callStatus, setCallStatus] = useState<'idle' | 'calling' | 'connected' | 'completed'>('idle');
  const [note, setNote] = useState('');

  if (!isOpen || !vendedor) return null;

  const handleStartCall = () => {
    setCallStatus('calling');
    setTimeout(() => {
      setCallStatus('connected');
    }, 1500);
  };

  const handleHangup = () => {
    setCallStatus('completed');
  };

  const handleSaveAndClose = () => {
    if (note.trim()) {
      onLogCallNote(vendedor.id, note);
    }
    setCallStatus('idle');
    setNote('');
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#d8dadc] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 bg-[#131b2e] text-white">
          <div className="flex items-center gap-2.5">
            <Phone className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Comunícarse con Vendedor</h3>
              <p className="text-[11px] text-slate-300">{vendedor.name} · {vendedor.route}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="p-5 flex flex-col gap-4">
          {/* Rep Summary card */}
          <div className="flex items-center justify-between p-3 bg-slate-50 border border-slate-200 rounded-lg">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-sm">
                {vendedor.initials}
              </div>
              <div>
                <p className="font-bold text-xs text-slate-900">{vendedor.name}</p>
                <p className="text-[11px] text-slate-500 font-mono">{vendedor.phone}</p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-[11px] text-slate-500 block">Efectividad Visitas</span>
              <span className="text-xs font-bold text-slate-900">
                {Math.round((vendedor.completedVisits / vendedor.totalVisits) * 100)}% ({vendedor.completedVisits}/{vendedor.totalVisits})
              </span>
            </div>
          </div>

          {/* Call Simulator Stage */}
          <div className="py-2 text-center">
            {callStatus === 'idle' && (
              <button
                onClick={handleStartCall}
                className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs rounded-lg flex items-center justify-center gap-2 shadow-sm transition-all"
              >
                <PhoneCall className="w-4 h-4" />
                <span>Iniciar Llamada de Voz ({vendedor.phone})</span>
              </button>
            )}

            {callStatus === 'calling' && (
              <div className="p-4 bg-blue-50 border border-blue-200 rounded-lg text-blue-900 flex flex-col items-center gap-2">
                <span className="w-3 h-3 rounded-full bg-blue-600 animate-ping"></span>
                <p className="text-xs font-bold">Marcando a terminal de campo...</p>
                <p className="text-[11px] text-blue-700">Esperando respuesta de {vendedor.name}</p>
              </div>
            )}

            {callStatus === 'connected' && (
              <div className="p-4 bg-emerald-50 border border-emerald-300 rounded-lg text-emerald-900 flex flex-col items-center gap-2">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span>
                  <span className="text-xs font-bold font-mono">00:42 · En Llamada Activa</span>
                </div>
                <button
                  onClick={handleHangup}
                  className="mt-2 py-1.5 px-4 bg-red-600 hover:bg-red-700 text-white font-bold text-xs rounded-lg shadow-xs"
                >
                  Finalizar Llamada
                </button>
              </div>
            )}

            {callStatus === 'completed' && (
              <div className="p-3 bg-slate-100 rounded-lg text-xs font-semibold text-slate-700">
                Llamada completada (Duración: 1m 15s)
              </div>
            )}
          </div>

          {/* Quick Call Note */}
          <div>
            <label className="block text-xs font-bold text-slate-700 mb-1 flex items-center gap-1.5">
              <MessageSquare className="w-3.5 h-3.5 text-slate-500" />
              <span>Bitácora de Supervisión (Opcional)</span>
            </label>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Ej: Se coordinó apoyo con supervisor para destrabar pedido en ruta..."
              rows={3}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 outline-none"
            />
          </div>

          <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
            <button
              onClick={handleSaveAndClose}
              className="px-4 py-2 text-xs font-bold bg-[#131b2e] text-white rounded-lg hover:bg-black transition-colors"
            >
              Guardar y Cerrar
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
