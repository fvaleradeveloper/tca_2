import React from 'react';
import { Role } from '../types';
import { ShieldAlert, Lock, ArrowLeft, KeyRound } from 'lucide-react';

interface AccessDeniedCardProps {
  currentRole: Role;
  requiredRole: 'Supervisor' | 'Gerencia';
  viewName: string;
  onSwitchRole: (role: Role) => void;
  onGoHome: () => void;
}

export const AccessDeniedCard: React.FC<AccessDeniedCardProps> = ({
  currentRole,
  requiredRole,
  viewName,
  onSwitchRole,
  onGoHome,
}) => {
  return (
    <div className="flex flex-col items-center justify-center min-h-[500px] p-8 text-center bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-xl shadow-xs">
      <div className="w-16 h-16 rounded-full bg-red-100 border border-red-300 text-red-700 flex items-center justify-center mb-4">
        <ShieldAlert className="w-8 h-8" />
      </div>

      <span className="text-xs font-bold uppercase tracking-wider text-red-700 bg-red-50 border border-red-200 px-3 py-1 rounded-full mb-2">
        Restricción de Acceso por Nivel de Autorización (RBAC)
      </span>

      <h2 className="text-2xl font-bold text-slate-900 tracking-tight">
        Acceso No Autorizado a: {viewName}
      </h2>

      <p className="text-sm text-slate-600 dark:text-slate-300 max-w-lg mt-2 leading-relaxed">
        Su sesión actual está autenticada bajo el rol de <strong className="text-slate-900">{currentRole}</strong>. 
        Este módulo contiene información confidencial restringida exclusivamente a usuarios con nivel de credencial{' '}
        <strong className="text-red-800">{requiredRole}</strong>.
      </p>

      {/* Difference Explanation */}
      <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg max-w-md w-full mt-6 text-left text-xs space-y-2">
        <div className="font-bold text-slate-900 border-b border-slate-100 dark:border-slate-700 pb-1 flex items-center gap-1.5">
          <KeyRound className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-500" />
          <span>Matriz de Autorización del Sistema:</span>
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          • <strong>Vendedor:</strong> Solo accede a su hoja de ruta diaria, clientes asignados y toma de pedidos.
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          • <strong>Supervisor:</strong> Controla asistencia, ranking y KPIs de su mesa de trabajo operativa.
        </div>
        <div className="text-slate-600 dark:text-slate-300">
          • <strong>Gerencia:</strong> Exclusividad para P&L corporativo, márgenes brutos, rebates y autorizaciones presupuestales.
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-3 mt-6">
        <button
          onClick={onGoHome}
          className="px-4 py-2 bg-white dark:bg-[#1e293b] border border-[#c6c6cd] dark:border-[#475569] hover:bg-slate-50 dark:bg-slate-800 text-slate-800 text-xs font-bold rounded-lg shadow-2xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Ir a Mi Vista Permitida</span>
        </button>
        <button
          onClick={() => onSwitchRole(requiredRole)}
          className="px-4 py-2 bg-[#131b2e] hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer transition-colors"
        >
          <Lock className="w-3.5 h-3.5 text-emerald-400" />
          <span>Simular Acceso como {requiredRole}</span>
        </button>
      </div>
    </div>
  );
};
