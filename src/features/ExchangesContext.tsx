import React, { useState } from 'react'

/**
 * This component provides a context to manage Exchangesdata.
 *
 * @param {Object} props.children - Child components wrapped by the ExchangesProvider.
 * @param {Object} props.offeringsByCountry - Offerings by country used for displaying in the Offerings page.
 * @returns {JSX.Element} - Returns the ExchangesProvider component.
 */
export const ExchangesContext = React.createContext({ 
  exchangesUpdated: undefined,
  setExchangesUpdated: undefined,
})

export const ExchangesProvider = ({ children }) => {
  const [exchangesUpdated, setExchangesUpdated] = useState(false)

  return (
    <ExchangesContext.Provider
      value={{
        exchangesUpdated,
        setExchangesUpdated
      }}
    >
      {children}
    </ExchangesContext.Provider>
  )
}