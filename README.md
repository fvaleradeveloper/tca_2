# TCA - Sistema de Gestión Comercial (Total Calidad Alimentaria)

Aplicación web para la gestión comercial de Total Calidad Alimentaria (TCA). Permite el seguimiento de rutas de vendedores, toma de pedidos, supervisión operativa, gestión gerencial, reportes, concursos y portal para clientes. Construida con React + TypeScript + Vite + Tailwind CSS v4.

## Tabla de Contenidos

- [Características Principales](#características-principales)
- [Tecnologías](#tecnologías)
- [Arquitectura](#arquitectura)
- [Instalación y Ejecución Local](#instalación-y-ejecución-local)
- [Estructura del Proyecto](#estructura-del-proyecto)
- [Funcionalidades por Rol](#funcionalidades-por-rol)
- [Generación de PDFs (Concursos)](#generación-de-pdfs-concursos)
- [Conexión con Celulares de Vendedores - Ubicación en Tiempo Real](#conexión-con-celulares-de-vendedores---ubicación-en-tiempo-real)
- [Optimización de Rutas Basada en Rendimiento](#optimización-de-rutas-basada-en-rendimiento)
- [Portal de Clientes](#portal-de-clientes)
- [APIs Necesarias para Integración con Oracle](#apis-necesarias-para-integración-con-oracle)
- [Pruebas para Validación de APIs Oracle](#pruebas-para-validación-de-apis-oracle)
- [Requerimientos al DBA de Oracle](#requerimientos-al-dba-de-oracle)
- [Despliegue](#despliegue)
- [Notas Importantes](#notas-importantes)

## Características Principales

- **Multi-rol**: Soporte para Gerencia, Supervisor y Vendedor con vistas específicas por rol
- **Toma de Pedidos**: Rápida desde visita con cálculo IGV fijo 18% (independiente del toggle global)
- **Rutas y Mapas**: Visualización con Leaflet, geocercas (45m), seguimiento GPS en tiempo real
- **Reportes y Exportación**: Consolidados con opción Con/Sin IGV
- **Concursos**: CRUD completo con generación de PDFs individuales y listados
- **Maestros**: CRUD para Productos, Clientes, Empleados/Vendedores/Supervisores/Auxiliares
- **Tema Claro/Oscuro**: Toggle persistido en localStorage
- **Responsive**: Adaptado a PC y dispositivos móviles
- **Sidebar colapsable**: Con menú hamburguesa

## Tecnologías

| Tecnología | Versión | Uso |
|---|---|---|
| [React](https://react.dev/) | 19.1.1 | Framework UI |
| [TypeScript](https://www.typescriptlang.org/) | ~5.8.2 | Tipado estático |
| [Vite](https://vitejs.dev/) | ^6.2.0 | Build tool y dev server |
| [Tailwind CSS](https://tailwindcss.com/) | ^4.1.13 | Estilos |
| [Leaflet](https://leafletjs.com/) | ^1.9.4 | Mapas interactivos |
| [jsPDF](https://github.com/parallax/jsPDF) | ^3.0.3 | Generación de PDFs |
| [jsPDF-AutoTable](https://github.com/simonbengtsson/jsPDF-AutoTable) | ^5.0.2 | Tablas en PDFs |
| [Lucide React](https://lucide.dev/) | ^0.544.0 | Iconos |

## Arquitectura

La aplicación funciona actualmente con **datos mock** (`src/data/`), pero está diseñada para conectarse a **Oracle REST Data Services (ORDS)** con paquetes PL/SQL (`PKG_TCA_WEBAPI`).

```text
Frontend (React + Vite)
    ↓ HTTP/REST (JSON)
ORDS (Oracle REST Data Services)
    ↓
Paquetes PL/SQL (PKG_TCA_WEBAPI)
    ↓
Base de Datos Oracle (Tablas, Vistas, Vistas Materializadas)
```

## Instalación y Ejecución Local

### Prerrequisitos
- Node.js 18+
- npm o yarn

### Pasos

1. **Clonar el repositorio**
```bash
git clone https://github.com/fvaleradeveloper/tca_2.git
cd tca_2
```

2. **Instalar dependencias**
```bash
npm install
```

3. **Configurar variables de entorno**
Crear archivo `.env.local` en la raíz:
```env
VITE_API_BASE_URL=http://localhost:8080/ords/tca
VITE_USE_MOCK=true  # Cambiar a false al conectar con Oracle
```

4. **Ejecutar en desarrollo**
```bash
npm run dev
```

La aplicación estará disponible en `http://localhost:3000`

5. **Build para producción**
```bash
npm run build
npm run preview
```

## Estructura del Proyecto

```text
src/
├── components/          # Componentes React por vista
│   ├── Header.tsx       # Cabecera con rol, IGV, tema
│   ├── Sidebar.tsx      # Menú lateral
│   ├── DashboardComercialView.tsx
│   ├── VendedorView.tsx # Toma de pedidos + hoja de ruta
│   ├── SupervisorView.tsx
│   ├── GerenciaView.tsx
│   ├── RutasMapasView.tsx # Mapas con Leaflet
│   ├── ReportesExportarView.tsx
│   ├── ConcursosView.tsx # CRUD + PDFs
│   ├── MaestrosView.tsx  # Productos/Clientes/Empleados
│   └── ClientePortalView.tsx # Portal cliente (a implementar)
├── data/               # Datos mock
├── types.ts            # Tipos TypeScript
├── utils/              # Utilidades
│   ├── generateConcursoPDF.ts
│   └── routeOptimizer.ts # Optimizador de rutas (a implementar)
└── App.tsx             # Componente principal y routing
```

## Funcionalidades por Rol

| Funcionalidad | Gerencia | Supervisor | Vendedor | Cliente |
|---|---|---|---|---|
| Dashboard Comercial | ✓ | ✓ (limitado) | ✗ | ✗ |
| Vendedor / Toma de Pedidos | ✓ | ✓ | ✓ | ✗ |
| Supervisor | ✓ | ✓ | ✗ | ✗ |
| Gerencia (P&L) | ✓ | ✗ | ✗ | ✗ |
| Rutas y Mapas | ✓ | ✓ | ✗ | ✗ |
| Reportes y Exportar | ✓ | ✓ | ✗ | ✗ |
| Concursos | ✓ | ✓ | ✓ | ✗ |
| Maestros (CRUD) | ✓ | ✗ | ✗ | ✗ |
| Portal Cliente | ✗ | ✗ | ✗ | ✓ |

## Generación de PDFs (Concursos)

La funcionalidad de concursos incluye generación de PDFs mediante `jspdf` y `jspdf-autotable`.

### Tipos de PDF

1. **PDF Individual por Vendedor**: Muestra avance detallado de un vendedor en el concurso (productos, metas, vendido, avance %)
2. **PDF Listado General**: Consolidado con ranking de todos los participantes

### Implementación

Archivo: `src/utils/generateConcursoPDF.ts`

```typescript
export const generateConcursoPDF = (concurso: Concurso, participantes: ConcursoParticipante[]) => void;
export const generateConcursoPDFIndividual = (concurso: Concurso, participante: ConcursoParticipante) => void;
```

### Características
- Encabezado con datos del concurso (nombre, fechas, estado)
- Tabla con productos participantes
- Cálculo automático de avance porcentual
- Formato A4 con tablas responsivas
- Descarga automática con nombre descriptivo

## Conexión con Celulares de Vendedores - Ubicación en Tiempo Real

### Objetivo
Capturar la ubicación GPS de los celulares de los vendedores en tiempo real y visualizarla en el mapa de `RutasMapasView.tsx` para supervisión operativa.

### Arquitectura Propuesta

```text
App Móvil Vendedor (PWA/Web App)
    ↓ navigator.geolocation.watchPosition (cada 10-20 seg)
WebSocket / ORDS REST
    ↓
Backend/API
    ↓
Oracle (GPS_ULTIMA_POSICION + GPS_LOG)
    ↓
Frontend (RutasMapasView.tsx)
```

### Configuración Recomendada

| Parámetro | Valor Recomendado | Notas |
|---|---|---|
| Frecuencia en ruta | 10-20 segundos | Balance entre precisión y batería |
| Frecuencia parado | 60 segundos | Ahorro de batería |
| Precisión | `enableHighAccuracy: true` | Requiere GPS nativo |
| Modo ahorro batería | < 20% batería -> 60 seg | Implementar lógica adaptativa |
| Geocerca validación | 45 metros | Para habilitar "Check-in" automático |
| Timeout sin señal | > 3 minutos | Mostrar "Sin señal GPS" |

### Endpoints Necesarios para GPS

| Endpoint | Método | Descripción |
|---|---|---|
| `/tca/rutas/gps/actualizar` | `POST` | Recibe ubicación desde celular del vendedor. Actualiza `GPS_ULTIMA_POSICION` con UPSERT. Guarda histórico en `GPS_LOG`. |
| `/tca/rutas/monitoreo-gps` | `GET` | Última posición de todos los vendedores activos para el mapa de supervisión. |
| `/tca/rutas/historial-posiciones` | `GET` | Trazado histórico por vendedor/fecha para auditoría. |

### Consideraciones de Seguridad y Privacidad

- **Autenticación**: Solo vendedores autenticados pueden enviar ubicación
- **Autorización**: Solo Supervisor/Gerencia pueden visualizar ubicaciones
- **HTTPS**: Obligatorio en producción
- **Permisos**: Solicitar permiso `geolocation` explícitamente
- **Privacidad**: Informar uso de ubicación a vendedores

## Optimización de Rutas Basada en Rendimiento

### Objetivo
Reacomodar la hoja de ruta del vendedor basado en análisis de rendimiento de ventas, priorizando clientes con mayor potencial y optimizando distancias.

### Factores de Priorización

| Factor | Peso | Descripción |
|---|---|---|
| Ventas últimos 30 días | 40% | Clientes con mayor facturación histórica |
| Frecuencia de compra | 15% | Recurrencia de pedidos |
| Venta potencial / línea objetivo | 10% | Oportunidades de venta cruzada |
| Distancia desde posición actual | 25% | Eficiencia del recorrido |
| Hora pico / restricción zona | 10% | Consideraciones de tráfico Lima |

### Algoritmos

- **MVP (Greedy)**: Nearest Neighbor + ajuste por score
- **Óptimo (Producción)**: Vehicle Routing Problem (VRP) con time windows/capacidades

### Endpoint Necesario

| Endpoint | Método | Descripción |
|---|---|---|
| `/tca/rutas/optimizar-sugerido` | `POST` | Retorna nuevo orden sugerido con `orden_sugerido[]`, distancias, tiempos y `ahorro_km/min`. |

## Portal de Clientes

### Funcionalidades

| Funcionalidad | Descripción |
|---|---|
| Login con RUC/DNI + OTP | Autenticación para portal cliente |
| Mi Vendedor Asignado | Ver datos y contacto del vendedor asignado |
| Solicitar Visita | Solicitar visita con fecha/hora/motivo preferidos |
| Pedido Rápido | Catálogo filtrado por lista de precios asignada |
| Mis Pedidos | Historial con seguimiento de estados |
| Llamar a mi Vendedor | Link `tel:` directo |

### Flujo Pedido Rápido

Cliente crea pedido -> queda `PENDIENTE_CONFIRMACION` -> Vendedor recibe notificación -> Rectifica y confirma -> Pasa a `CONFIRMADO` / `EN_REPARTO`

## APIs Necesarias para Integración con Oracle

Todas las APIs deben exponerse vía **Oracle REST Data Services (ORDS)** con **Package PL/SQL `PKG_TCA_WEBAPI`** retornando `CLOB` JSON.

### 1. Autenticación
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/auth/login` | POST | `AUTH_LOGIN` | `p_usuario`, `p_clave_hash` | Login admin/vendedor/supervisor/gerencia |
| `/tca/auth/perfil` | GET | `GET_PERFIL` | `p_token` | Perfil usuario |
| `/tca/cliente/login` | POST | `AUTH_CLIENTE_LOGIN` | `p_identificador`, `p_telefono`/`p_otp` | Login portal cliente |

### 2. Dashboard / Gerencia
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/dashboard/kpi-gerencia` | GET | `GET_KPI_GERENCIA` | `p_fecha_ini`, `p_fecha_fin`, `p_zona_id`, `p_supervisor_id` | KPI globales |
| `/tca/dashboard/ventas-por-vendedor` | GET | `GET_VENTAS_POR_VENDEDOR` | `p_fecha_ini`, `p_fecha_fin`, `p_zona_id` | Ranking vendedores |
| `/tca/dashboard/evolucion-mensual` | GET | `GET_EVOLUCION_MENSUAL` | `p_anio`, `p_zona_id` | Evolutivo mensual |
| `/tca/dashboard/top-productos` | GET | `GET_TOP_PRODUCTOS` | `p_fecha_ini`, `p_fecha_fin`, `p_top` | Top productos |

### 3. Vendedor
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/vendedor/ruta-diaria` | GET | `GET_RUTA_DIARIA_VENDEDOR` | `p_vendedor_id`, `p_fecha` | Hoja de ruta |
| `/tca/vendedor/resumen-dia` | GET | `GET_RESUMEN_DIA_VENDEDOR` | `p_vendedor_id`, `p_fecha` | Resumen diario |
| `/tca/vendedor/pedidos-por-confirmar` | GET | `GET_PEDIDOS_POR_CONFIRMAR` | `p_vendedor_id`, `p_estado` | Pedidos portal cliente |
| `/tca/vendedor/pedido-rapido/confirmar` | POST | `CONFIRMAR_PEDIDO_RAPIDO` | `p_pedido_rapido_id`, `p_vendedor_id`, `p_items_json`, `p_observaciones_vendedor`, `p_accion` | Rectificar/confirmar/rechazar |
| `/tca/vendedor/toma-pedido` | POST | `REGISTRAR_TOMA_PEDIDO` | `p_visita_id`, `p_vendedor_id`, `p_cliente_id`, `p_items_json`, `p_forma_pago`, `p_observaciones` | Toma de pedido rápida |
| `/tca/vendedor/checkin` | POST | `REGISTRAR_CHECKIN_VISITA` | `p_visita_id`, `p_vendedor_id`, `p_latitud`, `p_longitud`, `p_accuracy`, `p_fecha_hora` | Check-in geocercado |

### 4. Supervisor
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/supervisor/resumen-equipo` | GET | `GET_RESUMEN_EQUIPO` | `p_supervisor_id`, `p_fecha`, `p_zona_id` | Resumen equipo |
| `/tca/supervisor/seguimiento-rutas` | GET | `GET_SEGUIMIENTO_RUTAS` | `p_supervisor_id`, `p_fecha` | Seguimiento rutas |
| `/tca/supervisor/alertas` | GET | `GET_ALERTAS_SUPERVISOR` | `p_supervisor_id`, `p_fecha` | Alertas operativas |
| `/tca/supervisor/reasignar-visita` | POST | `REASIGNAR_VISITA` | `p_visita_id`, `p_vendedor_origen_id`, `p_vendedor_destino_id`, `p_motivo`, `p_usuario` | Reasignación |

### 5. Rutas y Mapas
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/rutas/gps/actualizar` | POST | `ACTUALIZAR_POSICION_GPS` | `p_vendedor_id`, `p_latitud`, `p_longitud`, `p_velocidad_kmh`, `p_precision_m`, `p_bateria_pct` | Actualizar GPS desde móvil |
| `/tca/rutas/monitoreo-gps` | GET | `GET_MONITOREO_GPS` | `p_fecha`, `p_zona_id`, `p_supervisor_id`, `p_solo_activos` | Monitoreo tiempo real |
| `/tca/rutas/paradas-mapa` | GET | `GET_PARADAS_PARA_MAPA` | `p_vendedor_id`, `p_fecha` | Paradas con coords |
| `/tca/rutas/historial-posiciones` | GET | `GET_HISTORIAL_GPS` | `p_vendedor_id`, `p_fecha`, `p_hora_ini`, `p_hora_fin` | Historial recorrido |
| `/tca/rutas/optimizar-sugerido` | POST | `GET_RUTA_OPTIMIZADA_SUGERIDA` | `p_vendedor_id`, `p_fecha`, `p_latitud_actual`, `p_longitud_actual`, `p_visitas_pendientes_json` | Sugerir ruta optimizada |
| `/tca/rutas/geofences` | GET | `GET_GEOFENCES` | `p_zona_id` | Geocercas por cliente |

### 6. Reportes
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/reportes/consolidado` | GET | `GET_REPORTE_CONSOLIDADO` | `p_fecha_ini`, `p_fecha_fin`, `p_vendedor_id`, `p_zona_id`, `p_supervisor_id` | Reporte detallado |
| `/tca/reportes/resumen-por-vendedor` | GET | `GET_RESUMEN_POR_VENDEDOR` | `p_fecha_ini`, `p_fecha_fin`, `p_zona_id` | Resumen agrupado |
| `/tca/reportes/ventas-por-linea` | GET | `GET_VENTAS_POR_LINEA` | `p_fecha_ini`, `p_fecha_fin`, `p_zona_id` | Ventas por línea/familia |

### 7. Concursos
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/concursos/listado` | GET | `GET_CONCURSOS` | `p_estado`, `p_fecha` | Listado concursos |
| `/tca/concursos/detalle` | GET | `GET_DETALLE_CONCURSO` | `p_concurso_id` | Detalle concurso |
| `/tca/concursos/avance` | GET | `GET_AVANCE_CONCURSO` | `p_concurso_id`, `p_vendedor_id`, `p_zona_id` | Avance vs meta |
| `/tca/concursos/reporte-pdf-datos` | GET | `GET_DATOS_PDF_CONCURSO` | `p_concurso_id`, `p_tipo` | Datos para PDF |

### 8. Maestros
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/maestros/productos` | GET | `GET_MAESTRO_PRODUCTOS` | `p_filtro`, `p_activo` | Catálogo productos |
| `/tca/maestros/clientes` | GET | `GET_MAESTRO_CLIENTES` | `p_filtro`, `p_vendedor_id` | Catálogo clientes (con coords) |
| `/tca/maestros/empleados` | GET | `GET_MAESTRO_EMPLEADOS` | `p_tipo`, `p_activo` | Empleados/vendedores/supervisores |
| `/tca/maestros/guardar` | POST | `GUARDAR_MAESTRO` | `p_modulo`, `p_accion`, `p_data_json`, `p_usuario` | Crear/actualizar |
| `/tca/maestros/eliminar` | POST | `ELIMINAR_MAESTRO` | `p_modulo`, `p_id`, `p_usuario`, `p_motivo` | Inactivar (lógico) |

### 9. Portal Cliente
| Endpoint | Método | Procedimiento | Parámetros | Uso |
|---|---|---|---|---|
| `/tca/cliente/mis-datos` | GET | `GET_CLIENTE_DETALLE` | `p_cliente_id` | Datos cliente + vendedor asignado |
| `/tca/cliente/solicitar-visita` | POST | `SOLICITAR_VISITA_CLIENTE` | `p_cliente_id`, `p_vendedor_id`, `p_fecha_preferida`, `p_hora_preferida`, `p_motivo` | Solicitar visita |
| `/tca/cliente/catalogo-pedido` | GET | `GET_CATALOGO_CLIENTE` | `p_cliente_id` | Catálogo por lista de precios |
| `/tca/cliente/pedido-rapido/crear` | POST | `CREAR_PEDIDO_RAPIDO` | `p_cliente_id`, `p_vendedor_id`, `p_items_json`, `p_observaciones` | Crear pedido rápido |
| `/tca/cliente/mis-pedidos` | GET | `GET_MIS_PEDIDOS_CLIENTE` | `p_cliente_id`, `p_estado` | Historial pedidos |
| `/tca/cliente/llamar-vendedor` | GET | `GET_CONTACTO_VENDEDOR` | `p_cliente_id` | Contacto vendedor (tel/whatsapp) |

## Pruebas para Validación de APIs Oracle

### 4.1 Pruebas SQL Directas
| API | Prueba | Resultado Esperado |
|---|---|---|
| `GET_KPI_GERENCIA` | `SELECT PKG_TCA_WEBAPI.GET_KPI_GERENCIA(...) FROM DUAL;` | JSON parseable sin ORA- |
| `GET_VENTAS_POR_VENDEDOR` | Conciliación con facturas del rango | Sumas coinciden exactamente |
| `GET_RUTA_DIARIA_VENDEDOR` | Comparar con ruta real | Mismos clientes/estados |
| `GET_MONITOREO_GPS` | Revisar última posición | Coordenadas válidas, sin 0,0/NULL |
| `CONFIRMAR_PEDIDO_RAPIDO` | Rectificar ítem y confirmar | Genera pedido en PEDIDO_CAB/DET |

### 4.2 Pruebas Postman/ORDS
| Prueba | Validación |
|---|---|
| Status/Headers | 200 OK, `Content-Type: application/json` |
| Esquema JSON | Claves obligatorias presentes |
| Coherencia IGV | `venta_con_igv ≈ venta_sin_igv * 1.18` |
| Georreferenciación | Paradas con lat/lng válidos |
| Flujo pedido rápido | crear -> ver en pendientes -> confirmar OK |
| Rendimiento | < 800ms p95 listados, < 1500ms consolidados |

### 4.3 Pruebas Integradas Frontend
| Vista | Validación |
|---|---|
| Vendedor IGV | "Toma de Pedido Rápido" usa 18% fijo |
| Rutas y Mapas | GPS actualiza marcadores, geocercas correctas |
| Reportes | Sumas CSV = sumas pantalla |
| Concursos | Avance coincide con facturación |
| Portal Cliente | Pedido llega a vendedor asignado |

## Requerimientos al DBA de Oracle

### Checklist Obligatorio

```text
[ ] Crear PACKAGE PKG_TCA_WEBAPI con todas las APIs
[ ] Exponer vía ORDS bajo /tca/* (GET/POST)
[ ] Retornar CLOB JSON con Content-Type application/json
[ ] Devolver venta_con_igv y venta_sin_igv en totales
[ ] Garantizar lat/lng en CLIENTES y RUTA_DET
[ ] Crear GPS_ULTIMA_POSICION + GPS_LOG
[ ] Implementar CONFIRMAR_PEDIDO_RAPIDO con rectificación
[ ] Implementar GET_RUTA_OPTIMIZADA_SUGERIDA con ahorro
[ ] Auditoría en acciones sensibles
[ ] Índices: (VENDEDOR_ID,FECHA), (CLIENTE_ID), (FECHA_EMISION), (GPS_ULTIMA_POSICION.VENDEDOR_ID)
[ ] Validación por rol en APIs sensibles
[ ] Inactivación lógica (ACTIVO='N') en maestros
[ ] Pruebas SQL + Postman OK
```

### Requerimientos Técnicos

| Requerimiento | Justificación |
|---|---|
| Usar `APEX_JSON`/`JSON_OBJECT`/`JSON_ARRAYAGG` | Generación JSON eficiente |
| Parámetros fecha `DATE`/`TIMESTAMP` (YYYY-MM-DD) | Evitar desfases horarios |
| UPSERT para GPS | Actualizar última posición sin duplicados |
| Vistas materializadas para KPI gerencia | Performance en horas pico |
| Auditoría `AUDITORIA_TCA` | Trazabilidad acciones sensibles |
| No exponer stacktrace Oracle | Errores amigables en JSON |

## Despliegue

### Desarrollo
```bash
npm run dev  # http://localhost:3000
```

### Producción (Vercel)
El repositorio está conectado a Vercel para despliegue automático desde `main`.

```bash
npm run build  # Genera dist/
```

## Notas Importantes

- **Datos Mock**: Actualmente usa `src/data/mockData.ts`. Migrar a APIs Oracle una vez validadas.
- **IGV Vendedor**: En "Toma de Pedido Rápido" (`VendedorView`) el IGV es **fijo 18%** independiente del toggle global.
- **Georreferenciación**: Clientes sin lat/lng no se mostrarán en mapa. Corregir desde Maestros.
- **GPS**: Requiere HTTPS y permisos de ubicación. En localhost funciona para pruebas.
- **Tolerancia redondeo**: Permitir diferencia <= S/. 1.00 entre sumatorias. **Cero diferencia** en conteos.
- **Inactivación lógica**: Siempre preferir inactivar sobre eliminar físicamente.
- **Conciliación obligatoria**: Validar totales entre Dashboard, Vendedor, Reportes y Gerencia sean idénticos.

---

**Última actualización**: Octubre 2026  
**Repositorio**: [https://github.com/fvaleradeveloper/tca_2](https://github.com/fvaleradeveloper/tca_2)  
**Deploy**: Vercel (auto-deploy desde `main`)
