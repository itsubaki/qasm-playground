import { describe, it, expect, vi, beforeEach } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Header } from './header'

vi.mock('next-themes', () => ({
    useTheme: () => ({
        theme: mockTheme,
        setTheme: mockSetTheme,
    }),
}))

let mockTheme = 'light'
const mockSetTheme = vi.fn()

describe('Header', () => {
    beforeEach(() => {
        mockTheme = 'light'
        mockSetTheme.mockClear()
    })

    it('renders header in light mode', () => {
        const { container } = render(<Header />)

        expect(screen.getByText('OpenQASM 3.0 Playground')).toBeInTheDocument()
        expect(container.querySelector('.text-gray-900')).not.toBeNull()
        expect(container.querySelector('.bg-white')).not.toBeNull()

        const githubLink = screen.getByRole('link', { name: /source on github/i })
        expect(githubLink).toHaveAttribute('href', 'https://github.com/itsubaki/qasm-playground')
    })

    it('renders header in dark mode', () => {
        mockTheme = 'dark'
        render(<Header />)

        const title = screen.getByText('OpenQASM 3.0 Playground');
        const button = screen.getByRole('button', { name: 'Toggle dark mode' });
        expect(title.className.includes('dark:text-white')).toBe(true);
        expect(button.className.includes('dark:bg-gray-800')).toBe(true);

        const githubLink = screen.getByRole('link', { name: /source on github/i })
        expect(githubLink).toHaveAttribute('href', 'https://github.com/itsubaki/qasm-playground')
    })

    it('toggles dark mode on button click', async () => {
        const user = userEvent.setup()
        render(<Header />)

        const toggleButton = screen.getByRole('button', { name: 'Toggle dark mode' })
        await user.click(toggleButton)

        expect(mockSetTheme).toHaveBeenCalledWith('dark')
    })

    it('toggles dark mode off when already on', async () => {
        mockTheme = 'dark'
        const user = userEvent.setup()
        render(<Header />)

        const toggleButton = screen.getByRole('button', { name: 'Toggle dark mode' })
        await user.click(toggleButton)

        expect(mockSetTheme).toHaveBeenCalledWith('light')
    })

    it('github icon uses correct alt text', () => {
        render(<Header />)
        const img = screen.getByAltText('GitHub')
        expect(img).toBeInTheDocument()
    })
})
