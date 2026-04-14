import { useMemo } from 'react'
import { Link } from 'react-router-dom'

const WEDDING_DATE = '2026-12-12T16:00:00'

function formatCountdown(targetDateIso: string): string {
  const diff = new Date(targetDateIso).getTime() - Date.now()
  if (diff <= 0) {
    return 'Hoy celebramos nuestra boda'
  }
  const days = Math.floor(diff / (1000 * 60 * 60 * 24))
  const hours = Math.floor((diff / (1000 * 60 * 60)) % 24)
  const minutes = Math.floor((diff / (1000 * 60)) % 60)
  return `${days} dias · ${hours} horas · ${minutes} min`
}

export function HomePage() {
  const countdown = useMemo(() => formatCountdown(WEDDING_DATE), [])

  return (
    <main className="editorial-page">
      <section className="hero section">
        <p className="eyebrow">Invitacion floral</p>
        <h1>Ana + Daniel</h1>
        <p className="lead">
          Con mucha ilusion, te invitamos a compartir una celebracion intima
          llena de flores, musica y amor.
        </p>
        <p className="date-label">12 de diciembre de 2026 · Ciudad de Mexico</p>
        <Link className="primary-btn" to="/invitacion/demo-token">
          Abrir invitacion personalizada
        </Link>
        <div className="floral-divider">✿ ✿ ✿</div>
      </section>

      <section className="section panel">
        <div className="countdown-wrap">
          <h2>Cuenta regresiva</h2>
          <p className="countdown">{countdown}</p>
          <p className="countdown-note">
            Faltan pocos dias para celebrar este nuevo capitulo con quienes mas
            queremos.
          </p>
        </div>
      </section>

      <section className="section panel">
        <h2>Detalles importantes</h2>
        <div className="highlights-grid">
          <article className="highlight-card">
            <span>Ceremonia</span>
            <h3>16:00 hrs</h3>
            <p>Parroquia de San Miguel</p>
          </article>
          <article className="highlight-card">
            <span>Recepcion</span>
            <h3>19:00 hrs</h3>
            <p>Casa Editorial Roma Norte</p>
          </article>
          <article className="highlight-card">
            <span>Dress code</span>
            <h3>Formal elegante</h3>
            <p>Tonos pastel, rosa viejo y neutros</p>
          </article>
        </div>
      </section>

      <section className="section panel">
        <h2>Nuestra historia</h2>
        <div className="story-wrap">
          <article className="story-card">
            <h3>Como empezo</h3>
            <p>
              Entre conversaciones largas y domingos de cafe, aprendimos a
              elegirnos todos los dias.
            </p>
          </article>
          <article className="story-card">
            <h3>El gran si</h3>
            <p>
              En una noche tranquila, rodeados de flores y velas, decidimos
              construir este futuro juntos.
            </p>
          </article>
          <article className="story-card">
            <h3>Lo que viene</h3>
            <p>
              Queremos celebrar este dia con las personas que han sido parte de
              nuestro camino.
            </p>
          </article>
          <article className="story-card">
            <h3>Tu presencia</h3>
            <p>
              Tu compania hace que esta fecha sea aun mas especial y memorable.
            </p>
          </article>
        </div>
      </section>

      <section className="section panel">
        <h2>Agenda del dia</h2>
        <ol className="timeline">
          <li>
            <span>16:00 hrs</span>
            <p>Ceremonia y brindis de bienvenida</p>
          </li>
          <li>
            <span>18:30 hrs</span>
            <p>Coctel, fotografias y mensajes especiales</p>
          </li>
          <li>
            <span>20:00 hrs</span>
            <p>Cena, primer baile y fiesta</p>
          </li>
          <li>
            <span>23:30 hrs</span>
            <p>Ultimo brindis y despedida</p>
          </li>
        </ol>
      </section>

      <section className="section grid-two">
        <article className="location-card">
          <span className="location-tag">Ceremonia</span>
          <h3 className="location-title">Parroquia de San Miguel</h3>
          <p>Centro Historico, Ciudad de Mexico</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Ver ruta en mapa
          </a>
        </article>
        <article className="location-card">
          <span className="location-tag">Recepcion</span>
          <h3 className="location-title">Casa Editorial Roma Norte</h3>
          <p>Roma Norte, Ciudad de Mexico</p>
          <a
            href="https://maps.google.com"
            target="_blank"
            rel="noreferrer"
            className="text-link"
          >
            Ver ruta en mapa
          </a>
        </article>
      </section>

      <section className="section panel">
        <h2>Galeria de momentos</h2>
        <div className="gallery-masonry">
          <article className="gallery-tile">
            <span>Sesion en jardin botanico</span>
          </article>
          <article className="gallery-tile">
            <span>Atardecer en la ciudad</span>
          </article>
          <article className="gallery-tile">
            <span>Celebracion en familia</span>
          </article>
          <article className="gallery-tile">
            <span>Nuestro primer viaje</span>
          </article>
          <article className="gallery-tile">
            <span>Entre flores y promesas</span>
          </article>
          <article className="gallery-tile">
            <span>Camino al gran dia</span>
          </article>
        </div>
      </section>
    </main>
  )
}
