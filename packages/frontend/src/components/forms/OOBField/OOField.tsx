import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import React from 'react'

import { FormField } from '../FormField'
import type { OOBFieldProps } from './OOBField.interface'

/**
 * OOBField Component is an out-of-band verification code input field.
 *
 * It takes a digitCount prop to specify the number of digits in the code.
 * When the code is complete, the handleSubmit function is called with the code.
 *
 * The user can copy and paste values too using their keyboard.
 */
export default React.forwardRef<HTMLDivElement, OOBFieldProps>(function OOBField(
  { digitCount = 6, onSubmit, ...formFieldProps }: OOBFieldProps,
  ref,
) {
  const [code, setCode] = React.useState<string[]>(Array(digitCount).fill(''))
  const [isLoading, setIsLoading] = React.useState(false)
  const inputRefs = React.useRef<(HTMLInputElement | null)[]>([])

  // Handle digitCount prop changes
  React.useEffect(() => {
    inputRefs.current = inputRefs.current.slice(0, digitCount)
    setCode(Array(digitCount).fill(''))
  }, [digitCount])

  // Handle state changes
  const handleChange = (index: number, value: string) => {
    if (!/^\d*$/.test(value)) return // Only allow numeric input

    const newCode = [...code]
    newCode[index] = value.slice(0, 1) // Ensure only one digit is stored
    setCode(newCode)

    if (value !== '' && index < digitCount - 1) {
      inputRefs.current[index + 1]?.focus()
    }

    if (newCode.every((digit) => digit !== '')) {
      handleSubmit(newCode.join(''))
    }
  }

  // Handle keyboard events
  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace' && code[index] === '' && index > 0) {
      inputRefs.current[index - 1]?.focus()
    }
  }

  // Handle paste events
  const handlePaste = (e: React.ClipboardEvent<HTMLInputElement>) => {
    e.preventDefault()
    const pastedData = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, digitCount)
    const newCode = [...code]
    for (let i = 0; i < pastedData.length; i++) {
      newCode[i] = pastedData[i]
    }
    setCode(newCode)
    inputRefs.current[Math.min(pastedData.length, digitCount - 1)]?.focus()

    if (newCode.every((digit) => digit !== '')) {
      handleSubmit(newCode.join(''))
    }
  }

  // Handle form submission
  const handleSubmit = async (verificationCode: string) => {
    setIsLoading(true)
    try {
      await onSubmit?.(verificationCode)
    } catch (_error) {
      // If invalid code, reset the form
      setCode(Array(digitCount).fill(''))
      setIsLoading(false)
    }
  }

  // Render
  return (
    <FormField ref={ref} {...formFieldProps}>
      <Box display="flex" flexDirection="column" alignItems="center" justifyContent="center">
        <Box display="flex" gap={1} mb={2} flexWrap="wrap" justifyContent="center" marginLeft={1.5}>
          {code.map((digit, index) => (
            <TextField
              key={index}
              variant="outlined"
              type="tel"
              autoFocus={index === 0}
              id={`oob-digit-${index}`}
              slotProps={{
                input: {
                  inputProps: {
                    maxLength: 1,
                    inputMode: 'numeric',
                    pattern: '[0-9]*',
                    style: { textAlign: 'center' },
                  },
                },
              }}
              sx={{ width: '3rem', height: '3rem' }}
              value={digit}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e as React.KeyboardEvent<HTMLInputElement>)}
              onPaste={handlePaste}
              inputRef={(el) => (inputRefs.current[index] = el)}
              aria-label={`Digit ${index + 1}`}
              disabled={isLoading}
            />
          ))}
        </Box>
      </Box>
    </FormField>
  )
})
