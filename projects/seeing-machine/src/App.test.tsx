import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('experience navigation', () => {
  it('enters the reader-paced journey', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /begin looking/i }))
    expect(screen.getByText(/seeing feels complete/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /continue/i })).toBeInTheDocument()
  })
})
