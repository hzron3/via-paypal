import axios from 'axios'

const PESAPAL_IPN_URL =
  'https://cybqa.pesapal.com/pesapalv3/api/URLSetup/RegisterIPN' // Use sandbox URL

export async function POST(req) {
  const token = req.headers.get('Authorization')?.split(' ')[1] // Get the token from the Authorization header
  const ipnUrl = process.env.PESAPAL_IPN_URL // Your IPN URL (must be publicly accessible)

  if (!token) {
    return new Response(
      JSON.stringify({ error: 'Authorization token is required' }),
      { status: 401, headers: { 'Content-Type': 'application/json' } }
    )
  }

  const ipnData = {
    url: ipnUrl,
    ipn_notification_type: 'POST', // Can be POST or GET
  }

  try {
    const response = await axios.post(PESAPAL_IPN_URL, ipnData, {
      headers: {
        Authorization: `Bearer ${token}`,
        'Content-Type': 'application/json',
        Accept: 'application/json',
      },
    })

    // Return the registration response
    return new Response(JSON.stringify(response.data), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    })
  } catch (error) {
    console.error('Error registering IPN URL:', error)
    return new Response(
      JSON.stringify({ error: 'Failed to register IPN URL' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    )
  }
}
