import React, { useState } from 'react'

/**
 * This component provides a context to manage RFQ (Request for Quote) data.
 *
 * @param {Object} props.children - Child components wrapped by the RfqProvider.
 * @param {Object} props.offeringsByCountry - Offerings by country used for displaying in the Offerings page.
 * @returns {JSX.Element} - Returns the RfqProvider component.
 */
export const RfqContext = React.createContext({ 
  offering: undefined,
  payinAmount: undefined,
  setPayinAmount: undefined,
  payoutAmount: undefined, 
  setPayoutAmount: undefined, 
  vcs: undefined,
  setVcs: undefined,
  btcAddress: undefined,
  setBtcAddress: undefined,
})

export const RfqProvider = ({ children, offering }) => {
  const [payinAmount, setPayinAmount] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')

  const [vcs, setVcs] = useState([])
  const [btcAddress, setBtcAddress] = useState()

  return (
    <RfqContext.Provider
      value={{
        offering,
        payinAmount,
        setPayinAmount,
        payoutAmount,
        setPayoutAmount,
        vcs,
        setVcs,
        btcAddress,
        setBtcAddress,
      }}
    >
      {children}
    </RfqContext.Provider>
  )
}
