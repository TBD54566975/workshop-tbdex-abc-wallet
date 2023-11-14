import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { ChevronRightIcon } from '@heroicons/react/24/outline'
import { RfqModal } from './RfqModal.tsx'
import { RfqProvider } from './RfqContext.tsx'
import { Flag } from '../common/Flag.tsx'
import { Spinner } from '../common/Spinner.tsx'

/**
 * This component displays a list of remittance offerings for different countries.
 * Users can click on a country to view more details and initiate a remittance request.
 *
 * @returns {JSX.Element} - Returns the RemittanceOfferings component.
 */
export function RemittanceOfferings() {
  const [offerings, setOfferings] = useState()
  const [rfqModalOpen, setRfqModalOpen] = useState(false)
  const [selectedCountry, setSelectedCountry] = useState()
  const navigate = useNavigate()

  useEffect(() => {
    const init = async () => {
      setOfferings(undefined)
    }
    init()
  }, [])

  const handleCountryClick = (country) => {
    setSelectedCountry(country)
    setRfqModalOpen(true)
  }

  const handleModalClose = (hasSubmitted: boolean) => {
    setRfqModalOpen(false)
    if (hasSubmitted) {
      navigate('/')
    } else {
      navigate('/remittance', { state: { selectedCountry } }) // TODO: is this right?
    }
  }

  if (!offerings) return (<Spinner />) 
  
  return (
    <>
      <div className="overflow-auto max-h-[calc(100vh-4rem)] pb-4" aria-label="Directory">
        <ul role="list" className="divide-y divide-transparent">
          {Object.keys(offerings).map(country => (
            <li key={`currency-${country}`} className="py-1">
              <button className="w-full h-full rounded-lg px-4 py-1 hover:bg-neutral-600/20 flex" onClick={() => handleCountryClick(country)}>
                <div className="flex items-center flex-grow pr-2">
                  <div className="flex justify-center items-center w-8 h-8 mt-0.5 rounded-lg bg-neutral-600 text-white text-sm font-semibold">
                    <Flag country={country}/>
                  </div>
                  <div className="min-w-0 truncate text-left pl-3">
                    <p className="text-xs font-medium leading-6 text-neutral-100">{country}</p>
                    <p className="truncate text-xs leading-5 text-gray-500">
                      Pay with {Object.keys(offerings[country]).join(', ')}
                    </p>
                  </div>
                </div>
                <ChevronRightIcon className="h-5 w-5 flex-none text-indigo-600 ml-1 mt-3" aria-hidden="true"/>
              </button>
            </li>
          ))}
        </ul>
      </div>

      {rfqModalOpen && selectedCountry && (
        <RfqProvider offeringsByCountry={offerings[selectedCountry]}>
          <RfqModal country={selectedCountry} isOpen={rfqModalOpen} onClose={handleModalClose} />
        </RfqProvider>
      )}
    </>
  )
}
