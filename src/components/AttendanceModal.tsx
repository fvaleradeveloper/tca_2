import React, { useState } from 'react';
import { Vendedor } from '../types';
import { X, CheckCircle2, Clock, AlertTriangle, UserX } from 'lucide-react';

interface AttendanceModalProps {
  isOpen: boolean;
  onClose: () => void;
  vendedor: Vendedor | null;
  onUpdateAttendance: (vendedorId: string, status: Vendedor['attendanceStatus'], time: string) => void;
}

export const AttendanceModal: React.FC<AttendanceModalProps> = ({
  isOpen,
  onClose,
  vendedor,
  onUpdateAttendance,
}) => {
  if (!isOpen || !vendedor) return null;

  const [status, setStatus] = useState<Vendedor['attendanceStatus']>(vendedor.attendanceStatus);
  const [time, setTime] = useState<string>(vendedor.checkInTime);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onUpdateAttendance(vendedor.id, status, time);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-xs p-4">
      <div className="bg-white rounded-xl shadow-2xl border border-[#d8dadc] w-full max-w-md overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        <div className="flex items-center justify-between px-5 py-4 bg-[#131b2e] text-white">
          <div className="flex items-center gap-2">
            <Clock className="w-4 h-4 text-emerald-400" />
            <div>
              <h3 className="font-bold text-sm">Validar / Modificar Asistencia</h3>
              <p className="text-[11px] text-slate-300">{vendedor.name} · {vendedor.route}</p>
            </div>
          </div>
          <button onClick={onClose} className="text-slate-400 hover:text-white p-1 rounded">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-5 flex flex-col gap-4">
          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-2">
              Estado de Marcación
            </label>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <button
                type="button"
                onClick={() => setStatus('Presente')}
                className={`p-2.5 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                  status === 'Presente'
                    ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                <span>Presente</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('Tardanza')}
                className={`p-2.5 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                  status === 'Tardanza'
                    ? 'bg-amber-50 border-amber-500 text-amber-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <Clock className="w-4 h-4 text-amber-600" />
                <span>Tardanza</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('Falta Justificada')}
                className={`p-2.5 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                  status === 'Falta Justificada'
                    ? 'bg-blue-50 border-blue-500 text-blue-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <AlertTriangle className="w-4 h-4 text-blue-600" />
                <span>Falta Justificada</span>
              </button>
              <button
                type="button"
                onClick={() => setStatus('Ausente')}
                className={`p-2.5 rounded-lg border flex items-center gap-2 font-semibold transition-all ${
                  status === 'Ausente'
                    ? 'bg-red-50 border-red-500 text-red-800'
                    : 'bg-white border-slate-200 text-slate-600 hover:bg-slate-50'
                }`}
              >
                <UserX className="w-4 h-4 text-red-600" />
                <span>Ausente</span>
              </button>
            </div>
          </div>

          <div>
            <label className="block text-xs font-bold text-slate-700 uppercase tracking-wider mb-1">
              Hora de Entrada / Registro
            </label>
            <input
              type="time"
              value={time}
              onChange={(e) => setTime(e.target.value)}
              className="w-full text-xs p-2.5 rounded-lg border border-slate-300 focus:border-slate-900 outline-none"
              required
            />
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
              className="px-4 py-2 text-xs font-bold text-white bg-[#131b2e] hover:bg-black rounded-lg transition-colors"
            >
              Guardar Marcación
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
