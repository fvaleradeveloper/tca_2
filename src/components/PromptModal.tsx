import React, { useState } from 'react';
import { X, Copy, Check, Sparkles, Terminal, FileText, Layers } from 'lucide-react';

interface PromptModalProps {
  isOpen: boolean;
  onClose: () => void;
  promptText: string;
}

export const PromptModal: React.FC<PromptModalProps> = ({
  isOpen,
  onClose,
  promptText,
}) => {
  const [copied, setCopied] = useState(false);
  const [activeTab, setActiveTab] = useState<'prompt' | 'architecture'>('prompt');

  if (!isOpen) return null;

  const handleCopy = () => {
    navigator.clipboard.writeText(promptText);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-xs p-4">
      <div className="bg-white dark:bg-[#1e293b] rounded-xl shadow-2xl border border-slate-300 w-full max-w-4xl max-h-[90vh] flex flex-col overflow-hidden animate-in fade-in zoom-in-95 duration-150">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 bg-[#131b2e] text-white">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-emerald-500/20 rounded-lg text-emerald-400">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h2 className="font-bold text-base">Prompt Maestro para Generar esta Aplicación Web</h2>
              <p className="text-xs text-slate-300">
                Especificación completa para reproducir todos los 6 screenviews y funcionalidades en cualquier generador de código de IA.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopy}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold transition-colors cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? '¡Copiado!' : 'Copiar Prompt'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 dark:text-slate-500 hover:text-white transition-colors"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Tabs */}
        <div className="flex items-center gap-4 px-6 py-2 bg-slate-100 dark:bg-slate-700 border-b border-slate-200 dark:border-slate-600 text-xs font-semibold">
          <button
            onClick={() => setActiveTab('prompt')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-colors ${
              activeTab === 'prompt'
                ? 'bg-white dark:bg-[#1e293b] text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Terminal className="w-3.5 h-3.5" />
            <span>Prompt Completo (Listo para Ejecutar)</span>
          </button>
          <button
            onClick={() => setActiveTab('architecture')}
            className={`flex items-center gap-1.5 py-1.5 px-3 rounded-md transition-colors ${
              activeTab === 'architecture'
                ? 'bg-white dark:bg-[#1e293b] text-slate-900 shadow-xs font-bold'
                : 'text-slate-600 dark:text-slate-300 hover:text-slate-900'
            }`}
          >
            <Layers className="w-3.5 h-3.5" />
            <span>Resumen de Vistas & Arquitectura</span>
          </button>
        </div>

        {/* Content */}
        <div className="flex-1 overflow-y-auto p-6 bg-slate-50 dark:bg-slate-800 font-mono text-xs">
          {activeTab === 'prompt' ? (
            <div className="bg-slate-950 text-slate-100 p-5 rounded-xl border border-slate-800 shadow-inner leading-relaxed whitespace-pre-wrap select-all">
              {promptText}
            </div>
          ) : (
            <div className="font-sans text-slate-800 space-y-4">
              {/* RBAC Architecture Box */}
              <div className="p-4 bg-emerald-50 border border-emerald-200 rounded-lg">
                <h4 className="font-bold text-sm text-emerald-950 mb-2 flex items-center gap-2">
                  <span>🔒 Matriz de Autorización y Credenciales (RBAC)</span>
                </h4>
                <div className="space-y-2 text-xs text-emerald-900 leading-relaxed">
                  <p>
                    <strong>• Nivel Vendedor:</strong> Acceso restringido exclusivamente a su hoja de ruta diaria, clientes de su turno, toma de pedidos y su GPS individual. Tiene bloqueadas las vistas de Supervisor, Gerencia, Dashboard y Reportes.
                  </p>
                  <p>
                    <strong>• Nivel Supervisor:</strong> Control integral de su Mesa de Trabajo (ej. Lima Norte - Alfa), asistencia del equipo, rankings de vendedores, llamadas, auditoría y alertas broadcast. <em>No puede ver ni acceder</em> a la Vista Gerencia (P&L corporativo ni margen bruto ni rebates).
                  </p>
                  <p>
                    <strong>• Nivel Gerencia:</strong> Superadministrador con visión completa de las 4 macro-zonas de Lima, consolidado P&L, márgenes de rentabilidad bruta (28.4%), rebates anuales de fabricantes y autorizaciones presupuestales.
                  </p>
                </div>
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-bold text-sm text-slate-900 mb-2">1. Vista Supervisor (Supervisión Operativa)</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Implementación exacta de la pantalla mostrada en el diseño: Mesa de Trabajo Lima Norte - Alfa, 4 KPIs operativos (Venta total S/. 148,250 con meta S/. 135k, Cumplimiento 94.8%, 12/12 Vendedores activos, Asistencia diaria 96.5%), gráfico de barras segmentadas por marcas (Nestlé, Alicorp, Gloria) vs categorías, Alertas de mesa con botón para Enviar Broadcast, y Ranking Detallado con tabla de asistencia, cuotas, efectividad y acciones rápidas (Llamar y Registrar Asistencia).
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-bold text-sm text-slate-900 mb-2">2. Dashboard Comercial</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Visión macro de ventas por canal, volumen mensual consolidado, drop size promedio por pedido, participación de mercado por líneas líderes y velocidad de rotación de inventario en almacenes de Lima.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-bold text-sm text-slate-900 mb-2">3. Vista Vendedor</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Herramienta de campo del representante comercial (Carlos Gomez - Ruta Norte-A): Cuota diaria del vendedor, hoja de ruta de visitas a bodegas y minimarkets de Los Olivos y SMP, toma de pedidos por SKU y cálculo de comisiones.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-bold text-sm text-slate-900 mb-2">4. Vista Gerencia</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Consolidador directivo para Gerencia Comercial y de Operaciones: Comparativo entre Lima Norte, Lima Sur, Lima Este y Lima Centro, margen bruto (28.4%), cumplimiento de márgenes y asignación de presupuestos.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-bold text-sm text-slate-900 mb-2">5. Rutas y Mapas</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Monitoreo geográfico y GPS en tiempo real de los vendedores y puntos de entrega en Lima Metropolitana, estado de visitas con geocercas, tiempos de parada y alertas de desvío de ruta.
                </p>
              </div>

              <div className="p-4 bg-white dark:bg-[#1e293b] border border-slate-200 dark:border-slate-600 rounded-lg">
                <h4 className="font-bold text-sm text-slate-900 mb-2">6. Reportes & Exportar</h4>
                <p className="text-xs text-slate-600 dark:text-slate-300">
                  Módulo de extracción analítica con generador de consultas por fecha/zona/marca y descarga real a archivo Excel/CSV y vista para impresión PDF.
                </p>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="px-6 py-3 bg-white dark:bg-[#1e293b] border-t border-slate-200 dark:border-slate-600 flex items-center justify-between text-xs text-slate-500 dark:text-slate-400 dark:text-slate-500">
          <span>Sistema: Total Calidad v2.4 (Andean Logistics)</span>
          <button
            onClick={handleCopy}
            className="text-xs font-bold text-emerald-700 hover:text-emerald-800 flex items-center gap-1 cursor-pointer"
          >
            <Copy className="w-3.5 h-3.5" />
            <span>{copied ? '¡Copiado al portapapeles!' : 'Copiar texto completo'}</span>
          </button>
        </div>
      </div>
    </div>
  );
};
