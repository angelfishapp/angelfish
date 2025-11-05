import { action } from '@storybook/addon-actions'
import type { Meta, StoryObj } from '@storybook/react'
import React from 'react'

import { Step, Stepper } from '.'

/**
 * Test Workflow Component
 */

function TestWorkflow({ open = true }: { open: boolean }) {
  const [activeStep, setActiveStep] = React.useState<number>(1)

  return (
    <Stepper
      activeStep={activeStep}
      labels={['Label 1', 'Label 2', 'Label 3', 'Label 4']}
      onClose={() => action('onClose')()}
      onTransitionEnd={() => action('onTransitionEnd')()}
      open={open}
    >
      <Step title="Step 1" nextStep="Step 2" isReady={true} onNext={async () => setActiveStep(2)}>
        Step 1
      </Step>
      <Step title="Step 2" nextStep="Step 3" isReady={true} onNext={async () => setActiveStep(3)}>
        Step 2
      </Step>
      <Step title="Step 3" nextStep="Step 4" isReady={true} onNext={async () => setActiveStep(4)}>
        Step 3
      </Step>
      <Step title="Step 4" nextStep="Finish" isReady={true} onNext={async () => setActiveStep(1)}>
        Step 1
      </Step>
    </Stepper>
  )
}

/**
 * Story Metadata
 */

const meta = {
  title: 'Components/Stepper',
  component: TestWorkflow,
  args: {},
  render: ({ ...args }) => <TestWorkflow open={args.open} />,
} satisfies Meta<typeof TestWorkflow>
export default meta
type Story = StoryObj<typeof meta>

/**
 * Stories
 */

export const Default: Story = {
  args: {
    open: true,
  },
}
