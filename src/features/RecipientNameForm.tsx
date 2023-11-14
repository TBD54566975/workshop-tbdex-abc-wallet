import React, { useContext, useState } from 'react'
import validator from '@rjsf/validator-ajv8'
import { RfqContext } from './RfqContext'
import { JsonSchemaForm } from '../common/JsonSchemaForm'
import { NextButton } from '../common/NextButton'
import recipientNameSchema from '../sender-name.json'

type RecipientNameFormProps = {
  onBack: () => void
  onNext: () => void
}

/**
 * This component represents a form for entering recipient's first and last name.
 *
 * @param {Function} props.onBack - A function to go back to the previous step.
 * @param {Function} props.onNext - A function to proceed to the next step.
 * @returns {JSX.Element} - Returns the RecipientNameForm component.
 */
export function RecipientNameForm(props: RecipientNameFormProps) {
  const { recipientNameObject, setRecipientNameObject } = useContext(RfqContext)
  const [recipientNameForm, setRecipientNameForm] = useState({
    'firstName': recipientNameObject ? recipientNameObject.firstName : '',
    'lastName': recipientNameObject ? recipientNameObject.lastName : ''
  })
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const handleNext = () => {
    setHasAttemptedNext(true)
    setRecipientNameObject(recipientNameForm)
    if (recipientNameForm.firstName !== '' && recipientNameForm.lastName !== '') {
      props.onNext()
    }
  }

  return ( 
    <>
      <div className='text-xs mt-2 px-3'>This info needs to match with what's on their ID.</div>
      <JsonSchemaForm
        validator={validator}
        schema={recipientNameSchema as any}
        formData={recipientNameForm}
        onChange={(e) => setRecipientNameForm(e.formData)}
      />
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {((recipientNameForm.firstName === '' || recipientNameForm.lastName === '') && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Enter recipient's full name</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </>
  )
}