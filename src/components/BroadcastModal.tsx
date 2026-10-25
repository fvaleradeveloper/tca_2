import React, { useState } from 'react';
import { X, Send, Megaphone, CheckCircle2 } from 'lucide-react';

interface BroadcastModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSend: (message: string, priority: 'normal' | 'urgente') => void;
  mesaName: string;
}

export const BroadcastModal: React.FC<BroadcastModalProps> = ({
  isOpen,
  onClose,
  onSend,
  mesaName,
}) => {
  const [message, setMessage] = useState('');
  const [priority, setPriority] = useState<'normal' | 'urgente'>('urgente');
  const [sentSuccess, setSentSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!message.trim()) return;
    onSend(message, priority);
    setSentSuccess(true);
    setTimeout(() => {
      setSentSuccess(false);
      setMessage('');
      onClose();
    }, 1200);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#d8dadc] w-full max-w-lg overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-6 py-4 bg-[#131b2e] text-white">
          <div className="flex items-center gap-2.5">
            <Megaphone className="w-5 h-5 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Enviar Broadcast a la Mesa</h3>
              <p className="text-[11px] text-slate-300">{mesaName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="text-slate-400 hover:text-white p-1 rounded transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {sentSuccess ? (
          <div className="p-8 text-center flex flex-col items-center">
            <CheckCircle2 className="w-12 h-12 text-emerald-600 mb-3 animate-bounce" />
            <h4 className="font-bold text-base text-slate-900">¡Broadcast Enviado con Éxito!</h4>
            <p className="text-xs text-slate-500 mt-1">
              12 vendedores recibieron la alerta sonora y notificación en sus terminales móviles.
            </p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 flex flex-col gap-4">
            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Nivel de Prioridad
              </label>
              <div className="grid grid-cols-2 gap-2">
                <button
                  type="button"
                  onClick={() => setPriority('urgente')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    priority === 'urgente'
                      ? 'bg-red-50 border-red-500 text-red-700 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-red-600"></span>
                  Alerta Urgente (Push + Sonido)
                </button>
                <button
                  type="button"
                  onClick={() => setPriority('normal')}
                  className={`py-2 px-3 rounded-lg text-xs font-semibold border flex items-center justify-center gap-2 transition-all ${
                    priority === 'normal'
                      ? 'bg-slate-100 border-slate-900 text-slate-900 font-bold shadow-xs'
                      : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                  }`}
                >
                  <span className="w-2 h-2 rounded-full bg-slate-500"></span>
                  Aviso Informativo
                </button>
              </div>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1.5">
                Mensaje a los Vendedores
              </label>
              <textarea
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                placeholder="Ejemplo: Priorizar colocación de packs promocionales Nestlé D’Onofrio en clientes clase A antes de las 14:00 hrs..."
                rows={4}
                className="w-full text-xs p-3 rounded-lg border border-slate-300 focus:border-slate-900 focus:ring-1 focus:ring-slate-900 outline-none text-slate-800 resize-none"
                required
              />
              <p className="text-[11px] text-slate-400 mt-1">
                Se enviará en tiempo real a todos los terminales activos de la mesa de trabajo.
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2 border-t border-slate-100">
              <button
                type="button"
                onClick={onClose}
                className="px-4 py-2 text-xs font-medium text-slate-600 hover:bg-slate-100 rounded-lg transition-colors"
              >
                Cancelar
              </button>
              <button
                type="submit"
                className="px-4 py-2 text-xs font-bold text-white bg-[#131b2e] hover:bg-black rounded-lg flex items-center gap-2 shadow-sm transition-colors"
              >
                <Send className="w-3.5 h-3.5" />
                <span>Emitir Comunicado</span>
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
};
