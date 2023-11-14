/**
 * This component represents a header section for remittance information.
 *
 * @returns {JSX.Element} - Returns the RemittanceHeader component.
 */
export function RemittanceHeader() {
  return (
    <div className="flex flex-col items-center">
      <div className='pl-6 pt-4 text-center'>Destination country</div>
      <div className='pl-6 pb-6 text-center text-xs text-gray-500'>You send US Dollar or Bitcoin, and your friends get the currency you choose</div>
    </div>
  )
}
