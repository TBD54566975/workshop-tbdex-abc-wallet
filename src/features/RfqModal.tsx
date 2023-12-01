import { useState, useContext } from 'react'
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
  onClose: () => void;
}
export function RfqModal(props: RfqModalProps) {
  const [step, setStep] = useState(0)
  const { offering, payinAmount, paymentDetails } = useContext(RfqContext)
  const [credentials] = useRecoilState(credentialsState)
  const [did] = useRecoilState(didState)

  const sendRfq = async () => { 
    await createExchange({
      offeringId: offering.id, 
      payinSubunits: getSubunits(payinAmount, offering.payinCurrency.currencyCode), 
      payinMethod: { kind: offering.payinMethods[0].kind, paymentDetails: {} },
      payoutMethod: { kind: offering.payoutMethods[0].kind, paymentDetails },
      credentials,
      didState: did
    })
    props.onClose()
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
    <div className='relative transform overflow-hidden rounded-lg bg-neutral-800 pb-4 pt-5 text-left shadow-xl transition-all w-80 h-auto'>
      <div className='flex items-center justify-center text-white'>
        <h2 className='text-sm'>{offering.description}</h2>
      </div>
      {step > 0 && (<BackButton onBack={handleBack}/>)}

      <Panel width={'w-80'} height={'h-128'}>
        {!offering ? (
          <p>Something went wrong with the offering.</p>
        ) : (
          <div className="mt-2 text-gray-500 ">
            <h3 className='text-white text-lg font-medium px-3'>{title}</h3>
            {component}
          </div>
        )}
      </Panel>
    </div>
  )
}
