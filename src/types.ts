export type Role = 'Gerencia' | 'Supervisor' | 'Vendedor';
export type LimaZone = 'Todas las Zonas' | 'Lima Norte' | 'Lima Sur' | 'Lima Este' | 'Lima Centro';
export type ScreenView = 'dashboard' | 'vendedor' | 'supervisor' | 'gerencia' | 'mapas' | 'reportes';

export interface Vendedor {
  id: string;
  initials: string;
  name: string;
  route: string;
  zone: string;
  supervisor: string;
  phone: string;
  attendanceStatus: 'Presente' | 'Tardanza' | 'Falta Justificada' | 'Ausente';
  checkInTime: string;
  quotaTarget: number;
  currentSales: number;
  completedVisits: number;
  totalVisits: number;
  brands: {
    nestle: number; // percentage
    alicorp: number;
    gloria: number;
  };
  categories: {
    lacteos: number;
    abarrotes: number;
    golosinas: number;
  };
}

export interface MesaAlert {
  id: string;
  type: 'warning' | 'success' | 'info';
  title: string;
  description: string;
  timestamp: string;
  zone: string;
}

export interface ClientVisit {
  id: string;
  clientName: string;
  address: string;
  district: string;
  status: 'completado' | 'en_proceso' | 'pendiente' | 'rechazado';
  orderTotal?: number;
  scheduledTime: string;
  completedTime?: string;
  lat: number;
  lng: number;
  notes?: string;
}

export interface KPIStats {
  totalSales: number;
  salesTarget: number;
  salesGrowth: number;
  complianceAvg: number;
  complianceDelta: number;
  activeReps: number;
  totalReps: number;
  dailyAttendance: number;
  attendanceTarget: number;
}
