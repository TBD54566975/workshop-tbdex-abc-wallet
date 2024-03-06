import { useState, useEffect, useRef } from 'react'
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
import { BearerDid } from '@web5/dids'


async function loadExchanges(did: BearerDid) {
  const fetchedExchanges = []
  const pfis = [
    JSON.parse(localStorage.getItem('pfi_0')).uri,
    JSON.parse(localStorage.getItem('pfi_1')).uri,
    JSON.parse(localStorage.getItem('pfi_2')).uri
  ]
  for (const pfiUri of pfis) {
    const exchanges = await fetchExchanges({ didState: did, pfiDid: pfiUri })
    fetchedExchanges.push(exchanges)
  }
  return fetchedExchanges.flatMap(exchangeGroup => exchangeGroup)
}

export function Exchanges() {
  const [exchanges, setExchanges] = useState(undefined)
  const [selectedExchange, setSelectedExchange] = useState()
  const [did] = useRecoilState(didState)
  const dialogRef = useRef<HTMLDialogElement>(null)
  dayjs.locale('en')

  useEffect(() => {
    const init = async () => {
      try {
        const exchanges = await loadExchanges(did)
        setExchanges(exchanges)
      } catch (e) {
        setExchanges(null)
      }
    }
    if (did) {
      init()
      const pollIntervalId = setInterval(async () => {
        init()// todo: add sorting to push completed to bottom
      }, 5000)
      return () => clearInterval(pollIntervalId)
    }
  }, [did])

  const handleModalOpen = (exchange) => {
    setSelectedExchange(exchange)
    dialogRef.current.showModal()
  }
  const handleModalClose = () => {
    setSelectedExchange(undefined)
  }

  if (exchanges === undefined) {
    return (
      <div className='mt-4'>
        <Spinner />
      </div>
    )
  } 

  if (exchanges === null) {
    return (
      <div className="min-w-0 truncate text-center">
        <h3 className="text-xs font-medium leading-6 text-neutral-100 mt-3">Failed to load</h3>
        <p className="truncate text-xs leading-5 text-gray-500">There was an error trying to loading transactions.</p>
      </div>
    )
  } 

  return (
    <>
      <ToastContainer
        toastClassName='bg-neutral-600 font-gray-300 relative flex p-1 mb-2 min-h-10 rounded-md justify-between overflow-hidden cursor-pointer'
        bodyClassName='text-sm font-white font-med block p-3'
      />
        <div className="sticky top-0 z-1 bg-neutral-800 px-3 py-1.5 text-sm leading-6 text-neutral-200">
          <div className="flex">
            <h3 className="flex-grow pr-2 text-xs text-neutral-100 ml-2 mt-1">Transaction</h3>
            <h3 className="w-1/5 text-xs font-medium leading-6 text-neutral-100 text-right mr-2">Amount</h3>
          </div>
        </div>
        {exchanges.length === 0 ? (
          <div className="min-w-0 truncate text-center">
            <h4 className="text-xs font-medium leading-6 text-neutral-100 mt-3">No transactions found</h4>
            <p className="truncate text-xs leading-5 text-gray-500">Request an exchange.</p>
          </div>
        ) : (
          exchanges.map((exchange, index) => (
            <ExchangeItem key={index} exchange={exchange} handleStatusModalOpen={handleModalOpen}/>
        )))}

        <dialog ref={dialogRef} className='fixed bg-transparent' onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close()
          }
        }} onClose={handleModalClose}>
          { selectedExchange && (
            <ExchangeModal
              exchange={selectedExchange}
              onClose={handleModalClose}
            />
          )}
        </dialog>
    </>
   
  )
}
