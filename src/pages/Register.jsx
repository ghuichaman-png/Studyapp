import { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

export default function Register() {
  const { signUp } = useAuth()
  const navigate = useNavigate()
  const [form, setForm] = useState({ username: '', email: '', password: '' })
  const [error, setError] = useState(null)
  const [info, setInfo] = useState(null)
  const [loading, setLoading] = useState(false)

  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }))

  async function handleSubmit(e) {
    e.preventDefault()
    setError(null); setInfo(null)
    if (form.password.length < 6) {
      setError('La contraseña debe tener al menos 6 caracteres.')
      return
    }
    setLoading(true)
    try {
      const data = await signUp(form.email.trim(), form.password, form.username.trim())
      // Si la confirmación de email está activada, no habrá sesión inmediata.
      if (data.session) {
        navigate('/study')
      } else {
        setInfo('Cuenta creada. Revisa tu correo para confirmar y luego inicia sesión.')
      }
    } catch (err) {
      setError(err.message || 'No se pudo crear la cuenta.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen grid lg:grid-cols-2">
      <div className="hidden lg:flex flex-col justify-between bg-success/95 text-white p-12">
        <div className="flex items-center gap-2 text-xl font-bold">
          <span className="text-3xl">🏥</span> Studyapp
        </div>
        <div>
          <h1 className="text-4xl font-bold leading-tight">Únete a tu equipo</h1>
          <p className="mt-4 text-white/80 max-w-md">
            Crea tu cuenta de jugador y empieza a sumar puntos, desbloquear
            insignias y escalar en el ranking del equipo.
          </p>
        </div>
        <p className="text-white/50 text-sm">© {new Date().getFullYear()} Kinesiología HPM</p>
      </div>

      <div className="flex items-center justify-center p-6 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-2xl font-bold text-institutional">Crear cuenta</h2>
          <p className="text-slate-500 mt-1 mb-6">Registro de jugador.</p>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Nombre de usuario</label>
              <input
                type="text" required value={form.username} onChange={set('username')}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-success/40"
                placeholder="Dr. Pérez"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Correo</label>
              <input
                type="email" required value={form.email} onChange={set('email')}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-success/40"
                placeholder="tucorreo@hospital.org"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-slate-600 mb-1">Contraseña</label>
              <input
                type="password" required value={form.password} onChange={set('password')}
                className="w-full border border-slate-300 rounded-xl px-4 py-2.5 focus:outline-none focus:ring-2 focus:ring-success/40"
                placeholder="Mínimo 6 caracteres"
              />
            </div>

            {error && (
              <div className="text-sm bg-danger/10 text-red-700 border border-danger/30 rounded-lg px-3 py-2 animate-shake">
                {error}
              </div>
            )}
            {info && (
              <div className="text-sm bg-success/10 text-green-700 border border-success/30 rounded-lg px-3 py-2">
                {info}
              </div>
            )}

            <button
              type="submit" disabled={loading}
              className="w-full bg-success text-white py-3 rounded-xl font-semibold hover:brightness-95 transition disabled:opacity-60"
            >
              {loading ? 'Creando…' : 'Crear cuenta'}
            </button>
          </form>

          <p className="mt-6 text-sm text-slate-500 text-center">
            ¿Ya tienes cuenta?{' '}
            <Link to="/" className="text-institutional font-semibold hover:underline">
              Inicia sesión
            </Link>
          </p>
        </div>
      </div>
    </div>
  )
}
