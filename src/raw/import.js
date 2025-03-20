/** Avoid generating unnecessary code with rewriteRelativeImportExtensions.
 * @param { string } mod module path
 */
export const dynamicImport = (mod) => import(mod)
