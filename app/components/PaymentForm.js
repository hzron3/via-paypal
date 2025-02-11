'use client'
import React, { useState } from 'react'

const PaymentForm = () => {
  const [formData, setFormData] = useState({
    name: '',
    amount: '',
    phoneNumber: '',
    description: '',
  })

  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const [redirectUrl, setRedirectUrl] = useState(null) // For modal redirection
  const [isModalOpen, setIsModalOpen] = useState(false) // For controlling modal visibility

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData((prevState) => ({
      ...prevState,
      [name]: value,
    }))
  }

  const validateForm = () => {
    if (!formData.name.trim()) return 'Please enter your full name.'
    if (
      !formData.amount ||
      isNaN(formData.amount) ||
      parseFloat(formData.amount) <= 0
    )
      return 'Please enter a valid amount in KES.'
    if (!formData.phoneNumber.trim()) return 'Please enter your phone number.'
    if (!formData.description.trim())
      return 'Please provide a payment description.'
    return null
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    const validationError = validateForm()
    if (validationError) {
      console.log('Validation Error:', validationError)
      setError(validationError)
      setLoading(false)
      return
    }

    try {
      const tokenResponse = await fetch('/api/pesapal/getPesapalToken', {
        method: 'POST',
      })
      const tokenData = await tokenResponse.json()
      console.log(`Get Status API: ${tokenData.token}`)

      if (!tokenData.token) {
        console.error('Token Fetch Error:', 'No token received')
        setError('Unable to fetch authentication token.')
        return
      }
      localStorage.setItem('pesapalToken', tokenData.token)
      const response = await fetch('/api/pesapal/submitPayment', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${tokenData.token}`,
        },
        body: JSON.stringify(formData),
      })

      const result = await response.json()

      console.log('Payment Submission Result:', result)

      // Check for errors in response
      if (result.error) {
        console.error('Payment Submission Error:', result.error)
        setError(result.error)
      } else if (result.redirect_url) {
        console.log('Redirect URL received:', result.redirect_url)
        setRedirectUrl(result.redirect_url)
        setIsModalOpen(true) // Open the modal when the URL is received
      } else {
        console.error('Unexpected response:', result)
        setError('Payment initiation failed')
      }
    } catch (error) {
      console.error('Payment initiation error:', error)
      setError('An error occurred while initiating payment. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const closeModal = () => {
    setIsModalOpen(false)
    setRedirectUrl(null)
  }

  return (
    <div className='mt-48 max-w-xl mx-auto p-6 bg-white shadow-lg rounded-lg'>
      <h2 className='text-2xl font-semibold text-center text-gray-700 mb-6'>
        Payment Form
      </h2>
      <form onSubmit={handleSubmit} className='space-y-4'>
        {error && <div className='text-red-500 text-center mb-4'>{error}</div>}

        {/* Name Input */}
        <div>
          <label
            htmlFor='name'
            className='block text-sm font-medium text-gray-700'
          >
            Full Name
          </label>
          <input
            type='text'
            id='name'
            name='name'
            value={formData.name}
            onChange={handleChange}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>

        {/* Amount Input */}
        <div>
          <label
            htmlFor='amount'
            className='block text-sm font-medium text-gray-700'
          >
            Amount (KES)
          </label>
          <input
            type='number'
            id='amount'
            name='amount'
            value={formData.amount}
            onChange={handleChange}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>

        {/* Phone Number Input */}
        <div>
          <label
            htmlFor='phoneNumber'
            className='block text-sm font-medium text-gray-700'
          >
            Phone Number
          </label>
          <input
            type='tel'
            id='phoneNumber'
            name='phoneNumber'
            value={formData.phoneNumber}
            onChange={handleChange}
            required
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>

        {/* Description Input */}
        <div>
          <label
            htmlFor='description'
            className='block text-sm font-medium text-gray-700'
          >
            Payment Description
          </label>
          <textarea
            id='description'
            name='description'
            value={formData.description}
            onChange={handleChange}
            required
            rows='3'
            className='mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm'
          />
        </div>

        <div className='text-center'>
          <button
            type='submit'
            className='w-full mt-4 px-6 py-3 bg-blue-600 text-white font-semibold rounded-md shadow-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2'
            disabled={loading}
          >
            {loading ? 'Processing...' : 'Pay Now'}
          </button>
        </div>
      </form>

      {/* Modal for payment processing */}
      {isModalOpen && (
        <div className='fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center'>
          <div className='bg-white rounded-lg p-6 max-w-5xl w-full'>
            <button
              onClick={closeModal}
              className='absolute top-2 right-2 text-gray-600'
            >
              X
            </button>
            <iframe
              title='Pesapal Payment'
              src={redirectUrl}
              style={{ width: '100%', height: '600px', border: 'none' }}
            />
          </div>
        </div>
      )}
    </div>
  )
}

export default PaymentForm
