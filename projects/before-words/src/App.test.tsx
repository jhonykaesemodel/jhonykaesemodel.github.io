import { fireEvent, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import App from './App'

describe('Before Words experience', () => {
  it('enters the reader-paced journey and advances by click', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /begin with one word/i }))
    expect(screen.getByText('A word looks complete.')).toBeInTheDocument()
    fireEvent.click(screen.getByRole('button', { name: /continue/i }))
    expect(screen.getByText('But another word is underneath.')).toBeInTheDocument()
  })

  it('opens the laboratory directly with the comparison instrument', () => {
    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /open the ancestry map/i }))
    expect(screen.getByLabelText('TRACE A WORD OR NAME')).toHaveValue('father')
    expect(screen.getByLabelText('COMPARE WITH')).toHaveValue('paternal')
    expect(screen.getByText('NEAREST SHARED FORM')).toBeInTheDocument()
  })
})
