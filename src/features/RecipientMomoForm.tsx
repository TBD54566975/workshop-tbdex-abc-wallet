import React, { useContext, useState } from 'react'
import validator from '@rjsf/validator-ajv8'
import { RfqContext } from './RfqContext'
import { JsonSchemaForm } from '../common/JsonSchemaForm'
import { NextButton } from '../common/NextButton'

type RecipientMomoFormProps = {
  schema: unknown
  onBack: () => void
  onNext: () => void
}

/**
 * This component represents a form for entering recipient's mobile money details.
 *
 * @param {Object} props.schema - The schema for the form.
 * @param {Function} props.onBack - A function to go back to the previous step.
 * @param {Function} props.onNext - A function to proceed to the next step.
 * @returns {JSX.Element} - Returns the RecipientMomoForm component.
 */
export function RecipientMomoForm(props: RecipientMomoFormProps) {
  const { recipientMomoObject, setRecipientMomoObject } = useContext(RfqContext)
  const [recipientMomoForm, setRecipientMomoForm] = useState({
    'accountNumber': recipientMomoObject ? recipientMomoObject.accountNumber : '',
    'reason': recipientMomoObject ? recipientMomoObject.reason : '',
  })
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)
  const isInvalidPayoutDetails = recipientMomoForm.accountNumber === '' || recipientMomoForm.reason === ''
  
  const handleNext = () => {
    setHasAttemptedNext(true)
    if (!isInvalidPayoutDetails) {
      setRecipientMomoObject(recipientMomoForm)
      props.onNext()
    }
  }

  return ( 
    <>
      <div className='text-xs mt-2 px-3'>Make sure the information is correct.</div>
      <JsonSchemaForm
        validator={validator}
        schema={props.schema}
        formData={recipientMomoForm}
        onChange={(e) => setRecipientMomoForm(e.formData)}
      />
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {isInvalidPayoutDetails && hasAttemptedNext && (
          <p className="text-sm text-red-600 mb-2">Improper payout details</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </>
  )
}