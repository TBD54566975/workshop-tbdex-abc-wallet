import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RfqModal } from './RfqModal.tsx'
import { RfqProvider } from './RfqContext.tsx'
import { Spinner } from '../common/Spinner.tsx'
import { fetchOfferings } from '../apiUtils.js'

export function Offerings() {
  const [offerings, setOfferings] = useState(undefined)
  const [rfqModalOpen, setRfqModalOpen] = useState(false)
  const [selectedOffering, setSelectedOffering] = useState<string | undefined>()
  const navigate = useNavigate()

  useEffect(() => {
    const fetchData = async () => {
      await new Promise((resolve) => setTimeout(resolve, 1000))
      setOfferings(await fetchOfferings())
    }
    fetchData()
  }, [])

  const handleCountryClick = (countryCode) => {
    setSelectedOffering(countryCode)
    setRfqModalOpen(true)
  }

  const handleModalClose = (hasSubmitted: boolean) => {
    setRfqModalOpen(false)
    if (hasSubmitted) {
      navigate('/')
    } else {
      navigate('/exchange', { state: { selectedCountry: selectedOffering } })
    }
  }

  if (!offerings) return <Spinner />

  return (
    <>
      <div
        className="overflow-auto max-h-[calc(100vh-4rem)] pb-4"
        aria-label="Directory"
      >
        <ul role="list" className="divide-y divide-transparent">
          {offerings.map((offering) => (
            <li key={`${offering}`} className="py-1">
              <button
                className="w-full h-full rounded-lg px-4 py-1 hover:bg-neutral-600/20 flex"
                onClick={() => handleCountryClick(offering)}
              >
                <div className="flex items-center flex-grow pr-2">
                  <div className="flex justify-center items-center w-8 h-8 mt-0.5 rounded-lg bg-neutral-600 text-white text-sm font-semibold">
                    $
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
      </div>

      {rfqModalOpen && selectedOffering && (
        <RfqProvider offering={selectedOffering}>
          <RfqModal
            isOpen={rfqModalOpen}
            onClose={handleModalClose}
          />
        </RfqProvider>
      )}
    </>
  )
}
