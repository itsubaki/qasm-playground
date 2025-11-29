import { describe, it, expect, vi } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './header'

describe('Header', () => {
    it('renders header in light mode', () => {
        const setIsDarkMode = vi.fn()
        render(<Header setIsDarkMode={setIsDarkMode} />)

        expect(screen.getByText('OpenQASM 3.0 Playground')).toHaveClass('text-gray-900')
        expect(screen.getByRole('button', { name: 'Toggle dark mode' })).toHaveClass('bg-white')
        const githubLink = screen.getByRole('link', { name: /source on github/i })
        expect(githubLink).toHaveAttribute('href', 'https://github.com/itsubaki/qasm-playground')
    })

    it('renders header in dark mode', () => {
        const setIsDarkMode = vi.fn()
        render(<Header isDarkMode={true} setIsDarkMode={setIsDarkMode} />)

        expect(screen.getByText('OpenQASM 3.0 Playground')).toHaveClass('text-white')
        expect(screen.getByRole('button', { name: 'Toggle dark mode' })).toHaveClass('bg-gray-800')
        const githubLink = screen.getByRole('link', { name: /source on github/i })
        expect(githubLink).toHaveAttribute('href', 'https://github.com/itsubaki/qasm-playground')
    })

    it('toggles dark mode on button click', async () => {
        const setIsDarkMode = vi.fn()
        render(<Header isDarkMode={false} setIsDarkMode={setIsDarkMode} />)
        const user = userEvent.setup()
        const toggleButton = screen.getByRole('button', { name: 'Toggle dark mode' })

        await user.click(toggleButton)
        expect(setIsDarkMode).toHaveBeenCalledWith(true)
    })

    it('toggles dark mode off when already on', async () => {
        const setIsDarkMode = vi.fn()
        render(<Header isDarkMode={true} setIsDarkMode={setIsDarkMode} />)
        const user = userEvent.setup()
        const toggleButton = screen.getByRole('button', { name: 'Toggle dark mode' })

        await user.click(toggleButton)
        expect(setIsDarkMode).toHaveBeenCalledWith(false)
    })

    it('github icon uses correct alt text', () => {
        const setIsDarkMode = vi.fn()
        render(<Header isDarkMode={false} setIsDarkMode={setIsDarkMode} />)
        const img = screen.getByAltText('GitHub')
        expect(img).toBeInTheDocument()
    })
})
