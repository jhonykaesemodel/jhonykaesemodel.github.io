import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Before Words experience', () => {
  it('enters the reader-paced journey and advances by click', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /begin with one word/i }))
    expect(screen.getByText('A word looks complete.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText('Move one voice backward.')).toBeInTheDocument()
  })

  it('opens a single-word time trace and advances one step backward', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /trace a word now/i }))
    expect(screen.getByLabelText('TRACE A WORD OR NAME')).toHaveValue('father')
    expect(screen.queryByText(/compare with/i)).not.toBeInTheDocument()
    expect(screen.getByLabelText(/travel backward through the word/i)).toHaveValue('0')
    fireEvent.click(screen.getByRole('button', { name: /one step older/i }))
    expect(screen.getByLabelText(/travel backward through the word/i)).toHaveValue('1')
    expect(screen.getByRole('heading', { name: 'fader' })).toBeInTheDocument()
  })
})
