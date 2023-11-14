import { useEffect, useState } from 'react'
import { Exchanges } from './Exchanges'
import { ExchangesHeader } from './ExchangesHeader'
import { Panel } from '../common/Panel'
import { Spinner } from '../common/Spinner'
import { USD } from '../currency-utils'

/**
 * This component displays the activity page, including account balance and exchange information.
 *
 * @returns {JSX.Element} - Returns the activity page component.
 */
export function ActivityPage() {
  const [accountBalance, setAccountBalance] = useState(undefined)

  useEffect(() => {
    const init = async () => {
      setAccountBalance(101)
    }
    init()
  }, [])

  if (!accountBalance) return (<Spinner />)

  return (
    <>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <button className="w-full rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm ring-2 ring-inset ring-neutral-700 hover:bg-neutral-700/30">
          <div className="mt-2 text-sm font-semibold text-gray-200">Cash Balance</div>
          <div className="mt-2 mb-3 text-3xl font-semibold text-gray-200">{USD(accountBalance).format()}</div>
        </button>
      </Panel>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <div className="py-2 overflow-hidden">
          <ExchangesHeader />
          <Exchanges/>
        </div>
      </Panel>
    </>
  )
}
