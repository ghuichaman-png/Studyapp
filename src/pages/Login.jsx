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
    <div className="min-h-screen grid lg:grid-cols-2">
      {/* Panel de marca */}
      <div className="hidden lg:flex flex-col justify-between bg-institutional text-white p-12">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-3xl">🏥</span> Studyapp
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">
            Prepárate para la<br />acreditación, jugando.
          </h1>
          <p className="mt-4 text-white/70 max-w-md">
            Estudia los temas clave, pon a prueba tus conocimientos con trivia
            gamificada y compite con tu equipo en el ranking.
          </p>
          <div className="mt-8 flex gap-3 text-sm">
            <span className="bg-white/10 px-3 py-2 rounded-lg">📖 Estudio</span>
            <span className="bg-white/10 px-3 py-2 rounded-lg">🎮 Trivia</span>
            <span className="bg-white/10 px-3 py-2 rounded-lg">🏅 Insignias</span>
          </div>
        </div>
        <p className="text-white/40 text-sm">© {new Date().getFullYear()} Kinesiología HPM</p>
      </div>

      {/* Formulario */}
      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <div className="lg:hidden flex items-center gap-2 text-institutional font-bold text-xl mb-8">
            <span className="text-3xl">🏥</span> Studyapp
          </div>
          <h2 className="text-2xl font-bold text-institutional">Iniciar sesión</h2>
          <p className="text-slate-500 mt-1 mb-6">Ingresa con tu correo y contraseña.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Correo</label>
              <input
                type="email" required value={email} onChange={(e) => setEmail(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-institutional/40"
                placeholder="tucorreo@hospital.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
              <input
                type="password" required value={password} onChange={(e) => setPassword(e.target.value)}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-institutional/40"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <div className="text-sm bg-danger/10 text-red-700 border border-danger/30 rounded-lg px-3 py-2 animate-shake">
                {error}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-institutional text-white py-3 rounded-xl font-semibold hover:bg-institutional-light transition disabled:opacity-60"
            >
              {loading ? 'Ingresando…' : 'Entrar'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 text-center">
            ¿No tienes cuenta?{' '}
            <Link to="/register" className="text-institutional font-semibold hover:underline">
              Regístrate
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
