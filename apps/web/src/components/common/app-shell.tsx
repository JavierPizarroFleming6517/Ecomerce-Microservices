import { NavLink, Outlet } from 'react-router-dom'

const navigation = [
  { label: 'Inicio', to: '/' },
  { label: 'Estado', to: '/estado' },
]

export function AppShell() {
  return (
    <div className="min-h-screen bg-slate-50 text-slate-950">
      <header className="border-b border-slate-200/80 bg-white/90 backdrop-blur">
        <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5 sm:px-8">
          <NavLink
            to="/"
            className="flex items-center gap-3 font-semibold tracking-tight"
          >
            <span className="grid size-9 place-items-center rounded-xl bg-indigo-600 text-sm font-bold text-white shadow-sm shadow-indigo-600/25">
              R
            </span>
            <span>Retail Console</span>
          </NavLink>

          <nav aria-label="Navegación principal" className="flex gap-1">
            {navigation.map((item) => (
              <NavLink
                key={item.to}
                to={item.to}
                end={item.to === '/'}
                className={({ isActive }) =>
                  isActive
                    ? 'rounded-lg bg-slate-100 px-4 py-2 text-sm font-semibold text-slate-950'
                    : 'rounded-lg px-4 py-2 text-sm font-medium text-slate-500 transition hover:bg-slate-100 hover:text-slate-950'
                }
              >
                {item.label}
              </NavLink>
            ))}
          </nav>
        </div>
      </header>

      <main className="mx-auto w-full max-w-6xl px-5 py-10 sm:px-8 sm:py-14">
        <Outlet />
      </main>

      <footer className="mx-auto flex max-w-6xl items-center justify-between border-t border-slate-200 px-5 py-6 text-xs text-slate-400 sm:px-8">
        <span>Retail Platform</span>
        <span>Panel operativo</span>
      </footer>
    </div>
  )
}
