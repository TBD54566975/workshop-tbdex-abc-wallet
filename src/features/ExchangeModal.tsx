import { Fragment } from 'react'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Dialog, Transition } from '@headlessui/react'
import { XMarkIcon } from '@heroicons/react/24/outline'
import { renderActionButtons, renderStatusInfo } from './ExchangeModalUtils'
import { TBD, money, BTC, removeTrailingZeros } from '../currency-utils'

type ExchangeModalProps = {
  exchange: any
  isOpen: boolean
  onClose: (hasSubmitted: boolean) => void
}

/**
 * This component represents a modal for displaying details of an exchange.
 *
 * @param {Object} props.exchange - The exchange object.
 * @param {boolean} props.isOpen - Indicates whether the modal is open or closed.
 * @param {Function} props.onClose - A function to handle closing the modal.
 * @returns {JSX.Element} - Returns the ExchangeModal component.
 */
export function ExchangeModal(props: ExchangeModalProps) {
  dayjs.extend(relativeTime)
  
  return (
    <>
      <Transition.Root show={props.isOpen} as={Fragment}>
        <Dialog as="div" className="relative z-30" onClose={props.onClose}>
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
                <Dialog.Panel className='relative transform overflow-hidden rounded-lg bg-neutral-800 pb-4 pt-5 text-left shadow-xl transition-all sm:my-8 sm:mt-24 mt-24 w-80 h-128 lg:ml-72'>
                  <button className="absolute top-5 right-5 text-white hover:text-gray-300 focus:outline-none" onClick={() => { props.onClose(true) }}>
                    <XMarkIcon className="h-6 w-6" aria-hidden="true" />
                  </button>
                  <div className="flex flex-col items-center p-8 text-center">
                    <div className="flex justify-center items-center w-12 h-12 mt-1 rounded-full bg-indigo-600 text-white text-sm font-semibold mb-4">
                      $
                    </div>
                    {/* <p className="text-sm font-semibold text-white">{props.exchange.firstName} {props.exchange.lastName}</p> */}
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
                      {/* <div className="flex mb-2">
                        <div className="w-1/2 text-left text-gray-500">Delivery method</div>
                        <div className="w-1/2 text-right">{props.exchange.deliveryMethod.replace(/^MOMO_|BANK_/, '')}</div>
                      </div> */}
                      <div className="flex mb-2">
                        <div className="w-1/2 text-left text-gray-500">To</div>
                        <div className="w-1/2 text-right">{'github'} {'user'}</div>
                      </div>
                      <div className="flex mb-2">
                        <div className="w-1/2 text-left text-gray-500">From</div>
                        <div className="w-1/2 text-right">{'github'} {'user'}</div>
                      </div>
                      {props.exchange.status.value === 110 && (
                        <div className="flex mb-2">
                          <div className="w-1/2 text-left text-gray-500">Expires in</div>
                          <div className="w-1/2 text-right">{dayjs(props.exchange.expirationTime).fromNow(true)}</div>
                        </div>
                      )}
                    </div>
                  </div>

                  {renderActionButtons(props.exchange.status, props.exchange.payinAmount, 'TBD', props.exchange.id, props.onClose)}

                </Dialog.Panel>

              </Transition.Child>
            </div>
          </div>
        </Dialog>
      </Transition.Root>
    </>
  )
}
