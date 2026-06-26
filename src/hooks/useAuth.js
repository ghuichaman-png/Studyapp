// Reexport del hook de contexto de auth para una API limpia.
import { useAuthContext } from '../contexts/AuthContext'

export function useAuth() {
  return useAuthContext()
}
