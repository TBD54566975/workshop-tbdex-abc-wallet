import { useContext } from 'react'
import { RfqContext } from './RfqContext'
import { BTC, formatUnits, money } from '../currency-utils'

type ReviewPageProps = {
  onSubmit: () => void;
  onBack: () => void;
}

/**
 * This component represents a review form for confirming the RFQ details before sending.
 *
 * @param {Function} props.onSubmit - A function to submit the RFQ.
 * @param {Function} props.onBack - A function to go back to the previous step.
 * @returns {JSX.Element} - Returns the ReviewForm component.
 */
export function ReviewPage(props: ReviewPageProps) {
  const {
    offering,
    payinAmount,
    payoutAmount,
    btcAddress,
  } = useContext(RfqContext)

  const payinCurrency = offering?.payinCurrency.currencyCode
  const payoutCurrency = offering?.payoutCurrency.currencyCode
  const payinUnits = money(payinAmount).format()
  const payoutUnits = formatUnits(payoutAmount, 8)

  const handleSubmit = () => {
    props.onSubmit()
  }

  return (
    <>
      <div className='text-xs mt-2 px-3'>Make sure to check the amount and delivery info before sending.</div>
      
      <div className="mt-6 text-gray-500">
        <div className='text-white text-sm font-medium px-3'>{payinUnits} {payinCurrency}</div>
        <div className='text-xs mt-1 px-3'>Transfer amount</div>
      </div>
      <div className="mt-3 text-gray-500">
        <div className='text-white text-sm font-medium px-3'>{payoutUnits} {payoutCurrency}</div>
        <div className='text-xs mt-1 px-3'>Total to you</div>
      </div>

      {/* <div className="mt-6 text-gray-400">
        <div className='text-white text-xs font-small px-3'>{recipientNameObject.firstName} {recipientNameObject.lastName}</div>
        <div className='text-xs mt-1 px-3'>{dayjs(recipientDob).format('MM/DD/YYYY')}</div>
        <div className='text-xs mt-1 px-3'>{recipientCountry}</div>
      </div> */}

      <div className="mt-4 text-gray-400">
        <div className='text-xs font-small px-3'>
          <div className='text-white'>{offering.payoutMethods[0].kind}</div>
        </div>
        <div className='text-xs px-3 mt-1'>{btcAddress.btcAddress}</div>
      </div>

      <div className="mx-8 fixed inset-x-0 bottom-6 z-10 flex justify-center">
        <button
          type="submit"
          className="rounded-2xl bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
          onClick={handleSubmit}
        >
          Request
        </button>
      </div>
    </>
  )
}
