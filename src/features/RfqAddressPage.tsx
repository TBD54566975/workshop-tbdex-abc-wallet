import { useContext, useState } from 'react'
import { RfqContext } from './RfqContext'
import { NextButton } from '../common/NextButton'

type RecipientBtcFormProps = {
  schema: unknown
  onBack: () => void
  onNext: () => void
}

export function RfqAddressPage(props: RecipientBtcFormProps) {
  const { setPaymentDetails } = useContext(RfqContext)
  const [recipientBtcForm, setRecipientBtcForm] = useState({})
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const isInvalidPayoutDetails = props.schema['required'].filter(requiredProperty => !recipientBtcForm[requiredProperty]).length > 0

  const handleNext = () => {
    setHasAttemptedNext(true)
    if (!isInvalidPayoutDetails) {
      setPaymentDetails(recipientBtcForm)
      props.onNext()
    }
  }

  return ( 
    <>
      <div className='text-xs mt-2 px-3'>Make sure the information is correct.</div>
      <label className="sr-only" htmlFor="address">Bitcoin Wallet Address</label>
      <input
        type="text"
        id="address"
        name="address"
        className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
        placeholder={props.schema['properties']['address']['title']}
        onChange={(e) => setRecipientBtcForm({address: e.target.value})}
        autoComplete='off'
      />
      
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {isInvalidPayoutDetails && hasAttemptedNext && (
          <p className="text-sm text-red-600 mb-2">Improper payout details</p>
        )}
        <NextButton disabled={!recipientBtcForm} onNext={handleNext} />
      </div>
    </>
  )
}