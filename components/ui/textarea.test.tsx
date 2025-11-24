import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import userEvent from '@testing-library/user-event'
import { Textarea } from './textarea'

describe('Textarea', () => {
  it('renders textarea', () => {
    render(<Textarea />)
    expect(screen.getByRole('textbox')).toBeInTheDocument()
  })

  it('renders textarea with placeholder', () => {
    render(<Textarea placeholder="Enter text here" />)
    const textarea = screen.getByPlaceholderText('Enter text here')
    expect(textarea).toBeInTheDocument()
  })

  it('applies default classes', () => {
    render(<Textarea data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea.className).toContain('min-h-[80px]')
    expect(textarea.className).toContain('border-input')
    expect(textarea.className).toContain('bg-background')
  })

  it('applies custom className', () => {
    render(<Textarea className="custom-textarea-class" data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea.className).toContain('custom-textarea-class')
  })

  it('handles user input', async () => {
    const user = userEvent.setup()
    render(<Textarea placeholder="Type here" />)
    const textarea = screen.getByPlaceholderText('Type here')

    await user.type(textarea, 'Hello, World!')
    expect(textarea).toHaveValue('Hello, World!')
  })

  it('handles disabled state', () => {
    render(<Textarea disabled placeholder="Disabled textarea" />)
    const textarea = screen.getByPlaceholderText('Disabled textarea')
    expect(textarea).toBeDisabled()
    expect(textarea.className).toContain('disabled:opacity-50')
  })

  it('handles rows attribute', () => {
    render(<Textarea rows={5} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('rows', '5')
  })

  it('handles maxLength attribute', () => {
    render(<Textarea maxLength={100} data-testid="textarea" />)
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('maxLength', '100')
  })

  it('passes through other textarea props', () => {
    render(
      <Textarea
        id="test-textarea"
        name="description"
        aria-label="Description field"
        data-testid="textarea"
      />
    )
    const textarea = screen.getByTestId('textarea')
    expect(textarea).toHaveAttribute('id', 'test-textarea')
    expect(textarea).toHaveAttribute('name', 'description')
    expect(textarea).toHaveAttribute('aria-label', 'Description field')
  })

  it('supports ref forwarding', () => {
    const ref = { current: null as HTMLTextAreaElement | null }
    render(<Textarea ref={ref} />)
    expect(ref.current).toBeInstanceOf(HTMLTextAreaElement)
  })

  it('handles value prop for controlled component', () => {
    render(<Textarea value="Controlled value" onChange={() => { }} />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Controlled value')
  })

  it('handles defaultValue prop for uncontrolled component', () => {
    render(<Textarea defaultValue="Default value" />)
    const textarea = screen.getByRole('textbox')
    expect(textarea).toHaveValue('Default value')
  })
})
