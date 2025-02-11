import axios from 'axios'

const PESAPAL_AUTH_URL =
  'https://cybqa.pesapal.com/pesapalv3/api/Auth/RequestToken'
const CONSUMER_KEY = process.env.PESAPAL_CONSUMER_KEY
const CONSUMER_SECRET = process.env.PESAPAL_CONSUMER_SECRET

export async function POST(req, res) {
  // Check if credentials are missing
  if (!CONSUMER_KEY || !CONSUMER_SECRET) {
    console.error('Missing Consumer Key or Consumer Secret.')
    return new Response(
      JSON.stringify({ error: 'Missing Consumer Key or Consumer Secret.' }),
      {
        status: 400,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }

  try {
    // Send the consumer_key and consumer_secret as JSON payload
    const response = await axios.post(
      PESAPAL_AUTH_URL,
      {
        consumer_key: CONSUMER_KEY,
        consumer_secret: CONSUMER_SECRET,
      },
      {
        headers: {
          'Content-Type': 'application/json',
          Accept: 'application/json',
        },
      }
    )

    // Return the token received in the response
    return new Response(JSON.stringify({ token: response.data.token }), {
      status: 200,
      headers: {
        'Content-Type': 'application/json',
      },
    })
  } catch (error) {
    // Check for specific authentication error
    if (error.response && error.response.data.error) {
      const { error_type, message } = error.response.data.error
      if (
        error_type === 'authentication_error' &&
        message === 'Invalid Access Token'
      ) {
        console.error('Authentication error: Invalid Access Token')
      }
    }

    return new Response(
      JSON.stringify({ error: 'Failed to fetch token from Pesapal' }),
      {
        status: 500,
        headers: {
          'Content-Type': 'application/json',
        },
      }
    )
  }
}
