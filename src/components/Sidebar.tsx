import React from 'react';
import { ScreenView, Role } from '../types';
import { 
  LayoutDashboard, 
  UserCheck, 
  ShieldCheck, 
  Building2, 
  MapPin, 
  FileSpreadsheet,
  Trophy,
  Lock,
  Shield,
  Menu,
  X,
} from 'lucide-react';

interface SidebarProps {
  currentView: ScreenView;
  onSelectView: (view: ScreenView) => void;
  onOpenPromptModal: () => void;
  currentRole: Role;
  isOpen: boolean;
  onToggleSidebar: () => void;
}

export const Sidebar: React.FC<SidebarProps> = ({
  currentView,
  onSelectView,
  onOpenPromptModal,
  currentRole,
  isOpen,
  onToggleSidebar,
}) => {
  // Define permissions per role
  // Vendedor: 'vendedor', 'mapas'
  // Supervisor: 'dashboard', 'vendedor', 'supervisor', 'mapas', 'reportes'
  // Gerencia: all
  const navItems: {
    id: ScreenView;
    label: string;
    icon: React.ReactNode;
    minRole: 'Vendedor' | 'Supervisor' | 'Gerencia';
    badge?: string;
  }[] = [
    {
      id: 'dashboard',
      label: 'Dashboard Comercial',
      icon: <LayoutDashboard className="w-4 h-4 mr-2.5" />,
      minRole: 'Supervisor',
    },
    {
      id: 'vendedor',
      label: 'Vista Vendedor',
      icon: <UserCheck className="w-4 h-4 mr-2.5" />,
      minRole: 'Vendedor',
    },
    {
      id: 'supervisor',
      label: 'Vista Supervisor',
      icon: <ShieldCheck className="w-4 h-4 mr-2.5" />,
      minRole: 'Supervisor',
    },
    {
      id: 'gerencia',
      label: 'Vista Gerencia',
      icon: <Building2 className="w-4 h-4 mr-2.5" />,
      minRole: 'Gerencia',
    },
    {
      id: 'mapas',
      label: 'Rutas y Mapas',
      icon: <MapPin className="w-4 h-4 mr-2.5" />,
      minRole: 'Vendedor',
      badge: 'GPS',
    },
    {
      id: 'reportes',
      label: 'Reportes & Exportar',
      icon: <FileSpreadsheet className="w-4 h-4 mr-2.5" />,
      minRole: 'Supervisor',
    },
    {
      id: 'concursos',
      label: 'Concursos',
      icon: <Trophy className="w-4 h-4 mr-2.5" />,
      minRole: 'Supervisor',
    },
  ];

  const isAllowed = (minRole: 'Vendedor' | 'Supervisor' | 'Gerencia') => {
    if (currentRole === 'Gerencia') return true;
    if (currentRole === 'Supervisor') return minRole === 'Vendedor' || minRole === 'Supervisor';
    if (currentRole === 'Vendedor') return minRole === 'Vendedor';
    return false;
  };

  return (
    <aside className={`fixed left-0 top-0 h-full w-72 bg-[#f2f4f6] dark:bg-[#1e293b] border-r border-[#e0e3e5] dark:border-[#334155] z-50 flex flex-col pt-6 pb-6 select-none transition-transform duration-300 ease-in-out ${isOpen ? 'translate-x-0' : '-translate-x-full'}`}>
      {/* Brand Header */}
      <div className="px-6 mb-5 flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-xl tracking-tight text-[#191c1e] dark:text-[#f1f5f9]">Total Calidad</span>
            <span className="px-1.5 py-0.5 text-[10px] font-semibold bg-[#131b2e] text-white rounded">PRO</span>
          </div>
          <p className="text-xs text-[#76777d] dark:text-[#94a3b8] mt-0.5">Andean Logistics Intelligence</p>
        </div>
        <button
          onClick={onToggleSidebar}
          className="p-1.5 rounded hover:bg-[#e6e8ea] dark:bg-[#475569] text-[#45464d] dark:text-[#cbd5e1] transition-colors cursor-pointer"
          title={isOpen ? 'Cerrar menú' : 'Abrir menú'}
        >
          {isOpen ? (
            <X className="w-5 h-5" />
          ) : (
            <Menu className="w-5 h-5" />
          )}
        </button>
      </div>

      {/* Role Badge Pill */}
      <div className="mx-4 mb-4 px-3 py-2 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-lg flex items-center justify-between shadow-2xs">
        <div className="flex items-center gap-2">
          <Shield className="w-4 h-4 text-emerald-700" />
          <div>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500 dark:text-slate-400 dark:text-slate-500 block">
              Nivel de Acceso
            </span>
            <span className="text-xs font-bold text-slate-900">
              {currentRole === 'Gerencia'
                ? 'Gerencia (Total)'
                : currentRole === 'Supervisor'
                ? 'Supervisor (Mesa)'
                : 'Vendedor (Ruta Propia)'}
            </span>
          </div>
        </div>
        <span
          className={`text-[9px] font-bold px-1.5 py-0.5 rounded uppercase ${
            currentRole === 'Gerencia'
              ? 'bg-purple-100 text-purple-800'
              : currentRole === 'Supervisor'
              ? 'bg-blue-100 text-blue-800'
              : 'bg-emerald-100 text-emerald-800'
          }`}
        >
          {currentRole}
        </span>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-3 flex flex-col gap-1">
        {navItems.map((item) => {
          const isActive = currentView === item.id;
          const allowed = isAllowed(item.minRole);

          if (!allowed) {
            return (
              <div
                key={item.id}
                className="flex items-center justify-between px-3.5 py-2.5 rounded-lg text-xs font-medium text-slate-400 dark:text-slate-500 bg-slate-200 dark:bg-slate-600/40 border border-transparent cursor-not-allowed select-none"
                title={`Acceso bloqueado: Requiere credenciales de nivel ${item.minRole}`}
              >
                <div className="flex items-center text-slate-400 dark:text-slate-500">
                  {item.icon}
                  <span className="line-through opacity-60">{item.label}</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] text-slate-500 dark:text-slate-400 dark:text-slate-500 font-semibold">
                  <Lock className="w-3 h-3 text-slate-400 dark:text-slate-500" />
                  <span>{item.minRole}</span>
                </div>
              </div>
            );
          }

          return (
            <button
              key={item.id}
              onClick={() => {
                onSelectView(item.id);
                onToggleSidebar();
              }}
              className={`flex items-center justify-between px-3.5 py-2.5 rounded-lg text-sm font-medium transition-all text-left cursor-pointer ${
                isActive
                  ? 'bg-[#131b2e] text-white font-semibold shadow-sm'
                  : 'text-[#45464d] dark:text-[#cbd5e1] hover:bg-[#e6e8ea] dark:bg-[#475569] hover:text-[#191c1e] dark:text-[#f1f5f9]'
              }`}
            >
              <div className="flex items-center">
                <span className={isActive ? 'text-white' : 'text-slate-500 dark:text-slate-400 dark:text-slate-500'}>{item.icon}</span>
                <span>{item.label}</span>
              </div>
              {item.badge && (
                <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-emerald-100 text-emerald-800">
                  {item.badge}
                </span>
              )}
            </button>
          );
        })}
      </nav>

      {/* Bottom Master Prompt Access */}
      <div className="px-4 pt-4 border-t border-[#e0e3e5] dark:border-[#334155]">
        <div className="mt-3 flex items-center justify-between text-[11px] text-[#76777d] dark:text-[#94a3b8] px-1">
          <span className="flex items-center gap-1">
            <span>Lima, PE</span>
          </span>
          <span>Lima, PE</span>
        </div>
      </div>
    </aside>
  );
};
