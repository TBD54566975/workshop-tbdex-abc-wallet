import React, { useEffect, useState } from 'react'
import { money, USD, BTC, removeTrailingZeros } from '../currency-utils'
import { toast } from 'react-toastify'
import dayjs from 'dayjs'
import 'dayjs/locale/en'
import 'react-toastify/dist/ReactToastify.css'
import { Spinner } from '../common/Spinner'

type ExchangeItemProps = {
  exchange: any
  exchangeAwaitingResponse: any
  setExchangeAwaitingResponse: (exchange: any) => void
  handleStatusModalOpen: (exchange: any) => void
}

/**
 * This component represents an individual item in a list of exchanges.
 *
 * @param {Object} props.exchange - The exchange object.
 * @param {Function} props.handleStatusModalOpen - A function to handle opening a status modal for the exchange.
 * @returns {JSX.Element} - Returns an individual exchange item component.
 */
export function ExchangeItem(props: ExchangeItemProps) {
  const [statusValue, setStatusValue] = useState()
  dayjs.locale('en')

  useEffect(() => {
    if (statusValue) {
      toast(getStatusString(props.exchange), {
        toastId: props.exchange.id + props.exchange.status.value,
        position: 'top-left',
        autoClose: 3000,
        hideProgressBar: true,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: 'dark',
      })
    }
    setStatusValue(props.exchange.status.value)
    props.setExchangeAwaitingResponse(null)
  }, [props.exchange.status.value])

  const getStatusString = (exchange) => {
    switch (exchange.status.name) {
      case 'EX_PROCESSING':
        return 'Payment processing...'
      case 'EX_REQUESTED':
        return `Requested ${money(exchange.amounts.base).format()} ${props.exchange.amounts.baseCurrency}`
      case 'EX_QUOTED':
        return `Quoted ${money(exchange.amounts.base).format()} ${props.exchange.amounts.baseCurrency}`
      case 'EX_SUBMITTED':
        return `Payment for ${money(exchange.amounts.base).format()} ${props.exchange.amounts.baseCurrency} submitted`
      case 'EX_COMPLETED':
        return `Sent ${money(exchange.amounts.base).format()} ${props.exchange.amounts.baseCurrency}`
      case 'EX_EXPIRED':
        return `Quote for ${money(exchange.amounts.base).format()} ${props.exchange.amounts.baseCurrency} expired`
      case 'EX_FAILED':
        return `Payment for ${money(exchange.amounts.base).format()} ${props.exchange.amounts.baseCurrency} failed`
      default:
        return 'Unknown status'
    }
  }

  return (
    <>
    <li className="flex py-1">
        <button className="w-full h-full rounded-lg px-4 py-1 hover:bg-neutral-600/20 flex" onClick={() => props.handleStatusModalOpen(props.exchange)}>
          <div className="flex items-center flex-grow pr-2">
            <div className="flex justify-center items-center w-8 h-8 mt-1 rounded-full bg-indigo-600 text-white text-sm font-semibold">
              {props.exchange.firstName.charAt(0).toUpperCase()}
            </div>
            <div className="min-w-0 truncate text-left pl-3">
              <p className="text-xs font-medium leading-6 text-neutral-100">{props.exchange.firstName} {props.exchange.lastName}</p>
              <p className="truncate text-xs leading-5 text-gray-500">{getStatusString(props.exchange)}</p>
            </div>
          </div>
          { props.exchangeAwaitingResponse && props.exchangeAwaitingResponse.id === props.exchange.id && props.exchange.status.value === 110 ? (
              <div className='mt-2'>
                <Spinner />
              </div>
          ) : props.exchange.status.value === 110 ? (
            <>
              <div className="hidden sm:block w-1/5 text-xs font-medium leading-6 text-justify pt-2 text-neutral-100 ">{dayjs(props.exchange.createdTime).format('MMM D, YYYY')}</div>
              <div className="w-1/5 flex items-center justify-end">
                <div className="h-auto w-auto mt-1.5 p-2 rounded-lg bg-neutral-700 text-white text-xs flex items-center justify-center">Review</div>
              </div>
            </>
          ) : props.exchange.status.value <= 310 ? (
            <>
              <div className="hidden sm:block w-1/5 text-xs font-medium leading-6 text-justify pt-2 text-neutral-100 ">&nbsp;{dayjs(props.exchange.createdTime).format('MMM D, YYYY')}</div>
              <div className="w-1/5 text-xs font-medium leading-6 text-right pt-2 mr-1 text-gray-500">
                {props.exchange.amounts.quoteCurrency === 'BTC'
                  ? removeTrailingZeros(BTC(props.exchange.amounts.quote).format())
                  : USD(props.exchange.amounts.quote).format()}
              </div>
            </>
          ) : 
            <div className="w-1/5 text-xs font-medium leading-6 text-right pt-2 mr-1 text-neutral-100"></div>
          }
        </button>
      </li>
    </>
  )
}
