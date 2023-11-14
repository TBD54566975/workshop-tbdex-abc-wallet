import React, { useContext, useState } from 'react'
import { getNames } from 'country-list'
import { RfqContext } from './RfqContext'
import { Dropdown } from '../common/Dropdown'
import { NextButton } from '../common/NextButton'

type RecipientCountryFormProps = {
  country: string
  onBack: () => void
  onNext: () => void
}

/**
 * This component represents a form for selecting the recipient's country.
 *
 * @param {Function} props.onBack - A function to go back to the previous step.
 * @param {Function} props.onNext - A function to proceed to the next step.
 * @returns {JSX.Element} - Returns the RecipientCountryForm component.
 */
export function RecipientCountryForm(props: RecipientCountryFormProps) {
  const { recipientCountry, setRecipientCountry } = useContext(RfqContext)
  const [selectedItem, setSelectedItem] = useState(recipientCountry)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const countriesList = getNames()
  const destinationCountry = countriesList.indexOf(props.country)

  if (destinationCountry !== -1) {
    countriesList.splice(destinationCountry, 1)
    countriesList.unshift(props.country)
  }

  const handleNext = () => {
    setHasAttemptedNext(true)
    setRecipientCountry(selectedItem)
    if (selectedItem) {
      props.onNext()
    }
  }

  return ( 
    <>
      <div className='text-xs mt-2 px-3'>Make sure the information is correct.</div>
      <div className='text-sm'>
        <Dropdown items={countriesList} selectedItem={selectedItem} setSelectedItem={setSelectedItem} label={'Select a country'}/>
      </div>
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {((!selectedItem) && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Select recipient country</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </> 
  )
}