import React, { useState } from 'react';
import { Role, LimaZone, MesaAlert } from '../types';
import { Bell, User, Check, X, ChevronDown, ShieldAlert, Shield, Menu, Sun, Moon } from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onChangeRole: (role: Role) => void;
  withIGV: boolean;
  onToggleIGV: (withIGV: boolean) => void;
  selectedZone: LimaZone;
  onChangeZone: (zone: LimaZone) => void;
  alerts: MesaAlert[];
  onToggleSidebar: () => void;
  sidebarOpen: boolean;
  theme: 'light' | 'dark';
  onToggleTheme: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onChangeRole,
  withIGV,
  onToggleIGV,
  selectedZone,
  onChangeZone,
  alerts,
  onToggleSidebar,
  sidebarOpen,
  theme,
  onToggleTheme,
}) => {
  const [showNotifications, setShowNotifications] = useState(false);
  const [unreadCount, setUnreadCount] = useState(alerts.length);
  const [showProfileMenu, setShowProfileMenu] = useState(false);

  // Profile data dynamic based on authenticated role
  const profileData = {
    Vendedor: {
      name: 'Carlos Gomez',
      initials: 'CG',
      title: 'Vendedor Preventa · Ruta Norte-A',
      email: 'carlos.gomez@totalcalidad.pe',
      scope: 'Ruta Asignada: Los Olivos / SMP',
      badgeBg: 'bg-emerald-50 text-emerald-800',
    },
    Supervisor: {
      name: 'Carlos Mendoza',
      initials: 'CM',
      title: 'Supervisor Operativo · Líder Alfa',
      email: 'c.mendoza@totalcalidad.pe',
      scope: 'Mesa de Trabajo: Lima Norte',
      badgeBg: 'bg-blue-50 text-blue-800',
    },
    Gerencia: {
      name: 'Ing. Roberto Thorne',
      initials: 'RT',
      title: 'Director Comercial & Operaciones',
      email: 'r.thorne@totalcalidad.pe',
      scope: 'Cobertura: Lima Metropolitana',
      badgeBg: 'bg-purple-50 text-purple-800',
    },
  }[currentRole];

  return (
    <header className="fixed top-0 left-0 right-0 h-auto min-h-[72px] bg-[#f7f9fb] dark:bg-[#0f172a]/90 backdrop-blur-md border-b border-[#e0e3e5] dark:border-[#334155] z-40 px-4 pb-2">
      {/* Left controls */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 w-full">
        <div className="flex items-center gap-3 flex-wrap">
          {/* Hamburger toggle */}
          <button
            onClick={onToggleSidebar}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#e6e8ea] dark:bg-[#475569] text-[#45464d] dark:text-[#cbd5e1] transition-colors cursor-pointer"
            title={sidebarOpen ? 'Cerrar menú' : 'Abrir menú'}
          >
            {sidebarOpen ? (
              <X className="w-5 h-5" />
            ) : (
              <Menu className="w-5 h-5" />
            )}
          </button>
          {/* Role Selector with Security Level Indicator */}
          <div className="flex items-center bg-[#eceef0] dark:bg-[#334155] border border-[#d8dadc] dark:border-[#475569] rounded-lg px-2 py-1 shadow-xs">
            <Shield className="w-3.5 h-3.5 text-slate-500 dark:text-slate-400 dark:text-slate-500 mr-1" />
            <span className="text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] px-1">Rol / Credencial:</span>
            <select
              value={currentRole}
              onChange={(e) => onChangeRole(e.target.value as Role)}
              className="bg-transparent text-xs font-bold text-[#191c1e] dark:text-[#f1f5f9] outline-none cursor-pointer pr-1"
            >
              <option value="Gerencia">Gerencia (Superadmin)</option>
              <option value="Supervisor">Supervisor (Mesa de Trabajo)</option>
              <option value="Vendedor">Vendedor (Ruta Individual)</option>
            </select>
          </div>

          {/* IGV Switcher */}
          <div className="flex items-center bg-[#eceef0] dark:bg-[#334155] border border-[#d8dadc] dark:border-[#475569] rounded-lg p-0.5 shadow-xs">
            <button
              onClick={() => onToggleIGV(true)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                withIGV
                  ? 'bg-[#131b2e] text-white shadow-xs'
                  : 'text-[#45464d] dark:text-[#cbd5e1] hover:text-[#191c1e] dark:text-[#f1f5f9]'
              }`}
            >
              Con IGV
            </button>
            <button
              onClick={() => onToggleIGV(false)}
              className={`px-2.5 py-1 rounded text-xs font-semibold transition-all cursor-pointer ${
                !withIGV
                  ? 'bg-[#131b2e] text-white shadow-xs'
                  : 'text-[#45464d] dark:text-[#cbd5e1] hover:text-[#191c1e] dark:text-[#f1f5f9]'
              }`}
            >
              Sin IGV
            </button>
          </div>

          {/* Lima Zone Selector */}
          <div className="flex items-center bg-[#eceef0] dark:bg-[#334155] border border-[#d8dadc] dark:border-[#475569] rounded-lg px-2 py-1 shadow-xs">
            <span className="text-xs font-semibold text-[#45464d] dark:text-[#cbd5e1] px-1.5">Lima:</span>
            <select
              value={selectedZone}
              onChange={(e) => onChangeZone(e.target.value as LimaZone)}
              className="bg-transparent text-xs font-bold text-[#191c1e] dark:text-[#f1f5f9] outline-none cursor-pointer pr-1"
            >
              <option value="Todas las Zonas">Todas las Zonas</option>
              <option value="Lima Norte">Lima Norte</option>
              <option value="Lima Sur">Lima Sur</option>
              <option value="Lima Este">Lima Este</option>
              <option value="Lima Centro">Lima Centro</option>
            </select>
          </div>
        </div>

        {/* Right controls */}
        <div className="flex items-center gap-3 relative">
          {/* Theme toggle */}
          <button
            onClick={onToggleTheme}
            className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#e6e8ea] dark:hover:bg-[#475569] text-[#45464d] dark:text-[#cbd5e1] transition-colors cursor-pointer"
            title={theme === 'dark' ? 'Modo claro' : 'Modo oscuro'}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          {/* Notifications button */}
          <div className="relative">
            <button
              onClick={() => {
                setShowNotifications(!showNotifications);
                setShowProfileMenu(false);
                setUnreadCount(0);
              }}
              className="w-9 h-9 rounded-full flex items-center justify-center hover:bg-[#e6e8ea] dark:bg-[#475569] text-[#45464d] dark:text-[#cbd5e1] relative transition-colors cursor-pointer"
              title="Notificaciones"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-red-600 rounded-full ring-2 ring-white"></span>
              )}
            </button>

            {/* Notifications Dropdown */}
            {showNotifications && (
              <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-[#1e293b] border border-[#d8dadc] dark:border-[#475569] rounded-xl shadow-lg p-3 z-50">
                <div className="flex items-center justify-between pb-2 border-b border-[#e6e8ea] mb-2">
                  <span className="text-xs font-bold text-[#191c1e] dark:text-[#f1f5f9] uppercase tracking-wider">
                    Alertas Operativas ({alerts.length})
                  </span>
                  <button
                    onClick={() => setShowNotifications(false)}
                    className="text-slate-400 dark:text-slate-500 hover:text-slate-600 dark:text-slate-300 cursor-pointer"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="flex flex-col gap-2 max-h-72 overflow-y-auto">
                  {alerts.map((alert) => (
                    <div
                      key={alert.id}
                      className={`p-2.5 rounded-lg text-xs border ${
                        alert.type === 'warning'
                          ? 'bg-amber-50 border-amber-200 text-amber-900'
                          : alert.type === 'success'
                          ? 'bg-emerald-50 border-emerald-200 text-emerald-900'
                          : 'bg-blue-50 border-blue-200 text-blue-900'
                      }`}
                    >
                      <div className="flex items-center justify-between font-bold mb-0.5">
                        <span>{alert.title}</span>
                        <span className="text-[10px] font-normal text-slate-500 dark:text-slate-400 dark:text-slate-500">{alert.timestamp}</span>
                      </div>
                      <p className="text-[11px] leading-relaxed text-slate-700 dark:text-slate-200">{alert.description}</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Profile Avatar & menu with dynamic role info */}
          <div className="relative">
            <button
              onClick={() => {
                setShowProfileMenu(!showProfileMenu);
                setShowNotifications(false);
              }}
              className="flex items-center gap-2 pl-1 pr-2 py-1 rounded-full hover:bg-[#e6e8ea] dark:bg-[#475569] transition-colors cursor-pointer"
            >
              <div className="w-8 h-8 rounded-full bg-[#131b2e] text-white flex items-center justify-center font-bold text-xs">
                {profileData.initials}
              </div>
              <div className="hidden sm:flex flex-col text-left">
                <span className="text-xs font-bold text-[#191c1e] dark:text-[#f1f5f9]">{profileData.name}</span>
                <span className="text-[10px] text-[#76777d] dark:text-[#94a3b8]">{profileData.title}</span>
              </div>
              <ChevronDown className="w-3 h-3 text-[#76777d] dark:text-[#94a3b8]" />
            </button>

            {showProfileMenu && (
              <div className="absolute right-0 mt-2 w-64 bg-white dark:bg-[#1e293b] border border-[#d8dadc] dark:border-[#475569] rounded-xl shadow-lg p-3 z-50 text-xs">
                <div className="pb-2 border-b border-[#e6e8ea]">
                  <p className="font-bold text-[#191c1e] dark:text-[#f1f5f9]">{profileData.name}</p>
                  <p className="text-[11px] text-[#76777d] dark:text-[#94a3b8]">{profileData.email}</p>
                  <span className={`inline-block mt-1 text-[10px] font-semibold px-2 py-0.5 rounded ${profileData.badgeBg}`}>
                    {profileData.scope}
                  </span>
                </div>
                <div className="py-2 text-[11px] text-slate-600 dark:text-slate-300 space-y-1">
                  <p>
                    <strong>Nivel:</strong> {currentRole}
                  </p>
                  <p>
                    <strong>Permisos:</strong>{' '}
                    {currentRole === 'Gerencia'
                      ? 'Total (P&L, Margen, Aprobaciones)'
                      : currentRole === 'Supervisor'
                      ? 'Supervisión Mesa, Asistencia, Broadcast'
                      : 'Preventa, Ruta Propia, Toma de Pedidos'}
                  </p>
                </div>
                <div className="pt-2 border-t border-[#e6e8ea]">
                  <button
                    onClick={() => setShowProfileMenu(false)}
                    className="w-full text-left px-2 py-1.5 hover:bg-[#f2f4f6] dark:bg-[#1e293b] rounded text-[#45464d] dark:text-[#cbd5e1] text-xs cursor-pointer"
                  >
                    Cerrar Menú
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};
