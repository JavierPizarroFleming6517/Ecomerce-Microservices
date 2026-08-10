import type { ReactNode } from 'react'

function SectionTitle({ children }: { children: string }) {
  return (
    <h3 className="mb-4 flex items-center gap-2 text-sm font-semibold tracking-wide text-white">
      <span className="h-4 w-1 rounded-sm bg-sky-400" aria-hidden="true" />
      {children}
    </h3>
  )
}

function FooterText({ children }: { children: string }) {
  return <p className="text-sm text-neutral-300">{children}</p>
}

function PaymentBadge({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center rounded-md border border-white/15 bg-white/[0.04] px-3 py-2 text-xs font-semibold uppercase tracking-wide text-neutral-200">
      {label}
    </span>
  )
}

function SocialIcon({ label, children }: { label: string; children: ReactNode }) {
  return (
    <span
      aria-label={label}
      className="grid size-9 place-items-center rounded-md bg-white/10 text-white"
    >
      {children}
    </span>
  )
}

export function StorefrontFooter() {
  return (
    <footer className="mt-12 border-t border-white/10 bg-neutral-950 text-neutral-100">
      <div className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8">
        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-3">
          <section>
            <SectionTitle>Ayuda</SectionTitle>
            <div className="space-y-2.5">
              <FooterText>Centro de ayuda</FooterText>
              <FooterText>Seguimiento de mi compra</FooterText>
              <FooterText>Formulario de contacto</FooterText>
            </div>
          </section>

          <section>
            <SectionTitle>Nosotros</SectionTitle>
            <div className="space-y-2.5">
              <FooterText>Quiénes somos</FooterText>
              <FooterText>Términos y condiciones</FooterText>
              <FooterText>Políticas de privacidad</FooterText>
            </div>
          </section>

          <section>
            <SectionTitle>Comunidad</SectionTitle>
            <div className="space-y-2.5">
              <FooterText>Instagram</FooterText>
              <FooterText>Facebook</FooterText>
              <FooterText>LinkedIn</FooterText>
            </div>
          </section>
        </div>

        <div className="mt-10 grid gap-8 border-t border-white/10 pt-8 md:grid-cols-2 md:items-start">
          <section>
            <SectionTitle>Medios de pago</SectionTitle>
            <div className="flex flex-wrap gap-3">
              <PaymentBadge label="Webpay" />
              <PaymentBadge label="Tarjetas" />
            </div>
          </section>

          <section className="space-y-3 md:text-right">
            <div className="flex flex-wrap gap-2 md:justify-end">
              <SocialIcon label="Instagram">
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                  <path d="M7.5 3h9A4.5 4.5 0 0 1 21 7.5v9A4.5 4.5 0 0 1 16.5 21h-9A4.5 4.5 0 0 1 3 16.5v-9A4.5 4.5 0 0 1 7.5 3zm0 1.8A2.7 2.7 0 0 0 4.8 7.5v9a2.7 2.7 0 0 0 2.7 2.7h9a2.7 2.7 0 0 0 2.7-2.7v-9a2.7 2.7 0 0 0-2.7-2.7h-9zm9.35 1.35a1.05 1.05 0 1 1 0 2.1 1.05 1.05 0 0 1 0-2.1zM12 8.2A3.8 3.8 0 1 1 12 15.8 3.8 3.8 0 0 1 12 8.2zm0 1.8a2 2 0 1 0 0 4 2 2 0 0 0 0-4z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="Facebook">
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                  <path d="M14 8h2.5V5.5H14c-1.9 0-3.5 1.6-3.5 3.5V11H8.5v2.5H10.5V20H13.5v-6.5H16L16.5 11H13.5V9c0-.6.4-1 1-1z" />
                </svg>
              </SocialIcon>
              <SocialIcon label="LinkedIn">
                <svg viewBox="0 0 24 24" className="size-4 fill-current" aria-hidden="true">
                  <path d="M6.5 9H4V20h2.5V9zM5.25 4A1.5 1.5 0 1 0 5.26 7a1.5 1.5 0 0 0-.01-3zM20 20h-2.5v-5.4c0-1.3-.5-2.2-1.7-2.2-1 0-1.5.7-1.8 1.3-.1.2-.1.6-.1.9V20H11.5s.05-8.7 0-9.6H14v1.4c.3-.6 1.2-1.6 2.9-1.6 2.1 0 3.1 1.4 3.1 4.1V20z" />
                </svg>
              </SocialIcon>
            </div>

            <p className="text-sm text-neutral-300">
              Av. Providencia 1234, Santiago, Chile
            </p>
            <p className="text-xs leading-relaxed text-neutral-500">
              Horario atención tienda y retiro: Lunes a Jueves 09:00 a 18:30 ·
              Viernes 09:00 a 18:00
            </p>
          </section>
        </div>
      </div>
    </footer>
  )
}
