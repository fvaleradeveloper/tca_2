import { jsPDF } from 'jspdf';
import autoTable from 'jspdf-autotable';
import { Concurso } from '../types';

export function generateConcursoPDF(concurso: Concurso) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  // Título
  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('HOJA DE CONCURSO', pageWidth / 2, 20, { align: 'center' });

  doc.setFontSize(12);
  doc.setFont('helvetica', 'normal');
  doc.text(`Concurso: ${concurso.nombre}`, pageWidth / 2, 30, { align: 'center' });
  doc.text(`Proveedor: ${concurso.proveedor}`, pageWidth / 2, 38, { align: 'center' });

  let y = 50;

  // Sección 1: El concurso
  doc.setFontSize(11);
  doc.setFont('helvetica', 'bold');
  doc.text('1. EL CONCURSO', 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  const section1 = [
    ['N°', concurso.nro.toString()],
    ['Nombre', concurso.nombre],
    ['Proveedor', concurso.proveedor],
    ['Logo', concurso.logo],
    ['Tabla', concurso.tabla || '-'],
    ['Columna de tabla', concurso.columnaTabla || '-'],
    ['Qué se mide', concurso.queSeMide],
    ['Meta en texto', concurso.metaTexto || '-'],
    ['Unidad de la meta', concurso.unidadMeta],
    ['¿Incluye IGV?', concurso.incluyeIGV ? 'Sí' : 'No'],
    ['Compra mínima por cliente', concurso.compraMinimaCliente.toString()],
    ['Compra mínima en', concurso.compraMinimaEn || '-'],
    ['Pedido o mes', concurso.enPedidoOMes],
    ['¿Tiene candado?', concurso.tieneCandado],
    ['Mínimo del candado', concurso.minimoCandado.toString()],
    ['Unidad del candado', concurso.unidadCandado || '-'],
  ];
  autoTable(doc, {
    startY: y,
    head: [['Campo', 'Valor']],
    body: section1,
    theme: 'grid',
    headStyles: { fillColor: [19, 27, 46] },
    margin: { left: 15, right: 15 },
  });
  y = (doc as any).lastAutoTable.finalY + 15;

  // Sección 2: Escalas
  doc.setFont('helvetica', 'bold');
  doc.text('2. ESCALAS (Meta y Premio)', 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  if (concurso.escalas.length > 0) {
    const escalasBody = concurso.escalas.map((e, i) => [
      `Escala ${i + 1}`,
      typeof e.meta === 'number' ? `S/ ${e.meta}` : String(e.meta),
      typeof e.premio === 'number' ? `S/ ${e.premio}` : String(e.premio),
    ]);
    autoTable(doc, {
      startY: y,
      head: [['Escala', 'Meta', 'Premio']],
      body: escalasBody,
      theme: 'grid',
      headStyles: { fillColor: [19, 27, 46] },
      margin: { left: 15, right: 15 },
    });
    y = (doc as any).lastAutoTable.finalY + 15;
  } else {
    doc.text('Sin escalas definidas.', 15, y);
    y += 10;
  }

  // Sección 3: Premio
  doc.setFont('helvetica', 'bold');
  doc.text('3. PREMIO', 15, y);
  y += 6;
  doc.setFont('helvetica', 'normal');
  const section3 = [
    ['Premio en', concurso.premioEn],
    ['Producto del premio', concurso.productoPremio || '-'],
    ['¿Cómo se paga?', concurso.comoSePaga],
    ['Tope del premio', concurso.topePremio.toString()],
    ['Ranking (N mejores)', concurso.rankingN > 0 ? concurso.rankingN.toString() : '-'],
    ['Productos que cuentan', concurso.productosQueCuentan || '-'],
    ['Quiénes participan', concurso.quienesParticipan || '-'],
    ['Desde', concurso.desde || '-'],
    ['Hasta', concurso.hasta || '-'],
    ['Premio máximo', concurso.premioMaximo.toString()],
  ];
  autoTable(doc, {
    startY: y,
    head: [['Campo', 'Valor']],
    body: section3,
    theme: 'grid',
    headStyles: { fillColor: [19, 27, 46] },
    margin: { left: 15, right: 15 },
  });
  y = (doc as any).lastAutoTable.finalY + 15;

  // Notas para el vendedor
  doc.setFont('helvetica', 'bold');
  doc.text('Notas para el vendedor:', 15, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  if (concurso.notasVendedor.length > 0) {
    concurso.notasVendedor.forEach((nota) => {
      doc.text(`• ${nota}`, 15, y);
      y += 5;
    });
  } else {
    doc.text('-', 15, y);
    y += 5;
  }

  // Notas internas
  y += 5;
  doc.setFont('helvetica', 'bold');
  doc.text('Notas internas:', 15, y);
  y += 5;
  doc.setFont('helvetica', 'normal');
  doc.text(concurso.notasInternas || '-', 15, y);

  // Revisión
  y += 10;
  doc.setFont('helvetica', 'bold');
  doc.text(`Revisión: ${concurso.revision}`, 15, y);

  // Guardar
  doc.save(`Concurso_${concurso.nombre.replace(/\s+/g, '_')}.pdf`);
}

export function generateConcursosListPDF(concursos: Concurso[]) {
  const doc = new jsPDF();
  const pageWidth = doc.internal.pageSize.getWidth();

  doc.setFontSize(18);
  doc.setFont('helvetica', 'bold');
  doc.text('REPORTE DE CONCURSOS', pageWidth / 2, 20, { align: 'center' });

  const body = concursos.map((c) => [
    c.nro,
    c.nombre,
    c.proveedor,
    c.queSeMide,
    c.escalas.length > 0 ? `${c.escalas.length} escala(s)` : '-',
    c.revision,
  ]);

  autoTable(doc, {
    startY: 30,
    head: [['N°', 'Nombre', 'Proveedor', 'Qué se mide', 'Escalas', 'Revisión']],
    body,
    theme: 'grid',
    headStyles: { fillColor: [19, 27, 46] },
    margin: { left: 15, right: 15 },
  });

  doc.save('Reporte_Concursos.pdf');
}
