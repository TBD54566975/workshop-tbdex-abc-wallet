import { useRecoilState } from 'recoil'
import { balanceState } from '../state'
import { Spinner } from '../common/Spinner'
import { TBD } from '../currency-utils'

export function Balance() {
  const [accountBalance] = useRecoilState(balanceState)
  
  return (
    <>
      {accountBalance === undefined ? ( 
        <div className='mt-4'><Spinner /></div>
      ) : accountBalance === null ? (
        <div className="min-w-0 truncate text-center">
          <h3 className="text-xs font-medium leading-6 text-neutral-100 mt-3">Failed to load</h3>
          <p className="truncate text-xs leading-5 text-gray-500">There was an error trying to load your balance.</p>
        </div>
      ) : (
        <div className="mt-2 mb-3 text-3xl font-semibold text-gray-200">{TBD(accountBalance).format()}</div>
      )}
    </>
  )
}