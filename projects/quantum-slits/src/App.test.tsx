import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it, vi } from 'vitest'
import App from './App'

vi.mock('./visuals/QuantumCanvas', () => ({
  default: () => <div data-testid="quantum-canvas" />,
}))

describe('guided experience', () => {
  it('moves from the geometry to a single detection before introducing interference', () => {
    render(<App />)

    fireEvent.click(screen.getByRole('button', { name: /begin the experiment/i }))
    expect(screen.getByRole('heading', { name: /begin with one opening/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^continue/i }))
    expect(screen.getByRole('heading', { name: /release one piece of light/i })).toBeInTheDocument()

    fireEvent.click(screen.getByRole('button', { name: /^release one$/i }))
    fireEvent.click(screen.getByRole('button', { name: /^continue/i }))
    expect(screen.getByRole('heading', { name: /one slit still spreads possibility/i })).toBeInTheDocument()
  })

  it('opens the short light primer without leaving the experiment', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /begin the experiment/i }))
    fireEvent.click(screen.getByRole('button', { name: /what is light/i }))

    expect(screen.getByRole('dialog', { name: /not a tiny ball/i })).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /return to the experiment/i }))
    expect(screen.getByRole('heading', { name: /begin with one opening/i })).toBeInTheDocument()
  })
})
