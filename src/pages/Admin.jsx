import { useRef, useState } from 'react';
import { MODO_PRUEBA } from '../config.js';
import { cargarPersonas, reiniciarDatosDePrueba, obtenerTodosLosTickets } from '../dataLayer.js';
import AuthGate from '../AuthGate.jsx';
import '../styles/admin.css';

function parseCSV(raw) {
  const lines = raw.split(/\r?\n/).map(l => l.trim()).filter(Boolean);
  if (lines.length === 0) return [];
  const firstCols = lines[0].split(',').map(c => c.trim().toLowerCase());
  const hasHeader = firstCols.includes('id') || firstCols.includes('telefono') || firstCols.includes('nombre');
  const dataLines = hasHeader ? lines.slice(1) : lines;

  return dataLines.map(line => {
    const parts = line.split(',').map(p => p.trim());
    return { id: parts[0] || '', nombre: parts[1] || '', correo: parts[2] || '' };
  }).filter(r => r.id);
}

function descargarCSV(filename, header, body) {
  const blob = new Blob([header + '\n' + body], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = filename;
  a.click();
  URL.revokeObjectURL(url);
}

export default function Admin() {
  return (
    <AuthGate titulo="Panel administrativo">
      {(usuario, cerrarSesion) => <AdminContent usuario={usuario} onLogout={cerrarSesion} />}
    </AuthGate>
  );
}

function AdminContent({ usuario, onLogout }) {
  const [csvText, setCsvText] = useState('');
  const [preview, setPreview] = useState('');
  const [subiendo, setSubiendo] = useState(false);
  const [progreso, setProgreso] = useState(0);
  const [uploadStatus, setUploadStatus] = useState({ text: '', kind: '' });
  const [reporteFinal, setReporteFinal] = useState([]);
  const [exportando, setExportando] = useState(false);
  const [exportStatus, setExportStatus] = useState({ text: '', kind: '' });
  const fileInputRef = useRef(null);

  function actualizarPreview(text) {
    const rows = parseCSV(text);
    setPreview(rows.length > 0 ? `${rows.length} filas detectadas. Ejemplo: ${rows[0].id} — ${rows[0].nombre}` : '');
  }

  function handleFile(e) {
    const file = e.target.files[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = ev => { setCsvText(ev.target.result); actualizarPreview(ev.target.result); };
    reader.readAsText(file);
  }

  function handleCsvChange(e) {
    setCsvText(e.target.value);
    actualizarPreview(e.target.value);
  }

  async function handleSubir() {
    const rows = parseCSV(csvText);
    if (rows.length === 0) {
      setUploadStatus({ text: 'No hay filas válidas para subir.', kind: 'bad' });
      return;
    }
    setSubiendo(true);
    setProgreso(0);
    setUploadStatus({ text: `Registrando ${rows.length} personas...`, kind: '' });

    try {
      const reporte = await cargarPersonas(rows, (subidos, total) => {
        setProgreso(Math.round((subidos / total) * 100));
        setUploadStatus({ text: `Registrando... ${subidos}/${total}`, kind: '' });
      });
      setReporteFinal(reporte);
      setUploadStatus({
        text: MODO_PRUEBA
          ? `✓ ${reporte.length} personas registradas en los datos de prueba (localStorage).`
          : `✓ ${reporte.length} personas registradas correctamente en Firestore.`,
        kind: 'ok'
      });
    } catch (err) {
      console.error(err);
      setUploadStatus({ text: 'Ocurrió un error durante el registro. Revisa la consola y tu configuración de Firebase.', kind: 'bad' });
    } finally {
      setSubiendo(false);
    }
  }

  function handleDescargarConfirmacion() {
    const body = reporteFinal.map(r => `${r.id},"${r.nombre}",${r.correo}`).join('\n');
    descargarCSV('confirmacion_personas.csv', 'telefono,nombre,correo', body);
  }

  async function handleExportar() {
    setExportando(true);
    setExportStatus({ text: '', kind: '' });
    try {
      const tickets = await obtenerTodosLosTickets();
      if (tickets.length === 0) {
        setExportStatus({ text: 'Todavía no se ha generado ninguna entrada.', kind: 'bad' });
        return;
      }
      const body = tickets.map(t => {
        const fecha = t.checkedInAt ? new Date(t.checkedInAt).toLocaleString('es-CO') : '';
        return `${t.personId},"${t.nombre}",${t.dia},${t.ticketCode},${t.checkedIn ? 'sí' : 'no'},${fecha}`;
      }).join('\n');
      descargarCSV('reporte_asistencia.csv', 'telefono,nombre,dia,codigo_qr,ingreso,fecha_hora_ingreso', body);
      setExportStatus({ text: `✓ ${tickets.length} entradas exportadas.`, kind: 'ok' });
    } catch (err) {
      console.error(err);
      setExportStatus({ text: 'Ocurrió un error al generar el reporte.', kind: 'bad' });
    } finally {
      setExportando(false);
    }
  }

  function handleReset() {
    reiniciarDatosDePrueba();
    setUploadStatus({ text: 'Datos de prueba reiniciados: 5 personas de ejemplo (sin entradas elegidas, salvo las 2 de muestra).', kind: 'ok' });
  }

  return (
    <div className="wrap">
      {MODO_PRUEBA && (
        <div className="test-banner" style={{ display: 'flex' }}>
          <span>MODO PRUEBA — los datos se guardan en este navegador (localStorage), no en una base real</span>
          <button onClick={handleReset}>Reiniciar datos de prueba</button>
        </div>
      )}

      <div className="eyebrow">Panel interno{usuario?.email ? ` · ${usuario.email}` : ''}</div>
      <h1>Carga de personas</h1>
      <p className="sub">
        Pega o sube un CSV con las columnas <code>telefono,nombre,correo</code> (una fila por persona, sin
        encabezado o con encabezado — ambos funcionan). Esto registra a las personas elegibles en{' '}
        <code>preregistros</code>; cada una elegirá su(s) día(s) de asistencia al entrar con su celular.
      </p>

      <div className="card">
        <h2>1. Datos del CSV</h2>
        <input type="file" accept=".csv,text/csv" ref={fileInputRef} onChange={handleFile} />
        <textarea
          placeholder={'3001234567,Juan Pérez,juan@correo.com\n3007654321,María López,maria@correo.com'}
          value={csvText}
          onChange={handleCsvChange}
        />
        {preview && <div className="status">{preview}</div>}
      </div>

      <div className="card">
        <h2>2. Registrar personas</h2>
        <button disabled={subiendo} onClick={handleSubir}>Registrar en la base de datos</button>
        {reporteFinal.length > 0 && (
          <button className="secondary" onClick={handleDescargarConfirmacion}>Descargar confirmación CSV</button>
        )}
        {subiendo && (
          <div className="progress-track" style={{ display: 'block' }}>
            <div className="progress-fill" style={{ width: `${progreso}%` }} />
          </div>
        )}
        {uploadStatus.text && <div className={`status ${uploadStatus.kind}`}>{uploadStatus.text}</div>}
      </div>

      <div className="card">
        <h2>3. Reporte de asistencia</h2>
        <p className="sub" style={{ marginBottom: 0 }}>
          Descarga en cualquier momento (antes, durante o después del evento) un CSV con todas las entradas
          generadas hasta ahora: quién eligió qué día y quién ya hizo check-in.
        </p>
        <button disabled={exportando} onClick={handleExportar}>
          {exportando ? 'Generando...' : 'Descargar reporte de asistencia (CSV)'}
        </button>
        {exportStatus.text && <div className={`status ${exportStatus.kind}`}>{exportStatus.text}</div>}
      </div>

      <button className="admin-logout" onClick={onLogout}>Cerrar sesión</button>
    </div>
  );
}
