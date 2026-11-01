import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Notes } from './notes'

describe('Notes', () => {
    it('renders notes in light mode', () => {
        render(<Notes />)

        const list = screen.getByRole('list')
        expect(list.classList.contains('text-gray-600')).toBe(true)
    })

    it('includes dark mode classes', () => {
        render(<Notes />)

        const list = screen.getByRole('list')
        expect(list.classList.contains('dark:text-gray-400')).toBe(true)
    })
})
