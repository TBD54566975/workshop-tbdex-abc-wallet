import { CheckCircleIcon, QuestionMarkCircleIcon, EllipsisHorizontalCircleIcon, XCircleIcon } from '@heroicons/react/20/solid'
import { TBD } from '../currency-utils'
import { useContext, useState } from 'react'
import { addClose, addOrder } from '../api-utils'
import { useRecoilState } from 'recoil'
import { balanceState } from '../state'
import { ExchangesContext } from './ExchangesContext'
import { Spinner } from '../common/Spinner'

export const renderActionButtons = (amount, exchangeId, onClose, didState, pfiUri) => {
  const { setExchangesUpdated } = useContext(ExchangesContext)
  const [isUpdating, setIsUpdating] = useState(false)
  const [accountBalance, setAccountBalance] = useRecoilState(balanceState)

  const handleUpdateExchange = async (action) => {
    if (action === 'accept') {
      setIsUpdating(true)
      try {
        await addOrder({ exchangeId, didState, pfiUri })
        setAccountBalance(accountBalance - Number(amount))
        setExchangesUpdated(true)
      } catch (e) {
        setIsUpdating(false)
        console.error(e)
        return
      }
      setIsUpdating(false)
    }
    if (action === 'reject') {
      setIsUpdating(true)
      try {
        await addClose({ exchangeId, didState, pfiUri, reason: 'user cancelled' })
        setAccountBalance(accountBalance - Number(amount))
        setExchangesUpdated(true)
      } catch (e) {
        setIsUpdating(false)
        console.error(e)
        return
      }
      setIsUpdating(false)
    }
    onClose(true)
  }

  return (
      isUpdating ? 
        <div className="m-2 pl-8 pr-8 flex items-center justify-center gap-x-6">
        <Spinner></Spinner>
        </div>
      : <div className="m-2 pl-8 pr-8 flex items-center justify-end gap-x-6">
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
            Pay {TBD(amount).format()}
          </button>
        </div>
  )
}

export const renderStatusInfo = (status) => {
    return (
      <>
        <div className="mt-3 w-5 h-5 bg-white rounded-full flex items-center justify-center focus:outline-none">
          {getStatusIcon(status)}
        </div>
        <div className='mt-2 text-white font-medium'>
          {getStatusText(status)}
        </div>
      </>
    )
}

const getStatusIcon = (status) => {
  switch (status) {
    case 'rfq':
    case 'quote':
    case 'order':
    case 'orderstatus':
      return <EllipsisHorizontalCircleIcon className="absolute h-7 w-7 text-gray-500" />
    case 'completed':
      return <CheckCircleIcon className="absolute h-7 w-7 text-green-500" />
    case 'failed':
    case 'expired': 
      return <XCircleIcon className="absolute h-7 w-7 text-red-600" />
    default:
      return <QuestionMarkCircleIcon className="absolute h-7 w-7 text-gray-500" />
  }
}

const getStatusText = (status) => {
  switch (status) {
    case 'rfq':
      return 'Requested'
    case 'quote':
      return 'Quoted'
    case 'order':
    case 'orderstatus':
      return 'Pending'
    case 'completed':
      return 'Completed'
    case 'expired':
      return 'Expired'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown status'
  }
}
