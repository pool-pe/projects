/**
 * Banderas de entorno del build.
 *
 * `VITE_PREVIEW=1` marca el build que se publica como vista previa online
 * (hosting estático dentro de un visor con sandbox). Ahí el navegador bloquea
 * las descargas que inicia la página, así que la UI lo avisa en lugar de
 * quedarse sin hacer nada.
 */
export const isStaticPreview = import.meta.env.VITE_PREVIEW === '1'

export default isStaticPreview
