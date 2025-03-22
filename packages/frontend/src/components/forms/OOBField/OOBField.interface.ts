import type { FormFieldProps } from '../FormField'

/**
 * OOBField Component Props
 */
export interface OOBFieldProps extends Omit<FormFieldProps, 'onSubmit'> {
  /**
   * Number of digits in the OOB code
   * @default 6
   */
  digitCount?: number
  /**
   * Asyn callback to handle submit when the code is submitted
   * Should throw an error if the code is invalid
   */
  onSubmit?: (verificationCode: string) => Promise<void>
}
