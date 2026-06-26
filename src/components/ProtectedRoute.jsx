import { Navigate } from 'react-router-dom'
import { useAuth } from '../hooks/useAuth'

// Protege rutas. requireAdmin -> exige role === 'admin'.
export default function ProtectedRoute({ children, requireAdmin = false }) {
  const { user, isAdmin, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-institutional">
        <div className="animate-pulse">Cargando…</div>
      </div>
    )
  }

  if (!user) return <Navigate to="/" replace />
  if (requireAdmin && !isAdmin) return <Navigate to="/study" replace />

  return children
}
