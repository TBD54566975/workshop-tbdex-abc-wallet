import { Fragment, useState, useContext } from 'react'
import { Dialog, Transition } from '@headlessui/react'
import { RfqContext } from './RfqContext'
import { RfqFormIds, getRfqForms } from './RfqForms'
import { BackButton } from '../common/BackButton'
import { Panel } from '../common/Panel'
import { createExchange } from '../apiUtils'
import '../styles/date.css'
import { getSubunits } from '../currency-utils'
import { useRecoilState } from 'recoil'
import { credentialsState, didState } from '../state'

type RfqModalProps = {
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
  const { offering, payinAmount, paymentDetails } = useContext(RfqContext)
  const [credentials] = useRecoilState(credentialsState)
  const [did] = useRecoilState(didState)

  if (!offering) return null

  const sendRfq = async () => { 
    await createExchange({
      offeringId: offering.id, 
      payinSubunits: getSubunits(payinAmount, offering.payinCurrency.currencyCode), 
      payinMethod: { kind: offering.payinMethods[0].kind, paymentDetails: {} },
      payoutMethod: { kind: offering.payoutMethods[0].kind, paymentDetails },
      credentials, // todo: only submit required credentials,
      didState: did
    })
    props.onClose(true)
  }

  const handleNext = async () => {
    const currentFormId = forms[step].id
    if (currentFormId === RfqFormIds.Review) {
      await sendRfq()
    } else {
      setStep((prevStep) => prevStep + 1)
    }
  }

  const handleBack = () => {
    setStep((prevStep) => prevStep - 1)
  }

  const forms = getRfqForms(offering, handleNext, handleBack)
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
                  className={'relative transform overflow-hidden rounded-lg bg-neutral-800 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:mt-24 mt-24 w-80 h-128'}
                >
                  <div className='flex items-center justify-center text-white'>
                    <div className='text-sm'>{offering.description}</div>
                    <span>&nbsp;</span>
                    {/* <Flag country={props.country} /> */}
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
