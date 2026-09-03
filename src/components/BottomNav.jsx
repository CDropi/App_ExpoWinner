import '../styles/componentes.css';

// Pestañas del menú inferior. El orden define el índice que maneja Ingreso.
const NAV_ITEMS = [
  { key: 'tickets', label: 'Tickets', icon: '/media/Tickets.svg', iconActivo: '/media/Tickets_2.svg' },
  { key: 'perfil', label: 'Perfil', icon: '/media/Perfil.svg', iconActivo: '/media/Perfil_2.svg' },
  { key: 'mapa', label: 'Mapa', icon: '/media/Mapa.svg', iconActivo: '/media/Mapa_2.svg' },
];

// Menú inferior fijo. El "hueco" de la pestaña activa se corre con la
// variable --nav-hole-x, y el círculo naranja que sobresale es un elemento
// aparte (.nav-indicator) que se desplaza en paralelo.
export default function BottomNav({ activo, onCambiar }) {
  return (
    <div className="nav-wrapper">
      <nav className="bottom-nav" style={{ '--nav-hole-x': `${activo * 50}%` }}>
        <div className="nav-items-row">
          {NAV_ITEMS.map((item, i) => (
            <button
              key={item.key}
              type="button"
              className={`nav-item ${i === activo ? 'active' : ''}`}
              aria-label={item.label}
              onClick={() => onCambiar(i)}
            >
              <img src={item.icon} alt="" width={24} height={24} />
            </button>
          ))}
        </div>
      </nav>
      <div className="nav-indicator" style={{ transform: `translateX(${activo * 100}%)` }}>
        <div className="nav-indicator-circle">
          <img src={NAV_ITEMS[activo].iconActivo} alt="" width={26} height={26} />
        </div>
      </div>
    </div>
  );
}
