import { composeStories } from '@storybook/react'
import '@testing-library/jest-dom'
import { render } from '@testing-library/react'
import * as stories from './EntropyGenerator.stories' // adjust if needed

beforeAll(() => {
  global.Audio = vi.fn().mockImplementation(() => ({
    play: vi.fn(),
    pause: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
  }))

  global.AudioContext = vi.fn().mockImplementation(() => ({
    createGain: () => ({
      gain: { setValueAtTime: vi.fn() },
      connect: vi.fn(),
    }),
    createMediaElementSource: () => ({
      connect: vi.fn(),
    }),
    destination: {},
    resume: vi.fn(),
    suspend: vi.fn(),
  }))
})

const { Default } = composeStories(stories)

describe('EntropyGenerator', () => {
  it('should render canvas', () => {
    const { container } = render(<Default />)
    const canvas = container.querySelector('canvas')

    expect(canvas).toBeInTheDocument()
  })

  //   it('should trigger onChange with entropy when drawing with mouse', async () => {
  //     const onChangeMock = vi.fn()
  //     const { container } = render(<Default onChange={onChangeMock} />)

  //     const canvas = container.querySelector('canvas') as HTMLCanvasElement

  //     fireEvent.pointerDown(canvas!, { clientX: 150, clientY: 150 })
  //     fireEvent.pointerMove(canvas!, { clientX: 160, clientY: 160 })
  //     fireEvent.pointerUp(canvas!)

  //     await waitFor(() => {
  //       expect(onChangeMock).toHaveBeenCalled()
  //       expect(onChangeMock.mock.calls[0][0].length).toBeGreaterThan(0)
  //     })

  //     expect(onChangeMock.mock.calls[0][0]).toEqual(expect.any(String))
  //   })
})
