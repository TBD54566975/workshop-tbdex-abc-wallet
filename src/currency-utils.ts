import currency from 'currency.js'

export const fromCents = value => currency(value, { symbol: '', fromCents: true })
export const money = value => currency(value, { symbol: '' })
export const TBD = value => currency(value)
export const BTC = value => currency(value, { symbol: '₿', precision: 8})
export const fromSats = value => value/100_000_000

export function removeTrailingZeros(inputString) {
  return inputString.replace(/(\.0*|0*)$/, '')
}

/**
 * Gets the exchange rate between two currencies.
 * @param quoteUnitsPerBaseUnit - The exchange rate value.
 * @param baseCurrencyCode - The currency code of the base currency.
 * @param quoteCurrencyCode - The currency code of the quote currency.
 * @returns {string} - The formatted exchange rate string.
 */
export function getExchangeRate(quoteUnitsPerBaseUnit: string, baseCurrencyCode: string, quoteCurrencyCode: string) {
  const exchangeRate = parseFloat(quoteUnitsPerBaseUnit)
  return `1 ${quoteCurrencyCode} = ${exchangeRate} ${baseCurrencyCode}`
}

/**
 * Gets the subunits of a currency amount (e.g. for USD, 10 units -> 1000 subunits).
 * @param quoteAmountUnits - The amount in a particular currency.
 * @returns {string} - The amount in subunits.
 */
export function getSubunits(quoteAmountUnits: string, quoteCurrencyCode: string) {
  let subunits = 0
  if(quoteCurrencyCode === 'BTC') {
     subunits = Number(quoteAmountUnits)*100_000_000
    } else if(quoteCurrencyCode ==='USDC' || quoteCurrencyCode ==='USD' || quoteCurrencyCode ==='TBD') {
      subunits = Number(quoteAmountUnits)*100
    } else {
      console.error('unexpected currency code', quoteCurrencyCode)
    }
    
  return subunits.toFixed(0).toString()
}

/**
 * Shortens a BTC address for display purposes.
 * @param address - The full BTC address.
 * @returns {string} - The shortened version of the address.
 */
export function shortenAddress(address) {
  const prefixLength = 6
  const suffixLength = 4
  
  if (!address || address.length <= prefixLength + suffixLength) {
    return address
  }
  
  const prefix = address.substring(0, prefixLength)
  const suffix = address.substring(address.length - suffixLength)
  
  const shortenedAddress = `${prefix}...${suffix}`
  
  return shortenedAddress
}

/**
 * Converts the given amount in quote units to its equivalent in base units.
 * @param quoteUnits - The amount in quote units.
 * @param quoteUnitsPerBaseUnit - The exchange rate value.
 * @returns {string} - The converted amount in base units.
 */
export function convertToBaseUnits(quoteUnits: string, quoteUnitsPerBaseUnit: string) {
  const parsedUnitPrice = parseFloat(
    quoteUnitsPerBaseUnit.replace(/,/g, '')
  )

  if (quoteUnits !== '') {
    const baseUnits = (parseFloat(quoteUnits) * parsedUnitPrice).toString()
    return baseUnits
  } else {
    return ''
  }
}

/**
 * Formats a numeric input with the specified decimal length.
 * @param input - The input value to be formatted.
 * @param decimalLength - The desired length of decimal digits.
 * @returns {string} - The formatted numeric string.
 */
export function formatUnits(input: string, decimalLength: number): string {
  // Remove any non-numeric and non-decimal characters except the first decimal point
  const numericValue = input.replace(/[^\d.]/g, (match, offset) => {
    if (match === '.') {
      // Allow the first decimal point
      return offset === 0 ? match : ''
    }
    return ''
  })

  // Remove additional decimal points if present
  const decimalIndex = numericValue.indexOf('.')
  if (decimalIndex !== -1) {
    const afterDecimal = numericValue.slice(decimalIndex + 1)
    const remainingDecimals = afterDecimal.slice(0, decimalLength)
    const ret = `${numericValue.slice(0, decimalIndex)}.${remainingDecimals}`
    return ret
  }

  return numericValue
}
  