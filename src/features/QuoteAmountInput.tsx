import React, { useContext, useState } from 'react'
import { RfqContext } from './RfqContext'
import { Dropdown } from '../common/Dropdown'
import { convertToBaseUnits, formatUnits, fromCents, getExchangeRate } from '../currency-utils'

type QuoteAmountInputProps = {
  minQuoteAmount: number;
  maxQuoteAmount: number;
  isAmountValid: boolean;
  validateAmount: (value: string) => void;
  currentBaseAmount: string;
  setCurrentBaseAmount: (value: string) => void;
  currentQuoteAmount: string;
  setCurrentQuoteAmount: (value: string) => void;
  selectedOffering: any;
  setSelectedOffering: (value: unknown) => void;
}

/**
 * This component represents an input form for selecting and displaying quote amounts.
 *
 * @param {number} props.minQuoteAmount - The minimum allowed quote amount.
 * @param {number} props.maxQuoteAmount - The maximum allowed quote amount.
 * @param {boolean} props.isAmountValid - Indicates whether the entered amount is valid.
 * @param {Function} props.validateAmount - A function to validate the entered amount.
 * @param {string} props.currentBaseAmount - The current base amount.
 * @param {Function} props.setCurrentBaseAmount - A function to set the current base amount.
 * @param {string} props.currentQuoteAmount - The current quote amount.
 * @param {Function} props.setCurrentQuoteAmount - A function to set the current quote amount.
 * @param {Object} props.selectedOffering - The selected offering object.
 * @param {Function} props.setSelectedOffering - A function to set the selected offering.
 * @returns {JSX.Element} - Returns the QuoteAmountInput component.
 */
export function QuoteAmountInput(props: QuoteAmountInputProps) {
  const { offeringsByCountry } = useContext(RfqContext)
  const currencyKeys = Object.keys(offeringsByCountry)
  const [selectedCurrency, setSelectedCurrency] = useState(props.selectedOffering.quoteCurrency.currencyCode)

  const baseCurrency = props.selectedOffering.baseCurrency.currencyCode
  const quoteCurrency = props.selectedOffering.quoteCurrency.currencyCode

  const handleQuoteAmountChange = (quoteUnits: string) => {
    const formattedQuoteUnits =
      selectedCurrency === 'BTC'
        ? formatUnits(quoteUnits, 8)
        : formatUnits(quoteUnits, 2)
  
    props.setCurrentQuoteAmount(formattedQuoteUnits)
    props.setCurrentBaseAmount(
      convertToBaseUnits(formattedQuoteUnits, props.selectedOffering.quoteUnitsPerBaseUnit)
    )
    props.validateAmount(formattedQuoteUnits)
  }

  const handleOfferingChange = (currency) => {
    if (currency !== selectedCurrency) {
      setSelectedCurrency(currency)
      props.setSelectedOffering(offeringsByCountry[currency])
      handleQuoteAmountChange('')
    }
  }

  return (
    <div>
      <div className="relative mt-2 rounded-md shadow-sm">
        <p className={`absolute mt-[-10px] ml-3 text-sm text-red-600 ${props.isAmountValid ? 'hidden' : ''}`}>
          {props.minQuoteAmount >= 0 && parseFloat(props.currentQuoteAmount) < props.minQuoteAmount
            ? `Minimum order is ${props.minQuoteAmount} ${quoteCurrency}`
            : props.maxQuoteAmount >= 0 && parseFloat(props.currentQuoteAmount) > props.maxQuoteAmount
            ? `Maximum order is ${props.maxQuoteAmount} ${quoteCurrency}`
            : null}
        </p>
        <div className="flex items-center">
          <input
            type="text"
            className="block w-full text-2xl border-0 text-indigo-600 bg-transparent rounded-md focus:text-indigo-600 placeholder:text-gray-400 focus:ring-transparent sm:leading-6"
            placeholder="0.00"
            aria-describedby="price-currency"
            value={props.currentQuoteAmount}
            onChange={(e) => handleQuoteAmountChange(e.target.value)}
          />
          <div className="w-40 text-xl" style={{ position: 'relative', top: '-5px', }}>
            <Dropdown items={currencyKeys} selectedItem={selectedCurrency} setSelectedItem={handleOfferingChange} selectedItemColor='text-gray-400' label={currencyKeys[0]} />
          </div>
        </div>        
        <label className="block text-xs leading-6 pl-3 -mt-3 text-gray-300">{'You Send'}</label>
      </div>

      <div className="relative mt-3 rounded-md shadow-sm">
        <div className="flex items-center">
          <input
            type="text"
            className="block w-full text-2xl border-0 py-1.5 text-neutral-200 bg-transparent rounded-md placeholder:text-gray-400 focus:ring-transparent sm:leading-6"
            placeholder="0.00"
            aria-describedby="price-currency"
            value={formatUnits(props.currentBaseAmount, 2)}
            readOnly
          />
          <div className='mr-10 pr-1 mb-1 text-gray-400 text-xl'>{baseCurrency}</div>
        </div>   
      </div>
      <label className="block text-xs leading-6 pl-3 -mt-1 text-gray-300"> {'They get'} </label>{' '}

      <div className="grid grid-cols-2 gap-0.5 mt-5 border border-gray-500 rounded-md p-3 text-xs">
        <div className="text-left text-gray-400">Est. rate</div>
        <div className="text-right w-[130%] ml-[-30%] text-gray-400">{getExchangeRate(props.selectedOffering.quoteUnitsPerBaseUnit, baseCurrency, quoteCurrency)}</div>

        <div className="text-left text-gray-400 mt-2">Service fee</div>
        {props.selectedOffering.feeSubunits ? (
          <div className="text-right text-gray-400 mt-2">{fromCents(props.selectedOffering.feeSubunits).format()}</div>
        ) : (
          <div className="text-right text-gray-400 mt-2">0.00 {quoteCurrency}</div>
        )}     
      </div>
    </div>
  )
}
