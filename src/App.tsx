import React, { useState } from 'react';
import { Role, LimaZone, ScreenView, Vendedor, MesaAlert } from './types';
import { INITIAL_VENDEDORES, INITIAL_ALERTS } from './data/mockData';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { SupervisorView } from './components/SupervisorView';
import { DashboardComercialView } from './components/DashboardComercialView';
import { VendedorView } from './components/VendedorView';
import { GerenciaView } from './components/GerenciaView';
import { RutasMapasView } from './components/RutasMapasView';
import { ReportesExportarView } from './components/ReportesExportarView';
import { ConcursosView } from './components/ConcursosView';
import { BroadcastModal } from './components/BroadcastModal';
import { CallModal } from './components/CallModal';
import { AttendanceModal } from './components/AttendanceModal';
import { PromptModal } from './components/PromptModal';
import { AccessDeniedCard } from './components/AccessDeniedCard';

export const MASTER_PROMPT_TEXT = `Act as an expert Principal Full-Stack Engineer and Senior Product Designer. Build a production-grade, highly polished Enterprise B2B SaaS web application named "Total Calidad - Andean Logistics Intelligence" for commercial distribution, sales supervision, and route telemetry tailored to fast-moving consumer goods (FMCG / Consumo Masivo - Nestlé, Alicorp, Gloria) in Lima, Peru.

---

### 1. DESIGN SYSTEM & VISUAL ARCHITECTURE (Andean Logistics Intelligence)
- Persona & Aesthetic: Authoritative, analytical, high-density corporate data workstation built with Tailwind CSS. Crisp slate background (#F7F9FB), deep corporate navy (#0F172A / #131B2E) for primary navigation and cards, and emerald accent (#006C49 / #10B981) for positive KPI variances and fulfillment goals.
- Anti-Slop Discipline: No decorative pill badge spam, no generic AI gradients, no fake compiler code comments. Clean, single-line typography using Inter / Plus Jakarta Sans with tabular figures (tabular-nums font-mono) for all monetary values, percentages, and timestamps.
- Navigation Layout: Persistent 72-pixel (w-72) left sidebar + fixed top header (h-16) + responsive 12-column content container.

---

### 2. ROLE-BASED ACCESS CONTROL (RBAC) & AUTHORIZATION LEVELS (CRITICAL REQUIREMENT)
The application MUST strictly enforce three distinct authorization tiers with authenticated session segregation:

1. LEVEL 1: ROL VENDEDOR (Field Sales Representative - e.g., Carlos Gomez, Ruta Norte-A)
   - Scope & Permissions: Strictly restricted to their own assigned route, personal customer schedule, and individual performance.
   - What the Vendedor SEES:
     * "Vista Vendedor": Daily personal quota progress bar (S/. 18,400 / S/. 16,000), individual commission estimator with bonus tier, their own daily visit checklist (Bodega Don Pepe, Minimarket Las Flores, etc.) with statuses (Completado, En Proceso, Pendiente), and the interactive Quick Order Taking Pad.
     * "Rutas y Mapas": Only displays their personal GPS route path, current location, and assigned bodega geofences.
   - What the Vendedor CANNOT SEE (Strictly Hidden / Blocked):
     * CANNOT see other salesmen's sales, individual rankings, or salaries.
     * CANNOT access "Vista Supervisor": Cannot modify team attendance, cannot trigger Mesa Broadcasts, and cannot see team alerts.
     * CANNOT access "Dashboard Comercial": Cannot view macro wholesale margins or city-wide revenue.
     * CANNOT access "Vista Gerencia": Zero access to P&L, gross margins (28.4%), corporate supplier rebates, or executive bonus approvals.
     * CANNOT access "Reportes & Exportar": Cannot download company-wide CSV financial ledgers.
   - Sidebar UI Behavior: Restricted navigation items are locked with a lock icon and disabled. Attempting direct navigation renders a high-security "Acceso Restringido" access gate.

2. LEVEL 2: ROL SUPERVISOR (Workstation / Mesa Leader - e.g., Carlos Mendoza, Líder Alfa)
   - Scope & Permissions: Manages their designated operational team (e.g., Mesa Lima Norte - Alfa, 12 sales reps).
   - What the Supervisor SEES:
     * "Vista Supervisor": Full access to Mesa KPIs (Venta Total S/. 148,250, Cumplimiento 94.8%, 12/12 activos, Asistencia 96.5%), brand share distribution bars (Nestlé, Alicorp, Gloria) vs categories, urgent Mesa Alerts, and the Detailed Seller Ranking Table.
     * Operative Actions: Can initiate voice calls with reps, log supervisory notes, override/validate attendance check-ins, and trigger urgent audio/push "Broadcast a la Mesa".
     * "Dashboard Comercial": Operational sales velocity and channel mix for their assigned regional territory.
     * "Vista Vendedor": Can inspect the individual portfolio and order history of any representative under their supervision.
     * "Rutas y Mapas": Real-time GPS fleet monitoring of all reps in the mesa, geofence compliance, and stop durations.
     * "Reportes & Exportar": Operational closing reports and export to CSV/Excel for route settlement.
   - What the Supervisor CANNOT SEE:
     * CANNOT access "Vista Gerencia": The Supervisor is strictly forbidden from viewing corporate gross profit margins (28.4%), company-wide P&L, strategic manufacturer volume rebates (Nestlé 3.2%, Alicorp 2.8%, Gloria 2.0%), credit exception overrides, or budget reallocations across other regional zones.

3. LEVEL 3: ROL GERENCIA GENERAL / DIRECCIÓN COMERCIAL (Executive Superadmin - e.g., Ing. Roberto Thorne)
   - Scope & Permissions: Unrestricted corporate visibility across all regions (Lima Norte, Lima Sur, Lima Centro, Lima Este), commercial finance, and operational auditing.
   - What Gerencia SEES (Exclusive Privileges):
     * "Vista Gerencia": Consolidated C-Suite P&L (S/. 4,131,000 MTD), Gross Profit Margin analysis (28.4%), On-Time In-Full delivery rate (97.1%), and Regional Comparison Matrix comparing all 4 Lima zones with profitability benchmarks.
     * Manufacturer Contract Management: Exclusive tracker for annual volume rebates and supplier negotiations (Nestlé, Alicorp, Leche Gloria).
     * Executive Triggers: Authorization button for monthly bonus payouts and credit exception approvals.
     * Unrestricted access to all 6 modules without barriers.

---

### 3. GLOBAL CONTROLS IN TOP HEADER
- Role Switcher: [Gerencia | Supervisor | Vendedor] - changes operational credentials, active view, and profile badge.
- Tax Switcher (IGV): "Con IGV" vs "Sin IGV" - dynamically recalculates all monetary values across every authorized screenview using Peruvian 18% General Sales Tax (S/. amount / 1.18).
- Zone Selector: [Todas las Zonas | Lima Norte | Lima Sur | Lima Este | Lima Centro] - filters datasets and statistics accordingly.
- Operational Notifications: Interactive notification center for route delays, quota milestones, and stock alerts.
- User Profile: Dynamically switches avatar and credentials based on active role (Carlos Gomez for Vendedor, Carlos Mendoza for Supervisor, Roberto Thorne for Gerencia).

---

### 4. THE 6 REQUIRED SCREENVIEWS
1. Vista Supervisor (Supervisión Operativa - Primary Reference):
   - Header with Mesa de Trabajo: Lima Norte - Alfa, supervisor selector, zone selector, and date picker.
   - 4 Operational KPI Cards: Venta Total de Equipo (S/. 148,250 / Meta S/. 135k, +12.4%), Cumplimiento Promedio (94.8%), Vendedores Activos (100%), Asistencia Diaria (96.5%).
   - Rendimiento por Marca y Vendedor: Segmented horizontal progress bars showing Nestlé / Alicorp / Gloria percentage breakdown for reps with toggle to "Categorías" (Lácteos, Abarrotes, Golosinas) and legend.
   - Alertas de Mesa: Urgent operational cards + button "Enviar Broadcast a la Mesa".
   - Ranking Detallado de Vendedores: Live search + filter dropdown + interactive table (Asistencia, Cuota, Efectividad, Venta Actual, Acciones Rápidas) + pagination.

2. Dashboard Comercial (Commercial Executive Dashboard):
   - Macro MTD billing (S/. 1.48M / S/. 1.6M), Drop size (S/. 428/pedido), Store coverage (94.2%), Rejection rate (1.8%).
   - Sales breakdown by macro-zones (Lima Norte, Centro, Sur, Este).
   - Brand share distribution (Nestlé 44.2%, Alicorp 34.0%, Gloria 21.8%) and channel mix (Tradicional 82%, Mayorista 18%).
   - Top 5 Fast Moving SKUs in Peruvian bodegas.

3. Vista Vendedor (Field Sales Rep Daily Route):
   - Active seller workspace with daily quota progress bar and commission estimator.
   - Daily Field Route Checklist: Visiting bodegas and minimarkets in Los Olivos/SMP with statuses (Completado, En Proceso, Pendiente, Rechazado).
   - Quick Order Pad: Interactive simulator to pick product SKU, quantity of boxes, calculate subtotal + IGV, and submit order to warehouse.

4. Vista Gerencia (Executive Management & P&L):
   - C-Suite KPI matrix: Consolidated Revenue, Gross Margin (28.4%), Headcount, OTIF Delivery fulfillment (97.1%).
   - Regional Performance Matrix comparing Lima Norte, Centro, Sur, and Este with compliance and gross margin benchmarks.
   - Strategic Manufacturer Rebates tracker (Nestlé 3.2%, Alicorp 2.8%, Gloria 2.0%).
   - Executive action trigger to authorize monthly bonuses.

5. Rutas y Mapas (Interactive GPS Telemetry, Street/Avenue Zoom & GIS):
   - Interactive high-resolution map of Lima Metropolitana with real street-level zoom controls (+, -, mouse scroll, double-click, and sector centering).
   - Crisp rendering of major avenues (Av. Carlos Izaguirre, Av. Antúnez de Mayolo, Av. Las Palmeras, Av. Universitaria, Av. Panamericana Norte, Av. Túpac Amaru, Av. Alfonso Ugarte, Av. Próceres), streets, and jirones.
   - Quick Sector Jump buttons: Lima Norte (Los Olivos/SMP), Lima Norte (Comas), Lima Centro (Cercado/Breña), Lima Este (SJL), and Lima Metropolitana macro view.
   - Live Avenue/Street Search input with instant coordinate centering.
   - Map style switchers: "Calles y Avenidas (Detallado)", "OpenStreetMap Estándar", and "Híbrido Satelital".
   - Clickable GPS pins for sales representatives and numbered client bodega stops along the route.
   - 45-meter geofence perimeter circles around customer bodegas with toggle control.
   - Real-time telemetry: Distance covered (18.4 km), Average stop time (14.2 min), Geofence compliance (99.1%).
   - Interactive sidebar displaying selected point-of-sale metadata with nearby avenues and direct call trigger.

6. Reportes & Exportar (Reporting, Audit & Real CSV Export):
   - Configurable query builder by report type, zone, brand, and date range.
   - Live preview table of commercial audit logs.
   - Functional "Descargar CSV / Excel" button that generates and downloads a real, formatted .csv file in the browser taking into account the active IGV tax mode!
   - Print view trigger.

---

### 5. INTERACTIVE MODALS & SYSTEM INTEGRITY
- "Enviar Broadcast a la Mesa": Push urgent or normal announcement to field terminals.
- "Llamar Vendedor": Voice call simulator with active timer and supervision log notes.
- "Validar Asistencia": Modal to update check-in status (Presente, Tardanza, Falta) and time.
- "Ver Prompt Maestro": Modal displaying this complete generation prompt with 1-click clipboard copy.`;

