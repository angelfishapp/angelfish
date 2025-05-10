/**
 * Content Security Policy (CSP) Header Utility Functions to generate CSP headers
 * for Electron Windows.
 */

/**
 * CSP Directives that can be used in the CSP header.
 */
export type CSPDirective =
  | 'default-src'
  | 'script-src'
  | 'style-src'
  | 'img-src'
  | 'connect-src'
  | 'font-src'
  | 'object-src'
  | 'media-src'
  | 'frame-src'

/**
 * CSP Directives that can be used in the CSP header.
 */
export type CspDirectives = Partial<Record<CSPDirective, string[]>>

/**
 * CSP Presets for different environments.
 */
const CSPPresets: Record<string, CspDirectives> = {
  development: {
    'default-src': ['self', 'unsafe-inline'],
    'script-src': ['self', 'unsafe-eval', 'unsafe-inline'],
    'img-src': ['self', 'data:'],
  },
  production: {
    'default-src': ['self', 'unsafe-inline'],
    'script-src': ['self', 'unsafe-inline'],
    'img-src': ['self', 'data:'],
  },
}

/**
 * List of CSP keywords that should be quoted.
 * These keywords are used in CSP directives and should be quoted to ensure proper parsing.
 */
const keywordSources = new Set([
  'self',
  'none',
  'unsafe-inline',
  'unsafe-eval',
  'strict-dynamic',
  'unsafe-hashes',
  'report-sample',
])

/**
 * Helper function to quote CSP values if needed. This is used to ensure that certain CSP values are properly
 * quoted when generating the CSP header.
 *
 * @param value   The CSP value to be quoted.
 * @returns       The quoted CSP value if it is a keyword, otherwise the original value.
 */
function quoteIfNeeded(value: string): string {
  const clean = value.replace(/^'+|'+$/g, '')
  return keywordSources.has(clean) ? `'${clean}'` : clean
}

/**
 * Generates a Content Security Policy (CSP) header string from the given directives. Starts with a preset
 * listed above and then adds any additional directives provided. You don't need to include 'self' in directives
 * as it is automatically added to the default-src directive.
 *
 * @param preset        The CSP preset to use (e.g., 'development', 'production').
 * @param directives    An optional object containing specific CSP directives and their corresponding values.
 * @returns             A string representing the CSP header.
 */
export function generateCSPHeader(
  preset: keyof typeof CSPPresets,
  directives: CspDirectives = {},
): string {
  // Start with the preset directives
  const cspDirectives = { ...CSPPresets[preset] }

  // Merge the provided directives with the preset directives
  for (const [directive, values] of Object.entries(directives)) {
    const key = directive as CSPDirective
    if (cspDirectives[key]) {
      // Build set of values if directive already exists
      cspDirectives[key] = [...new Set([...cspDirectives[key], ...values, 'self'])]
    } else {
      cspDirectives[directive as CSPDirective] = [...new Set([...values, 'self'])]
    }
  }

  // Return the CSP header string
  return Object.entries(cspDirectives)
    .map(([directive, values]) => `${directive} ${values.map((v) => quoteIfNeeded(v)).join(' ')}`)
    .join('; ')
}
