import theme from '@/app/theme'
import { ThemeProvider } from '@emotion/react'
import { composeStories } from '@storybook/react'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import * as stories from './FileField.stories'

const { Default, Multiple, WithFileTypes } = composeStories(stories)

describe('FileField Component', () => {
  it('renders the Default story correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Default {...Default.args} />
      </ThemeProvider>,
    )
    expect(screen.getByPlaceholderText('Select File')).toBeInTheDocument()
    expect(screen.getByText('Click the button to select a file.')).toBeInTheDocument()
  })

  it('renders the Multiple story correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <Multiple {...Multiple.args} />
      </ThemeProvider>,
    )
    expect(screen.getByPlaceholderText('Select Files')).toBeInTheDocument()
  })

  it('renders the WithFileTypes story correctly', () => {
    render(
      <ThemeProvider theme={theme}>
        <WithFileTypes {...WithFileTypes.args} />
      </ThemeProvider>,
    )
    expect(screen.getByPlaceholderText('Select Images')).toBeInTheDocument()
  })

  //   it('calls onChange when a file is selected in Default story', async () => {
  //     const onChangeMock = vi.fn()
  //     render(
  //       <ThemeProvider theme={theme}>
  //         <Default {...Default.args} onChange={onChangeMock} />
  //       </ThemeProvider>,
  //     )
  //     const fileInput = screen.getByPlaceholderText('Select File')
  //     fireEvent.click(fileInput)

  //     // Simulate file selection
  //     const files = new File(['file content'], 'test-file.txt', { type: 'text/plain' })
  //     await Default.args.onOpenFileDialog?.(false, undefined)
  //     expect(onChangeMock).toHaveBeenCalledWith('test-file.txt')
  //   }, 100000) // Increased timeout to 10 seconds
  //   it('calls onChange when multiple files are selected in Multiple story', async () => {
  //     const onChangeMock = vi.fn()
  //     render(
  //       <ThemeProvider theme={theme}>
  //         <Multiple {...Multiple.args} onChange={onChangeMock} />
  //       </ThemeProvider>,
  //     )
  //     const fileInput = screen.getByPlaceholderText('Select Files')
  //     fireEvent.click(fileInput)

  //     // Simulate file selection
  //     const files = [
  //       new File(['file content'], 'file1.txt', { type: 'text/plain' }),
  //       new File(['file content'], 'file2.txt', { type: 'text/plain' }),
  //     ]
  //     await Multiple.args.onOpenFileDialog?.(true, undefined)
  //     expect(onChangeMock).toHaveBeenCalledWith(['file1.txt', 'file2.txt'])
  //   }, 100000) // Increased timeout to 10 seconds

  //   it('filters files by type in WithFileTypes story', async () => {
  //     const onChangeMock = vi.fn()
  //     render(
  //       <ThemeProvider theme={theme}>
  //         <WithFileTypes {...WithFileTypes.args} onChange={onChangeMock} />
  //       </ThemeProvider>,
  //     )
  //     const fileInput = screen.getByPlaceholderText('Select Images')
  //     fireEvent.click(fileInput)

  //     new File(['file content'], 'image.png', { type: 'image/png' })
  //     new File(['file content'], 'document.pdf', { type: 'application/pdf' })
  //     await WithFileTypes.args.onOpenFileDialog?.(true, ['image/png', 'image/jpeg'])
  //     expect(onChangeMock).toHaveBeenCalledWith(['image.png'])
  //   }, 100000)
})
