export type Role = 'Gerencia' | 'Supervisor' | 'Vendedor' | 'Cliente';
export type LimaZone = 'Todas las Zonas' | 'Lima Norte' | 'Lima Sur' | 'Lima Este' | 'Lima Centro';
export type ScreenView = 'dashboard' | 'vendedor' | 'supervisor' | 'gerencia' | 'mapas' | 'reportes' | 'concursos' | 'maestros' | 'cliente-portal';

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

export type MedicionConcurso = 'Venta en soles' | 'Clientes (coberturas)' | 'Otro (meta en texto)';
export type UnidadMeta = string;
export type TipoPremio = 'Soles' | 'Producto' | 'Personal';
export type FormaPago = 'Monto fijo' | 'Por cada cliente o unidad';
export type AmbitoCompra = string;
export type TipoCandado = 'Sí' | 'No';

export interface EscalaConcurso {
  id: string;
  meta: number | string;
  premio: number | string;
}

export interface Concurso {
  id: string;
  nro: number;
  proveedor: string;
  nombre: string;
  logo: string;
  tabla: string;
  columnaTabla: string;
  queSeMide: MedicionConcurso;
  metaTexto: string;
  unidadMeta: UnidadMeta;
  incluyeIGV: boolean;
  compraMinimaCliente: number;
  compraMinimaEn: string;
  enPedidoOMes: AmbitoCompra;
  tieneCandado: TipoCandado;
  minimoCandado: number;
  unidadCandado: string;
  escalas: EscalaConcurso[];
  premioEn: TipoPremio;
  productoPremio: string;
  comoSePaga: FormaPago;
  topePremio: number;
  rankingN: number;
  productosQueCuentan: string;
  quienesParticipan: string;
  desde: string;
  hasta: string;
  notasVendedor: string[];
  notasInternas: string;
  revision: string;
  asiLoVeVendedor: string;
  premioMaximo: number;
}

export interface Producto {
  proveedor: string;
  marca: string;
  artId: string;
  descripcion: string;
  ventaConIGV: number;
}

export interface ProductoMaestro {
  id: string;
  codigo: string;
  descripcion: string;
  marca: string;
  proveedor: string;
  categoria: string;
  precioVenta: number;
  precioCosto: number;
  stock: number;
  unidad: string;
  igv: boolean;
  activo: boolean;
}

export type TipoCliente = 'Bodega' | 'Minimarket' | 'Supermercado' | 'Mayorista' | 'Hotel/Restaurante';
export interface Cliente {
  id: string;
  codigo: string;
  razonSocial: string;
  ruc: string;
  tipo: TipoCliente;
  direccion: string;
  distrito: string;
  zona: string;
  telefono: string;
  celular: string;
  email: string;
  vendedorAsignado: string;
  vendedorId: string;
  formaPago: 'Contado' | 'Crédito 7' | 'Crédito 15' | 'Crédito 30';
  lineaCredito: number;
  saldo: number;
  activo: boolean;
  fechaRegistro: string;
  observaciones: string;
}

export type EmpleadoRol = 'Vendedor' | 'Supervisor' | 'Auxiliar' | 'Jefe de Ventas' | 'Cobrador' | 'Logística' | 'Administrativo';
export interface ClienteUsuario {
  id: string;
  clienteId: string;
  email: string;
  password: string;
  razonSocial: string;
  vendedorId: string;
  vendedorAsignado: string;
  zona: string;
}

export interface PedidoRapidoCliente {
  id: string;
  clienteId: string;
  clienteUsuarioId: string;
  vendedorId: string;
  razonSocial: string;
  items: Array<{ productoId: string; descripcion: string; cantidad: number; precioUnitario: number; subtotal: number }>;
  descuento?: number;
  oferta?: string;
  observacionesCliente?: string;
  observacionesVendedor?: string;
  total: number;
  estado: 'solicitado' | 'en_revision' | 'ajustado' | 'confirmado' | 'rechazado';
  createdAt: string;
  updatedAt?: string;
}

export interface SolicitudVisita {
  id: string;
  clienteId: string;
  clienteUsuarioId: string;
  vendedorId: string;
  razonSocial: string;
  fechaPreferida: string;
  horaPreferida: string;
  motivo: string;
  estado: 'solicitado' | 'aceptado' | 'rechazado' | 'programado';
  createdAt: string;
}
