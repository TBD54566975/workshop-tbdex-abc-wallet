import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { renderActionButtons, renderStatusInfo } from './ExchangeModalUtils'
import { money, BTC, removeTrailingZeros } from '../currency-utils'
import { type ClientExchange } from '../apiUtils'
import { useRecoilState } from 'recoil'
import { didState } from '../state'

type ExchangeModalProps = {
  exchange: ClientExchange
  onClose: (hasSubmitted: boolean) => void
}

export function ExchangeModal(props: ExchangeModalProps) {
  dayjs.extend(relativeTime)
  const [did] = useRecoilState(didState)
  
  return (
    <div className='relative transform overflow-hidden rounded-lg bg-neutral-800 pb-4 pt-5 text-left shadow-xl transition-all w-80 h-auto'>
      <button className="absolute top-5 right-5 text-white hover:text-gray-300 focus:outline-none" onClick={() => { props.onClose(true) }}>
        <XMarkIcon className="h-6 w-6" aria-hidden="true" />
      </button>
      <div className="flex flex-col items-center p-8 text-center">
        <div className="flex justify-center items-center w-12 h-12 mt-1 rounded-full bg-indigo-600 text-white text-sm font-semibold mb-4">
          $
        </div>
        <p className="text-xs text-gray-500 mt-1">Exchange from TBD to BTC</p>
        <div className="mt-8 mb-1 text-3xl font-semibold text-gray-200">
          {removeTrailingZeros(money(props.exchange.payinAmount).format())} TBD
        </div>
        <p className="text-xs text-gray-500 mb-3">{dayjs(props.exchange.createdTime).format('MMM D [at] h:mm A')}</p>

        {renderStatusInfo(props.exchange.status)}

        <div className="w-full mt-6 px-5 pt-3 text-xs text-gray-400">
          <div className="flex mb-2">
            <div className="w-1/2 text-left text-gray-500">Amount</div>
            <div className="w-1/2 text-right">{removeTrailingZeros(BTC(props.exchange.payoutAmount).format())} BTC</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-left text-gray-500">To</div>
            <div className="w-1/2 text-right break-all">{props.exchange.to}</div>
          </div>
          <div className="flex mb-2">
            <div className="w-1/2 text-left text-gray-500">From</div>
            <div className="w-1/2 text-right break-all">{props.exchange.from}</div>
          </div>
          {props.exchange.status === 'quote' && props.exchange.expirationTime && (
            <div className="flex mb-2">
              <div className="w-1/2 text-left text-gray-500">Expires in</div>
              <div className="w-1/2 text-right">{dayjs(props.exchange.expirationTime).fromNow(true)}</div>
            </div>
          )}
        </div>
      </div>

      {props.exchange.status === 'quote' && renderActionButtons(props.exchange.payinAmount, props.exchange.id, props.onClose, did)}
    </div>
  )
}
