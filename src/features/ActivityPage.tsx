import { useEffect, useState } from 'react'
import { Exchanges } from './Exchanges'
import { Panel } from '../common/Panel'
import { Spinner } from '../common/Spinner'
import { TBD } from '../currency-utils'
import { OfferingsHeader } from './OfferingsHeader'
import { Offerings } from './Offerings'
import { useRecoilState } from 'recoil'
import { credentialsState, didState } from '../state'
import { jwtDecode } from 'jwt-decode'
import { addTBDollars, checkTbdDollars } from '../apiUtils'

/**
 * This component displays the activity page, including account balance and exchange information.
 *
 * @returns {JSX.Element} - Returns the activity page component.
 */

function renderTBDeveloperCredential(credential: string) {
  const vc = jwtDecode(credential)['vc']
  return {
    title: 'TBDeveloper Credential',
    userName: '@' + vc.credentialSubject.username,
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}
export function ActivityPage() {
  const [accountBalance, setAccountBalance] = useState(null)
  const [credentials] = useRecoilState(credentialsState)
  const [did] = useRecoilState(didState)

  useEffect(() => {
    const init = async () => {
      const res = await checkTbdDollars(did)
      setAccountBalance(res.currentBalance)
    }
    void init()
  }, [])

  async function addFunds() {
    setAccountBalance(null)
    const res = await addTBDollars(did)
    if (res.balance) {
      setAccountBalance(res.balance)
    }
  }

  return (
    <>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <div className="text-center w-full rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-neutral-700">
          <h1 className="mt-2 text-sm font-semibold text-gray-200">TBDollars Balance</h1>
          <div className="mt-2 mb-3 text-3xl font-semibold text-gray-200">{accountBalance !== null ? TBD(accountBalance).format() : <Spinner />}</div>
          <button className="rounded-md bg-indigo-600 p-2 text-white" onClick={addFunds}>Add $</button>
        </div>
      </Panel>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <h2 className='mb-4'>Credentials</h2>
        {credentials && credentials.map((credential, ind) => {
          const renderedCredential = renderTBDeveloperCredential(credential)
          return (
            <div key={ind} className="w-1/4 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-neutral-700">
              <div className="mt-2 text-lg font-semibold text-gray-200">{renderedCredential.title}</div>
              <div className="mt-2 mb-3 text-sm font-semibold text-gray-200">Issued: {renderedCredential.issuanceDate}</div>
              <div className="mt-2 mb-3 text-sm font-semibold text-gray-200">{renderedCredential.userName}</div>
            </div>
          )
        }
        )}
      </Panel>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <div className="py-2 overflow-hidden">
          <h2 className='mb-4'>Transactions</h2>
            <Exchanges/>
        </div>
      </Panel>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <OfferingsHeader />
        <Offerings />
      </Panel>
    </>
  )
}
