import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Landing from './Landing'

describe('landing experience', () => {
  it('starts the procedural experience from a user gesture', () => {
    const onDemo = vi.fn()
    render(<Landing onDemo={onDemo} onFile={vi.fn()} />)
    fireEvent.click(screen.getByRole('button', { name: /enter the experience/i }))
    expect(onDemo).toHaveBeenCalledOnce()
    expect(screen.getByText(/nothing is uploaded/i)).toBeInTheDocument()
  })
})
