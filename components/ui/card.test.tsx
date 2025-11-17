import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Card, CardContent } from './card'

describe('Card', () => {
  it('renders card with children', () => {
    render(<Card>Card content</Card>)
    expect(screen.getByText('Card content')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(<Card data-testid="card">Card</Card>)
    const card = screen.getByTestId('card')
    expect(card).toHaveAttribute('data-slot', 'card')
    expect(card.className).toContain('bg-card')
    expect(card.className).toContain('rounded-xl')
    expect(card.className).toContain('shadow-sm')
    expect(card.className).toContain('border')
  })

  it('applies custom className', () => {
    render(<Card className="custom-card-class" data-testid="card">Card</Card>)
    const card = screen.getByTestId('card')
    expect(card.className).toContain('custom-card-class')
  })

  it('passes through other div props', () => {
    render(
      <Card id="test-card" aria-label="Test card">
        Card
      </Card>
    )
    const card = screen.getByLabelText('Test card')
    expect(card).toHaveAttribute('id', 'test-card')
  })
})

describe('CardContent', () => {
  it('renders card content with children', () => {
    render(<CardContent>Content text</CardContent>)
    expect(screen.getByText('Content text')).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(<CardContent data-testid="card-content">Content</CardContent>)
    const content = screen.getByTestId('card-content')
    expect(content).toHaveAttribute('data-slot', 'card-content')
    expect(content.className).toContain('pl-3')
    expect(content.className).toContain('pr-3')
  })

  it('applies custom className', () => {
    render(<CardContent className="custom-content-class" data-testid="card-content">Content</CardContent>)
    const content = screen.getByTestId('card-content')
    expect(content.className).toContain('custom-content-class')
  })

  it('renders Card with CardContent', () => {
    render(
      <Card data-testid="card">
        <CardContent data-testid="card-content">
          Full card with content
        </CardContent>
      </Card>
    )
    const card = screen.getByTestId('card')
    const content = screen.getByTestId('card-content')
    expect(card).toBeInTheDocument()
    expect(content).toBeInTheDocument()
    expect(screen.getByText('Full card with content')).toBeInTheDocument()
  })
})
