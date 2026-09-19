import { Link } from 'react-router-dom'
import { Compass } from 'lucide-react'
import Button from '../components/ui/Button.jsx'

export function NotFoundPage() {
  return (
    <div className="grid min-h-dvh place-items-center bg-brand-50 px-6 text-center dark:bg-ink-950">
      <div>
        <Compass className="mx-auto size-12 text-brand-400" aria-hidden="true" />
        <h1 className="mt-4 font-display text-4xl font-extrabold text-ink-900 dark:text-white">
          404
        </h1>
        <p className="mt-2 text-sm text-ink-700/70 dark:text-ink-100/60">
          Esta página no existe. Quizá la puerta de ingreso es otra.
        </p>
        <Button as={Link} to="/" variant="primary" className="mt-6">
          Volver al inicio
        </Button>
      </div>
    </div>
  )
}

export default NotFoundPage
