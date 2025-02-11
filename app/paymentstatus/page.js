const PaymentStatus = () => {
  return (
    <div className='font-mono min-h-screen mt-48 '>
      <div className='bg-white p-6 rounded-lg shadow-lg max-w-md mx-auto'>
        <div className='flex justify-center w-full'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            width='50'
            height='50'
            viewBox='0 0 100 100'
          >
            <circle
              cx='50'
              cy='50'
              r='48'
              fill='none'
              stroke='#4CAF50'
              strokeWidth='4'
              strokeDasharray='0, 300'
            >
              <animate
                attributeName='stroke-dasharray'
                from='0, 300'
                to='300, 0'
                dur='2s'
                fill='freeze'
              />
            </circle>
            <path
              d='M30 50 L45 65 L70 35'
              fill='none'
              stroke='#4CAF50'
              strokeWidth='4'
              strokeLinecap='round'
              strokeLinejoin='round'
            >
              <animate
                attributeName='stroke-dasharray'
                from='0, 100'
                to='100, 0'
                dur='2s'
                fill='freeze'
              />
            </path>
          </svg>
        </div>
        <h2 className='text-xl text-center py-4  text-black'>
          Payment completed
        </h2>
        <div className='flex py-4'>
          <svg
            xmlns='http://www.w3.org/2000/svg'
            fill='none'
            viewBox='0 0 24 24'
            strokeWidth={1.5}
            stroke='currentColor'
            className='size-6'
          >
            <path
              strokeLinecap='round'
              strokeLinejoin='round'
              d='M9 12h3.75M9 15h3.75M9 18h3.75m3 .75H18a2.25 2.25 0 0 0 2.25-2.25V6.108c0-1.135-.845-2.098-1.976-2.192a48.424 48.424 0 0 0-1.123-.08m-5.801 0c-.065.21-.1.433-.1.664 0 .414.336.75.75.75h4.5a.75.75 0 0 0 .75-.75 2.25 2.25 0 0 0-.1-.664m-5.8 0A2.251 2.251 0 0 1 13.5 2.25H15c1.012 0 1.867.668 2.15 1.586m-5.8 0c-.376.023-.75.05-1.124.08C9.095 4.01 8.25 4.973 8.25 6.108V8.25m0 0H4.875c-.621 0-1.125.504-1.125 1.125v11.25c0 .621.504 1.125 1.125 1.125h9.75c.621 0 1.125-.504 1.125-1.125V9.375c0-.621-.504-1.125-1.125-1.125H8.25ZM6.75 12h.008v.008H6.75V12Zm0 3h.008v.008H6.75V15Zm0 3h.008v.008H6.75V18Z'
            />
          </svg>
          <p>
            orderTrackingId:{''}
            {orderTrackingId}
          </p>
        </div>
        <h4 className='mt-6 '>Transaction Details</h4>
        <div className='mt-4 border rounded-lg'>
          <table className='min-w-full'>
            <tbody>
              <tr className='border-b '>
                <td className='text-gray-700 p-2 border-r '>
                  Amount {`(${transactionDetails.currency})`}
                </td>
                <td className='p-2'>{transactionDetails.amount}</td>
              </tr>
              <tr className='border-b'>
                <td className='text-gray-700 p-2 border-r '>Payment Method</td>
                <td className='p-2'> {transactionDetails.payment_method}</td>
              </tr>
              <tr className='border-b'>
                <td className='text-gray-700 p-2 border-r '>Transaction ID</td>
                <td className='p-2'>{transactionDetails.confirmation_code}</td>
              </tr>
              <tr>
                <td className='text-gray-700 p-2 border-r '>Payment Date</td>
                <td className='p-2'>
                  {new Date(transactionDetails.created_date).toLocaleString()}
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <button className='mt-6 bg-green-600 text-white py-2 px-4 rounded-full inline-block justify-center hover:bg-green-700 transition duration-300'>
          Download Receipt
        </button>
      </div>
    </div>
  )
}
export default PaymentStatus
