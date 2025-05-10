/**
 * Checks if the element is Scrolled To End or not
 *
 * @param {HTMLElement} element Element to check scroll of
 * @param {number} [tolerance = 5] tolerance value from the end
 * @returns {boolean}
 */
export const isScrolledToEnd = (element: HTMLElement, tolerance = 5): boolean => {
  return element?.scrollLeft + tolerance >= element?.scrollWidth - element?.clientWidth
}

/**
 * Checks if the element is Scrolled To Start or not
 *
 * @param {HTMLElement} element
 * @param {number} [tolerance = 5] tolerance value from the start
 * @returns {boolean}
 */
export const isScrolledToStart = (element: HTMLElement, tolerance = 5) => {
  return element?.scrollLeft - tolerance < 0
}
