/**
 * This component represents a header section for offerings information.
 *
 * @returns {JSX.Element} - Returns the OfferingsHeader component.
 */
export function OfferingsHeader() {
  return (
    <div className="flex flex-col items-center">
      <div className='pl-6 pt-4 text-center'>Offerings</div>
      <div className='pl-6 pb-6 text-center text-xs text-gray-500'>What would you like to exchange TBDollars for?</div>
    </div>
  )
}
