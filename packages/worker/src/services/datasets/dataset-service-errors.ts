/**
 * Custom Error for Invalid Data from Dataset Service
 */
export class InvalidDataError extends Error {
  // The name of the dataset that failed validation
  private dataset: string
  // The row target that failed validation
  private target: object
  // The AJV validation errors that caused the failure
  private avjErrors: Record<string, any>[]

  constructor(
    dataset: string,
    target: object,
    avjErrors: Record<string, any>[] | null | undefined,
  ) {
    super(`Invalid data for dataset "${dataset}"`)
    this.name = 'InvalidDataError'
    this.dataset = dataset
    this.target = target
    this.avjErrors = avjErrors as Record<string, any>[]
  }

  getDataset(): string {
    return this.dataset
  }

  getTarget(): object {
    return this.target
  }

  getValidationErrors(): Record<string, any>[] {
    return this.avjErrors
  }

  toString(): string {
    return `${super.toString()}:\nTarget: ${JSON.stringify(this.target)}:\nErrors: ${JSON.stringify(
      this.avjErrors,
    )}`
  }
}
