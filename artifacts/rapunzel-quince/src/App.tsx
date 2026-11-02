import React, { useState, useEffect } from 'react';

// Estructura de familias precargadas
interface Familia {
  id: string;
  nombre: string;
  maxCupos: number;
}

const LISTA_INVITADOS: Familia[] = [
  { id: '1', nombre: 'Familia Hernández', maxCupos: 5 },
  { id: '2', nombre: 'Familia Rodríguez', maxCupos: 2 },
  { id: '3', nombre: 'Familia Pérez', maxCupos: 4 },
  { id: '4', nombre: 'Familia García', maxCupos: 3 },
];

// URL de tu Google Apps Script para sincronizar con Google Sheets
const GOOGLE_SHEETS_SCRIPT_URL = "AQUI_PONDREMOS_TU_LINK_DE_GOOGLE_APPS_SCRIPT";

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [busqueda, setBusqueda] = useState('');
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<Familia | null>(null);
  const [asistentesConfirmados, setAsistentesConfirmados] = useState<number>(1);
  const [enviando, setEnviando] = useState(false);
  const [confirmadoExito, setConfirmadoExito] = useState(false);

  // Contador de tiempo para el 16 de enero de 2027
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const targetDate = new Date('2027-01-16T20:00:00').getTime();

    const interval = setInterval(() => {
      const now = new Date().getTime();
      const difference = targetDate - now;

      if (difference > 0) {
        setTimeLeft({
          dias: Math.floor(difference / (1000 * 60 * 60 * 24)),
          horas: Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((difference % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Filtrar la lista por el texto ingresado
  const familiasFiltradas = busqueda.trim() === '' ? [] : LISTA_INVITADOS.filter(f => 
    f.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const seleccionarFamilia = (fam: Familia) => {
    setFamiliaSeleccionada(fam);
    setAsistentesConfirmados(fam.maxCupos);
  };

  const enviarAsistencia = async () => {
    if (!familiaSeleccionada) return;
    setEnviando(true);

    try {
      if (GOOGLE_SHEETS_SCRIPT_URL !== "AQUI_PONDREMOS_TU_LINK_DE_GOOGLE_APPS_SCRIPT") {
        await fetch(GOOGLE_SHEETS_SCRIPT_URL, {
          method: 'POST',
          mode: 'no-cors',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            familia: familiaSeleccionada.nombre,
            cuposMaximos: familiaSeleccionada.maxCupos,
            asistentes: asistentesConfirmados,
            fecha: new Date().toLocaleString()
          })
        });
      }
      setConfirmadoExito(true);
    } catch (e) {
      console.error(e);
      alert("Error al guardar asistencia. Inténtalo de nuevo.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-amber-100 font-sans relative overflow-x-hidden">

      {/* 1. INTRO / PORTADA TIPO SOBRE */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-purple-950/95 backdrop-blur-md">
          <div className="w-full max-w-sm p-8 rounded-3xl bg-gradient-to-b from-purple-900 via-indigo-950 to-purple-950 border-2 border-amber-400/60 shadow-[0_0_50px_rgba(251,191,36,0.3)] text-center relative overflow-hidden">
            <div className="text-5xl mb-4 animate-bounce">🏮</div>
            <p className="text-amber-300 font-serif tracking-widest text-sm uppercase">Te invitamos a los</p>
            <h1 className="text-4xl font-serif font-bold text-amber-200 my-2 tracking-wide">15 Años</h1>
            <p className="text-2xl font-serif italic text-purple-200 mb-6">Inspirados en Rapunzel</p>

            <button
              onClick={() => setIsOpen(true)}
              className="w-full py-4 px-6 bg-gradient-to-r from-amber-400 to-yellow-500 hover:from-amber-300 hover:to-yellow-400 text-purple-950 font-bold rounded-xl shadow-lg transform active:scale-95 transition-all text-lg tracking-wider"
            >
              Abrir Invitación ✨
            </button>
          </div>
        </div>
      )}

      {/* 2. CONTENIDO PRINCIPAL */}
      <div className={`transition-all duration-700 ${!isOpen ? 'filter blur-md pointer-events-none select-none' : ''}`}>

        {/* Cabecera Principal */}
        <header className="py-16 text-center px-4 bg-gradient-to-b from-purple-950 via-purple-900 to-slate-950 border-b border-amber-500/20">
          <p className="text-amber-400 text-sm tracking-widest uppercase mb-2">Mis XV Años</p>
          <h1 className="text-5xl font-serif text-amber-200 tracking-wider mb-4">Rapunzel</h1>
          <p className="max-w-md mx-auto text-purple-200 text-sm italic">
            "Una noche mágica donde las linternas iluminarán nuevos sueños."
          </p>
        </header>

        {/* Cuenta Regresiva */}
        <section className="py-10 px-4 text-center">
          <h2 className="text-xl font-serif text-amber-300 mb-6">El Gran Día en...</h2>
          <div className="grid grid-cols-4 gap-2 max-w-xs mx-auto">
            {[
              { label: 'Días', val: timeLeft.dias },
              { label: 'Horas', val: timeLeft.horas },
              { label: 'Min', val: timeLeft.minutos },
              { label: 'Seg', val: timeLeft.segundos },
            ].map((item, idx) => (
              <div key={idx} className="bg-purple-900/50 border border-amber-400/40 rounded-xl p-3 backdrop-blur-sm">
                <span className="block text-2xl font-bold text-amber-200">{String(item.val).padStart(2, '0')}</span>
                <span className="text-[10px] text-purple-300 uppercase">{item.label}</span>
              </div>
            ))}
          </div>
          <p className="mt-4 text-amber-200/80 font-serif">Sábado, 16 de Enero de 2027 — 8:00 PM</p>
        </section>

        {/* Módulo de Asistencia por Mesas */}
        <section className="py-12 px-4 max-w-md mx-auto">
          <div className="bg-purple-900/40 border border-amber-400/50 rounded-2xl p-6 backdrop-blur-sm shadow-xl">
            <h2 className="text-2xl font-serif text-amber-300 text-center mb-2">Confirmación de Asistencia</h2>
            <p className="text-xs text-purple-200 text-center mb-6">
              Busca tu apellido para ubicar tu mesa decorada y marcar tus asistentes.
            </p>

            {!familiaSeleccionada ? (
              <div>
                <label className="block text-xs font-semibold text-amber-200 mb-2">Ingresa tu Apellido o Familia:</label>
                <input
                  type="text"
                  placeholder="Ej. Hernández"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full p-3 rounded-xl bg-purple-950/80 border border-amber-400/30 text-amber-100 placeholder-purple-400 focus:outline-none focus:border-amber-400 text-sm mb-4"
                />

                {familiasFiltradas.length > 0 && (
                  <div className="space-y-2">
                    {familiasFiltradas.map((fam) => (
                      <button
                        key={fam.id}
                        onClick={() => seleccionarFamilia(fam)}
                        className="w-full text-left p-3 rounded-xl bg-purple-800/60 border border-amber-400/20 hover:bg-purple-700/60 transition-all flex justify-between items-center"
                      >
                        <span className="font-semibold text-amber-100">{fam.nombre}</span>
                        <span className="text-xs text-amber-300 bg-purple-950/80 px-2 py-1 rounded-lg">
                          Mesa reservada ({fam.maxCupos} p)
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : confirmadoExito ? (
              <div className="text-center py-6">
                <div className="text-4xl mb-2">👑</div>
                <h3 className="text-xl font-bold text-amber-300 mb-1">¡Asistencia Confirmada!</h3>
                <p className="text-sm text-purple-200">
                  Registramos {asistentesConfirmados} lugar(es) para la <strong className="text-amber-200">{familiaSeleccionada.nombre}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <div className="p-4 rounded-xl bg-purple-950/70 border border-amber-400/30 mb-4 text-center">
                  <p className="text-sm text-purple-300">Mesa Decorada de:</p>
                  <h3 className="text-xl font-serif text-amber-200 font-bold">{familiaSeleccionada.nombre}</h3>
                  <p className="text-xs text-amber-400/80 mt-1">Máximo disponible: {familiaSeleccionada.maxCupos} personas</p>
                </div>

                <div className="mb-6">
                  <label className="block text-xs text-purple-200 text-center mb-2">¿Cuántos van a asistir?</label>
                  <div className="flex items-center justify-center space-x-4">
                    <button
                      onClick={() => setAsistentesConfirmados(Math.max(1, asistentesConfirmados - 1))}
                      className="w-10 h-10 rounded-xl bg-purple-800 border border-amber-400/40 text-amber-200 text-xl font-bold"
                    >
                      -
                    </button>
                    <span className="text-2xl font-bold text-amber-300 w-8 text-center">{asistentesConfirmados}</span>
                    <button
                      onClick={() => setAsistentesConfirmados(Math.min(familiaSeleccionada.maxCupos, asistentesConfirmados + 1))}
                      className="w-10 h-10 rounded-xl bg-purple-800 border border-amber-400/40 text-amber-200 text-xl font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>

                <div className="flex space-x-2">
                  <button
                    onClick={() => setFamiliaSeleccionada(null)}
                    className="w-1/3 py-3 rounded-xl bg-purple-950 border border-purple-700 text-purple-300 text-xs font-semibold"
                  >
                    Cambiar
                  </button>
                  <button
                    onClick={enviarAsistencia}
                    disabled={enviando}
                    className="w-2/3 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-yellow-500 text-purple-950 font-bold text-sm shadow-md disabled:opacity-50"
                  >
                    {enviando ? 'Guardando...' : 'Confirmar Llenado 👑'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

      </div>
    </div>
  );
}
