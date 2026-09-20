/**
 * Resolución de rutas de assets según el `base` del build.
 */

/**
 * Convierte una ruta de `public/` en una URL válida para el `base` del build.
 *
 * En desarrollo `BASE_URL` es "/" y la ruta queda igual. En un build hecho con
 * `--base ./` (hosting estático o servido desde una subcarpeta) pasa a ser
 * relativa: "/posters/x.svg" -> "./posters/x.svg". Sin esto, la ruta absoluta
 * apunta a la raíz del dominio y la imagen da 404.
 *
 * Las URLs externas y los data: URI se devuelven sin tocar.
 */
export function resolveAsset(path) {
  if (!path) return path
  if (/^(?:[a-z][a-z0-9+.-]*:)?\/\//i.test(path) || path.startsWith('data:')) return path

  const base = import.meta.env.BASE_URL ?? '/'
  return `${base.replace(/\/+$/, '')}/${path.replace(/^\/+/, '')}`
}

export default resolveAsset
