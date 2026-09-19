import { cn, getInitials } from '../../lib/format.js'

const SIZES = {
  sm: 'size-9 text-xs',
  md: 'size-11 text-sm',
  lg: 'size-16 text-lg',
  xl: 'size-20 text-2xl',
}

/**
 * Avatar con iniciales sobre degradado de marca.
 * Si algún día llega una URL real, basta con pasar `src`.
 */
export function Avatar({ name = '', src, size = 'md', className, ring = true }) {
  const initials = getInitials(name) || 'JP'

  return (
    <span
      className={cn(
        'relative inline-grid shrink-0 place-items-center overflow-hidden rounded-full font-display font-bold text-white',
        'bg-gradient-to-br from-brand-500 via-brand-600 to-accent-500',
        ring && 'ring-2 ring-white/80 dark:ring-white/15',
        SIZES[size],
        className,
      )}
      aria-hidden="true"
    >
      {src ? (
        <img src={src} alt="" className="size-full object-cover" />
      ) : (
        <span className="translate-y-px">{initials}</span>
      )}
    </span>
  )
}

export default Avatar
