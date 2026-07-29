import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { afterEach, describe, expect, it, vi } from 'vitest'
import App from './App'

afterEach(() => vi.unstubAllGlobals())

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

  it('clears the previous map immediately and offers documented spellings for a missing name', async () => {
    let resolveLookup!: (value: { ok: boolean; json: () => Promise<unknown> }) => void
    const lookup = new Promise<{ ok: boolean; json: () => Promise<unknown> }>((resolve) => {
      resolveLookup = resolve
    })
    const fetchMock = vi.fn()
      .mockReturnValueOnce(lookup)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => ['Jhony', ['Johny', 'Jhon'], [], []],
      })
    vi.stubGlobal('fetch', fetchMock)

    render(<App />)
    fireEvent.click(screen.getByRole('button', { name: /trace a word now/i }))
    fireEvent.change(screen.getByLabelText('TRACE A WORD OR NAME'), { target: { value: 'Jhony' } })
    fireEvent.click(screen.getByRole('button', { name: /trace →/i }))

    expect(screen.queryByLabelText(/etymology ancestry of father/i)).not.toBeInTheDocument()
    expect(screen.getByText(/reading every documented language/i)).toBeInTheDocument()

    resolveLookup({
      ok: true,
      json: async () => ({ error: { code: 'missingtitle', info: 'The page does not exist.' } }),
    })
    await waitFor(() => expect(screen.getByText(/no exact trail for/i)).toBeInTheDocument())
    expect(screen.getByRole('button', { name: /Johny/i })).toBeInTheDocument()
  })
})
