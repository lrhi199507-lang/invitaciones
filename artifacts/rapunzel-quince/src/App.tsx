import React, { useState, useEffect, useRef } from 'react';
import { LISTA_INVITADOS, Familia } from './data/invitados';

const GOOGLE_SHEETS_SCRIPT_URL = "AQUI_TU_SCRIPT_URL";
const AUDIO_URL = "/cancion.mp3";

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

  // Modal para Galería
  const [imagenAmpliada, setImagenAmpliada] = useState<string | null>(null);

  // Modal y Estado de Pago Móvil
  const [modalPagoOpen, setModalPagoOpen] = useState(false);
  const [capturaNombre, setCapturaNombre] = useState('');
  const [capturaEnviada, setCapturaEnviada] = useState(false);

  // Estado para la Trivia (3 Preguntas)
  const [preguntaActual, setPreguntaActual] = useState(0);
  const [opcionSeleccionada, setOpcionSeleccionada] = useState<number | null>(null);
  const [respondido, setRespondido] = useState(false);
  const [aciertos, setAciertos] = useState(0);

  const triviaPreguntas = [
    {
      pregunta: "¿Qué país me encantaría visitar?",
      opciones: ["Australia", "Japón", "España", "Estados Unidos"],
      correcta: 1 // Japón
    },
    {
      pregunta: "¿Cuál es mi color favorito?",
      opciones: ["Morado", "Azul", "Rosado", "Negro"],
      correcta: 2 // Rosado
    },
    {
      pregunta: "¿Cuál es mi comida favorita?",
      opciones: ["Sushi", "Hamburguesa", "Pizza", "Pasticho"],
      correcta: 0 // Sushi
    }
  ];

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

  // Animación Scroll Reveal
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

  const abrirInvitacion = () => {
    setIsOpening(true);
    if (audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((err) => {
        console.log("Error al reproducir audio:", err);
      });
    }
    setTimeout(() => {
      setIsOpen(true);
    }, 800);
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

  const seleccionarRespuesta = (index: number) => {
    if (respondido) return;
    setOpcionSeleccionada(index);
    setRespondido(true);
    if (index === triviaPreguntas[preguntaActual].correcta) {
      setAciertos(prev => prev + 1);
    }
  };

  const siguientePregunta = () => {
    setOpcionSeleccionada(null);
    setRespondido(false);
    setPreguntaActual(prev => prev + 1);
  };

  const reiniciarTrivia = () => {
    setPreguntaActual(0);
    setOpcionSeleccionada(null);
    setRespondido(false);
    setAciertos(0);
  };

  return (
    <div className="min-h-screen bg-[#2E1F47] text-[#3D2C4D] font-serif relative overflow-x-hidden select-none">
      <audio ref={audioRef} src={AUDIO_URL} preload="auto" loop />

      {/* ESTILOS DE LINTERNAS Y ANIMACIONES */}
      <style>{`
        @keyframes floatLantern {
          0% {
            transform: translateY(105vh) scale(0.6);
            opacity: 0;
          }
          15% {
            opacity: 0.85;
          }
          85% {
            opacity: 0.85;
          }
          100% {
            transform: translateY(-110vh) scale(0.9);
            opacity: 0;
          }
        }
        .lantern-floating {
          position: fixed;
          bottom: 0;
          pointer-events: none;
          animation: floatLantern linear infinite;
          z-index: 10;
          transform: translateY(105vh);
        }
        @keyframes flicker {
          0%, 100% { opacity: 0.7; transform: scale(0.9); }
          50% { opacity: 1; transform: scale(1.1); }
        }
        .lantern-flame {
          animation: flicker 1.8s ease-in-out infinite;
        }
      `}</style>

      {/* LINTERNAS FLOTANTES (Con mayor presencia visual) */}
      <div className="fixed inset-0 pointer-events-none z-10 overflow-hidden">
        {[...Array(15)].map((_, i) => (
          <div
            key={i}
            className="lantern-floating"
            style={{
              left: `${i * 6.5 + (i % 2) * 3}%`,
              animationDuration: `${(i % 3) * 4 + 9}s`,
              animationDelay: `${(i * 0.8) % 6}s`,
            }}
          >
            <div className="relative w-6 h-6 rounded-full bg-gradient-to-t from-[#D4AF37]/80 via-[#F3E5AB]/80 to-[#FFF9C4]/90 p-0.5 shadow-[0_0_12px_rgba(255,215,0,0.6)] flex flex-col items-center justify-center border border-white/60 opacity-85">
              <div className="text-[5px] text-[#5A456E] font-bold opacity-90 mb-0.2">☀️</div>
              <div className="lantern-flame w-2.5 h-2.5 bg-gradient-to-t from-[#FF4500]/90 via-[#FFD700] to-[#FFF] rounded-full shadow-[0_0_8px_#FFD700]"></div>
            </div>
          </div>
        ))}
      </div>

      {/* MODAL PARA ZOOM DE IMÁGENES */}
      {imagenAmpliada && (
        <div 
          onClick={() => setImagenAmpliada(null)}
          className="fixed inset-0 z-50 bg-black/80 flex items-center justify-center p-4 backdrop-blur-sm cursor-pointer"
        >
          <div className="relative max-w-md w-full rounded-3xl overflow-hidden border-2 border-[#E5C158]/50 shadow-2xl">
            <img src={imagenAmpliada} alt="Ampliada" className="w-full h-auto max-h-[80vh] object-contain bg-black" />
            <span className="absolute top-3 right-3 bg-[#2E1F47]/80 text-[#E5C158] w-8 h-8 rounded-full flex items-center justify-center text-xs font-sans">✕</span>
          </div>
        </div>
      )}

      {/* MODAL PARA PAGO MÓVIL Y COMPROBANTE */}
      {modalPagoOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 flex items-center justify-center p-4 backdrop-blur-sm">
          <div className="relative max-w-sm w-full bg-white rounded-3xl p-6 shadow-2xl border border-[#E5C158]/40 text-left">
            <button 
              onClick={() => setModalPagoOpen(false)}
              className="absolute top-4 right-4 text-[#5A456E] font-bold text-sm w-7 h-7 rounded-full bg-[#F3ECF8] flex items-center justify-center cursor-pointer"
            >
              ✕
            </button>

            <h4 className="text-2xl font-bold text-[#5A456E] mb-3 text-center" style={{ fontFamily: "'Alex Brush', cursive" }}>Datos de Pago Móvil</h4>
            <div className="text-sm space-y-1.5 text-[#3D2C4D] font-sans bg-[#F3ECF8]/50 p-4 rounded-2xl mb-4 border border-[#EADBEE]">
              <p><strong>Banco:</strong> Bancamiga / Mercantil</p>
              <p><strong>Teléfono:</strong> 0412-1234567</p>
              <p><strong>C.I:</strong> V-12.345.678</p>
            </div>

            <p className="text-xs text-[#7A6282] mb-2 font-sans font-medium text-center">¿Realizaste tu transferencia? Sube tu comprobante:</p>
            {!capturaEnviada ? (
              <div className="space-y-3">
                <input
                  type="text"
                  placeholder="Tu Nombre y Apellido"
                  value={capturaNombre}
                  onChange={(e) => setCapturaNombre(e.target.value)}
                  className="w-full p-3 rounded-xl bg-[#FAF6FF] border border-[#EADBEE] text-sm text-[#3D2C4D] focus:outline-none font-sans"
                />
                <label className="block w-full py-3 bg-[#5A456E] text-white text-xs tracking-wider uppercase font-semibold rounded-xl text-center cursor-pointer font-sans shadow-sm">
                  📷 Adjuntar Captura de Pago
                  <input 
                    type="file" 
                    accept="image/*" 
                    onChange={() => { 
                      if(capturaNombre.trim() !== '') {
                        setCapturaEnviada(true);
                      } else {
                        alert("Por favor ingresa tu nombre primero.");
                      } 
                    }} 
                    className="hidden" 
                  />
                </label>
              </div>
            ) : (
              <div className="py-3 text-center">
                <p className="text-sm font-semibold text-[#5A456E] font-sans">¡Comprobante adjuntado con éxito!</p>
                <button 
                  onClick={() => { setCapturaEnviada(false); setCapturaNombre(''); }}
                  className="mt-2 text-xs text-[#7A6282] underline font-sans cursor-pointer"
                >
                  Subir otro comprobante
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* REPRODUCTOR FLOTANTE */}
      {isOpen && (
        <button
          onClick={toggleAudio}
          className="fixed bottom-6 right-6 z-50 w-12 h-12 rounded-full bg-[#2E1F47]/90 text-[#E5C158] flex items-center justify-center shadow-2xl border border-[#E5C158]/50 backdrop-blur-sm cursor-pointer"
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

      {/* PORTADA CON LA NUEVA TORRE REFERENCIA */}
      {!isOpen && (
        <div 
          className={`fixed inset-0 z-50 flex flex-col items-center justify-center py-12 px-6 text-center bg-cover bg-center transition-all duration-1000 ${
            isOpening ? 'opacity-0 scale-105 pointer-events-none' : 'opacity-100 scale-100'
          }`}
          style={{ 
            backgroundImage: `linear-gradient(to bottom, rgba(30, 18, 48, 0.4), rgba(20, 10, 35, 0.8)), url('/torre.jpg')` 
          }}
        >
          <div className="flex flex-col items-center z-10 max-w-xs w-full space-y-6">
            <div>
              <span className="text-xs tracking-[0.35em] uppercase text-[#F3E5AB] mb-3 block font-sans drop-shadow-md">MIS XV AÑOS</span>
              <h1 className="text-7xl text-[#E5C158] mb-2 drop-shadow-lg" style={{ fontFamily: "'Alex Brush', cursive" }}>Nicole</h1>
              <p className="text-sm text-purple-100 italic font-sans drop-shadow">
                "Una noche donde las linternas brillarán por ti"
              </p>
            </div>

            <div className="w-full pt-4">
              <button
                onClick={abrirInvitacion}
                className="w-full py-4 bg-gradient-to-r from-[#D4AF37] via-[#F3E5AB] to-[#D4AF37] text-[#2E1F47] font-bold text-xs tracking-[0.2em] rounded-full shadow-2xl uppercase transition-transform active:scale-95 border border-white/20 cursor-pointer"
              >
                ABRIR INVITACIÓN
              </button>
            </div>

            <p className="text-[11px] text-purple-200/90 italic font-sans">
              Al abrirla sonará «Veo en ti la luz», la canción de Rapunzel
            </p>
          </div>
        </div>
      )}

      {/* PÁGINA PRINCIPAL */}
      <div className={`bg-[#FAF6FF] relative ${!isOpen ? 'hidden' : 'block'}`}>

                {/* CABELLO DORADO TIPO TRENZA ENTRELAZADA */}
        <div className="absolute inset-0 pointer-events-none z-10 overflow-hidden">
          <svg className="w-full h-full" viewBox="0 0 100 1000" preserveAspectRatio="none">
            <defs>
              <linearGradient id="goldBraidGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#FFF59D" />
                <stop offset="30%" stopColor="#F5B041" />
                <stop offset="70%" stopColor="#D4AF37" />
                <stop offset="100%" stopColor="#9A7B0C" />
              </linearGradient>
              <filter id="shadowBraid" x="-20%" y="-20%" width="140%" height="140%">
                <feDropShadow dx="1" dy="2" stdDeviation="1" floodColor="#2E1F47" floodOpacity="0.3" />
              </filter>
            </defs>

            {/* Sombra de fondo para dar volumen */}
            <path
              d="M 42 0 C 48 40, 36 80, 42 120 C 48 160, 36 200, 42 240 C 48 280, 36 320, 42 360 C 48 400, 36 440, 42 480 C 48 520, 36 560, 42 600 C 48 640, 36 680, 42 720 C 48 760, 36 800, 42 840 C 48 880, 36 920, 42 960"
              fill="none"
              stroke="#5A456E"
              strokeWidth="5"
              opacity="0.2"
            />

            {/* Ramal 1 de la trenza (Onda A) */}
            <path
              d="M 42 0 C 50 20, 34 40, 42 60 C 50 80, 34 100, 42 120 C 50 140, 34 160, 42 180 C 50 200, 34 220, 42 240 C 50 260, 34 280, 42 300 C 50 320, 34 340, 42 360 C 50 380, 34 400, 42 420 C 50 440, 34 460, 42 480 C 50 500, 34 520, 42 540 C 50 560, 34 580, 42 600 C 50 620, 34 640, 42 660 C 50 680, 34 700, 42 720 C 50 740, 34 760, 42 780 C 50 800, 34 820, 42 840 C 50 860, 34 880, 42 900 C 50 920, 34 940, 42 960 C 50 980, 34 1000, 42 1020"
              fill="none"
              stroke="url(#goldBraidGrad)"
              strokeWidth="3.5"
              filter="url(#shadowBraid)"
            />

            {/* Ramal 2 de la trenza (Onda B invertida entrelazada) */}
            <path
              d="M 42 0 C 34 20, 50 40, 42 60 C 34 80, 50 100, 42 120 C 34 140, 50 160, 42 180 C 34 200, 50 220, 42 240 C 34 260, 50 280, 42 300 C 34 320, 50 340, 42 360 C 34 380, 50 400, 42 420 C 34 440, 50 460, 42 480 C 34 500, 50 520, 42 540 C 34 560, 50 580, 42 600 C 34 620, 50 640, 42 660 C 34 680, 50 700, 42 720 C 34 740, 50 760, 42 780 C 34 800, 50 820, 42 840 C 34 860, 50 880, 42 900 C 34 920, 50 940, 42 960 C 34 980, 50 1000, 42 1020"
              fill="none"
              stroke="#FFF9C4"
              strokeWidth="2"
              opacity="0.9"
            />
          </svg>

          {/* Flores decorativas intercaladas en los cruces de la trenza */}
          <div className="absolute top-[8%] left-[40%] text-xs opacity-90 drop-shadow">🌸</div>
          <div className="absolute top-[22%] left-[42%] text-xs opacity-90 drop-shadow">💜</div>
          <div className="absolute top-[38%] left-[39%] text-xs opacity-90 drop-shadow">🌸</div>
          <div className="absolute top-[54%] left-[41%] text-xs opacity-90 drop-shadow">🌼</div>
          <div className="absolute top-[70%] left-[40%] text-xs opacity-90 drop-shadow">🌸</div>
          <div className="absolute top-[86%] left-[42%] text-xs opacity-90 drop-shadow">💜</div>
        </div>
        

        {/* Cabecera */}
        <section 
          className="py-24 px-6 text-center bg-cover bg-center relative text-white z-20 flex flex-col items-center"
          style={{ backgroundImage: `linear-gradient(to bottom, rgba(46, 31, 71, 0.6), rgba(46, 31, 71, 0.9)), url('/torre.jpg')` }}
        >
          <p className="text-xs uppercase tracking-[0.25em] text-purple-200 mb-3 font-sans">Estás invitado a celebrar mis</p>
          <h2 className="text-7xl font-bold text-[#E5C158] tracking-widest my-1" style={{ fontFamily: "'Cinzel', serif" }}>XV</h2>
          <p className="text-xs uppercase tracking-[0.3em] text-purple-200 mb-6 font-sans">AÑOS</p>
          <p className="text-sm italic text-purple-200 mb-2">en honor a</p>
          <h1 className="text-5xl text-[#E5C158]" style={{ fontFamily: "'Alex Brush', cursive" }}>Nicole Rivas</h1>
        </section>

        {/* Texto Emotivo y Foto Principal */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 text-center max-w-md mx-auto relative z-20">
          <p className="text-sm italic leading-relaxed text-[#5A456E] mb-6">
            Toda gran historia tiene una noche especial. Hoy llega el momento de abrir un nuevo capítulo en mi vida y celebrar mis quince años rodeada de las personas que han sido parte de mi camino.
          </p>
          <p className="text-sm italic font-semibold text-[#3D2C4D] mb-10">
            Tu presencia será el detalle perfecto para hacer de esta noche un recuerdo que brillará para siempre.
          </p>

          <div 
            onClick={() => setImagenAmpliada("https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800")}
            className="rounded-3xl overflow-hidden shadow-xl border-4 border-white bg-white cursor-pointer group relative"
          >
            <img 
              src="https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=800" 
              alt="Nicole" 
              className="w-full h-80 object-cover transition-transform duration-500 group-hover:scale-105"
            />
          </div>
        </section>

        {/* Fecha y Contador */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 text-center bg-[#F3ECF8]/90 relative z-20">
          <h3 className="text-4xl text-[#5A456E] mb-6" style={{ fontFamily: "'Alex Brush', cursive" }}>Enero</h3>

          <div className="flex justify-center space-x-3 text-sm mb-6 text-[#5A456E] font-medium">
            <div className="flex flex-col items-center opacity-60"><span className="text-[11px]">LUN</span><span className="text-base">11</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[11px]">MAR</span><span className="text-base">12</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[11px]">MIÉ</span><span className="text-base">13</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[11px]">JUE</span><span className="text-base">14</span></div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[11px]">VIE</span><span className="text-base">15</span></div>
            <div className="flex flex-col items-center font-bold text-[#2E1F47] bg-[#E5C158] px-3 py-1.5 rounded-xl shadow-sm">
              <span className="text-[11px]">SÁB</span><span className="text-lg">16</span>
            </div>
            <div className="flex flex-col items-center opacity-60"><span className="text-[11px]">DOM</span><span className="text-base">17</span></div>
          </div>

          <p className="text-xs tracking-widest text-[#3D2C4D] uppercase font-sans mb-1 font-semibold">SÁBADO · 16 DE ENERO DE 2027</p>
          <p className="text-2xl font-semibold text-[#5A456E] font-sans mb-2">07:00 PM</p>
          <p className="text-sm italic text-[#7A6282] mb-8">¡Llega puntual para que no te pierdas las sorpresas!</p>

          <div 
            className="rounded-3xl p-6 max-w-xs mx-auto shadow-xl text-white bg-cover bg-center"
            style={{ backgroundImage: `linear-gradient(to bottom, rgba(46, 31, 71, 0.9), rgba(46, 31, 71, 0.95)), url('/torre.jpg')` }}
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
                  <span className="text-[8px] tracking-wider text-purple-200 uppercase font-sans">{item.label}</span>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Ubicación */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 text-center max-w-md mx-auto relative z-20">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Ubicación</h3>
          <div className="w-12 h-0.5 bg-[#E5C158] mx-auto mb-6"></div>

          <h4 className="text-sm font-bold tracking-widest text-[#2E1F47] uppercase font-sans mb-1">CASONA PALMA REAL</h4>
          <p className="text-xs text-[#7A6282] uppercase tracking-widest font-sans mb-6">VALENCIA, CARABOBO</p>

          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="inline-block px-8 py-3 bg-[#5A456E] text-white text-xs tracking-widest uppercase font-semibold rounded-full shadow-md font-sans cursor-pointer"
          >
            VER UBICACIÓN
          </a>
        </section>

        {/* TRIVIA INTERACTIVA */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 bg-[#F3ECF8]/90 relative z-20">
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-[#EADBEE] text-center">
            <h3 className="text-4xl text-[#5A456E] mb-1" style={{ fontFamily: "'Alex Brush', cursive" }}>Trivia</h3>
            <p className="text-xs tracking-widest text-[#2E1F47] uppercase font-sans font-bold mb-4">¿QUÉ TANTO ME CONOCES?</p>

            {preguntaActual < triviaPreguntas.length ? (
              <div>
                <p className="text-[10px] tracking-widest text-[#7A6282] uppercase font-sans mb-2 font-semibold">
                  PREGUNTA {preguntaActual + 1} DE {triviaPreguntas.length}
                </p>
                <h4 className="text-base font-bold text-[#2E1F47] mb-6 font-sans">
                  {triviaPreguntas[preguntaActual].pregunta}
                </h4>

                <div className="space-y-3 mb-6">
                  {triviaPreguntas[preguntaActual].opciones.map((opcion, idx) => {
                    let btnStyle = "bg-[#FAF6FF] border-[#EADBEE] text-[#3D2C4D]";
                    if (respondido) {
                      if (idx === triviaPreguntas[preguntaActual].correcta) {
                        btnStyle = "bg-green-100 border-green-500 text-green-800 font-bold shadow-sm";
                      } else if (idx === opcionSeleccionada) {
                        btnStyle = "bg-red-100 border-red-500 text-red-800";
                      } else {
                        btnStyle = "opacity-40 bg-gray-50 border-gray-200";
                      }
                    }

                    return (
                      <button
                        key={idx}
                        onClick={() => seleccionarRespuesta(idx)}
                        disabled={respondido}
                        className={`w-full p-3.5 rounded-xl border text-xs font-sans transition-all cursor-pointer ${btnStyle}`}
                      >
                        {opcion}
                      </button>
                    );
                  })}
                </div>

                {respondido && (
                  <div className="space-y-4">
                    <div className="p-4 rounded-2xl bg-[#FAF6FF] border border-[#EADBEE]">
                      {opcionSeleccionada === triviaPreguntas[preguntaActual].correcta ? (
                        <p className="text-sm font-bold text-green-700 font-sans">
                          ✨ ¡Qué bien me conoces! Sabía que lo adivinarías.
                        </p>
                      ) : (
                        <p className="text-sm italic text-[#5A456E] font-sans">
                          🌸 ¡Ups! Casi, pero estás a tiempo de conocerme mucho mejor en esta noche tan especial.
                        </p>
                      )}
                    </div>

                    <button
                      onClick={siguientePregunta}
                      className="w-full py-3.5 bg-[#5A456E] text-white text-xs tracking-wider uppercase font-semibold rounded-full shadow-md font-sans cursor-pointer hover:bg-[#48355B] transition-colors"
                    >
                      {preguntaActual < triviaPreguntas.length - 1 ? 'Siguiente Pregunta ➔' : 'Ver Resultado Final 🏆'}
                    </button>
                  </div>
                )}
              </div>
            ) : (
              <div className="py-4 space-y-4">
                <span className="text-4xl">👑</span>
                <h4 className="text-xl font-bold text-[#5A456E] font-sans">¡Trivia Completada!</h4>
                <p className="text-sm text-[#3D2C4D] font-sans">
                  Acertaste <strong>{aciertos}</strong> de <strong>{triviaPreguntas.length}</strong> preguntas.
                </p>
                <p className="text-xs italic text-[#7A6282] max-w-xs mx-auto">
                  {aciertos === 3 
                    ? "¡Eres todo un experto en mi vida! Nos vemos pronto para celebrar juntos." 
                    : "¡Gracias por jugar! Esta noche compartiremos recuerdos inolvidables."}
                </p>
                <button
                  onClick={reiniciarTrivia}
                  className="px-6 py-3 bg-[#D4AF37] text-[#2E1F47] font-bold text-xs tracking-wider uppercase rounded-full shadow-sm font-sans cursor-pointer"
                >
                  Volver a Jugar 🔄
                </button>
              </div>
            )}
          </div>
        </section>

        {/* CÓDIGO QR / ÁLBUM DE RECUERDOS */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 text-center max-w-md mx-auto relative z-20">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Código QR</h3>
          <p className="text-xs tracking-widest text-[#2E1F47] uppercase font-sans font-bold mb-4">RECUERDOS DE LA FIESTA</p>

          <div className="bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-[#EADBEE] text-center">
            <div className="w-40 h-40 mx-auto mb-4 bg-white p-2 rounded-2xl border border-gray-200 shadow-inner flex items-center justify-center">
              <img 
                src="https://api.qrserver.com/v1/create-qr-code/?size=150x150&data=https://drive.google.com" 
                alt="QR Recuerdos" 
                className="w-full h-full object-contain"
              />
            </div>
            <p className="text-sm italic text-[#7A6282] mb-4">
              ¿Hiciste una foto increíble? Súbela aquí escaneando este código y compártela con todos en nuestro álbum digital.
            </p>
            <a 
              href="https://drive.google.com" 
              target="_blank" 
              rel="noreferrer"
              className="inline-block w-full py-3 bg-[#D4AF37] text-[#2E1F47] font-bold text-xs tracking-wider uppercase rounded-xl font-sans shadow-sm"
            >
              Abrir Álbum en Google Drive
            </a>
          </div>
        </section>

        {/* Galería */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 text-center max-w-md mx-auto relative z-20">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Galería</h3>
          <div className="w-12 h-0.5 bg-[#E5C158] mx-auto mb-6"></div>

          <div className="grid grid-cols-2 gap-3">
            {[
              "https://images.unsplash.com/photo-1519741497674-611481863552?q=80&w=500",
              "https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=500",
              "https://images.unsplash.com/photo-1579783902614-a3fb3927b675?q=80&w=500"
            ].map((imgUrl, i) => (
              <div 
                key={i} 
                onClick={() => setImagenAmpliada(imgUrl)}
                className={`${i === 0 ? 'col-span-2 h-52' : 'h-36'} overflow-hidden rounded-2xl shadow-sm bg-white cursor-pointer relative group`}
              >
                <img src={imgUrl} alt={`Foto ${i}`} className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" />
              </div>
            ))}
          </div>
        </section>

        {/* Dress Code */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 bg-[#F3ECF8]/90 relative z-20">
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-sm border border-[#EADBEE] text-center">
            <h3 className="text-4xl text-[#5A456E] mb-1" style={{ fontFamily: "'Alex Brush', cursive" }}>Dress code</h3>
            <p className="text-xs tracking-widest text-[#2E1F47] uppercase font-sans font-bold mb-4">SEMI-FORMAL</p>
            <p className="text-sm italic text-[#7A6282] mb-6">
              Que las damas brillen con su belleza única y los caballeros con su porte y estilo.
            </p>

            <p className="text-[10px] tracking-widest uppercase text-[#3D2C4D] font-bold font-sans mb-3">COLORES RESERVADOS</p>
            <div className="flex justify-center space-x-4 mb-4">
              <div className="w-9 h-9 rounded-full bg-[#E2D4F0] border-2 border-[#E5C158]"></div>
              <div className="w-9 h-9 rounded-full bg-[#5A456E] border-2 border-[#E5C158]"></div>
              <div className="w-9 h-9 rounded-full bg-[#E5C158] border-2 border-white shadow"></div>
            </div>
            <p className="text-sm italic text-[#7A6282]">
              Los tonos lila, morado y dorado representan la esencia de mis sueños; les solicitamos gentilmente no utilizarlos.
            </p>
          </div>
        </section>

        {/* Obsequios */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 text-center max-w-md mx-auto relative z-20">
          <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Obsequios</h3>
          <p className="text-sm italic text-[#7A6282] mb-6 max-w-xs mx-auto leading-relaxed">
            Mi mayor regalo será tu presencia. Si deseas obsequiarme algo, disponemos de lluvia de sobres en el evento o transferencia mediante pago móvil.
          </p>

          <button
            onClick={() => setModalPagoOpen(true)}
            className="px-8 py-3.5 bg-[#5A456E] text-white text-xs tracking-widest uppercase font-semibold rounded-full shadow-md font-sans cursor-pointer hover:bg-[#48355B] transition-colors"
          >
            💳 Ver Datos de Pago Móvil
          </button>
        </section>

        {/* Asistencia */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-14 px-6 bg-[#F3ECF8]/90 relative z-20">
          <div className="max-w-md mx-auto bg-white/95 backdrop-blur-sm rounded-3xl p-6 shadow-md border border-[#EADBEE] text-center">
            <h3 className="text-4xl text-[#5A456E] mb-2" style={{ fontFamily: "'Alex Brush', cursive" }}>Asistencia</h3>

            {!familiaSeleccionada ? (
              <div>
                <p className="text-sm italic text-[#7A6282] mb-4">
                  Ingresa tu apellido para encontrar tu invitación:
                </p>
                <input
                  type="text"
                  placeholder="Ej. Hernández"
                  value={busqueda}
                  onChange={(e) => setBusqueda(e.target.value)}
                  className="w-full p-3.5 rounded-xl bg-[#FAF6FF] border border-[#EADBEE] text-sm text-[#3D2C4D] focus:outline-none mb-3 font-sans"
                />

                {familiasFiltradas.length > 0 && (
                  <div className="space-y-2">
                    {familiasFiltradas.map((fam) => (
                      <button
                        key={fam.id}
                        onClick={() => { setFamiliaSeleccionada(fam); setAsistentesConfirmados(fam.maxCupos); }}
                        className="w-full text-left p-3.5 rounded-xl bg-[#F3ECF8] border border-[#E5C158]/40 flex justify-between items-center cursor-pointer"
                      >
                        <span className="font-semibold text-sm text-[#2E1F47] font-sans">{fam.nombre}</span>
                        <span className="text-[10px] bg-[#5A456E] text-white px-2.5 py-1 rounded-full font-sans">
                          Máx. {fam.maxCupos}
                        </span>
                      </button>
                    ))}
                  </div>
                )}
              </div>
            ) : confirmadoExito ? (
              <div className="py-4">
                <h4 className="text-xl font-bold text-[#5A456E] font-sans mb-1">¡Asistencia Confirmada!</h4>
                <p className="text-sm text-[#7A6282]">
                  Guardamos {asistentesConfirmados} lugar(es) para la <strong>{familiaSeleccionada.nombre}</strong>.
                </p>
              </div>
            ) : (
              <div>
                <div className="p-3.5 rounded-xl bg-[#F3ECF8] mb-4">
                  <p className="text-[10px] uppercase tracking-wider text-[#7A6282] font-sans">INVITACIÓN DE</p>
                  <h4 className="text-base font-bold text-[#2E1F47] font-sans">{familiaSeleccionada.nombre}</h4>
                </div>

                <p className="text-sm text-[#7A6282] mb-3 font-sans">Asistentes a confirmar:</p>
                <div className="flex items-center justify-center space-x-4 mb-4">
                  <button onClick={() => setAsistentesConfirmados(Math.max(1, asistentesConfirmados - 1))} className="w-9 h-9 rounded-full bg-[#5A456E] text-white font-bold font-sans cursor-pointer text-base">-</button>
                  <span className="text-lg font-bold text-[#2E1F47] font-sans">{asistentesConfirmados}</span>
                  <button onClick={() => setAsistentesConfirmados(Math.min(familiaSeleccionada.maxCupos, asistentesConfirmados + 1))} className="w-9 h-9 rounded-full bg-[#5A456E] text-white font-bold font-sans cursor-pointer text-base">+</button>
                </div>

                <div className="flex space-x-2">
                  <button onClick={() => setFamiliaSeleccionada(null)} className="w-1/3 py-3 rounded-full border text-xs uppercase font-sans cursor-pointer">Cambiar</button>
                  <button onClick={enviarAsistencia} disabled={enviando} className="w-2/3 py-3 rounded-full bg-[#D4AF37] text-[#2E1F47] font-bold text-xs uppercase font-sans shadow-md cursor-pointer">
                    {enviando ? 'Guardando...' : 'Confirmar Aquí'}
                  </button>
                </div>
              </div>
            )}
          </div>
        </section>

        {/* Playlist */}
        <section className="reveal opacity-0 translate-y-10 transition-all duration-1000 py-12 px-6 max-w-md mx-auto text-center relative z-20">
          <h3 className="text-4xl text-[#5A456E] mb-1" style={{ fontFamily: "'Alex Brush', cursive" }}>Playlist</h3>
          <p className="text-sm italic text-[#7A6282] mb-4">¿Qué canción no debería faltar en la fiesta?</p>
          {!playlistEnviada ? (
            <div className="space-y-3">
              <input
                type="text"
                placeholder="Nombre o link de Spotify / YouTube"
                value={cancionUrl}
                onChange={(e) => setCancionUrl(e.target.value)}
                className="w-full p-3.5 rounded-xl bg-[#F3ECF8] border border-[#EADBEE] text-sm text-[#3D2C4D] focus:outline-none font-sans"
              />
              <button onClick={() => { if(cancionUrl) setPlaylistEnviada(true); }} className="w-full py-3 rounded-full bg-[#5A456E] text-white text-xs font-sans uppercase font-semibold cursor-pointer">
                Sugerir Canción
              </button>
            </div>
          ) : (
            <p className="text-sm font-semibold text-[#5A456E]">¡Gracias por tu recomendación!</p>
          )}
        </section>

        {/* Cierre */}
        <footer className="py-12 px-6 text-center bg-[#2E1F47] text-purple-200 relative z-20">
          <p className="text-sm italic mb-2">¡Los espero para darnos un fuerte abrazo!</p>
          <h4 className="text-3xl text-[#E5C158] mb-4" style={{ fontFamily: "'Alex Brush', cursive" }}>Nicole</h4>
          <p className="text-[10px] tracking-widest uppercase opacity-60 font-sans">XV AÑOS · NICOLE RIVAS · 16.01.2027</p>
        </footer>

      </div>
    </div>
  );
}
