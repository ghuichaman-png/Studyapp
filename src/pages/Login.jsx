import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Login() {
  const { signIn } = useAuth()
  const navigate = useNavigate()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState(null)
  const [loading, setLoading] = useState(false)

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null)
    setLoading(true)
    try {
      await signIn(email.trim(), password)
      navigate('/study')
    } catch (err) {
      setError(err.message || 'No se pudo iniciar sesión.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2 bg-slate-50 dark:bg-slate-900 transition-colors duration-200">
      
      {/* Brand/Hero Panel */}
      <div className="hidden lg:flex flex-col justify-between bg-gradient-to-br from-slate-900 via-slate-800 to-slate-950 text-white p-12 shadow-inner relative overflow-hidden">
        {/* Glow decorative effect */}
        <div className="absolute top-[-20%] left-[-20%] w-[60%] h-[60%] rounded-full bg-sky-500/10 blur-[120px] pointer-events-none" />
        <div className="absolute bottom-[-20%] right-[-20%] w-[60%] h-[60%] rounded-full bg-violet-500/10 blur-[120px] pointer-events-none" />

        <div className="flex items-center gap-2 text-2xl font-bold tracking-tight">
          <span className="text-3xl">🏥</span>
          <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
            Studyapp
          </span>
        </div>
        
        <div className="space-y-6">
          <h1 className="text-5xl font-black leading-tight tracking-tight">
            Prepárate para la<br />
            <span className="bg-gradient-to-r from-sky-400 to-violet-400 bg-clip-text text-transparent">
              acreditación
            </span>, jugando.
          </h1>
          <p className="text-slate-300 text-lg max-w-md font-medium leading-relaxed">
            Estudia los temas clave, pon a prueba tus conocimientos con trivia
            gamificada y compite con tu equipo en el ranking.
          </p>
          <div className="flex gap-3 text-sm pt-2">
            <span className="bg-white/10 border border-white/5 px-4 py-2 rounded-2xl font-semibold shadow-sm flex items-center gap-1.5">📖 Estudio</span>
            <span className="bg-white/10 border border-white/5 px-4 py-2 rounded-2xl font-semibold shadow-sm flex items-center gap-1.5">🎮 Trivia</span>
            <span className="bg-white/10 border border-white/5 px-4 py-2 rounded-2xl font-semibold shadow-sm flex items-center gap-1.5">🏅 Insignias</span>
          </div>
        </div>

        <p className="text-slate-500 text-xs font-semibold">© {new Date().getFullYear()} Kinesiología HPM</p>
      </div>

      {/* Form Panel */}
      <div className="flex items-center justify-center p-6 sm:p-12 animate-fade-in">
        <div className="w-full max-w-sm space-y-8">
          
          <div className="text-center lg:text-left">
            <div className="lg:hidden flex items-center justify-center gap-2 text-institutional font-bold text-3xl mb-4">
              <span className="text-4xl">🏥</span>
              <span className="bg-gradient-to-r from-sky-500 to-violet-500 dark:from-sky-400 dark:to-violet-400 bg-clip-text text-transparent">
                Studyapp
              </span>
            </div>
            <h2 className="text-3xl font-black text-slate-800 dark:text-white tracking-tight">Iniciar sesión</h2>
            <p className="text-slate-500 dark:text-slate-400 mt-2 font-medium">Ingresa con tu correo y contraseña.</p>
          </div>

          <form onSubmit={handleSubmit} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 p-8 rounded-3xl shadow-sm space-y-5 transition-colors duration-200">
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Correo</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/50 dark:focus:ring-sky-400/30 transition-all font-medium"
                placeholder="tucorreo@hospital.org"
              />
            </div>
            <div>
              <label className="block text-sm font-semibold text-slate-600 dark:text-slate-300 mb-1.5">Contraseña</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-slate-50 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-700/60 text-slate-800 dark:text-slate-100 rounded-2xl px-4 py-3 focus:outline-none focus:ring-2 focus:ring-sky-400/50 dark:focus:ring-sky-400/30 transition-all font-medium"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm bg-red-50 dark:bg-red-950/20 text-red-600 dark:text-red-400 border border-red-200 dark:border-red-900/30 rounded-xl px-4 py-3 animate-shake font-medium">
                ⚠️ {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-gradient-to-r from-sky-500 to-violet-500 hover:from-sky-600 hover:to-violet-600 dark:from-sky-400 dark:to-violet-400 text-white dark:text-slate-950 py-3.5 rounded-2xl font-bold transition-all duration-200 hover:shadow-lg hover:shadow-sky-500/10 dark:hover:shadow-none disabled:opacity-60 active:scale-[0.98]"
            >
              {loading ? 'Ingresando…' : 'Entrar'}
            </button>
          </form>

          <p className="text-sm text-slate-500 dark:text-slate-400 text-center font-medium">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-sky-600 dark:text-sky-400 font-bold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
