import React, { useState, useEffect, useRef } from 'react';

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

const GOOGLE_SHEETS_SCRIPT_URL = "AQUI_TU_SCRIPT_URL";
const AUDIO_URL = "https://cdn.pixabay.com/download/audio/2022/05/27/audio_1808fbf07a.mp3"; 

export default function App() {
  const [isOpen, setIsOpen] = useState(false);
  const [isOpening, setIsOpening] = useState(false);
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Asistencia
  const [busqueda, setBusqueda] = useState('');
  const [familiaSeleccionada, setFamiliaSeleccionada] = useState<Familia | null>(null);
  const [asistentesConfirmados, setAsistentesConfirmados] = useState<number>(1);
  const [enviando, setEnviando] = useState(false);
  const [confirmadoExito, setConfirmadoExito] = useState(false);

  // Playlist
  const [cancionUrl, setCancionUrl] = useState('');
  const [playlistEnviada, setPlaylistEnviada] = useState(false);

  // Contador
  const [timeLeft, setTimeLeft] = useState({ dias: 0, horas: 0, minutos: 0, segundos: 0 });

  useEffect(() => {
    const targetDate = new Date('2027-01-16T19:00:00').getTime();
    const interval = setInterval(() => {
      const now = new Date().getTime();
      const diff = targetDate - now;

      if (diff > 0) {
        setTimeLeft({
          dias: Math.floor(diff / (1000 * 60 * 60 * 24)),
          horas: Math.floor((diff % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60)),
          minutos: Math.floor((diff % (1000 * 60 * 60)) / (1000 * 60)),
          segundos: Math.floor((diff % (1000 * 60)) / 1000),
        });
      }
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  // Animación Scroll Fade-In
  useEffect(() => {
    if (!isOpen) return;

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('opacity-100', 'translate-y-0');
            entry.target.classList.remove('opacity-0', 'translate-y-10');
          }
        });
      },
      { threshold: 0.1 }
    );

    const elements = document.querySelectorAll('.reveal');
    elements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isOpen]);

  const toggleAudio = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
        setIsPlaying(false);
      } else {
        audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
      }
    }
  };

  const abrirCarta = () => {
    setIsOpening(true);
    if (audioRef.current) {
      audioRef.current.play().then(() => setIsPlaying(true)).catch(() => {});
    }
    setTimeout(() => {
      setIsOpen(true);
    }, 1000);
  };

  const familiasFiltradas = busqueda.trim() === '' ? [] : LISTA_INVITADOS.filter(f => 
    f.nombre.toLowerCase().includes(busqueda.toLowerCase())
  );

  const enviarAsistencia = async () => {
    if (!familiaSeleccionada) return;
    setEnviando(true);
    try {
      if (GOOGLE_SHEETS_SCRIPT_URL !== "AQUI_TU_SCRIPT_URL") {
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
      alert("Error al guardar asistencia.");
    } finally {
      setEnviando(false);
    }
  };

  return (
    <div className="min-h-screen bg-[#2E1F47] text-[#3D2C4D] font-serif relative overflow-x-hidden select-none">
      <audio ref={audioRef} src={AUDIO_URL} loop />

      {/* ESTILOS DE ANIMACIÓN DESTELLOS Y APERTURA DE SOBRE */}
      <style>{`
        @keyframes floatUp {
          0% { transform: translateY(100vh) scale(0); opacity: 0; }
          50% { opacity: 0.8; }
          100% { transform: translateY(-10vh) scale(1.2); opacity: 0; }
        }
        .sparkle {
          position: fixed;
          bottom: 0;
          pointer-events: none;
          border-radius: 50%;
          animation: floatUp linear infinite;
          z-index: 40;
        }
        .envelope-flap {
          transition: transform 0.8s ease-in-out;
          transform-origin: top;
        }
        .open-flap {
          transform: rotateX(180deg);
          opacity: 0;
        }
      `}</style>

      {/* DESTELLOS FLOTANTES EN TODA LA PÁGINA */}
      <div className="fixed inset-0 pointer-events-none z-30 overflow-hidden">
        {[...Array(25)].map((_, i) => (
          <div
            key={i}
            className="sparkle"
            style={{
              left: `${Math.random() * 100}%`,
              width: `${Math.random() * 6 + 2}px`,
              height: `${Math.random() * 6 + 2}px`,
              backgroundColor: i % 2 === 0 ? '#E5C158' : '#D8B4FE',
              boxShadow: i % 2 === 0 ? '0 0 8px #E5C158' : '0 0 8px #D8B4FE',
              animationDuration: `${Math.random() * 5 + 4}s`,
              animationDelay: `${Math.random() * 5}s`,
            }}
          />
        ))}
      </div>

      {/* REPRODUCTOR FLOTANTE */}
      {isOpen && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#3B284C] text-[#E5C158] flex items-center justify-center shadow-2xl border border-[#E5C158]/40"
        >
          {isPlaying ? (
            <span className="flex items-end space-x-0.5 h-4">
              <span className="w-1 bg-[#E5C158] h-full animate-pulse"></span>
              <span className="w-1 bg-[#E5C158] h-2/3 animate-pulse delay-75"></span>
              <span className="w-1 bg-[#E5C158] h-4/5 animate-pulse delay-150"></span>
            </span>
          ) : (
            <span className="text-sm">🎵</span>
          )}
        </button>
      )}

      {/* SOBRE DE CARTA VERTICAL Y REAL */}
      {!isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#1E1230]">
          <div 
            className={`relative w-full max-w-xs h-[480px] bg-[#4E3863] rounded-3xl shadow-2xl overflow-hidden border-2 border-[#E5C158]/60 transition-all duration-1000 flex flex-col justify-between ${
              isOpening ? 'scale-125 opacity-0 translate-y-10' : 'scale-100'
            }`}
          >
            {/* Solapa Superior del Sobre (Triangular) */}
            <div 
              className={`absolute top-0 left-0 right-0 h-48 bg-[#3B284C] border-b-2 border-[#E5C158]/40 envelope-flap z-20 ${
                isOpening ? 'open-flap' : ''
              }`}
              style={{ clipPath: 'polygon(0 0, 100% 0, 50% 100%)' }}
            />

            {/* Contenido dentro del sobre */}
            <div className="relative z-10 flex flex-col items-center justify-center h-full px-6 text-center pt-24">
              <span className="text-[10px] tracking-[0.3em] uppercase text-[#F3E5AB] mb-2 font-sans">MIS XV AÑOS</span>
              <h1 className="text-6xl text-[#E5C158] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Nicole</h1>
              <p className="text-xs text-purple-200 italic mb-10 font-sans max-w-[220px]">
                "Una noche donde las linternas brillarán por ti"
              </p>

              {/* SELLO DORADO DE RAPUNZEL */}
              <div className="relative flex justify-center mt-2">
                <button
                  onClick={abrirCarta}
                  className="w-20 h-20 rounded-full bg-gradient-to-tr from-[#D4AF37] via-[#F3E5AB] to-[#B8860B] shadow-2xl flex flex-col items-center justify-center border-4 border-[#2E1F47] hover:scale-105 active:scale-95 transition-transform group cursor-pointer"
                >
                  <svg className="w-8 h-8 text-[#2E1F47] mb-0.5 group-hover:rotate-12 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L14.5 8.5L21 9.5L16.5 14L18 20.5L12 17L6 20.5L7.5 14L3 9.5L9.5 8.5L12 2Z"/>
                  </svg>
                  <span className="text-[8px] font-extrabold tracking-widest text-[#2E1F47] uppercase font-sans">ABRIR</span>
                </button>
              </div>

              <p className="text-[10px] text-purple-200/70 italic font-sans mt-4">
                Toca el sello dorado para abrir tu invitación
              </p>
            </div>
          </div>
        </div>
      )}

      {/* CONTENIDO PRINCIPAL DE LA INVITACIÓN */}
      <div className={`bg-[#FAF6FF] ${!isOpen ? 'hidden' : 'block'}`}>

        {/* Cabecera */}
        <section 
          className="py-24 px-6 text-center bg-cover bg-center relative text-white"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(46, 31, 71, 0.8), rgba(46, 31, 71, 0.95)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=1000')` }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-purple-200 mb-3 font-sans">Estás invitado a celebrar mis</p>
          <h2 className="text-7xl font-bold text-[#E5C158] tracking-widest my-1" style={{ fontFamily: "'Cinzel', serif" }}>XV</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-200 mb-6 font-sans">AÑOS</p>
          <p className="text-xs italic text-purple-200 mb-2">en honor a</p>
          <h1 className="text-5xl text-[#E5C158]" style={{ fontFamily: "'Alex Brush', cursive" }}>Nicole Rivas</h1>
        </section>

        {/* Texto Emotivo y Foto (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 text-center max-w-md mx-auto">
          <p className="text-xs italic leading-relaxed text-[#5A456E] mb-6">
            Toda gran historia tiene una noche especial. Hoy llega el momento de abrir un nuevo capítulo en mi vida y celebrar mis quince años rodeada de las personas que han sido parte de mi camino.
          </p>
          <p className="text-xs italic font-semibold text-[#3D2C4D] mb-10">
            Tu presencia será el detalle perfecto para hacer de esta noche un recuerdo que brillará para siempre.
          </p>

          <div className="rounded-3xl overflow-hidden shadow-xl border-4 border-white">
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" 
              alt="Nicole" 
              className="w-full h-80 object-cover"
            />
          </div>
        </section>

        {/* Fecha y Contador (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 text-center bg-[#F3ECF8]">
          <h3 className="text-4xl text-[#5A456E] mb-6" style={{ fontFamily: "'Alex Brush', cursive" }}>Enero</h3>

          <div className="flex justify-center space-x-3 text-xs mb-6 text-[#5A456E]">
            <div className="flex flex-col items-center opacity-60"><span className="text-[9px]">LUN</span><span>11</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[9px]">MAR</span><span>12</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[9px]">MIÉ</span><span>13</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[9px]">JUE</span><span>14</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[9px]">VIE</span><span>15</span></div>
            <div className="flex flex-col items-center font-bold text-[#2E1F47] bg-[#E5C158] px-2.5 py-1 rounded-xl shadow-sm">
              <span className="text-[9px]">SÁB</span><span>16</span>
            </div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[9px]">DOM</span><span>17</span></div>
          </div>

          <p className="text-[10px] tracking-widest text-[#3D2C4D] uppercase font-sans mb-1">SÁBADO · 16 DE ENERO DE 2027</p>
          <p className="text-2xl font-semibold text-[#5A456E] font-sans mb-2">07:00 PM</p>
          <p className="text-xs italic text-[#7A6282] mb-8">¡Llega puntual para que no te pierdas las sorpresas!</p>

          <div 
            className="rounded-3xl p-6 max-w-xs mx-auto shadow-xl text-white bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(46, 31, 71, 0.9), rgba(46, 31, 71, 0.95)), url('https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500')` }}
          >
            <h4 className="text-2xl text-[#E5C158] mb-4" style={{ fontFamily: "'Alex Brush', cursive" }}>Solo faltan...</h4>
            <div className="grid grid-cols-4 gap-2 text-center">
              {[
                { label: 'DÍAS', val: timeLeft.dias },
                { label: 'HORAS', val: timeLeft.horas },
                { label: 'MINUTOS', val: timeLeft.minutos },
                { label: 'SEGUNDOS', val: timeLeft.segundos }
              ].map((item, idx) => (
                <div key={idx} className="bg-white/10 rounded-xl p-2 border border-white/10">
                  <span className="block text-lg font-bold text-[#E5C158] font-sans">{String(item.val).padStart(2, '0')}</span>
                  <span className="text-[7px] tracking-wider text-purple-200 uppercase font-sans">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ubicación (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 text-center max-w-md mx-auto">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Ubicación</h3>
          <div className="w-12 h-0.5 bg-[#E5C158] mx-auto mb-6"></div>

          <h4 className="text-sm font-bold tracking-widest text-[#2E1F47] uppercase font-sans mb-1">CASONA PALMA REAL</h4>
          <p className="text-[10px] text-[#7A6282] uppercase tracking-widest font-sans mb-6">VALENCIA, CARABOBO</p>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-8 py-3 bg-[#5A456E] text-white text-[10px] tracking-widest uppercase font-semibold rounded-full shadow-md font-sans"
          >
            VER UBICACIÓN
          </a>
        </section>

        {/* Galería (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 text-center max-w-md mx-auto">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Galería</h3>
          <div className="w-12 h-0.5 bg-[#E5C158] mx-auto mb-6"></div>

          <div className="grid grid-cols-2 gap-3">
            <img src="https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500" alt="Foto 1" className="col-span-2 w-full h-52 object-cover rounded-2xl shadow-sm" />
            <img src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500" alt="Foto 2" className="w-full h-36 object-cover rounded-2xl shadow-sm" />
            <img src="https://images.unsplash.com/photo-1514525253161-7a46d19cd819?q=80&w=500" alt="Foto 3" className="w-full h-36 object-cover rounded-2xl shadow-sm" />
          </div>
        </section>

        {/* Dress Code (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 bg-[#F3ECF8]">
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-sm border border-[#EADBEE] text-center">
            <h3 className="text-4xl text-[#5A456E] mb-1" style={{ fontFamily: "'Alex Brush', cursive" }}>Dress code</h3>
            <p className="text-[10px] tracking-widest text-[#2E1F47] uppercase font-sans font-bold mb-4">SEMI-FORMAL</p>
            <p className="text-xs italic text-[#7A6282] mb-6">
              Que las damas brillen con su belleza única y los caballeros con su porte y estilo.
            </p>

            <p className="text-[9px] tracking-widest uppercase text-[#3D2C4D] font-bold font-sans mb-3">COLORES RESERVADOS</p>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#E2D4F0] border-2 border-[#E5C158]"></div>
              <div className="w-9 h-9 rounded-full bg-[#5A456E] border-2 border-[#E5C158]"></div>
              <div className="w-9 h-9 rounded-full bg-[#E5C158] border-2 border-white shadow"></div>
            </div>
            <p className="text-[10px] italic text-[#7A6282]">
              Los tonos lila, morado y dorado representan la esencia de mis sueños; les solicitamos gentilmente no utilizarlos.
            </p>
          </div>
        </section>

        {/* Obsequios (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 text-center max-w-md mx-auto">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Obsequios</h3>
          <p className="text-xs italic text-[#7A6282] mb-4 max-w-xs mx-auto">
            Mi mayor regalo será tu presencia. Sin embargo, si deseas obsequiarme algo más, una lluvia de sobres será siempre bienvenida.
          </p>
          <p className="text-[10px] tracking-widest font-bold text-[#3D2C4D] uppercase font-sans">LLUVIA DE SOBRES</p>
        </section>

        {/* Asistencia (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 bg-[#F3ECF8]">
          <div className="max-w-md mx-auto bg-white rounded-3xl p-6 shadow-md border border-[#EADBEE] text-center">
            <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Asistencia</h3>

            {!familiaSeleccionada ? (
              <div>
                <p className="text-xs italic text-[#7A6282] mb-4">
                  Ingresa tu apellido para encontrar tu invitación:
                </p>
                <input
                  type="text"
                  placeholder="Ej. Hernández"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF6FF] border border-[#EADBEE] text-xs text-[#3D2C4D] focus:outline-none mb-3 font-sans"
                />

                {familiasFiltradas.length > 0 && (
                  <div className="space-y-2">
                    {familiasFiltradas.map((fam) => (
                      <button
                        key={fam.id}
                        onClick={() => { setFamiliaSeleccionada(fam); setAsistentesConfirmados(fam.maxCupos); }}
                        className="w-full text-left p-3 rounded-xl bg-[#F3ECF8] border border-[#E5C158]/40 flex justify-between items-center"
                      >
                        <span className="font-semibold text-xs text-[#2E1F47] font-sans">{fam.nombre}</span>
                        <span className="text-[9px] bg-[#5A456E] text-white px-2 py-0.5 rounded-full font-sans">
                          Máx. {fam.maxCupos}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : confirmadoExito ? (
              <div className="py-4">
                <h4 className="text-lg font-bold text-[#5A456E] font-sans mb-1">¡Asistencia Confirmada!</h4>
                <p className="text-xs text-[#7A6282]">
                  Guardamos {asistentesConfirmados} lugar(es) para la <strong>{familiaSeleccionada.nombre}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <div className="p-3 rounded-xl bg-[#F3ECF8] mb-4">
                  <p className="text-[9px] uppercase tracking-wider text-[#7A6282] font-sans">INVITACIÓN DE</p>
                  <h4 className="text-base font-bold text-[#2E1F47] font-sans">{familiaSeleccionada.nombre}</h4>
                </div>

                <p className="text-xs text-[#7A6282] mb-3 font-sans">Asistentes a confirmar:</p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button onClick={() => setAsistentesConfirmados(Math.max(1, asistentesConfirmados - 1))} className="w-8 h-8 rounded-full bg-[#5A456E] text-white font-bold font-sans">-</button>
                  <span className="text-lg font-bold text-[#2E1F47] font-sans">{asistentesConfirmados}</span>
                  <button onClick={() => setAsistentesConfirmados(Math.min(familiaSeleccionada.maxCupos, asistentesConfirmados + 1))} className="w-8 h-8 rounded-full bg-[#5A456E] text-white font-bold font-sans">+</button>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => setFamiliaSeleccionada(null)} className="w-1/3 py-2.5 rounded-full border text-[10px] uppercase font-sans">Cambiar</button>
                  <button onClick={enviarAsistencia} disabled={enviando} className="w-2/3 py-2.5 rounded-full bg-[#D4AF37] text-[#2E1F47] font-bold text-[10px] uppercase font-sans shadow-md">
                    {enviando ? 'Guardando...' : 'Confirmar Aquí'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Playlist (Reveal Scroll) */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 max-w-md mx-auto text-center">
          <h3 className="text-4xl text-[#5A456E] mb-1" style={{ fontFamily: "'Alex Brush', cursive" }}>Playlist</h3>
          <p className="text-xs italic text-[#7A6282] mb-4">¿Qué canción no debería faltar en la fiesta?</p>
          {!playlistEnviada ? (
            <div className="space-y-2">
              <input
                type="text"
                placeholder="Nombre o link de Spotify / YouTube"
                value={cancionUrl}
                onChange={(e) => setCancionUrl(e.target.value)}
                className="w-full p-3 rounded-xl bg-[#F3ECF8] border border-[#EADBEE] text-xs text-[#3D2C4D] focus:outline-none font-sans"
              />
              <button onClick={() => { if(cancionUrl) setPlaylistEnviada(true); }} className="w-full py-2.5 rounded-full bg-[#5A456E] text-white text-[10px] font-sans uppercase font-semibold">
                Sugerir Canción
              </button>
            </div>
          ) : (
            <p className="text-xs font-semibold text-[#5A456E]">¡Gracias por tu recomendación!</p>
          )}
        </section>

        {/* Cierre */}
        <footer className="py-12 px-6 text-center bg-[#2E1F47] text-purple-200">
          <p className="text-xs italic mb-2">¡Los espero para darnos un fuerte abrazo!</p>
          <h4 className="text-3xl text-[#E5C158] mb-4" style={{ fontFamily: "'Alex Brush', cursive" }}>Nicole</h4>
          <p className="text-[9px] tracking-widest uppercase opacity-60 font-sans">XV AÑOS · NICOLE RIVAS · 16.01.2027</p>
        </footer>

      </div>
    </div>
  );
}
