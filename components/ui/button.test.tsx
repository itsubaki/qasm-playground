import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from './button'

describe('Button', () => {
    it('renders button with text', () => {
        render(<Button>Click me</Button>)
        expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument()
    })

    it('applies default variant and size', () => {
        render(<Button>Default</Button>)
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('data-slot', 'button')
    })

    it('applies variant prop correctly', () => {
        const { rerender } = render(<Button variant="outline">Outline</Button>)
        let button = screen.getByRole('button')
        expect(button.className).toContain('border')

        rerender(<Button variant="ghost">Ghost</Button>)
        button = screen.getByRole('button')
        expect(button.className).toContain('hover:bg-accent')
    })

    it('applies custom className', () => {
        render(<Button className="custom-class">Custom</Button>)
        const button = screen.getByRole('button')
        expect(button.className).toContain('custom-class')
    })

    it('handles disabled state', () => {
        render(<Button disabled>Disabled</Button>)
        const button = screen.getByRole('button')
        expect(button).toBeDisabled()
        expect(button.className).toContain('disabled:opacity-50')
    })

    it('passes through other button props', () => {
        const handleClick = () => { /* noop */ }
        render(
            <Button onClick={handleClick} type="submit" aria-label="Submit button">
                Submit
            </Button>
        )
        const button = screen.getByRole('button')
        expect(button).toHaveAttribute('type', 'submit')
        expect(button).toHaveAttribute('aria-label', 'Submit button')
    })
})
