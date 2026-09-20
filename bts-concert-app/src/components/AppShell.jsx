import { Outlet } from 'react-router-dom'
import { Loader2, TriangleAlert } from 'lucide-react'
import { useData } from '../context/DataContext.jsx'

/**
 * Contenedor de la zona privada.
 *
 * La app es solo la sección de entradas: cada pantalla trae su propia
 * cabecera, así que aquí únicamente viven los estados de carga y de error.
 */
export function AppShell() {
  const { loading, error, reload } = useData()

  if (error) {
    return (
      <div className="grid min-h-dvh place-items-center bg-app-bg px-6 font-native">
        <div className="text-center">
          <TriangleAlert className="mx-auto size-9 text-app-teal" aria-hidden="true" />
          <p className="mt-4 text-[15px] font-semibold text-white">
            No pudimos cargar tus entradas
          </p>
          <p className="mt-1 text-[13px] text-app-muted">{error}</p>
          <button
            type="button"
            onClick={reload}
            className="mt-6 h-11 rounded-[24px] bg-white px-7 text-[14px] font-semibold text-[#111] active:scale-[0.99]"
          >
            Reintentar
          </button>
        </div>
      </div>
    )
  }

  if (loading) {
    return (
      <div className="grid min-h-dvh place-items-center bg-app-bg font-native">
        <div className="flex flex-col items-center gap-3">
          <Loader2 className="size-7 animate-spin text-app-teal" aria-hidden="true" />
          <p className="text-[13px] text-app-muted">Cargando tus entradas…</p>
        </div>
      </div>
    )
  }

  return <Outlet />
}

export default AppShell
