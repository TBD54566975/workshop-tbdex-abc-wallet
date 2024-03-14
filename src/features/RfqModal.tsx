import { useState, useContext } from 'react'
import { RfqContext } from './RfqContext'
import { RfqFormIds, getRfqForms } from './RfqForms'
import { BackButton } from '../common/BackButton'
import { Panel } from '../common/Panel'
import { createExchange } from '../apiUtils'
import '../styles/date.css'
import { useRecoilState } from 'recoil'
import { credentialsState, didState } from '../state'
import { ExchangesContext } from './ExchangesContext'
import { pfiAllowlist } from '../allowlist'

type RfqModalProps = {
  onClose: () => void;
}
export function RfqModal(props: RfqModalProps) {
  const { setExchangesUpdated } = useContext(ExchangesContext)
  const [step, setStep] = useState(0)
  const { offering, payinAmount, paymentDetails } = useContext(RfqContext)
  const [credentials] = useRecoilState(credentialsState)
  const [did] = useRecoilState(didState)

  const sendRfq = async () => { 
    await createExchange({
      pfiDid: offering.metadata.from,
      offeringId: offering.id, 
      payinAmount: Number(payinAmount).toFixed(2).toString(), 
      payinMethod: { kind: offering.data.payinMethods[0].kind, paymentDetails: {} },
      payoutMethod: { kind: offering.data.payoutMethods[0].kind, paymentDetails },
      claims: credentials,
      didState: did
    })
    setExchangesUpdated(true)
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
      <div className='text-white text-center'>
        <h2 className='text-xs leading-6'>
          { pfiAllowlist.find(pfi => pfi.pfiUri === offering.metadata.from).pfiName }
        </h2>
        <h3 className='text-sm font-medium'>
          {offering.data.description}
        </h3>
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
