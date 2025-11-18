import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Notes } from './notes'

describe('Notes', () => {
    it('renders notes in light mode', () => {
        render(<Notes isDarkMode={false} />)
        expect(screen.getByRole('list')).toHaveClass('text-gray-600')

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', 'https://github.com/itsubaki/qasm/issues')
        expect(link.className).toContain('text-blue-600')
        expect(link.className).toContain('underline')
    })

    it('renders notes in dark mode', () => {
        render(<Notes isDarkMode={true} />)
        expect(screen.getByRole('list')).toHaveClass('text-gray-400')

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', 'https://github.com/itsubaki/qasm/issues')
        expect(link.className).toContain('text-blue-400')
        expect(link.className).toContain('underline')
    })
})
