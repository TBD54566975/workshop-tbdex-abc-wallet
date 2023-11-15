import React, { useContext, useState } from 'react'
import { QuoteAmountInput } from './QuoteAmountInput'
import { RfqContext } from './RfqContext'
import { USD } from '../currency-utils'
import { NextButton } from '../common/NextButton'

type SetQuoteAmountFormProps = {
  onNext: () => void;
}

/**
 * This component represents a form for setting the quote amount for an exchange.
 *
 * @param {Function} props.onNext - A function to proceed to the next step.
 * @returns {JSX.Element} - Returns the SetQuoteAmountForm component.
 */
export function SetQuoteAmountForm(props: SetQuoteAmountFormProps) {
  const {offering, payinAmount, setPayinAmount, payoutAmount, setPayoutAmount} = useContext(RfqContext)
  const [currentPayoutAmount, setCurrentQuoteAmount] = useState(payoutAmount)
  const [currentPayinAmount, setCurrentBaseAmount] = useState(payinAmount)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const handleNext = () => {
    setHasAttemptedNext(true)
    if (isNaN(parseFloat(currentPayoutAmount))) return
      setPayoutAmount(currentPayoutAmount)
      setPayinAmount(currentPayinAmount)
      console.log(currentPayinAmount)
      props.onNext()
    
  }

  return (
    <>
      <QuoteAmountInput
        currentPayinAmount={currentPayinAmount}
        setCurrentPayinAmount={setCurrentBaseAmount}
        currentPayoutAmount={currentPayoutAmount}
        setCurrentPayoutAmount={setCurrentQuoteAmount}
      />

      <div className="mx-8 fixed inset-x-0 bottom-6 z-10 flex flex-col items-center justify-center">
        {(currentPayoutAmount === '' && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Enter an amount in {offering.payoutCurrency.currencyCode}</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </>
  )
}
