import React, { useState } from 'react'
import './Form.css'
import axios from 'axios'
import { URL } from '../../consts'

const Form = () => {
  const [inputs, setInputs] = useState(['', '', ''])
  const [results, setResults] = useState([])
  const [error, setError] = useState(null)

  const handleInputChange = (index, event) => {
    const newInputs = [...inputs]
    newInputs[index] = event.target.value
    setInputs(newInputs)
  }

  const addInputField = () => {
    setInputs([...inputs, ''])
  }

  const removeInputField = (index) => {
    if (index >= 3) {
      const newInputs = inputs.filter((_, i) => i !== index)
      setInputs(newInputs)
    }
  }

  const handleSubmit = async (event) => {
    event.preventDefault()
    setError(null)
    setResults([])

    const validInputs = inputs.filter((input) => input.trim() !== '')

    if (validInputs.length < 3) {
      setError('Please enter at least 3 valid URLs.')
      return
    }

    try {
      const { data } = await axios.post(URL, { urls: validInputs })
      setResults(data)
    } catch (err) {
      setError('An error occurred while fetching the metadata. Please try again.')
    }
  }

  return (
    <div className="form-container">
      <form onSubmit={handleSubmit}>
        <div className="info-container">
          <div className="info-text">Example: https://www.example.com</div>
        </div>
        {inputs.map((input, index) => (
          <div key={index} className="input-wrapper">
            {index >= 3 && (
              <button 
                type="button" 
                onClick={() => removeInputField(index)} 
                className="remove-button"
              >
                &times;
              </button>
            )}
            <input
              type="text"
              value={input}
              onChange={(e) => handleInputChange(index, e)}
              placeholder={`Enter URL ${index + 1}`}
            />
          </div>
        ))}
        <button type="button" onClick={addInputField}>
          Add More URLs
        </button>
        <button type="submit">Submit</button>
      </form>

      {error && <div className="error-message" dangerouslySetInnerHTML={{ __html: error }} />}

      <div className="results-container">
        {results.map((result, index) => (
          <div key={index} className="result-item">
            <h3>{result.title || 'No title available'}</h3>
            <p>{result.description || 'No description available'}</p>
            {result.image && <img src={result.image} alt={result.title} />}
            {result.error && <div className="error-message">{result.error}</div>}
          </div>
        ))}
      </div>
    </div>
  )
}

export default Form
