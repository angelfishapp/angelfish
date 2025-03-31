import React from 'react'

import { AudioPlayer } from '@/utils/audio.utils'
import type { EntropyGeneratorMethods, EntropyGeneratorProps } from './EntropyGenerator.interface'
import { drawPattern, fadeOut, resetCanvas, updateSeed } from './EntropyGenerator.utils'

/**
 * Entropy Generator Component generates entropy for generating a truly random seed for
 * private key generation using the user's mouse movements.
 *
 * The user creates a glowing Mandala pattern by moving the mouse around the canvas to
 * generate the entropy for a random seed. The code to draw the Mandala pattern is inspired
 * from this blog: https://24ways.org/2018/the-art-of-mathematics
 *
 * The onChange function is called continuously with the generated entropy value as the
 * user draws the pattern which can be used by parent components to determine if the seed
 * is ready (64 characters long) with enough entropy.
 */
export default React.forwardRef<EntropyGeneratorMethods, EntropyGeneratorProps>(
  function EntropyGenerator(
    { size = 300, onChange }: EntropyGeneratorProps,
    ref: React.ForwardedRef<EntropyGeneratorMethods>,
  ) {
    // Get the canvas element ref
    const canvasRef = React.useRef<HTMLCanvasElement | null>(null)
    // Audio player Ref to prevent multiple instances getting created on each render
    const audioPlayerRef = React.useRef<AudioPlayer | null>(null)
    // Hold the entropy seed value
    const seedRef = React.useRef<string>('')
    // Hold the drawing state
    const drawRef = React.useRef<boolean>(false)
    // Hold reference to current mouse X position
    const currXRef = React.useRef<number>(0)
    // Hold reference to previous mouse X position
    const prevXRef = React.useRef<number>(0)
    // Hold reference to current mouse Y position
    const currYRef = React.useRef<number>(0)
    // Hold reference to previous mouse Y position
    const prevYRef = React.useRef<number>(0)

    // Expose methods to parent component Ref Component Methods Forwarding
    React.useImperativeHandle(ref, () => ({
      reset: () => {
        const canvas = canvasRef.current
        if (canvas) {
          const ctx = canvas.getContext('2d')
          if (ctx) {
            resetCanvas(ctx, canvas.width, canvas.height)
            seedRef.current = ''
            drawRef.current = false
            onChange?.('')
          }
        }
      },
    }))

    // Initialise canvas when ready
    React.useEffect(() => {
      const canvas = canvasRef.current
      if (canvas) {
        // Get canvas context
        const ctx = canvas.getContext('2d', {
          willReadFrequently: true,
        }) as CanvasRenderingContext2D
        // Create audio player for sound effects
        if (!audioPlayerRef.current) {
          audioPlayerRef.current = new AudioPlayer('assets/sounds/Underwater.mp3', {
            fadeIn: true,
            fadeOut: true,
            fadeDuration: 0.5,
            loop: true,
          })
        }

        const recordPositions = (e: PointerEvent) => {
          // Update mouse positions
          const rect = canvas.getBoundingClientRect()
          prevXRef.current = currXRef.current
          prevYRef.current = currYRef.current
          currXRef.current = e.clientX - rect.left
          currYRef.current = e.clientY - rect.top
        }

        // Set up canvas event handlers
        canvas.onpointermove = (e) => {
          if (drawRef.current) {
            recordPositions(e)
            drawPattern(
              currXRef.current,
              currYRef.current,
              prevXRef.current,
              prevYRef.current,
              canvas.width,
              canvas.height,
              ctx,
            )
            fadeOut(ctx, canvas.width, canvas.height)
            seedRef.current = updateSeed(seedRef.current, currXRef.current, currYRef.current)
            onChange?.(seedRef.current)
          }
        }
        canvas.onpointerdown = (e) => {
          recordPositions(e)
          drawRef.current = true
          audioPlayerRef.current?.play()
        }
        canvas.onpointerup = () => {
          drawRef.current = false
          audioPlayerRef.current?.stop()
        }
        canvas.onpointerout = () => {
          drawRef.current = false
          audioPlayerRef.current?.stop()
        }

        // Cleanup event listeners
        return () => {
          canvas.onpointermove = null
          canvas.onpointerdown = null
          canvas.onpointerup = null
          canvas.onpointerout = null
        }
      }
    }, [canvasRef, onChange])

    // Render canvas
    return <canvas width={size} height={size} ref={canvasRef} style={{ display: 'block' }}></canvas>
  },
)
