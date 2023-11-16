import { CheckCircleIcon, QuestionMarkCircleIcon, EllipsisHorizontalCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { TBD, BTC, removeTrailingZeros } from '../currency-utils'
import { useState } from 'react'

/**
 * Render action buttons based on the exchange status.
 *
 * @param {Object} status - The status object for the exchange.
 * @param {number} amount - The amount of the exchange.
 * @param {string} currency - The currency of the exchange (e.g., 'USDC' or 'BTC').
 * @param {string} accountId - The account ID associated with the exchange.
 * @param {string} id - The ID of the exchange.
 * @param {Function} onClose - A function to handle the modal close event.
 * @returns {JSX.Element|null} - Returns the action buttons JSX element if applicable; otherwise, null.
 */
export const renderActionButtons = (status, amount, currency, id, onClose) => {
  const isUSDC = currency === 'USDC'
  const [isUpdating, setIsUpdating] = useState(false)

  const handleUpdateExchange = async (action) => {
    onClose(true)
    setIsUpdating(true)
    // await updateExchange(accountId, id, action, () => {
    //   setIsUpdating(false)
    // })
  }

  if (status.value === 110) {
    return (
      <div className="mt-2 pl-8 pr-8 flex items-center justify-end gap-x-6">
        <button
          type="button"
          className="text-sm font-semibold leading-6 text-white"
          onClick={() => handleUpdateExchange('reject')}
          disabled={isUpdating}
        >
          Reject
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-500 px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={() => handleUpdateExchange('accept')}
          disabled={isUpdating}
        >
          Pay {isUSDC ? TBD(amount).format() : removeTrailingZeros(BTC(amount).format())}
        </button>
      </div>
    )
  } else {
    return null
  }
}

/**
 * Render status information based on the exchange status.
 *
 * @param {Object} status - The status object for the exchange.
 * 
 * @returns {JSX.Element|null} - Returns the status information JSX element if applicable; otherwise, null.
 */
export const renderStatusInfo = (status) => {
  if (status.value !== 110) {
    return (
      <>
        <div className="mt-3 w-5 h-5 bg-white rounded-full flex items-center justify-center focus:outline-none">
          {getStatusIcon(status.value)}
        </div>
        <div className='mt-2 text-white font-medium'>
          {getStatusText(status.name)}
        </div>
      </>
    )
  } else {
    return null
  }
}

const getStatusIcon = (statusValue) => {
  let statusIcon = null

  switch (statusValue) {
    case 100:
    case 120:
    case 130:
      statusIcon = <EllipsisHorizontalCircleIcon className="absolute h-7 w-7 text-gray-500" />
      break
    case 200:
      statusIcon = <CheckCircleIcon className="absolute h-7 w-7 text-green-500" />
      break
    case 210:
    case 220: 
    case 300:
    case 310:
      statusIcon = <XCircleIcon className="absolute h-7 w-7 text-red-600" />
      break
    default:
      statusIcon = <QuestionMarkCircleIcon className="absolute h-7 w-7 text-gray-500" />
      break 
  }

  return statusIcon
}

const getStatusText = (statusName) => {
  let statusText = null

  switch (statusName) {
    case 'EX_REQUESTED':
      statusText = 'Requested'
      break
    case 'EX_QUOTED':
      statusText = 'Quoted'
      break
    case 'EX_PROCESSING':
    case 'EX_SUBMITTED':
      statusText = 'Pending'
      break
    case 'EX_COMPLETED':
      statusText = 'Completed'
      break
    case 'EX_EXPIRED':
    case 'EX_FAILED':
      statusText = 'Failed'
      break
    default:
      statusText = 'Unknown status'
      break
  }

  return (
    <div>
      {statusText}
    </div>
  )
}
