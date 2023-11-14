import { Fragment, useState, useContext, useEffect } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { getCode } from 'country-list'
import { RfqContext } from './RfqContext'
import { RfqFormIds, getRfqForms } from './RfqForms'
import { getSubunits } from '../currency-utils'
import { BackButton } from '../common/BackButton'
import { Panel } from '../common/Panel'
import { Flag } from '../common/Flag'
import dayjs from 'dayjs'
import '../styles/date.css'

type RfqModalProps = {
  country: string;
  isOpen: boolean;
  onClose: (hasSubmitted: boolean) => void;
}

/**
 * This component represents the RFQ (Request for Quote) modal for entering exchange details.
 *
 * @param {string} props.country - The selected country.
 * @param {boolean} props.isOpen - A boolean indicating whether the modal is open.
 * @param {Function} props.onClose - A function to close the modal.
 * @returns {JSX.Element} - Returns the RfqModal component.
 */
export function RfqModal(props: RfqModalProps) {
  const [step, setStep] = useState(0)
  const {
    offering,
    setOffering,
    offeringsByCountry,
    recipientNameObject,
    recipientDob,
    recipientCountry,
    payoutMethod,
    recipientMomoObject,
    recipientBankObject,
    quoteAmount,
  } = useContext(RfqContext)

  const accountId = localStorage.getItem('accountId')
  const currencyKeys = Object.keys(offeringsByCountry)
  
  useEffect(() => {
    if (!offering) {
      setOffering(offeringsByCountry[currencyKeys[0]])
    }
  }, [])

  if (!offering) return null

  populateRfq()

  const sendRfq = async () => { 
    const quoteCurrencyCode = offering.quoteCurrency.currencyCode
    const quoteAmountSubunits = getSubunits(quoteAmount, quoteCurrencyCode)
    const recipient = {
      firstName: recipientNameObject.firstName,
      lastName: recipientNameObject.lastName,
      dob: dayjs(recipientDob).format('YYYY-MM-DD'),
      country: getCode(recipientCountry)
    }
    const deliveryMethod = {
      kind: payoutMethod.kind,
      paymentDetails: {
        accountNumber: recipientMomoObject?.accountNumber || recipientBankObject?.accountNumber,
        reason: recipientMomoObject?.reason?.value || recipientBankObject?.reason?.value
      }               
    }
    // await createExchange(accountId, offering.offeringId, quoteAmountSubunits, recipient, deliveryMethod, props.onClose)
  }

  const handleNext = async () => {
    const currentFormId = forms[step].id
    if (currentFormId === RfqFormIds.Review) {
      await sendRfq()
    } else if (currentFormId === RfqFormIds.RecipientBank) {
      setStep((prevStep) => prevStep + 2)
    } else {
      setStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    const currentFormId = forms[step].id
    if (currentFormId === RfqFormIds.Review && ALLOWED_BANKS.includes(payoutMethod.kind)) {
      setStep((prevStep) => prevStep - 2)
    } else if (currentFormId === RfqFormIds.RecipientMomo) {
      setStep((prevStep) => prevStep - 2)
    } else {
      setStep((prevStep) => prevStep - 1)
    }
  }

  const forms = getRfqForms(offering, props.country, handleNext, handleBack)
  const { title, component } = forms[step]

  return (
    <>
      <Transition.Root show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z" onClose={props.onClose}>
          <Transition.Child
            as={Fragment}
            enter="ease-out duration-300"
            enterFrom="opacity-0"
            enterTo="opacity-100"
            leave="ease-in duration-200"
            leaveFrom="opacity-100"
            leaveTo="opacity-0"
          >
            <div className="fixed inset-0 bg-black/30 transition-opacity" />
          </Transition.Child>

          <div className="fixed inset-0 z-10 overflow-y-auto">
            <div className="flex justify-center p-8 text-center">
              <Transition.Child
                as={Fragment}
                enter="ease-out duration-300"
                enterFrom="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
                enterTo="opacity-100 translate-y-0 sm:scale-100"
                leave="ease-in duration-200"
                leaveFrom="opacity-100 translate-y-0 sm:scale-100"
                leaveTo="opacity-0 translate-y-4 sm:translate-y-0 sm:scale-95"
              >
                <Dialog.Panel
                  className={'relative transform overflow-hidden rounded-lg bg-neutral-800 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:mt-24 mt-24 w-80 h-128 lg:ml-72'}
                >
                  <div className='flex items-center justify-center text-white'>
                    <div className='text-sm'>{props.country}</div>
                    <span>&nbsp;</span>
                    <Flag country={props.country} />
                  </div>
                  {step > 0 && (<BackButton onBack={handleBack}/>)}

                  <Panel width={'w-80'} height={'h-128'}>
                    <div className="mt-2 text-gray-500 ">
                      <div className='text-white text-lg font-medium px-3'>{title}</div>
                      {component}
                    </div>
                  </Panel>
                </Dialog.Panel>
              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
