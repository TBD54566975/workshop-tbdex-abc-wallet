import React, { useState } from 'react'

/**
 * This component provides a context to manage RFQ (Request for Quote) data.
 *
 * @param {Object} props.children - Child components wrapped by the RfqProvider.
 * @param {Object} props.offeringsByCountry - Offerings by country used for displaying in the RemittanceOfferings page.
 * @returns {JSX.Element} - Returns the RfqProvider component.
 */
export const RfqContext = React.createContext({ 
  offering: undefined,
  offeringsByCountry: undefined,
  setOffering: undefined,
  baseAmount: undefined,
  setBaseAmount: undefined,
  quoteAmount: undefined, 
  setQuoteAmount: undefined, 
  vcs: undefined,
  setVcs: undefined,
  kycProof: undefined,
  setKycProof: undefined,
  recipientNameObject: undefined,
  setRecipientNameObject: undefined,
  recipientBankObject: undefined,
  setRecipientBankObject: undefined,
  recipientMomoObject: undefined,
  setRecipientMomoObject: undefined,
  recipientDob: undefined,
  setRecipientDob: undefined,
  recipientCountry: undefined,
  setRecipientCountry: undefined,
  payoutMethod: undefined,
  setPayoutMethod: undefined,
})

export const RfqProvider = ({ children, offeringsByCountry }) => {
  const [offering, setOffering] = useState()
  const [baseAmount, setBaseAmount] = useState('')
  const [quoteAmount, setQuoteAmount] = useState('')

  const [vcs, setVcs] = useState([])
  const [kycProof, setKycProof] = useState(undefined)

  const [recipientNameObject, setRecipientNameObject] = useState()
  const [recipientBankObject, setRecipientBankObject] = useState()
  const [recipientMomoObject, setRecipientMomoObject] = useState()
  const [recipientDob, setRecipientDob] = useState()
  const [recipientCountry, setRecipientCountry] = useState()
  const [payoutMethod, setPayoutMethod] = useState()


  return (
    <RfqContext.Provider
      value={{
        offering,
        setOffering,
        offeringsByCountry,
        baseAmount,
        setBaseAmount,
        quoteAmount,
        setQuoteAmount,
        vcs,
        setVcs,
        kycProof,
        setKycProof,
        recipientNameObject,
        setRecipientNameObject,
        recipientBankObject,
        setRecipientBankObject,
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
