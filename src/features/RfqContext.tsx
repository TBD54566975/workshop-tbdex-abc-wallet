import { Offering } from '@tbdex/http-client'
import React, { useState } from 'react'

/**
 * This component provides a context to manage RFQ (Request for Quote) data.
 *
 * @param {Object} props.children - Child components wrapped by the RfqProvider.
 * @param {Object} props.offeringsByCountry - Offerings by country used for displaying in the Offerings page.
 * @returns {JSX.Element} - Returns the RfqProvider component.
 */
export const RfqContext = React.createContext({ 
  offering: undefined as Offering,
  payinAmount: undefined as string,
  setPayinAmount: undefined,
  payoutAmount: undefined as string, 
  setPayoutAmount: undefined, 
  paymentDetails: undefined,
  setPaymentDetails: undefined
})

export const RfqProvider = ({ children, offering }) => {
  const [payinAmount, setPayinAmount] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')
  const [paymentDetails, setPaymentDetails] = useState('')

  return (
    <RfqContext.Provider
      value={{
        offering,
        payinAmount,
        setPayinAmount,
        payoutAmount,
        setPayoutAmount,
        paymentDetails,
        setPaymentDetails
      }}
    >
      {children}
    </RfqContext.Provider>
  )
}
