import { RecipientNameForm } from './RecipientNameForm'
import { RecipientCountryForm } from './RecipientCountryForm'
import { RecipientBankForm } from './RecipientBankForm'
import { RecipientMomoForm } from './RecipientMomoForm'
import { SetQuoteAmountForm } from './SetQuoteAmountForm'
import { RecipientDobForm } from './RecipientDobForm'
import { PayoutMethodForm } from './PayoutMethodForm'
import { ReviewForm } from './ReviewForm'
import { ALLOWED_BANKS, ALLOWED_MOMO } from '../payout-allowlist'
import { useContext } from 'react'
import { RfqContext } from './RfqContext'

export enum RfqFormIds {
  SetQuoteAmount = 'setQuoteAmount',
  RecipientName = 'recipientName',
  RecipientDob = 'recipientDob',
  RecipientCountry = 'recipientCountry',
  PayoutMethod = 'payoutMethod',
  RecipientBank = 'recipientBank',
  RecipientMomo = 'recipientMomo',
  Review = 'review',
}

/**
 * This function generates an array of RFQ (Request for Quote) form objects based on the selected offering.
 *
 * @param {Function} handleNext - A function to handle the "Next" action.
 * @param {Function} handleBack - A function to handle the "Back" action.
 * @returns {Array} - An array of RFQ form objects, each containing a title and a component.
 */
export const getRfqForms = (offering, country, handleNext, handleBack) => {
  const { payoutMethod } = useContext(RfqContext)

  const forms = [
    {
      title: '',
      component: (
        <SetQuoteAmountForm onNext={handleNext} />
      ),
      id: RfqFormIds.SetQuoteAmount
    },
    {
      title: 'Who are you sending money to?',
      component: (
        <RecipientNameForm onBack={handleBack} onNext={handleNext} />
      ),
      id: RfqFormIds.RecipientName
    },
    {
      title: 'What\'s their date of birth?',
      component: (
        <RecipientDobForm onBack={handleBack} onNext={handleNext} />
      ),
      id: RfqFormIds.RecipientDob
    },
    {
      title: 'What\'s their country of residence?',
      component: (
        <RecipientCountryForm country={country} onBack={handleBack} onNext={handleNext} />
      ),
      id: RfqFormIds.RecipientCountry
    },
    {
      title: 'How are you sending money?',
      component: (
        <PayoutMethodForm payoutMethods={offering.payoutMethods} onNext={handleNext} onBack={handleBack} />
      ),
      id: RfqFormIds.PayoutMethod
    }
  ]

  const isBank = offering.payoutMethods.some(
    (method) => ALLOWED_BANKS.includes(method.kind)
  )

  if (isBank && payoutMethod) {
    forms.push({
      title: 'What\'s their bank details?',
      component: (
        <RecipientBankForm
          schema={payoutMethod.requiredPaymentDetails}
          onBack={handleBack}
          onNext={handleNext}
        />
      ),
      id: RfqFormIds.RecipientBank
    })
  } else {
    forms.push({
      title: 'NO BANK IN PAYOUT METHODS',
      component: undefined,
      id: RfqFormIds.RecipientBank
    })
  }

  const isMomo = offering.payoutMethods.find(
    (method) => ALLOWED_MOMO.includes(method.kind)
  )

  if (isMomo && payoutMethod) {
    forms.push({
      title: 'What\'s their mobile money details?',
      component: (
        <RecipientMomoForm
          schema={payoutMethod.requiredPaymentDetails}
          onBack={handleBack}
          onNext={handleNext}
        />
      ),
      id: RfqFormIds.RecipientMomo
    })
  } else {
    forms.push({
      title: 'NO MOMO IN PAYOUT METHODS',
      component: undefined,
      id: RfqFormIds.RecipientMomo
    })
  }

  forms.push({
    title: 'Review your request',
    component: <ReviewForm onBack={handleBack} onSubmit={handleNext} />,
    id: RfqFormIds.Review
  })

  return forms
}
