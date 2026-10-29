import React, { useEffect, useRef, useState } from 'react';
import L from 'leaflet';
import { Vendedor } from '../types';
import { CARLOS_GOMEZ_VISITS } from '../data/mockData';
import { 
  MapPin, 
  Navigation, 
  Clock, 
  CheckCircle2, 
  AlertTriangle, 
  Phone, 
  Store,
  Layers,
  Compass,
  Zap,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Crosshair,
  Search
} from 'lucide-react';

interface RutasMapasViewProps {
  vendedores: Vendedor[];
  withIGV: boolean;
  onCallVendedor: (v: Vendedor) => void;
}

// Tile layer configurations
const TILE_LAYERS = {
  voyager: {
    name: 'Calles y Avenidas (Detallado)',
    url: 'https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png',
    attribution: '&copy; OpenStreetMap contributors &copy; CARTO',
    maxZoom: 19,
  },
  osm: {
    name: 'OpenStreetMap Estándar',
    url: 'https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',
    attribution: '&copy; OpenStreetMap contributors',
    maxZoom: 19,
  },
  satellite: {
    name: 'Híbrido Satelital',
    url: 'https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}',
    attribution: 'Tiles &copy; Esri',
    maxZoom: 19,
  },
};

// District / Sector presets for quick jump in Lima
const SECTORS = [
  {
    name: 'Lima Norte: Los Olivos / SMP',
    description: 'Av. Izaguirre, Av. Antúnez de Mayolo, Av. Universitaria',
    center: [-11.9930, -77.0700] as [number, number],
    zoom: 15,
    repId: 'v-1',
  },
  {
    name: 'Lima Norte: Comas',
    description: 'Av. Túpac Amaru, Av. Universitaria Norte',
    center: [-11.9400, -77.0500] as [number, number],
    zoom: 15,
    repId: 'v-3',
  },
  {
    name: 'Lima Centro: Cercado / Breña',
    description: 'Av. Alfonso Ugarte, Av. Abancay, Av. Grau',
    center: [-12.0464, -77.0428] as [number, number],
    zoom: 15,
    repId: 'v-2',
  },
  {
    name: 'Lima Este: San Juan de Lurigancho',
    description: 'Av. Próceres de la Independencia, Av. Canto Grande',
    center: [-11.9870, -76.9980] as [number, number],
    zoom: 15,
    repId: 'v-4',
  },
  {
    name: 'Vista General Lima Metropolitana',
    description: 'Visión consolidada de todas las rutas activas',
    center: [-12.0200, -77.0500] as [number, number],
    zoom: 12,
    repId: 'all',
  },
];

