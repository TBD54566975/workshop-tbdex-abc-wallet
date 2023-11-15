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
  kycProof: undefined,
  setKycProof: undefined,
  recipientNameObject: undefined,
  setRecipientNameObject: undefined,
  recipientBtcObject: undefined,
  setRecipientBtcObject: undefined,
  recipientMomoObject: undefined,
  setRecipientMomoObject: undefined,
  recipientDob: undefined,
  setRecipientDob: undefined,
  recipientCountry: undefined,
  setRecipientCountry: undefined,
  payoutMethod: undefined,
  setPayoutMethod: undefined,
})

export const RfqProvider = ({ children, offering }) => {
  const [payinAmount, setPayinAmount] = useState('')
  const [payoutAmount, setPayoutAmount] = useState('')

  const [vcs, setVcs] = useState([])
  const [kycProof, setKycProof] = useState(undefined)

  const [recipientNameObject, setRecipientNameObject] = useState()
  const [recipientBtcObject, setRecipientBtcObject] = useState()
  const [recipientMomoObject, setRecipientMomoObject] = useState()
  const [recipientDob, setRecipientDob] = useState()
  const [recipientCountry, setRecipientCountry] = useState()
  const [payoutMethod, setPayoutMethod] = useState()


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
        kycProof,
        setKycProof,
        recipientNameObject,
        setRecipientNameObject,
        recipientBtcObject,
        setRecipientBtcObject,
        recipientMomoObject,
        setRecipientMomoObject,
        recipientDob,
        setRecipientDob,
        recipientCountry,
        setRecipientCountry,
        payoutMethod,
        setPayoutMethod
      }}
    >
      {children}
    </RfqContext.Provider>
  )
}
