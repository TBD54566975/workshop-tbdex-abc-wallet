import { Exchanges } from './Exchanges'
import { Panel } from '../common/Panel'
import { Offerings } from './Offerings'
import { Credentials } from './Credentials'
import { Balance } from './Balance'
import { ExchangesProvider } from './ExchangesContext'

export function ActivityPage() {
  return (
    <>
      <h1 className="sr-only">ABC Wallet</h1>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <div className="text-center w-full rounded-md bg-transparent px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm">
          <h2 className="mt-2 text-sm font-semibold text-gray-200">TBDollars Balance</h2>
          <Balance />
        </div>
      </Panel>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <h2 className='mb-4'>Credentials</h2>
        <Credentials />
      </Panel>
      <ExchangesProvider>
        <Panel width={'w-11/12'} height={'h-auto'}>
          <h2 className='mb-4'>Transactions</h2>
          <Exchanges/>
        </Panel>
        <Panel width={'w-11/12'} height={'h-auto'}>
          <div className="flex flex-col items-center">
            <h2 className='pt-4 text-center'>Offerings</h2>
            <p className='pb-6 text-center text-xs text-gray-500'>What would you like to exchange TBDollars for?</p>
          </div>
          <Offerings />
        </Panel>
      </ExchangesProvider>
    </>
  )
}
