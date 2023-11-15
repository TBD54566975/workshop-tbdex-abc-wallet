import { RecipientBtcForm } from './RecipientBtcForm'
import { SetQuoteAmountForm } from './SetQuoteAmountForm'
import { ReviewForm } from './ReviewForm'

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
export const getRfqForms = (offering, handleNext, handleBack) => {

  return [
    {
      title: '',
      component: (
        <SetQuoteAmountForm onNext={handleNext} />
      ),
      id: RfqFormIds.SetQuoteAmount
    },
    {
      title: 'What\'s your BTC address?',
      component: (
        <RecipientBtcForm
          schema={offering.payoutMethods[0].requiredPaymentDetails}
          onBack={handleBack}
          onNext={handleNext}
        />
      ),
      id: RfqFormIds.RecipientBank
    },
    {
      title: 'Review your request',
      component: <ReviewForm onBack={handleBack} onSubmit={handleNext} />,
      id: RfqFormIds.Review
    }
  ]
}
