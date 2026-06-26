import { Routes, Route, Navigate } from 'react-router-dom'
import { useAuth } from './hooks/useAuth'
import ProtectedRoute from './components/ProtectedRoute'
import Navbar from './components/Navbar'
import Login from './pages/Login'
import Register from './pages/Register'
import Study from './pages/Study'
import Trivia from './pages/Trivia'
import Ranking from './pages/Ranking'
import Admin from './pages/Admin'

function Layout({ children }) {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <main className="flex-1">{children}</main>
    </div>
  )
}

export default function AppRouter() {
  const { user, loading } = useAuth()

  if (loading) {
    return (
      <div className="min-h-screen grid place-items-center text-institutional">
        <div className="animate-pulse text-lg font-medium">Cargando…</div>
      </div>
    )
  }

  return (
    <Routes>
      {/* Públicas */}
      <Route path="/" element={user ? <Navigate to="/study" replace /> : <Login />} />
      <Route path="/register" element={user ? <Navigate to="/study" replace /> : <Register />} />

      {/* Autenticadas */}
      <Route path="/study"   element={<ProtectedRoute><Layout><Study /></Layout></ProtectedRoute>} />
      <Route path="/trivia"  element={<ProtectedRoute><Layout><Trivia /></Layout></ProtectedRoute>} />
      <Route path="/ranking" element={<ProtectedRoute><Layout><Ranking /></Layout></ProtectedRoute>} />

      {/* Solo admin */}
      <Route path="/admin" element={
        <ProtectedRoute requireAdmin>
          <Layout><Admin /></Layout>
        </ProtectedRoute>
      } />

      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}
