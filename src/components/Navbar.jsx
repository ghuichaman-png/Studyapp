import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Navbar() {
  const { profile, isAdmin, signOut } = useAuth()
  const navigate = useNavigate()
  const [theme, setThemeState] = useState(() => localStorage.getItem('theme') || 'system')

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

  function toggleTheme() {
    let nextTheme = 'light'
    if (theme === 'light') nextTheme = 'dark'
    else if (theme === 'dark') nextTheme = 'system'
    
    setThemeState(nextTheme)
    localStorage.setItem('theme', nextTheme)
    
    const isDark = nextTheme === 'dark' || (nextTheme === 'system' && window.matchMedia('(prefers-color-scheme: dark)').matches)
    document.documentElement.classList.toggle('dark', isDark)
  }

  return (
    <header className="bg-white dark:bg-slate-900 text-slate-800 dark:text-white border-b border-slate-200 dark:border-slate-800/80 shadow-sm sticky top-0 z-30 transition-colors duration-200">
      <div className="max-w-6xl mx-auto px-4 h-16 flex items-center justify-between gap-4">
        
        {/* Logo */}
        <div className="flex items-center gap-2 font-bold tracking-tight">
          <span className="text-2xl">🏥</span>
          <span className="text-xl bg-gradient-to-r from-sky-500 to-violet-500 dark:from-sky-400 dark:to-violet-400 bg-clip-text text-transparent">
            Studyapp
          </span>
        </div>

        {/* Navigation links */}
        <nav className="flex items-center gap-1 sm:gap-2">
          {links.map((l) => (
            <NavLink
              key={l.to}
              to={l.to}
              className={({ isActive }) =>
                `px-3 py-2 rounded-xl text-sm font-medium transition-all duration-200 flex items-center gap-1.5 ${
                  isActive 
                    ? 'bg-sky-500/10 text-sky-600 dark:bg-sky-400/15 dark:text-sky-400 font-semibold' 
                    : 'text-slate-500 hover:text-slate-900 dark:text-slate-400 dark:hover:text-slate-100 hover:bg-slate-100 dark:hover:bg-slate-800/60'
                }`
              }
            >
              <span>{l.icon}</span>
              <span className="hidden sm:inline">{l.label}</span>
            </NavLink>
          ))}
        </nav>

        {/* Right tools (Theme, Profile, Exit) */}
        <div className="flex items-center gap-2 sm:gap-3">
          
          {/* Theme switcher */}
          <button
            onClick={toggleTheme}
            title={`Tema: ${theme === 'light' ? 'Claro' : theme === 'dark' ? 'Oscuro' : 'Sistema'}`}
            className="text-lg bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700/80 p-2 rounded-xl transition-all duration-200 flex items-center justify-center border border-slate-200/40 dark:border-slate-800"
          >
            <span>{theme === 'light' ? '☀️' : theme === 'dark' ? '🌙' : '🖥️'}</span>
          </button>

          {/* User profile info */}
          <div className="flex items-center gap-2 pl-1 border-l border-slate-200 dark:border-slate-800">
            {/* Avatar circle */}
            <div className="h-8 w-8 rounded-full bg-gradient-to-tr from-sky-400 to-violet-400 flex items-center justify-center text-white font-bold text-sm shadow-sm">
              {profile?.username?.charAt(0).toUpperCase()}
            </div>
            
            <span className="hidden md:flex flex-col items-start leading-tight">
              <span className="text-xs font-semibold text-slate-700 dark:text-slate-200">{profile?.username}</span>
              <span className="text-[9px] uppercase tracking-wider text-slate-400 dark:text-slate-500 font-medium">
                {isAdmin ? 'Admin' : 'Jugador'}
              </span>
            </span>
          </div>

          {/* Exit button */}
          <button
            onClick={handleLogout}
            className="text-xs font-semibold bg-slate-100 hover:bg-red-50 text-slate-600 hover:text-red-600 dark:bg-slate-800 dark:hover:bg-red-950/40 dark:text-slate-400 dark:hover:text-red-400 px-3 py-2 rounded-xl transition-all duration-200 border border-slate-200/40 dark:border-slate-800"
          >
            Salir
          </button>
        </div>

      </div>
    </header>
  )
}
