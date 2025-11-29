import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Notes } from './notes'

describe('Notes', () => {
    it('renders notes in light mode', () => {
        render(<Notes />)

        const list = screen.getByRole('list')
        expect(list.classList.contains('text-gray-600')).toBe(true)

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', 'https://github.com/itsubaki/qasm/issues')
        expect(link.classList.contains('text-blue-600')).toBe(true)
    })

    it('renders notes in dark mode', () => {
        render(<Notes />)

        const list = screen.getByRole('list')
        expect(list.classList.contains('dark:text-gray-400')).toBe(true)

        const link = screen.getByRole('link')
        expect(link).toHaveAttribute('href', 'https://github.com/itsubaki/qasm/issues')
        expect(link.className.includes('text-blue-400')).toBe(true)
    })
})
