import React, { useContext, useState } from 'react'
import { QuoteAmountInput } from './QuoteAmountInput'
import { RfqContext } from './RfqContext'
import { USD } from '../currency-utils'
import { NextButton } from '../common/NextButton'

type SetQuoteAmountFormProps = {
  onNext: () => void;
}

/**
 * This component represents a form for setting the quote amount for a remittance.
 *
 * @param {Function} props.onNext - A function to proceed to the next step.
 * @returns {JSX.Element} - Returns the SetQuoteAmountForm component.
 */
export function SetQuoteAmountForm(props: SetQuoteAmountFormProps) {
  const {offering, setOffering, baseAmount, setBaseAmount, quoteAmount, setQuoteAmount} = useContext(RfqContext)
  const [selectedOffering, setSelectedOffering] = useState(offering)
  const [currentQuoteAmount, setCurrentQuoteAmount] = useState(quoteAmount)
  const [currentBaseAmount, setCurrentBaseAmount] = useState(baseAmount)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const minQuoteAmount = selectedOffering.quoteCurrency.minSubunit ? USD(selectedOffering.quoteCurrency.minSubunit).value : -1
  const maxQuoteAmount = selectedOffering.quoteCurrency.maxSubunit ? USD(selectedOffering.quoteCurrency.maxSubunit).value : -1

  const isWithinMinMax = (amount: string, minQuoteAmount: number, maxQuoteAmount: number) => {
    const parsedAmount = parseFloat(amount)

    if (minQuoteAmount < 0 && maxQuoteAmount < 0) {
        return true 
    }

    const isAmountWithinMinBounds = minQuoteAmount < 0 || parsedAmount >= minQuoteAmount
    const isAmountWithinMaxBounds = maxQuoteAmount < 0 || parsedAmount <= maxQuoteAmount

    return isAmountWithinMinBounds && isAmountWithinMaxBounds
}
  const [isAmountValid, setIsAmountValid] = useState(isWithinMinMax(currentQuoteAmount, minQuoteAmount, maxQuoteAmount))

  const validateAmount = (amount: string) => {
    setIsAmountValid(isWithinMinMax(amount, minQuoteAmount, maxQuoteAmount))
  }

  const handleNext = () => {
    setHasAttemptedNext(true)
    if (isNaN(parseFloat(currentQuoteAmount))) return

    if (isAmountValid) {
      setQuoteAmount(currentQuoteAmount)
      setBaseAmount(currentBaseAmount)
      setOffering(selectedOffering)
      props.onNext()
    }
  }

  return (
    <>
      <QuoteAmountInput
        minQuoteAmount={minQuoteAmount}
        maxQuoteAmount={maxQuoteAmount}
        isAmountValid={isAmountValid}
        validateAmount={validateAmount}
        currentBaseAmount={currentBaseAmount}
        setCurrentBaseAmount={setCurrentBaseAmount}
        currentQuoteAmount={currentQuoteAmount}
        setCurrentQuoteAmount={setCurrentQuoteAmount}
        selectedOffering={selectedOffering}
        setSelectedOffering={setSelectedOffering}
      />

      <div className="mx-8 fixed inset-x-0 bottom-6 z-10 flex flex-col items-center justify-center">
        {(currentQuoteAmount === '' && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Enter an amount in {selectedOffering.quoteCurrency.currencyCode}</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </>
  )
}
