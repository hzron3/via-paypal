import { NextResponse } from 'next/server'

// Function to simulate updating the payment status in your database or system
async function updatePaymentStatus(orderTrackingId, paymentStatus) {
  // Replace with actual logic to update your system (e.g., database update)
  console.log(
    `Updating payment status for ${orderTrackingId} to ${paymentStatus}`
  )
  // Example: await db.updatePaymentStatus(orderTrackingId, paymentStatus);
}

// This API receives the payment status and updates the system
export async function POST(req) {
  let body
  try {
    body = await req.json()
  } catch (error) {
    console.error('Error parsing JSON:', error)
    return NextResponse.json({ error: 'Invalid JSON payload' }, { status: 400 })
  }

  const { paymentStatus, orderTrackingId } = body

  if (!orderTrackingId || !paymentStatus) {
    return NextResponse.json(
      { error: 'Missing required fields' },
      { status: 400 }
    )
  }

  try {
    await updatePaymentStatus(orderTrackingId, paymentStatus)
    console.log(
      `Payment status for order ${orderTrackingId} updated to ${paymentStatus}`
    )

    return NextResponse.json(
      { message: 'Payment status updated successfully' },
      { status: 200 }
    )
  } catch (error) {
    console.error('Error updating payment status:', error)
    return NextResponse.json(
      { error: 'Error updating payment status' },
      { status: 500 }
    )
  }
}
