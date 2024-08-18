import React from 'react'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import '@testing-library/jest-dom'
import Form from '../components/Form/Form'
import axios from 'axios'

jest.mock('axios')

describe('Form component', () => {
  test('should render form with initial fields', () => {
    render(<Form />)
    expect(screen.getByPlaceholderText('Enter URL 1')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter URL 2')).toBeInTheDocument()
    expect(screen.getByPlaceholderText('Enter URL 3')).toBeInTheDocument()
  })

  test('should handle input changes', () => {
    render(<Form />)
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://www.example.com' } })
    expect(screen.getByPlaceholderText('Enter URL 1')).toHaveValue('https://www.example.com')
  })

  test('should add and remove input fields', () => {
    render(<Form />)
    fireEvent.click(screen.getByText('Add More URLs'))
    expect(screen.getAllByPlaceholderText(/Enter URL/)).toHaveLength(4)

    fireEvent.click(screen.getByText('×').closest('button'))
    expect(screen.getAllByPlaceholderText(/Enter URL/)).toHaveLength(3)
  })

  test('should show error message for fewer than 3 URLs', async () => {
    render(<Form />)
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://www.example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://www.another-example.com' } })
    fireEvent.click(screen.getByText('Submit'))
    await waitFor(() => {
      expect(screen.getByText('Please enter at least 3 valid URLs.')).toBeInTheDocument()
    })
  })

  test('should show results after successful form submission', async () => {
    const mockData = [
      { title: 'Example Title1', description: 'Example Description1', image: 'example.jpg1' },
      { title: 'Example Title2', description: 'Example Description2', image: 'example.jpg2' },
      { title: 'Example Title3', description: 'Example Description3', image: 'example.jpg3' }
    ]
    axios.post.mockResolvedValue({ data: mockData })

    render(<Form />)
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://www.example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://www.another-example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://www.yetanother-example.com' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText('Example Title1')).toBeInTheDocument()
      expect(screen.getByText('Example Description1')).toBeInTheDocument()
      expect(screen.getByAltText('Example Title1')).toBeInTheDocument()
      expect(screen.getByText('Example Title2')).toBeInTheDocument()
      expect(screen.getByText('Example Description2')).toBeInTheDocument()
      expect(screen.getByAltText('Example Title2')).toBeInTheDocument()
      expect(screen.getByText('Example Title3')).toBeInTheDocument()
      expect(screen.getByText('Example Description3')).toBeInTheDocument()
      expect(screen.getByAltText('Example Title3')).toBeInTheDocument()
    })
  })

  test('should show error message for failed form submission', async () => {
    axios.post.mockRejectedValue(new Error('Network Error'))

    render(<Form />)
    fireEvent.change(screen.getByPlaceholderText('Enter URL 1'), { target: { value: 'https://www.example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter URL 2'), { target: { value: 'https://www.another-example.com' } })
    fireEvent.change(screen.getByPlaceholderText('Enter URL 3'), { target: { value: 'https://www.yetanother-example.com' } })
    fireEvent.click(screen.getByText('Submit'))

    await waitFor(() => {
      expect(screen.getByText('An error occurred while fetching the metadata.')).toBeInTheDocument()
    })
  })
})