export const RutasMapasView: React.FC<RutasMapasViewProps> = ({
  vendedores,
  withIGV,
  onCallVendedor,
}) => {
  const mapContainerRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<L.Map | null>(null);
  const tileLayerRef = useRef<L.TileLayer | null>(null);
  const markersLayerRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);
  const geofencesLayerRef = useRef<L.LayerGroup | null>(null);

  const [selectedRepId, setSelectedRepId] = useState<string>('v-1');
  const [selectedPin, setSelectedPin] = useState<any>(CARLOS_GOMEZ_VISITS[0]);
  const [activeTileKey, setActiveTileKey] = useState<keyof typeof TILE_LAYERS>('voyager');
  const [currentZoom, setCurrentZoom] = useState<number>(15);
  const [showGeofences, setShowGeofences] = useState<boolean>(true);
  const [streetSearch, setStreetSearch] = useState<string>('');

  const currentRep = vendedores.find((v) => v.id === selectedRepId) || vendedores[0];

  const formatSoles = (amountWithIGV: number) => {
    const val = withIGV ? amountWithIGV : amountWithIGV / 1.18;
    return `S/. ${Math.round(val).toLocaleString('en-US')}`;
  };

  // Initialize Leaflet Map
  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (!mapInstanceRef.current) {
      // Create Map centered in Los Olivos, Lima Norte
      const map = L.map(mapContainerRef.current, {
        center: [-11.9930, -77.0700],
        zoom: 15,
        zoomControl: false, // Custom styled zoom controls
        scrollWheelZoom: true,
      });

      // Add Tile Layer with high-contrast street and avenue labels
      const tileConfig = TILE_LAYERS[activeTileKey];
      const tiles = L.tileLayer(tileConfig.url, {
        attribution: tileConfig.attribution,
        maxZoom: tileConfig.maxZoom,
      }).addTo(map);

      tileLayerRef.current = tiles;

      // Create LayerGroups for markers, route paths, and geofences
      markersLayerRef.current = L.layerGroup().addTo(map);
      geofencesLayerRef.current = L.layerGroup().addTo(map);

      map.on('zoomend', () => {
        setCurrentZoom(map.getZoom());
      });

      mapInstanceRef.current = map;
    }

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  // Update Tile Layer when user toggles style
  useEffect(() => {
    if (!mapInstanceRef.current || !tileLayerRef.current) return;
    const tileConfig = TILE_LAYERS[activeTileKey];
    tileLayerRef.current.setUrl(tileConfig.url);
  }, [activeTileKey]);

  // Render Markers, Routes, and Geofences for Selected Rep & Visits
  useEffect(() => {
    const map = mapInstanceRef.current;
    if (!map || !markersLayerRef.current || !geofencesLayerRef.current) return;

    // Clear previous elements
    markersLayerRef.current.clearLayers();
    geofencesLayerRef.current.clearLayers();
    if (routeLayerRef.current) {
      routeLayerRef.current.remove();
      routeLayerRef.current = null;
    }

    // Determine visits to plot
    const visitsToPlot = CARLOS_GOMEZ_VISITS;
    const routeCoordinates: [number, number][] = [];

    // 1. Plot Client Store Stops
    visitsToPlot.forEach((visit, index) => {
      const pos: [number, number] = [visit.lat, visit.lng];
      routeCoordinates.push(pos);

      // Color scheme according to status
      let bgColor = '#10b981'; // green completed
      let borderColor = '#065f46';
      if (visit.status === 'en_proceso') {
        bgColor = '#2563eb'; // blue in progress
        borderColor = '#1d4ed8';
      } else if (visit.status === 'rechazado') {
        bgColor = '#dc2626'; // red rejected
        borderColor = '#991b1b';
      } else if (visit.status === 'pendiente') {
        bgColor = '#64748b'; // slate pending
        borderColor = '#334155';
      }

      // Custom HTML Pin with Stop Sequence Number & Street Indicator
      const pinHtml = `
        <div style="position: relative; display: flex; flex-direction: column; align-items: center; cursor: pointer;">
          <div style="background-color: ${bgColor}; border: 2.5px solid white; box-shadow: 0 4px 10px rgba(0,0,0,0.3); width: 28px; height: 28px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 12px; font-family: monospace;">
            ${index + 1}
          </div>
          <div style="background: rgba(15, 23, 42, 0.95); color: #f8fafc; font-size: 10px; font-weight: 600; padding: 2px 6px; border-radius: 4px; margin-top: 2px; white-space: nowrap; box-shadow: 0 2px 5px rgba(0,0,0,0.25); border: 1px solid rgba(255,255,255,0.15);">
            ${visit.clientName}
          </div>
        </div>
      `;

      const customIcon = L.divIcon({
        html: pinHtml,
        className: 'custom-store-pin',
        iconSize: [120, 52],
        iconAnchor: [60, 14],
      });

      const marker = L.marker(pos, { icon: customIcon });

      // Click Marker handler
      marker.on('click', () => {
        setSelectedPin(visit);
        map.panTo(pos, { animate: true });
      });

      // Bind rich popup with address, avenue, and status
      marker.bindPopup(`
        <div style="font-family: sans-serif; padding: 4px; min-width: 180px;">
          <div style="font-weight: 700; font-size: 13px; color: #0f172a;">${visit.clientName}</div>
          <div style="font-size: 11px; color: #475569; margin-top: 2px;">📍 ${visit.address}</div>
          <div style="font-size: 11px; color: #475569;">Distrito: <strong>${visit.district}</strong></div>
          <div style="font-size: 11px; margin-top: 6px; padding-top: 4px; border-top: 1px solid #e2e8f0; display: flex; justify-content: space-between;">
            <span>Estado:</span>
            <strong style="color: ${bgColor}; text-transform: capitalize;">${visit.status}</strong>
          </div>
          ${visit.orderTotal ? `<div style="font-size: 11px; display: flex; justify-content: space-between; font-weight: bold; color: #006c49;"><span>Pedido:</span><span>S/. ${visit.orderTotal}</span></div>` : ''}
        </div>
      `);

      markersLayerRef.current?.addLayer(marker);

      // Add Geofence circle (radius: 45 meters around the store)
      if (showGeofences) {
        const circle = L.circle(pos, {
          radius: 45,
          color: bgColor,
          fillColor: bgColor,
          fillOpacity: 0.12,
          weight: 1.5,
          dashArray: '4, 4',
        });
        geofencesLayerRef.current?.addLayer(circle);
      }
    });

    // 2. Plot Sales Representative Live Position (Carlos Gomez in Av. Antúnez de Mayolo)
    const repPos: [number, number] = [-11.9860, -77.0690];
    const repIconHtml = `
      <div style="position: relative; display: flex; flex-direction: column; align-items: center;">
        <span style="position: absolute; width: 44px; height: 44px; background: rgba(16, 185, 129, 0.35); border-radius: 50%; animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite; top: -6px;"></span>
        <div style="background: #131b2e; border: 3px solid #10b981; width: 34px; height: 34px; border-radius: 50%; display: flex; align-items: center; justify-content: center; color: white; font-weight: 800; font-size: 13px; box-shadow: 0 4px 12px rgba(0,0,0,0.4); z-index: 10;">
          CG
        </div>
        <div style="background: #0f172a; color: #10b981; font-size: 10px; font-weight: 700; padding: 2px 8px; border-radius: 9999px; margin-top: 3px; box-shadow: 0 2px 6px rgba(0,0,0,0.3); border: 1px solid #10b981; white-space: nowrap; z-index: 10;">
          Carlos Gomez (24 km/h)
        </div>
      </div>
    `;

    const repMarker = L.marker(repPos, {
      icon: L.divIcon({
        html: repIconHtml,
        className: 'custom-rep-pin',
        iconSize: [120, 60],
        iconAnchor: [60, 17],
      }),
      zIndexOffset: 1000,
    });

    repMarker.bindPopup(`
      <div style="font-family: sans-serif; padding: 4px;">
        <div style="font-weight: 800; font-size: 13px; color: #0f172a;">Carlos Gomez · En Ruta</div>
        <div style="font-size: 11px; color: #475569;">📍 Av. Antúnez de Mayolo cdra. 14</div>
        <div style="font-size: 11px; color: #475569;">Velocidad: <strong>24 km/h</strong></div>
        <div style="font-size: 11px; color: #059669; font-weight: bold; margin-top: 4px;">✅ Geocerca activa</div>
      </div>
    `);

    markersLayerRef.current?.addLayer(repMarker);

    // 3. Draw Route Path Polyline tracing connecting avenues
    const routePath = L.polyline(routeCoordinates, {
      color: '#006c49',
      weight: 4,
      opacity: 0.85,
      dashArray: '8, 6',
      lineJoin: 'round',
    }).addTo(map);

    routeLayerRef.current = routePath;
  }, [selectedRepId, showGeofences]);

  // Zoom handlers
  const handleZoomIn = () => {
    mapInstanceRef.current?.zoomIn();
  };

  const handleZoomOut = () => {
    mapInstanceRef.current?.zoomOut();
  };

  const handleResetView = () => {
    mapInstanceRef.current?.setView([-11.9930, -77.0700], 15, { animate: true });
  };

  const handleJumpToSector = (sector: typeof SECTORS[0]) => {
    mapInstanceRef.current?.setView(sector.center, sector.zoom, { animate: true });
    if (sector.repId !== 'all') {
      setSelectedRepId(sector.repId);
    }
  };

  const handleSearchAvenue = (e: React.FormEvent) => {
    e.preventDefault();
    if (!streetSearch.trim()) return;

    const query = streetSearch.toLowerCase();
    // Check known avenues in Lima Norte
    if (query.includes('izaguirre')) {
      mapInstanceRef.current?.setView([-11.9965, -77.0620], 16, { animate: true });
    } else if (query.includes('mayolo') || query.includes('antunez')) {
      mapInstanceRef.current?.setView([-11.9922, -77.0705], 16, { animate: true });
    } else if (query.includes('palmeras')) {
      mapInstanceRef.current?.setView([-11.9840, -77.0740], 16, { animate: true });
    } else if (query.includes('universitaria')) {
      mapInstanceRef.current?.setView([-11.9790, -77.0780], 16, { animate: true });
    } else if (query.includes('panamericana') || query.includes('mendiola')) {
      mapInstanceRef.current?.setView([-11.9900, -77.0610], 15, { animate: true });
    } else if (query.includes('tupac') || query.includes('comas')) {
      mapInstanceRef.current?.setView([-11.9400, -77.0500], 15, { animate: true });
    } else if (query.includes('centro') || query.includes('abancay') || query.includes('alfonso ugarte')) {
      mapInstanceRef.current?.setView([-12.0464, -77.0428], 15, { animate: true });
    } else {
      // Default to current representative route
      mapInstanceRef.current?.setView([-11.9930, -77.0700], 16, { animate: true });
    }
  };

  return (
    <div className="flex flex-col w-full gap-6 pb-20">
      {/* Page Title & Controls */}
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-6 rounded-xl flex flex-col md:flex-row md:items-center justify-between gap-4 shadow-xs">
        <div>
          <span className="text-xs uppercase tracking-wider text-[#45464d] dark:text-[#cbd5e1] font-bold">
            Telemetría GPS & Navegación Satelital
          </span>
          <h1 className="text-2xl font-bold text-[#191c1e] dark:text-[#f1f5f9] tracking-tight">
            Rutas, Calles y Avenidas en Tiempo Real - Lima
          </h1>
          <p className="text-sm text-[#45464d] dark:text-[#cbd5e1]">
            Mapa detallado con visualización de avenidas principales, calles, jirones, geocercas y paradas de distribución.
          </p>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          <div className="flex items-center gap-2 bg-white dark:bg-[#1e293b] border border-[#c6c6cd] dark:border-[#475569] px-3 py-1.5 rounded-lg shadow-2xs">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="text-xs font-bold text-slate-800">GPS Satelital Online</span>
          </div>

          <div className="flex items-center gap-1 bg-white dark:bg-[#1e293b] border border-[#c6c6cd] dark:border-[#475569] p-1 rounded-lg">
            <button
              onClick={() => setActiveTileKey('voyager')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                activeTileKey === 'voyager'
                  ? 'bg-[#131b2e] text-white shadow-xs'
                  : 'text-[#45464d] dark:text-[#cbd5e1] hover:text-[#191c1e] dark:text-[#f1f5f9]'
              }`}
            >
              Calles y Avenidas
            </button>
            <button
              onClick={() => setActiveTileKey('osm')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                activeTileKey === 'osm'
                  ? 'bg-[#131b2e] text-white shadow-xs'
                  : 'text-[#45464d] dark:text-[#cbd5e1] hover:text-[#191c1e] dark:text-[#f1f5f9]'
              }`}
            >
              OpenStreetMap
            </button>
            <button
              onClick={() => setActiveTileKey('satellite')}
              className={`px-2.5 py-1 text-xs font-bold rounded transition-colors cursor-pointer ${
                activeTileKey === 'satellite'
                  ? 'bg-[#131b2e] text-white shadow-xs'
                  : 'text-[#45464d] dark:text-[#cbd5e1] hover:text-[#191c1e] dark:text-[#f1f5f9]'
              }`}
            >
              Satelital
            </button>
          </div>
        </div>
      </div>

      {/* Sector Quick Jump & Search Avenues Strip */}
      <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-4 rounded-xl shadow-xs flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
        {/* Quick Sector Buttons */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <span className="text-xs font-bold text-[#45464d] dark:text-[#cbd5e1] uppercase tracking-wide shrink-0 mr-1 flex items-center gap-1">
            <Compass className="w-3.5 h-3.5 text-emerald-600" />
            Sectores:
          </span>
          {SECTORS.map((sec, idx) => (
            <button
              key={idx}
              onClick={() => handleJumpToSector(sec)}
              className="px-3 py-1.5 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:bg-slate-800 border border-[#c6c6cd] dark:border-[#475569] text-slate-800 text-xs font-semibold rounded-lg shadow-2xs whitespace-nowrap cursor-pointer transition-all hover:border-slate-900"
              title={sec.description}
            >
              {sec.name}
            </button>
          ))}
        </div>

        {/* Street & Avenue Live Search */}
        <form onSubmit={handleSearchAvenue} className="flex items-center gap-2 shrink-0">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 dark:text-slate-500 absolute left-2.5 top-2.5" />
            <input
              type="text"
              value={streetSearch}
              onChange={(e) => setStreetSearch(e.target.value)}
              placeholder="Buscar avenida (ej: Izaguirre, Mayolo)..."
              className="pl-8 pr-3 py-1.5 bg-white dark:bg-[#1e293b] border border-[#c6c6cd] dark:border-[#475569] rounded-lg text-xs font-medium text-slate-800 outline-none w-64 shadow-2xs placeholder:text-slate-400 dark:text-slate-500"
            />
          </div>
          <button
            type="submit"
            className="px-3 py-1.5 bg-[#131b2e] hover:bg-black text-white text-xs font-bold rounded-lg shadow-xs cursor-pointer"
          >
            Ubicar
          </button>
        </form>
      </div>

      {/* Main Map + Sidebar Layout */}
      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Map Viewport (col-span-3) */}
        <div className="lg:col-span-3 bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-xl overflow-hidden shadow-xs flex flex-col relative">
          {/* Map Top Subheader */}
          <div className="p-3.5 bg-white dark:bg-[#1e293b] border-b border-[#e0e3e5] dark:border-[#334155] flex items-center justify-between flex-wrap gap-2 text-xs">
            <div className="flex items-center gap-3">
              <span className="font-bold text-[#191c1e] dark:text-[#f1f5f9] flex items-center gap-1.5">
                <Navigation className="w-4 h-4 text-emerald-600" />
                Vendedor en Monitoreo:
              </span>
              <select
                value={selectedRepId}
                onChange={(e) => {
                  setSelectedRepId(e.target.value);
                  if (e.target.value === 'v-1') {
                    mapInstanceRef.current?.setView([-11.9930, -77.0700], 15, { animate: true });
                  } else if (e.target.value === 'v-2') {
                    mapInstanceRef.current?.setView([-12.0464, -77.0428], 15, { animate: true });
                  } else if (e.target.value === 'v-3') {
                    mapInstanceRef.current?.setView([-11.9400, -77.0500], 15, { animate: true });
                  } else if (e.target.value === 'v-4') {
                    mapInstanceRef.current?.setView([-11.9870, -76.9980], 15, { animate: true });
                  }
                }}
                className="bg-slate-100 dark:bg-slate-700 border border-slate-300 rounded px-2.5 py-1 text-xs font-semibold outline-none cursor-pointer"
              >
                {vendedores.slice(0, 6).map((v) => (
                  <option key={v.id} value={v.id}>
                    {v.name} ({v.route})
                  </option>
                ))}
              </select>

              <label className="flex items-center gap-1.5 ml-2 cursor-pointer select-none text-[11px] font-semibold text-slate-700 dark:text-slate-200">
                <input
                  type="checkbox"
                  checked={showGeofences}
                  onChange={(e) => setShowGeofences(e.target.checked)}
                  className="rounded text-emerald-600 cursor-pointer"
                />
                <span>Mostrar Geocercas (45m)</span>
              </label>
            </div>

            <div className="flex items-center gap-3 text-[11px] text-[#45464d] dark:text-[#cbd5e1]">
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-600"></span> Concretado
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-blue-600"></span> En Proceso
              </span>
              <span className="flex items-center gap-1">
                <span className="w-2.5 h-2.5 rounded-full bg-slate-50 dark:bg-slate-8000"></span> Pendiente
              </span>
            </div>
          </div>

          {/* Interactive Leaflet Map Container */}
          <div className="relative w-full h-[560px]">
            <div ref={mapContainerRef} className="w-full h-full z-10" />

            {/* Custom High-Contrast Map Zoom & Reset Controls */}
            <div className="absolute top-4 right-4 z-20 flex flex-col gap-1.5 shadow-md">
              <button
                onClick={handleZoomIn}
                className="w-9 h-9 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:bg-slate-800 border border-slate-300 text-slate-800 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm transition-colors cursor-pointer"
                title="Acercar mapa (Zoom In)"
              >
                <ZoomIn className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>
              <button
                onClick={handleZoomOut}
                className="w-9 h-9 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:bg-slate-800 border border-slate-300 text-slate-800 rounded-lg flex items-center justify-center font-bold text-lg shadow-sm transition-colors cursor-pointer"
                title="Alejar mapa (Zoom Out)"
              >
                <ZoomOut className="w-4 h-4 text-slate-700 dark:text-slate-200" />
              </button>
              <button
                onClick={handleResetView}
                className="w-9 h-9 bg-white dark:bg-[#1e293b] hover:bg-slate-50 dark:bg-slate-800 border border-slate-300 text-slate-800 rounded-lg flex items-center justify-center shadow-sm transition-colors cursor-pointer"
                title="Centrar en Los Olivos / SMP"
              >
                <Crosshair className="w-4 h-4 text-emerald-700" />
              </button>
            </div>

            {/* Current Zoom Indicator Overlay */}
            <div className="absolute top-4 left-4 z-20 bg-slate-900/85 backdrop-blur-md text-white text-[11px] font-mono px-3 py-1 rounded-lg border border-slate-700 shadow-md flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-400"></span>
              <span>
                Zoom: <strong>{currentZoom}x</strong> · {currentZoom >= 15 ? 'Nivel Calles y Avenidas' : 'Nivel Sector Macro'}
              </span>
            </div>

            {/* Prominent Avenue Guide Banner on Map Bottom */}
            <div className="absolute bottom-4 left-4 right-4 z-20 bg-slate-900/90 backdrop-blur-md border border-slate-700 rounded-xl p-3 text-white text-xs flex items-center justify-between flex-wrap gap-4 shadow-xl">
              <div className="flex items-center gap-6">
                <div>
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                    Avenidas Principales en Vista
                  </span>
                  <span className="text-xs font-semibold text-emerald-300">
                    Av. Carlos Izaguirre · Av. Antúnez de Mayolo · Av. Las Palmeras · Av. Universitaria
                  </span>
                </div>
                <div className="hidden sm:block border-l border-slate-700 pl-4">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                    Distancia Recorrida
                  </span>
                  <span className="text-sm font-bold font-mono text-emerald-400">18.4 km</span>
                </div>
                <div className="hidden sm:block border-l border-slate-700 pl-4">
                  <span className="text-[10px] text-slate-400 dark:text-slate-500 uppercase font-bold block">
                    Tiempo x Parada
                  </span>
                  <span className="text-sm font-bold font-mono">14.2 min</span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <span className="text-[10px] bg-emerald-950 text-emerald-400 border border-emerald-700 px-2.5 py-1 rounded-full font-bold">
                  Geocercas 99.1% Cumplimiento
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Selected Store / Rep Detail Sidebar (col-span-1) */}
        <div className="bg-[#f2f4f6] dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] p-5 rounded-xl shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-4 pb-3 border-b border-[#e0e3e5] dark:border-[#334155]">
              <Store className="w-5 h-5 text-[#131b2e]" />
              <div>
                <h3 className="font-bold text-sm text-[#191c1e] dark:text-[#f1f5f9]">Detalle de Punto de Venta</h3>
                <p className="text-[11px] text-[#76777d] dark:text-[#94a3b8]">Información de la parada seleccionada</p>
              </div>
            </div>

            {selectedPin ? (
              <div className="space-y-4">
                <div>
                  <span className="text-[10px] uppercase font-bold text-slate-500 dark:text-slate-400 dark:text-slate-500">Bodega / Cliente</span>
                  <h4 className="font-bold text-base text-[#191c1e] dark:text-[#f1f5f9]">{selectedPin.clientName}</h4>
                  <p className="text-xs text-[#45464d] dark:text-[#cbd5e1] flex items-center gap-1 mt-0.5 font-medium">
                    <MapPin className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                    {selectedPin.address}
                  </p>
                  <span className="inline-block mt-1 text-[10px] font-bold px-2 py-0.5 rounded bg-slate-200 dark:bg-slate-600 text-slate-800">
                    Sector: {selectedPin.district}
                  </span>
                </div>

                <div className="p-3 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-lg space-y-2 text-xs">
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Estado de Visita:</span>
                    <span className="font-bold text-emerald-700 capitalize">
                      {selectedPin.status}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Hora Programada:</span>
                    <span className="font-mono font-semibold">{selectedPin.scheduledTime} hrs</span>
                  </div>
                  {selectedPin.completedTime && (
                    <div className="flex justify-between">
                      <span className="text-slate-500 dark:text-slate-400 dark:text-slate-500">Hora Check-Out:</span>
                      <span className="font-mono font-semibold text-emerald-700">
                        {selectedPin.completedTime} hrs
                      </span>
                    </div>
                  )}
                  {selectedPin.orderTotal && (
                    <div className="flex justify-between pt-1 border-t border-slate-100 dark:border-slate-700">
                      <span className="font-bold text-slate-800">Pedido Facturado:</span>
                      <span className="font-mono font-bold text-emerald-700">
                        {formatSoles(selectedPin.orderTotal)}
                      </span>
                    </div>
                  )}
                </div>

                {selectedPin.notes && (
                  <div className="p-3 bg-amber-50 border border-amber-200 rounded-lg text-xs text-amber-900">
                    <span className="font-bold block mb-0.5">Bitácora en Punto de Venta:</span>
                    <p className="text-[11px] leading-relaxed">{selectedPin.notes}</p>
                  </div>
                )}

                {/* Nearby Avenues & References */}
                <div className="p-3 bg-white dark:bg-[#1e293b] border border-[#e0e3e5] dark:border-[#334155] rounded-lg text-xs text-slate-700 dark:text-slate-200">
                  <span className="font-bold block mb-1 text-slate-900">Avenidas y Referencias:</span>
                  <ul className="text-[11px] space-y-0.5 text-slate-600 dark:text-slate-300 list-disc list-inside">
                    <li>Cruce cercano: Av. Antúnez de Mayolo con Av. Las Palmeras</li>
                    <li>Paradero: Mercado Covida / Plaza Vea Izaguirre</li>
                    <li>Radio de Geocerca: 45 metros validado por satélite</li>
                  </ul>
                </div>
              </div>
            ) : (
              <p className="text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">Selecciona un marcador en el mapa para ver el detalle de la parada.</p>
            )}
          </div>

          <div className="pt-4 border-t border-[#e0e3e5] dark:border-[#334155] space-y-2">
            <button
              onClick={() => onCallVendedor(currentRep)}
              className="w-full py-2.5 bg-[#131b2e] hover:bg-black text-white text-xs font-bold rounded-lg flex items-center justify-center gap-2 cursor-pointer transition-colors shadow-xs"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>Llamar a {currentRep.name}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
