import { useEffect, useState } from 'react'
import { Exchanges } from './Exchanges'
import { Panel } from '../common/Panel'
import { Spinner } from '../common/Spinner'
import { TBD } from '../currency-utils'
import { OfferingsHeader } from './OfferingsHeader'
import { Offerings } from './Offerings'
import { useRecoilState } from 'recoil'
import { credentialsState } from '../state'
import { jwtDecode } from 'jwt-decode'

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
  const [accountBalance, setAccountBalance] = useState(undefined)
  const [credentials] = useRecoilState(credentialsState)

  useEffect(() => {
    const init = async () => {
      setAccountBalance(105)
    }
    init()
  }, [])

  if (!accountBalance) return (<Spinner />)

  return (
    <>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <div className="text-center w-full rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-neutral-700">
          <h1 className="mt-2 text-sm font-semibold text-gray-200">TBDollars Balance</h1>
          <div className="mt-2 mb-3 text-3xl font-semibold text-gray-200">{TBD(accountBalance).format()}</div>
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
