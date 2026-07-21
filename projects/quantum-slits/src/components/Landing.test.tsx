import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import Landing from './Landing'

describe('landing', () => {
  it('offers both the guided experiment and laboratory', () => {
    const onBegin = vi.fn()
    const onLab = vi.fn()
    render(<Landing onBegin={onBegin} onLab={onLab} />)
    fireEvent.click(screen.getByRole('button', { name: /begin the experiment/i }))
    expect(onBegin).toHaveBeenCalledOnce()
    expect(screen.getByRole('button', { name: /open laboratory/i })).toBeInTheDocument()
  })
})
