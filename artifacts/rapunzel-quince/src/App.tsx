import { type ReactNode, useState } from 'react';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ErrorBoundary } from '@/components/error-boundary';
import { Toaster } from '@/components/ui/toaster';
import { TooltipProvider } from '@/components/ui/tooltip';
import NotFound from '@/pages/not-found';
import { CalendarDays, Clock3, Flower2, MapPin, Share2, Sparkles } from 'lucide-react';
import {
  Route,
  Switch,
  useLocation,
  Router as WouterRouter,
} from 'wouter';

const queryClient = new QueryClient();

// Edit this single object to personalize the invitation. Replace each bracketed value.
const INVITATION = {
  celebrant: '[Nombre de la festejada]',
  date: '[Día, mes y año]',
  time: '[Hora de inicio]',
  venue: '[Nombre del lugar]',
  address: '[Dirección completa]',
  contact: '[Contacto para confirmar asistencia]',
};

function Home() {
  const [toast, setToast] = useState('');

  async function shareInvitation() {
    const shareText = `Te invito a celebrar los quince años de ${INVITATION.celebrant}. ${INVITATION.date} · ${INVITATION.time}.`;
    try {
      if (navigator.share) {
        await navigator.share({ title: `Quince años de ${INVITATION.celebrant}`, text: shareText, url: window.location.href });
      } else if (navigator.clipboard) {
        await navigator.clipboard.writeText(`${shareText} ${window.location.href}`);
        setToast('Enlace de la invitación copiado');
        window.setTimeout(() => setToast(''), 3000);
      } else {
        setToast('Copia el enlace desde la barra del navegador');
        window.setTimeout(() => setToast(''), 3000);
      }
    } catch {
      // A dismissed native share sheet is not an error for the guest.
    }
  }

  return (
    <main className="story-shell">
      <section className="hero" aria-labelledby="hero-title">
        <div className="hero-inner">
          <div className="hero-kicker">Una invitación bajo las estrellas</div>
          <h1 id="hero-title">Una noche <em>de cuento</em></h1>
          <p className="hero-deck">Hay noches que parecen escritas en las estrellas. Nos encantaría que acompañaras a <strong>{INVITATION.celebrant}</strong> a celebrar sus quince años.</p>
          <div className="hero-date"><span>{INVITATION.date}</span><span aria-hidden="true">·</span><span>{INVITATION.time}</span></div>
          <div className="hero-actions">
            <a className="pill-button" href="#detalles" data-testid="link-invitation-details">Descubrir la invitación <Sparkles size={15} aria-hidden="true" /></a>
            <button className="pill-button outline" type="button" onClick={shareInvitation} data-testid="button-share-invitation"><Share2 size={15} aria-hidden="true" /> Compartir</button>
          </div>
        </div>
        <a className="scroll-cue" href="#bienvenida" aria-label="Desplazarse a la invitación" data-testid="link-scroll-invitation">Sigue la luz</a>
      </section>

      <section className="chapter intro" id="bienvenida">
        <div className="chapter-inner">
          <div className="eyebrow">Una página nueva comienza</div>
          <h2>Quince años, mil sueños<br />y una noche para recordar.</h2>
          <p>Como una trenza que une historias, esta noche reúne a las personas que más queremos. Ven a celebrar el comienzo de un capítulo luminoso, rodeados de flores, faroles y mucho cariño.</p>
          <div className="dedication">Con todo nuestro amor, te esperamos</div>
          <div className="rule" aria-hidden="true" />
        </div>
      </section>

      <section className="details-section" id="detalles" aria-labelledby="details-title">
        <div className="chapter-inner details-layout">
          <div className="detail-copy">
            <div className="eyebrow">Guarda la fecha</div>
            <h2 className="section-title" id="details-title">El comienzo<br />de la celebración.</h2>
            <p>Una noche para brindar, bailar y llenar de recuerdos una historia que apenas empieza. Aquí encontrarás los detalles para acompañarnos.</p>
          </div>
          <div className="detail-list">
            <div className="detail-row">
              <div className="detail-icon"><CalendarDays size={21} strokeWidth={1.5} aria-hidden="true" /></div>
              <div><div className="detail-label">La fecha</div><div className="detail-value">{INVITATION.date}</div><div className="detail-note">Edita este dato en el objeto INVITATION.</div></div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><Clock3 size={21} strokeWidth={1.5} aria-hidden="true" /></div>
              <div><div className="detail-label">La hora</div><div className="detail-value">{INVITATION.time}</div></div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><Flower2 size={21} strokeWidth={1.5} aria-hidden="true" /></div>
              <div><div className="detail-label">El lugar</div><div className="detail-value">{INVITATION.venue}</div><div className="detail-note">{INVITATION.address}</div></div>
            </div>
            <div className="detail-row">
              <div className="detail-icon"><MapPin size={21} strokeWidth={1.5} aria-hidden="true" /></div>
              <div><div className="detail-label">Cómo llegar</div><div className="detail-value">{INVITATION.address}</div><div className="detail-note">Sustituye por la dirección para compartirla con tus invitados.</div></div>
            </div>
          </div>
        </div>
      </section>

      <section className="note-section">
        <div className="note-card">
          <div className="eyebrow">Una noche para brillar</div>
          <h2>Tu presencia hará<br />más mágico el cuento.</h2>
          <p>Prepara tus mejores pasos y ven con ganas de celebrar. Será una velada de abrazos, música y pequeños momentos que guardaremos para siempre.</p>
        </div>
      </section>

      <section className="rsvp-section" id="asistencia" aria-labelledby="rsvp-title">
        <div className="rsvp-inner">
          <div>
            <div className="eyebrow">Acompáñanos</div>
            <h2 id="rsvp-title">¿Nos vemos bajo los faroles?</h2>
            <p>Nos encantará saber si podrás venir. Para enviar tu respuesta hace falta configurar primero un teléfono o contacto real de la familia; esta invitación no envía confirmaciones todavía.</p>
          </div>
          <div className="rsvp-action" role="note">
            <strong>Confirmación pendiente</strong>
            <span>Contacto por configurar:<br />{INVITATION.contact}</span>
          </div>
        </div>
      </section>
      <footer className="footer">
        <div className="footer-mark">{INVITATION.celebrant} · XV</div>
        Una noche de cuento, hecha para compartir.
      </footer>
      {toast && <div className="toast-note" role="status" aria-live="polite">{toast}</div>}
    </main>
  );
}

function Router() {
  return (
    // Keep a shared shell (sidebar, navbar) outside the boundary so it
    // survives a page crash.
    <RoutedErrorBoundary>
      <Switch>
        <Route path="/" component={Home} />
        <Route component={NotFound} />
      </Switch>
    </RoutedErrorBoundary>
  );
}

function RoutedErrorBoundary({ children }: { children: ReactNode }) {
  const [location] = useLocation();
  return <ErrorBoundary resetKey={location}>{children}</ErrorBoundary>;
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <WouterRouter base={import.meta.env.BASE_URL.replace(/\/$/, '')}>
          <Router />
        </WouterRouter>
        <Toaster />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
