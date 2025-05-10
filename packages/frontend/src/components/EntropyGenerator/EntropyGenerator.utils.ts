/**
 * Update seed with new entropy from mouse movements, will limit the length to 64 characters
 *
 * @param currentSeed   Current seed value
 * @param currX         Current X position of mouse
 * @param currY         Current Y position of mouse
 * @returns             Updated seed
 */
export function updateSeed(currentSeed: string, currX: number, currY: number): string {
  const randomPart = (currX * currY * Math.random()).toString(36).substring(2, 8)
  let newSeed = currentSeed + randomPart

  // Only keep a limited length
  if (newSeed.length > 64) {
    newSeed = newSeed.slice(-64)
  }
  return newSeed
}

/**
 * Draws a glowing white Mandala pattern on the canvas based on the user's mouse movements.
 * @see https://24ways.org/2018/the-art-of-mathematics
 *
 * @param currX     Current X position of mouse
 * @param currY     Current Y position of mouse
 * @param prevX     Previous X position of mouse
 * @param prevY     Previous Y position of mouse
 * @param width     Width of the canvas
 * @param height    Height of the canvas
 * @param ctx       Canvas 2D Context
 */
export function drawPattern(
  currX: number,
  currY: number,
  prevX: number,
  prevY: number,
  width: number,
  height: number,
  ctx: CanvasRenderingContext2D,
) {
  // Initialise
  const a = prevX,
    b = prevY,
    c = currX,
    d = currY
  let a_ = a,
    b_ = height - b,
    c_ = c,
    d_ = height - d

  // Set up glowing effect
  ctx.strokeStyle = '#FFFFFF' // White color
  ctx.lineWidth = 4
  ctx.lineCap = 'round'
  ctx.shadowBlur = 15 // Glow intensity
  ctx.shadowColor = 'white' // Glow color

  ctx.beginPath()

  ctx.moveTo(a, b)
  ctx.lineTo(c, d)

  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  a_ = width - a
  b_ = b
  c_ = width - c
  d_ = d
  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  a_ = width - a
  b_ = height - b
  c_ = width - c
  d_ = height - d
  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  a_ = width / 2 + height / 2 - b
  b_ = width / 2 + height / 2 - a
  c_ = width / 2 + height / 2 - d
  d_ = width / 2 + height / 2 - c
  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  a_ = width / 2 + height / 2 - b
  b_ = height / 2 - width / 2 + a
  c_ = width / 2 + height / 2 - d
  d_ = height / 2 - width / 2 + c
  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  a_ = width / 2 - height / 2 + b
  b_ = width / 2 + height / 2 - a
  c_ = width / 2 - height / 2 + d
  d_ = width / 2 + height / 2 - c
  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  a_ = width / 2 - height / 2 + b
  b_ = height / 2 - width / 2 + a
  c_ = width / 2 - height / 2 + d
  d_ = height / 2 - width / 2 + c
  ctx.moveTo(a_, b_)
  ctx.lineTo(c_, d_)

  ctx.stroke()
  ctx.closePath()
}

/**
 * Fades out older lines on the canvas by reducing the opacity of non-black pixels.
 *
 * @param ctx       Canvas 2D Context
 * @param width     Width of the canvas
 * @param height    Height of the canvas
 */
export function fadeOut(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Get the current pixel data
  const imageData = ctx.getImageData(0, 0, width, height)
  const data = imageData.data
  const fadeOutRate = 1

  // Loop through each pixel (RGBA format)
  for (let i = 0; i < data.length; i += 4) {
    // Reduce the alpha channel (opacity) of non-black pixels
    if (data[i + 3] > 0) {
      // Check if alpha > 0
      data[i + 3] = Math.max(0, data[i + 3] - fadeOutRate) // Gradually reduce alpha
    }
  }

  // Put the updated pixel data back on the canvas
  ctx.putImageData(imageData, 0, 0)
}

/**
 * Reset and clear the canvas
 *
 * @param ctx     Canvas 2D Context
 * @param width   Width of the canvas
 * @param height  Height of the canvas
 */
export function resetCanvas(ctx: CanvasRenderingContext2D, width: number, height: number) {
  // Clear the canvas
  ctx.clearRect(0, 0, width, height)
}
