import { useContext, useState } from 'react'
import { PayinAmountInput } from './RfqPayinAmountInput'
import { RfqContext } from './RfqContext'
import { NextButton } from '../common/NextButton'
import { TBD } from '../currency-utils'

type SetQuoteAmountFormProps = {
  onNext: () => void;
}

export function PayinPage(props: SetQuoteAmountFormProps) {
  const {offering, payinAmount, setPayinAmount, payoutAmount, setPayoutAmount} = useContext(RfqContext)
  const [currentPayoutAmount, setCurrentPayoutAmount] = useState(payoutAmount)
  const [currentPayinAmount, setCurrentPayinAmount] = useState(payinAmount)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const minPayinAmount = offering.payinCurrency.minSubunit ? TBD(offering.payinCurrency.minSubunit).value : 0.01
  const maxPayinAmount = offering.payinCurrency.maxSubunit ? TBD(offering.payinCurrency.maxSubunit).value : 5

  const isWithinMinMax = (amount: string, minQuoteAmount: number, maxQuoteAmount: number) => {
    const parsedAmount = parseFloat(amount)

    if (minQuoteAmount < 0 && maxQuoteAmount < 0) {
        return true 
    }

    const isAmountWithinMinBounds = minQuoteAmount < 0 || parsedAmount >= minQuoteAmount
    const isAmountWithinMaxBounds = maxQuoteAmount < 0 || parsedAmount <= maxQuoteAmount

    return isAmountWithinMinBounds && isAmountWithinMaxBounds
  }
  const [isAmountValid, setIsAmountValid] = useState(isWithinMinMax(currentPayinAmount, minPayinAmount, maxPayinAmount))

  const validateAmount = (amount: string) => {
    setIsAmountValid(isWithinMinMax(amount, minPayinAmount, maxPayinAmount))
  }


  const handleNext = () => {
    setHasAttemptedNext(true)
    if (isNaN(parseFloat(currentPayoutAmount))) return

    if (isAmountValid) {
      setPayoutAmount(currentPayoutAmount)
      setPayinAmount(currentPayinAmount)
      props.onNext()
    } 
  }

  return (
    <>
      <PayinAmountInput
        minPayinAmount={minPayinAmount}
        maxPayinAmount={maxPayinAmount}
        isAmountValid={isAmountValid}
        validateAmount={validateAmount}
        currentPayinAmount={currentPayinAmount}
        setCurrentPayinAmount={setCurrentPayinAmount}
        currentPayoutAmount={currentPayoutAmount}
        setCurrentPayoutAmount={setCurrentPayoutAmount}
      />

      <div className="mx-8 fixed inset-x-0 bottom-6 z-10 flex flex-col items-center justify-center">
        {(currentPayoutAmount === '' && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Enter an amount in {offering.payinCurrency.currencyCode}</p>
        )}
        <NextButton disabled={false} onNext={handleNext} />
      </div>
    </>
  )
}
