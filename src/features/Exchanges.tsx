import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/en' // Import the English locale for dayjs
import { ExchangeItem } from './ExchangeItem'
import { ExchangeModal } from './ExchangeModal'
import { Spinner } from '../common/Spinner'
import { ToastContainer } from 'react-toastify'
import 'react-toastify/dist/ReactToastify.css'

/**
 * This component displays a list of exchange transactions and provides the ability to view
 * details of each exchange in a modal.
 *
 * @returns {JSX.Element} - Returns the Exchanges component.
 */
export function Exchanges() {
  const accountId = localStorage.getItem('accountId')
  const [exchanges, setExchanges] = useState(undefined)
  const [selectedExchange, setSelectedExchange] = useState()
  const [exchangeAwaitingResponse, setExchangeAwaitingResponse] = useState()
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false)
  dayjs.locale('en')

  const contextClass = {
    success: 'bg-blue-600',
    error: 'bg-red-600',
    info: 'bg-gray-600',
    warning: 'bg-orange-400',
    default: 'bg-neutral-900',
    dark: 'bg-neutral-600 font-gray-300',
  }

  useEffect(() => {
    const init = async () => {
      // wait a little bit so we can render a pretty spinner animation
      await new Promise(resolve => setTimeout(() => resolve(undefined), 250)) 
      
      // const fetchedExchanges = await fetchExchanges(accountId)
      setExchanges([])
    }
    init()
  }, [])

  // [kw] todo this is a crude polling implementation
  //      too much state changes going on, could be optimized
  //      feel free to change the interval, 
  //      which is currently set to 11 seconds
  useEffect(() => {
    setTimeout(async () => {
      // const fetchedExchanges = await fetchExchanges(accountId)
      // console.log('polling fetch: ', fetchedExchanges)
      setExchanges([])
    }, 11000)
  }, [exchanges])

  const handleStatusModalOpen = (exchange) => {
    setSelectedExchange(exchange)
    setExchangeModalOpen(true)
  }
  const handleStatusModalClose = (hasSubmitted: boolean) => {
    // await new Promise((resolve) => setTimeout(() => resolve(undefined), 250))
    if (hasSubmitted) {
      setExchangeAwaitingResponse(selectedExchange)
    }
    setExchangeModalOpen(false)
    // console.log('updating the balance')
    // await fetchAccountBalance(accountId)
  }

  if (!exchanges) {
    return (
      <div className='mt-4'>
        <Spinner />
      </div>
    )
  } 

  return (
    <>
      <ToastContainer
        toastClassName={({ type }) => contextClass[type || 'dark'] +
          ' relative flex p-1 mb-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
        }
        bodyClassName={() => 'text-sm font-white font-med block p-3'}
      />
      <div className="overflow-auto max-h-[calc(70vh-4rem)] no-scrollbar" aria-label="Directory">
        <div className="sticky top-0 z-20 border-y border-b-neutral-500 border-t-transparent bg-neutral-800 px-3 py-1.5 text-sm leading-6 text-neutral-200">
          <div className="flex">
            <div className="flex-grow pr-2 text-xs text-neutral-100 ml-2 mt-1">Transaction</div>
            <div className="hidden sm:block w-1/5 text-xs font-medium leading-6 text-neutral-100 pl-2">Date</div>
            <div className="w-1/5 text-xs font-medium leading-6 text-neutral-100 text-right mr-2">Amount</div>
          </div>
        </div>
        {!exchanges || exchanges?.length === 0 ? (
          <div className="min-w-0 truncate text-center pl-3">
            <p className="text-xs font-medium leading-6 text-neutral-100 mt-3">No transactions found</p>
            <p className="truncate text-xs leading-5 text-gray-500">Request a remittance.</p>
          </div>
        ) : (
          exchanges?.map((exchange) => (
            <ExchangeItem key={exchange.id} exchange={exchange} exchangeAwaitingResponse={exchangeAwaitingResponse} setExchangeAwaitingResponse={setExchangeAwaitingResponse} handleStatusModalOpen={handleStatusModalOpen}/>
        )))}

        {exchangeModalOpen && (
          <ExchangeModal
            exchange={selectedExchange}
            isOpen={exchangeModalOpen}
            onClose={handleStatusModalClose}
          />
        )}
      </div>
    </>
   
  )
}
