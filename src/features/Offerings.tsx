import React, { useState, useEffect, useRef } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RfqModal } from './RfqModal.tsx'
import { RfqProvider } from './RfqContext.tsx'
import { Spinner } from '../common/Spinner.tsx'
import { fetchOfferings } from '../apiUtils.js'
import bitcoinIcon from '../assets/bitcoin.svg'

export function Offerings() {
  const [offerings, setOfferings] = useState(undefined)
  const [selectedOffering, setSelectedOffering] = useState<string | undefined>()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const fetchData = async () => {
      try {
        setOfferings(await fetchOfferings())
      } catch (e) {
        setOfferings(null)
      }
    }
    fetchData()
  }, [])

  const handleModalOpen = (offering) => {
    setSelectedOffering(offering)
    dialogRef.current?.showModal()
  }

  const handleModalClose = () => {
    setSelectedOffering(undefined)
  }

  if (offerings === undefined) return <Spinner />

  if (offerings === null) {
    return (
      <div className="min-w-0 truncate text-center">
        <h3 className="text-xs font-medium leading-6 text-neutral-100 mt-3">Failed to load</h3>
        <p className="truncate text-xs leading-5 text-gray-500">There was an error trying to loading offerings.</p>
      </div>
    )
  } 


  return (
    <>
        <ul role="list" className="divide-y divide-transparent">
          {offerings.map((offering, ind) => (
            <li key={ind} className="py-1">
              <button
                className="w-full h-full rounded-lg px-4 py-1 hover:bg-neutral-600/20 flex"
                onClick={() => handleModalOpen(offering)}
              >
                <div className="flex items-center flex-grow pr-2">
                  <div className="flex justify-center items-center w-8 h-8 mt-0.5 rounded-lg bg-neutral-600 text-white text-sm font-semibold">
                    <img
                        src={bitcoinIcon}
                        alt="bitcoin icon"
                        style={{ filter: 'var(--color-primary-yellow-filter)' }}
                      />
                  </div>
                  <div className="min-w-0 truncate text-left pl-3">
                    <p className="text-xs font-medium leading-6 text-neutral-100">
                      {offering.description}
                    </p>
                    <p className="truncate text-xs leading-5 text-gray-500">
                      {offering.payoutUnitsPerPayinUnit} {offering.payoutCurrency.currencyCode} for 1 {offering.payinCurrency.currencyCode}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon
                  className="h-5 w-5 flex-none text-indigo-600 ml-1 mt-3"
                  aria-hidden="true"
                />
              </button>
            </li>
          ))}
        </ul>

        <dialog ref={dialogRef} className='fixed bg-transparent' onClick={(e) => {
          if (e.target === dialogRef.current) {
            dialogRef.current.close()
          }
        }} onClose={handleModalClose}>
          { selectedOffering && (
            <RfqProvider offering={selectedOffering}>
              <RfqModal onClose={handleModalClose}/>
            </RfqProvider>
          )}
        </dialog>

    </>
  )
}
