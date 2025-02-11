// Home.js
'use client'

import PaymentForm from './components/PaymentForm'

export default function Home() {
  const handlePayment = (data) => {
    console.log('Payment data', data)
    // Example: fetch('/api/pesapal/initiatePayment', { method: 'POST', body: JSON.stringify(data) });
  }

  return (
    <div>
      <PaymentForm onSubmit={handlePayment} />
    </div>
  )
}