export default function App() {
  // Global State
  const [currentView, setCurrentView] = useState<ScreenView>('supervisor');
  const [currentRole, setCurrentRole] = useState<Role>('Supervisor');
  const [withIGV, setWithIGV] = useState<boolean>(true);
  const [selectedZone, setSelectedZone] = useState<LimaZone>('Lima Norte');
  const [selectedSupervisor, setSelectedSupervisor] = useState<string>('Carlos Mendoza (Líder Alfa)');
  const [selectedDate, setSelectedDate] = useState<string>('2023-10-24');

  // Theme state
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('theme');
      if (saved === 'dark' || saved === 'light') return saved;
      return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    }
    return 'light';
  });

  React.useEffect(() => {
    const root = document.documentElement;
    if (theme === 'dark') root.classList.add('dark');
    else root.classList.remove('dark');
    localStorage.setItem('theme', theme);
  }, [theme]);

  const toggleTheme = () => setTheme((t) => (t === 'dark' ? 'light' : 'dark'));

  // Sidebar state
  const [sidebarOpen, setSidebarOpen] = useState(false);

  // Vendedores State
  const [vendedores, setVendedores] = useState<Vendedor[]>(INITIAL_VENDEDORES);
  const [alerts, setAlerts] = useState<MesaAlert[]>(INITIAL_ALERTS);

  // Selected Vendedor for VendedorView
  const [activeVendedor, setActiveVendedor] = useState<Vendedor>(INITIAL_VENDEDORES[0]);

  // Modals State
  const [isBroadcastOpen, setIsBroadcastOpen] = useState(false);
  const [isCallModalOpen, setIsCallModalOpen] = useState(false);
  const [callTargetVendedor, setCallTargetVendedor] = useState<Vendedor | null>(null);
  const [isAttendanceModalOpen, setIsAttendanceModalOpen] = useState(false);
  const [attendanceTargetVendedor, setAttendanceTargetVendedor] = useState<Vendedor | null>(null);
  const [isPromptModalOpen, setIsPromptModalOpen] = useState(false);

  // Handlers
  const handleRoleChange = (role: Role) => {
    setCurrentRole(role);
    // Auto-route to primary allowed screen based on new role
    if (role === 'Gerencia') setCurrentView('gerencia');
    else if (role === 'Supervisor') setCurrentView('supervisor');
    else if (role === 'Vendedor') setCurrentView('vendedor');
  };

  const handleSendBroadcast = (message: string, priority: 'normal' | 'urgente') => {
    const newAlert: MesaAlert = {
      id: `alt-${Date.now()}`,
      type: priority === 'urgente' ? 'warning' : 'info',
      title: priority === 'urgente' ? 'Alerta Urgente de Supervisión' : 'Comunicado de Mesa',
      description: message,
      timestamp: 'Ahora mismo',
      zone: selectedZone,
    };
    setAlerts([newAlert, ...alerts]);
  };

  const handleCallVendedor = (v: Vendedor) => {
    setCallTargetVendedor(v);
    setIsCallModalOpen(true);
  };

  const handleLogCallNote = (vendedorId: string, note: string) => {
    console.log(`Call note for ${vendedorId}: ${note}`);
  };

  const handleOpenAttendance = (v: Vendedor) => {
    setAttendanceTargetVendedor(v);
    setIsAttendanceModalOpen(true);
  };

  const handleUpdateAttendance = (
    vendedorId: string,
    status: Vendedor['attendanceStatus'],
    time: string
  ) => {
    setVendedores((prev) =>
      prev.map((v) =>
        v.id === vendedorId ? { ...v, attendanceStatus: status, checkInTime: time } : v
      )
    );
  };

  // RBAC Permission Check Helper
  const checkAccess = (view: ScreenView): { allowed: boolean; requiredRole?: 'Supervisor' | 'Gerencia' } => {
    if (currentRole === 'Gerencia') return { allowed: true };

    if (currentRole === 'Supervisor') {
      if (view === 'gerencia') {
        return { allowed: false, requiredRole: 'Gerencia' };
      }
      return { allowed: true };
    }

    if (currentRole === 'Vendedor') {
      if (view === 'vendedor' || view === 'mapas') {
        return { allowed: true };
      }
      if (view === 'gerencia') {
        return { allowed: false, requiredRole: 'Gerencia' };
      }
      return { allowed: false, requiredRole: 'Supervisor' };
    }

    return { allowed: true };
  };

  const access = checkAccess(currentView);

  return (
    <div className="min-h-screen bg-[#f7f9fb] dark:bg-[#0f172a] text-[#191c1e] dark:text-[#f1f5f9] font-sans antialiased">
      {/* Sidebar Navigation */}
      <Sidebar
        currentView={currentView}
        onSelectView={(view) => setCurrentView(view)}
        onOpenPromptModal={() => setIsPromptModalOpen(true)}
        currentRole={currentRole}
        isOpen={sidebarOpen}
        onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
      />

      {/* Main Content Area */}
      <div className="pl-0">
        {/* Top Header */}
        <Header
          currentRole={currentRole}
          onChangeRole={handleRoleChange}
          withIGV={withIGV}
          onToggleIGV={setWithIGV}
          selectedZone={selectedZone}
          onChangeZone={setSelectedZone}
          alerts={alerts}
          onToggleSidebar={() => setSidebarOpen(!sidebarOpen)}
          sidebarOpen={sidebarOpen}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* View Routing with RBAC Gate */}
        <main className={`relative px-4 sm:px-8 max-w-7xl mx-auto ${sidebarOpen ? 'pt-24' : 'pt-20'}`}>
          {!access.allowed ? (
            <AccessDeniedCard
              currentRole={currentRole}
              requiredRole={access.requiredRole || 'Supervisor'}
              viewName={
                currentView === 'gerencia'
                  ? 'Vista Gerencia (P&L y Márgenes Corporativos)'
                  : currentView === 'supervisor'
                  ? 'Vista Supervisor (Mesa de Supervisión Operativa)'
                  : currentView === 'dashboard'
                  ? 'Dashboard Comercial Consolidado'
                  : 'Reportes y Exportación Financiera'
              }
              onSwitchRole={handleRoleChange}
              onGoHome={() => setCurrentView(currentRole === 'Vendedor' ? 'vendedor' : 'supervisor')}
            />
          ) : (
            <>
              {currentView === 'supervisor' && (
                <SupervisorView
                  vendedores={vendedores}
                  alerts={alerts}
                  withIGV={withIGV}
                  selectedSupervisor={selectedSupervisor}
                  onChangeSupervisor={setSelectedSupervisor}
                  selectedZone={selectedZone}
                  onChangeZone={setSelectedZone as any}
                  selectedDate={selectedDate}
                  onChangeDate={setSelectedDate}
                  onOpenBroadcast={() => setIsBroadcastOpen(true)}
                  onCallVendedor={handleCallVendedor}
                  onAttendanceClick={handleOpenAttendance}
                />
              )}

              {currentView === 'dashboard' && (
                <DashboardComercialView
                  withIGV={withIGV}
                  selectedZone={selectedZone}
                />
              )}

              {currentView === 'vendedor' && (
                <VendedorView
                  withIGV={withIGV}
                  selectedVendedor={activeVendedor}
                  onSelectVendedor={setActiveVendedor}
                  allVendedores={vendedores}
                />
              )}

              {currentView === 'gerencia' && (
                <GerenciaView withIGV={withIGV} />
              )}

              {currentView === 'mapas' && (
                <RutasMapasView
                  vendedores={vendedores}
                  withIGV={withIGV}
                  onCallVendedor={handleCallVendedor}
                />
              )}

               {currentView === 'reportes' && (
                <ReportesExportarView
                  vendedores={vendedores}
                  withIGV={withIGV}
                />
              )}

              {currentView === 'concursos' && (
                <ConcursosView />
              )}
            </>
          )}
        </main>
      </div>

      {/* Mobile sidebar overlay */}
      {sidebarOpen && (
        <div
          onClick={() => setSidebarOpen(false)}
          className="fixed inset-0 bg-black/40 backdrop-blur-sm z-[45] lg:hidden"
        />
      )}

      {/* Modals */}
      <BroadcastModal
        isOpen={isBroadcastOpen}
        onClose={() => setIsBroadcastOpen(false)}
        onSend={handleSendBroadcast}
        mesaName="Mesa de Trabajo: Lima Norte - Alfa"
      />

      <CallModal
        isOpen={isCallModalOpen}
        onClose={() => setIsCallModalOpen(false)}
        vendedor={callTargetVendedor}
        onLogCallNote={handleLogCallNote}
      />

      <AttendanceModal
        isOpen={isAttendanceModalOpen}
        onClose={() => setIsAttendanceModalOpen(false)}
        vendedor={attendanceTargetVendedor}
        onUpdateAttendance={handleUpdateAttendance}
      />

      <PromptModal
        isOpen={isPromptModalOpen}
        onClose={() => setIsPromptModalOpen(false)}
        promptText={MASTER_PROMPT_TEXT}
      />
    </div>
  );
}
