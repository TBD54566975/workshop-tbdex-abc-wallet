import React, { useContext } from 'react'
import { RfqContext } from './RfqContext'
import { TBD, convertToBaseUnits, formatUnits, getExchangeRate } from '../currency-utils'

type PayinAmountInputProps = {
  minPayinAmount: number;
  maxPayinAmount: number;
  isAmountValid: boolean;
  validateAmount: (value: string) => void;
  currentPayinAmount: string;
  setCurrentPayinAmount: (value: string) => void;
  currentPayoutAmount: string;
  setCurrentPayoutAmount: (value: string) => void;
}

export function PayinAmountInput(props: PayinAmountInputProps) {
  const { offering } = useContext(RfqContext)

  const payinCurrency = offering.data.payinCurrency.currencyCode
  const payoutCurrency = offering.data.payoutCurrency.currencyCode

  const handlePayinAmountChange = (payinAmount: string) => {
    const formattedPayinAmount = formatUnits(payinAmount, 8)
  
    props.setCurrentPayinAmount(formattedPayinAmount)
    props.setCurrentPayoutAmount(
      convertToBaseUnits(formattedPayinAmount, offering.data.payoutUnitsPerPayinUnit)
    )
    props.validateAmount(formattedPayinAmount)
  }

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <p className={`absolute mt-[-10px] ml-3 text-sm text-red-600 ${props.isAmountValid ? 'hidden' : ''}`}>
          {props.minPayinAmount >= 0 && parseFloat(props.currentPayinAmount) < props.minPayinAmount
            ? `Minimum order is ${props.minPayinAmount} ${payinCurrency}`
            : props.maxPayinAmount >= 0 && parseFloat(props.currentPayinAmount) > props.maxPayinAmount
            ? `Maximum order is ${props.maxPayinAmount} ${payinCurrency}`
            : null}
        </p>
        <label htmlFor="payinAmount" className="block text-xs leading-6 pl-3 mt-3 text-gray-300">You Send</label>
        <div className="flex items-center">
          <input
            type="text"
            className="block w-full text-2xl border-0 text-indigo-600 bg-transparent rounded-md focus:text-indigo-600 placeholder:text-gray-400 focus:ring-transparent sm:leading-6"
            placeholder="0.00"
            id="payinAmount"
            name="payinAmount"
            value={props.currentPayinAmount}
            onChange={(e) => handlePayinAmountChange(e.target.value)}
            autoComplete='off'
          />
          <p className='pr-1 mb-1 text-gray-400 text-xl'>{payinCurrency}</p>
        </div>        
      </div>

      <div className="relative mt-3 rounded-md shadow-sm">
        <label className="block text-xs leading-6 pl-3 mt-1 text-gray-300">They get</label>{' '}
        <div className="flex items-center">
          <input
            type="text"
            className="block w-full text-2xl border-0 py-1.5 text-neutral-200 bg-transparent rounded-md placeholder:text-gray-400 focus:ring-transparent sm:leading-6"
            placeholder="0.00"
            id="payoutAmount"
            name="payoutAmount"
            value={formatUnits(props.currentPayoutAmount, 8)}
            readOnly
          />
          <p className='pr-1 mb-1 text-gray-400 text-xl'>{payoutCurrency}</p>
        </div>   
      </div>

      <div className="grid grid-cols-2 gap-0.5 mt-5 rounded-md p-3 text-xs">
        <p className="text-left text-gray-400">Est. rate</p>
        <p className="text-right w-[130%] ml-[-30%] text-gray-400">{getExchangeRate(offering.data.payoutUnitsPerPayinUnit, payinCurrency, payoutCurrency)}</p>
        <p className="text-left text-gray-400 mt-2">Total</p>
        <p className="text-right text-gray-400 mt-2">{props.currentPayinAmount ? `${TBD(props.currentPayinAmount).format()} ${payinCurrency}` : `0.00 ${payinCurrency}`}</p> 
      </div>
    </div>
  )
}
