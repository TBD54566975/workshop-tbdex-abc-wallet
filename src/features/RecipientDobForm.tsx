import React, { useContext, useState } from 'react'
import dayjs from 'dayjs'
import DatePicker from 'react-date-picker'
import { RfqContext } from './RfqContext'
import { NextButton } from '../common/NextButton'
import '../styles/date.css'

type RecipientDobFormProps = {
  onNext: () => void;
  onBack: () => void;
}

/**
 * This component represents a form for entering the recipient's date of birth.
 *
 * @param {Function} props.onNext - A function to proceed to the next step.
 * @param {Function} props.onBack - A function to go back to the previous step.
 * @returns {JSX.Element} - Returns the RecipientDobForm component.
 */
export function RecipientDobForm(props: RecipientDobFormProps) {
  const { recipientDob, setRecipientDob } = useContext(RfqContext)
  const [recipientDobForm, setRecipientDobForm] = useState(recipientDob)
  const [hasAttemptedNext, setHasAttemptedNext] = useState(false)

  const handleNext = () => {
    setHasAttemptedNext(true)
    setRecipientDob(dayjs(recipientDobForm).format('MM/DD/YYYY'))
    if (recipientDobForm) {
      props.onNext()
    }
  }

  return (
    <>
      <div className='text-xs mt-2 px-3'>This info needs to match with what's on their ID.</div>
      <DatePicker
        className="text-gray-200 p-2 mt-3 text-sm"
        value={recipientDobForm}
        onChange={setRecipientDobForm}
        calendarIcon={null}
        showLeadingZeros
        clearIcon={null}
        dayPlaceholder="DD"
        monthPlaceholder="MM"
        yearPlaceholder="YYYY"
      />
      <style> {`.react-date-picker__calendar { position: absolute; transform: translateY(310px); }`} </style>
      <div className="mx-8 fixed inset-x-0 bottom-6 flex flex-col items-center justify-center">
        {((!recipientDobForm) && hasAttemptedNext) && (
          <p className="text-sm text-red-600 mb-2">Enter recipient's date of birth</p>
        )}
        <NextButton onNext={handleNext} />
      </div>
    </>
  )
}
