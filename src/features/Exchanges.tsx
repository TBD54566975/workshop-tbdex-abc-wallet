import { useState, useEffect } from 'react'
import dayjs from 'dayjs'
import 'dayjs/locale/en' // Import the English locale for dayjs
import { ExchangeItem } from './ExchangeItem'
import { ExchangeModal } from './ExchangeModal'
import { Spinner } from '../common/Spinner'
import { ToastContainer } from 'react-toastify'
import { fetchExchanges } from '../apiUtils'
import 'react-toastify/dist/ReactToastify.css'
import { useRecoilState } from 'recoil'
import { didState } from '../state'

/**
 * This component displays a list of exchange transactions and provides the ability to view
 * details of each exchange in a modal.
 *
 * @returns {JSX.Element} - Returns the Exchanges component.
 */
export function Exchanges() {
  const [exchanges, setExchanges] = useState(undefined)
  const [selectedExchange, setSelectedExchange] = useState()
  const [exchangeModalOpen, setExchangeModalOpen] = useState(false)
  const [did] = useRecoilState(didState)
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
      
      const fetchedExchanges = await fetchExchanges(did)
      setExchanges(fetchedExchanges.reverse())
    }
    init()
  }, [])

  // [kw] todo this is a crude polling implementation
  //      too much state changes going on, could be optimized
  //      feel free to change the interval, 
  //      which is currently set to 11 seconds
  useEffect(() => {
    // TODO: make sure fetching newly created exchanges work now that backend is removed
    const pollIntervalId = setInterval(async () => {
      const fetchedExchanges = await fetchExchanges(did)
      setExchanges(fetchedExchanges.reverse()) // todo: add sorting to push completed to bottom
    }, 5000)
    return () => clearInterval(pollIntervalId)
  }, [])

  const handleStatusModalOpen = (exchange) => {
    setSelectedExchange(exchange)
    setExchangeModalOpen(true)
  }
  const handleStatusModalClose = () => {
    setExchangeModalOpen(false)
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
        <div className="sticky top-0 z-1 border-y border-b-neutral-500 border-t-transparent bg-neutral-800 px-3 py-1.5 text-sm leading-6 text-neutral-200">
          <div className="flex">
            <div className="flex-grow pr-2 text-xs text-neutral-100 ml-2 mt-1">Transaction</div>
            <div className="w-1/5 text-xs font-medium leading-6 text-neutral-100 text-right mr-2">Amount</div>
          </div>
        </div>
        {exchanges.length === 0 ? (
          <div className="min-w-0 truncate text-center">
            <p className="text-xs font-medium leading-6 text-neutral-100 mt-3">No transactions found</p>
            <p className="truncate text-xs leading-5 text-gray-500">Request an exchange.</p>
          </div>
        ) : (
          exchanges.map((exchange, index) => (
            <ExchangeItem key={index} exchange={exchange} handleStatusModalOpen={handleStatusModalOpen}/>
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
