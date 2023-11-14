import React, { useContext, useState } from 'react'
import { RfqContext } from './RfqContext'
import { Dropdown } from '../common/Dropdown'
import { NextButton } from '../common/NextButton'
import { fromCents } from '../currency-utils'

type PayoutMethodFormProps = {
  payoutMethods: undefined
  onNext: () => void
  onBack: () => void
}

/**
 * This component represents a form for selecting a payout method.
 *
 * @param {Array} props.payoutMethods - The list of payout methods to choose from.
 * @param {Function} props.onNext - A function to handle moving to the next step.
 * @param {Function} props.onBack - A function to handle going back to the previous step.
 * @returns {JSX.Element} - Returns the PayoutMethodForm component.
 */
export function PayoutMethodForm(props: PayoutMethodFormProps) {
  const { payoutMethod, setPayoutMethod, offering } = useContext(RfqContext)
  const [selectedItem, setSelectedItem] = useState(payoutMethod)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const handleNext = () => {
    setPayoutMethod(selectedItem)
    setHasAttemptedNext(true)
    if (ALLOWED_MOMO.includes(selectedItem.kind)) {
      props.onNext()
    }
    props.onNext()
  }

  const currency = offering.baseCurrency.currencyCode

  return (
    <>
      <div className='text-xs mt-2 px-3'>Service fees may apply.</div>
      <div className='text-sm'>
        <Dropdown items={props.payoutMethods} selectedItem={selectedItem} setSelectedItem={setSelectedItem} label={'Select a delivery method'} labelKind='kind'/>
      </div>
      {selectedItem && (
        <div className="grid grid-cols-2 gap-0.5 border border-gray-500 rounded-md p-3 text-xs">
          <div className="text-left text-gray-400 mt-2">Service fee</div>
          {selectedItem.feeSubunits ? (
            <div className="text-right text-gray-400 mt-2">{fromCents(selectedItem.feeSubunits).format()} {currency}</div>
          ) : (
            <div className="text-right text-gray-400 mt-2">0.00 {currency}</div>
          )}   
        </div>
      )}
      
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {!selectedItem && hasAttemptedNext && (
          <p className="text-sm text-red-600 mb-2">Make a selection</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </>
  )
}
