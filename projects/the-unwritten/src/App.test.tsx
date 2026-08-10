import {fireEvent, render, screen} from '@testing-library/react'
import {describe, expect, it} from 'vitest'
import App from './App'

describe('The Unwritten experience', () => {
  it('starts the reader-paced story and advances with the arrow key', () => {
    render(<App/>)
    fireEvent.click(screen.getByRole('button', {name: /begin at the lit edge/i}))
    expect(screen.getByRole('heading', {name: /history we can read/i})).toBeInTheDocument()
    fireEvent.keyDown(window, {key: 'ArrowRight'})
    expect(screen.getByRole('heading', {name: /final 1.7%/i})).toBeInTheDocument()
  })

  it('opens the atlas directly and changes scale', () => {
    render(<App/>)
    fireEvent.click(screen.getByRole('button', {name: /open the evidence atlas/i}))
    expect(screen.getByRole('heading', {name: /move through what remains/i})).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', {name: /human family/i}))
    expect(screen.getByRole('button', {name: /long before us, someone walked/i})).toBeInTheDocument()
  })

  it('exposes sources and model limits', () => {
    render(<App/>)
    fireEvent.click(screen.getByRole('button', {name: /evidence & limits/i}))
    expect(screen.getByRole('dialog')).toHaveTextContent(/not a single source of truth/i)
    expect(screen.getByRole('link', {name: /jebel irhoud dating/i})).toHaveAttribute('href', 'https://www.nature.com/articles/nature22335')
  })
})
