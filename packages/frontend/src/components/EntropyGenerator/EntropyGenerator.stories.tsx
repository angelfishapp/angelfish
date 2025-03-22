import Button from '@mui/material/Button'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { EntropyGenerator } from '.'
import type { EntropyGeneratorMethods } from './EntropyGenerator.interface'

const meta = {
  title: 'Components/Entropy Generator',
  component: EntropyGenerator,
  args: {},
  render: ({ ...args }) => {
    const RenderComponent = () => {
      const { onChange, ref, ...restArgs } = args
      const seedValueRef = React.useRef<HTMLDivElement>(null)
      const methodsRef = React.useRef<EntropyGeneratorMethods | null>(null)
      return (
        <React.Fragment>
          <div ref={seedValueRef}>Generating Seed Value...</div>
          <EntropyGenerator
            ref={methodsRef}
            onChange={(seed: string) => {
              if (seedValueRef.current) {
                seedValueRef.current.innerText = seed
              }
            }}
            {...restArgs}
          />
          <Button
            onClick={() => {
              methodsRef.current?.reset()
            }}
          >
            Reset
          </Button>
        </React.Fragment>
      )
    }
    return <RenderComponent />
  },
} satisfies Meta<typeof EntropyGenerator>
export default meta
type Story = StoryObj<typeof meta>

export const Default: Story = {
  args: {
    size: 500,
  },
}
