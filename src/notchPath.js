// Genera el contorno (path) de la barra inferior CON un hueco real recortado
// en el borde superior, con curvas tangentes y suaves (sin esquinas), usando
// dos círculos "fillet" que conectan el hueco principal con el borde plano.
//
// Geometría verificada por muestreo de píxeles antes de integrarla aquí.
function lerp(a, b, t) { return a + (b - a) * t; }

export function buildNotchPath({ barWidth, barHeight, cx, R = 32, r = 16, steps = 24 }) {
  const dx = Math.sqrt(R * R + 2 * R * r);
  const mainCenter = { x: cx, y: 0 };
  const leftFilletCenter = { x: cx - dx, y: r };
  const rightFilletCenter = { x: cx + dx, y: r };

  function angleOf(center, point) {
    return Math.atan2(point.y - center.y, point.x - center.x);
  }
  function pointAt(center, radius, angle) {
    return { x: center.x + radius * Math.cos(angle), y: center.y + radius * Math.sin(angle) };
  }
  function tangentPoint(sign) {
    const fc = sign < 0 ? leftFilletCenter : rightFilletCenter;
    const vx = fc.x - mainCenter.x, vy = fc.y - mainCenter.y;
    const len = Math.hypot(vx, vy);
    return { x: mainCenter.x + R * vx / len, y: mainCenter.y + R * vy / len };
  }

  const leftTangent = tangentPoint(-1);
  const rightTangent = tangentPoint(1);

  const pts = [];
  pts.push({ x: 0, y: 0 });
  pts.push({ x: cx - dx, y: 0 });

  // Fillet izquierdo: de -90° (arriba del centro, sobre la línea plana) a la tangencia con el hueco principal
  {
    const a0 = -Math.PI / 2;
    const a1 = angleOf(leftFilletCenter, leftTangent);
    for (let i = 1; i <= steps; i++) pts.push(pointAt(leftFilletCenter, r, lerp(a0, a1, i / steps)));
  }
  // Hueco principal: de la tangencia izquierda a la derecha, pasando por ABAJO (90°, hacia adentro de la barra)
  {
    const a0 = angleOf(mainCenter, leftTangent);
    const a1 = angleOf(mainCenter, rightTangent);
    for (let i = 1; i <= steps; i++) pts.push(pointAt(mainCenter, R, lerp(a0, a1, i / steps)));
  }
  // Fillet derecho: de la tangencia con el hueco principal de vuelta a -90° (línea plana)
  {
    const a0 = angleOf(rightFilletCenter, rightTangent);
    const a1 = -Math.PI / 2;
    for (let i = 1; i <= steps; i++) pts.push(pointAt(rightFilletCenter, r, lerp(a0, a1, i / steps)));
  }

  pts.push({ x: barWidth, y: 0 });
  pts.push({ x: barWidth, y: barHeight });
  pts.push({ x: 0, y: barHeight });

  return 'M ' + pts.map(p => `${p.x.toFixed(2)} ${p.y.toFixed(2)}`).join(' L ') + ' Z';
}
