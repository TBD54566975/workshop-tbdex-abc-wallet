import React, { useState, useEffect, useRef } from 'react'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RfqModal } from './RfqModal.tsx'
import { RfqProvider } from './RfqContext.tsx'
import { Spinner } from '../common/Spinner.tsx'
import { fetchOfferings, isMatchingOffering } from '../apiUtils.js'
import bitcoinIcon from '../assets/bitcoin.svg'
import { Offering } from '@tbdex/http-client'
import { pfiAllowlist } from '../allowlist.ts'
import { credentialsState } from '../state.ts'
import { useRecoilState } from 'recoil'



export function Offerings() {
  const [credentials] = useRecoilState(credentialsState)
  const [offerings, setOfferings] = useState<Offering[]>(undefined)
  const [selectedOffering, setSelectedOffering] = useState<string | undefined>()
  const dialogRef = useRef<HTMLDialogElement>(null)

  useEffect(() => {
    const init = async () => {
      try {
        const fetchedOfferings: Offering[][] = []
        for (const pfi of pfiAllowlist) {
          const offering = await fetchOfferings(pfi.pfiUri)
          
          fetchedOfferings.push(offering)
        }
        setOfferings(fetchedOfferings.flatMap(offering => offering))
      } catch (e) {
        setOfferings(null)
      }
    }
      init()
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
      { offerings.length === 0 ? (
          <div className="min-w-0 truncate text-center">
            <h4 className="text-xs font-medium leading-6 text-neutral-100 mt-3">No offerings found</h4>
            <p className="truncate text-xs leading-5 text-gray-500">Check back later.</p>
          </div>
        ) : (
        <ul role="list" className="divide-y divide-transparent">
          {offerings.map((offering, ind) => (
            <li key={ind} className="py-1">
              <button
                className={`w-full h-full rounded-lg px-4 py-1 flex ${
                  isMatchingOffering(offering, credentials)
                    ? 'hover:bg-neutral-600/20'
                    : 'opacity-50'
                }`}
                onClick={() => handleModalOpen(offering)}
                disabled={!isMatchingOffering(offering, credentials)}
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
                    <p className="text-xs font-medium leading-5 text-neutral-100">
                      { pfiAllowlist.find(pfi => pfi.pfiUri === offering.metadata.from).pfiName }
                    </p>
                    <p className="text-xs font-medium leading-6 text-neutral-100">
                      {offering.data.description}
                    </p>
                    <p className="truncate text-xs leading-5 text-gray-500">
                      {offering.data.payoutUnitsPerPayinUnit} {offering.data.payoutCurrency.currencyCode} for 1 {offering.data.payinCurrency.currencyCode}
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
      )}

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
