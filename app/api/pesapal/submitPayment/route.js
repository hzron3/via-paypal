import axios from 'axios'
import { v4 as uuidv4 } from 'uuid'

export async function POST(req) {
  const { name, amount, phoneNumber, description } = await req.json()
  const token = req.headers.get('Authorization')?.split(' ')[1]

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Authorization token required' }),
      { status: 400, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const paymentUrl =
    'https://cybqa.pesapal.com/pesapalv3/api/Transactions/SubmitOrderRequest'

  const merchantReference = uuidv4()

  const paymentData = {
    id: merchantReference, // Changed from merchant_reference to id
    currency: 'KES', // Changed from currency_code to currency
    amount: parseFloat(amount), // Ensure amount is float
    description,
    callback_url: process.env.CALLBACK_URL,
    notification_id: process.env.PESAPAL_IPN_ID,
    // Adding billing_address as it's required
    billing_address: {
      phone_number: phoneNumber,
      first_name: name.split(' ')[0],
      last_name:
        name.split(' ').length > 1 ? name.split(' ').slice(1).join(' ') : '',
      country_code: 'KE', // Assuming user is in Kenya
    },
  }

  // console.log('Payment Data:', paymentData)

  try {
    const response = await axios.post(paymentUrl, paymentData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Log the full response to understand its structure
    // console.log('Pesapal Response:', response.data)

    // Check for redirect_url in the response
    const { redirect_url, error } = response.data

    if (error) {
      console.error('Error from Pesapal:', error)
      return new Response(
        JSON.stringify({ error: 'Pesapal returned an error: ' + error }),
        { status: 500, headers: { 'Content-Type': 'application/json' } }
      )
    }

    if (!redirect_url) {
      console.error('No redirect URL in response')
      return new Response(
        JSON.stringify({
          error: 'No redirect URL found in the response from Pesapal.',
        }),
        { status: 400, headers: { 'Content-Type': 'application/json' } }
      )
    }

    // console.log('Redirect URL received:', redirect_url)

    return new Response(JSON.stringify({ redirect_url }), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error initiating payment:', error)

    return new Response(
      JSON.stringify({
        error: 'Failed to initiate payment',
        details: error.message,
      }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
