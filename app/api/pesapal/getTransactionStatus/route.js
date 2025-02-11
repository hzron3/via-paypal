export async function GET(req) {
  const token = req.headers.get('authorization')?.replace('Bearer ', '')
  const { searchParams } = new URL(req.url)
  const orderTrackingId = searchParams.get('orderTrackingId')
  console.log('Received orderTrackingId:', orderTrackingId)
  console.log('Received token:', token)

  if (!token || !orderTrackingId) {
    return new Response(
      JSON.stringify({ error: 'Missing token or OrderTrackingId' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  try {
    // Call Pesapal's API to check the status
    const pesapalResponse = await fetch(
      `https://cybqa.pesapal.com/pesapalv3/api/Transactions/GetTransactionStatus?orderTrackingId=${orderTrackingId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          Accept: 'application/json',
          'Content-Type': 'application/json',
        },
      }
    )

    if (!pesapalResponse.ok) {
      throw new Error(`Error from Pesapal: ${pesapalResponse.statusText}`)
    }

    // Log full response from Pesapal for debugging
    const data = await pesapalResponse.json()
    console.log('Pesapal Response Data:', data)

    return new Response(
      JSON.stringify({
        payment_status_description: data.payment_status_description,
        ...data, // Spread all the other fields from Pesapal's response
      }),
      {
        status: 200,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  } catch (error) {
    console.error('Error in API call:', error.message)
    return new Response(
      JSON.stringify({
        error: error.message || 'Failed to check transaction status',
      }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
