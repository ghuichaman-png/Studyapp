import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()

  const links = [
    { to: '/study',   label: 'Estudiar', icon: '📖' },
    { to: '/trivia',  label: 'Trivia',   icon: '🎮' },
    { to: '/ranking', label: 'Ranking',  icon: '🏅' },
  ]
  if (isAdmin) links.push({ to: '/admin', label: 'Admin', icon: '⚙️' })

  async function handleLogout() {
    await signOut()
    navigate('/')
  }

  return (
    <header className="bg-institutional text-white shadow-md sticky top-0 z-30">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <span className="text-2xl">🏥</span>
          <span className="hidden sm:inline">Studyapp</span>
        </div>

        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-lg text-sm font-medium transition-colors flex items-center gap-1.5 ${
                  isActive ? 'bg-white/20' : 'hover:bg-white/10'
                }`
              }
            >
              <span>{l.icon}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        <div className="flex items-center gap-3">
          <span className="hidden md:flex flex-col items-end leading-tight">
            <span className="text-sm font-semibold">{profile?.username}</span>
            <span className="text-[11px] uppercase tracking-wide text-white/60">
              {isAdmin ? 'Administrador' : 'Jugador'}
            </span>
          </span>
          <button
            onClick={handleLogout}
            className="text-sm bg-white/10 hover:bg-white/20 px-3 py-1.5 rounded-lg transition-colors"
          >
            Salir
          </button>
        </div>
      </div>
    </header>
  )
}
