import { SelectedPaymentMethod, TbdexHttpClient } from '@tbdex/http-client'
import { PortableDid } from '@web5/dids'

export type SendRfqOptions = {
  offeringId: string, 
  payinSubunits: string, 
  payinMethod: SelectedPaymentMethod,
  payoutMethod: SelectedPaymentMethod,
  credentials: string[],
  didState: PortableDid,
  pfiDid: string
}

export type SendOrderOptions = {
  exchangeId: string,
  didState: PortableDid,
  pfiDid: string
}

export async function sendRFQ(opts: SendRfqOptions) {
  const { 
    offeringId, 
    payinSubunits, 
    payinMethod,
    payoutMethod,
    credentials,
    didState,
    pfiDid
  } = opts
  let message
  /* <--- Add code here ---> */
  return await TbdexHttpClient.sendMessage({ message })
}

export async function sendOrder(opts: SendOrderOptions) {
  const { 
    exchangeId,
    didState,
    pfiDid
  } = opts
  let message
  /* <--- Add code here ---> */
  return await TbdexHttpClient.sendMessage({ message })
}

export function renderOrderStatus (exchange) {
  const status = generateExchangeStatusValues(exchange)
  switch (status) {
    /* <--- Add code here ---> */
    default:
      return 'Unknown status'
  }
}

export function generateExchangeStatusValues(exchange) {
  if (exchange.kind === 'close') {
    if (exchange.data.reason.toLowerCase().includes('completed')) {
      return 'completed'
    } else if (exchange.data.reason.toLowerCase().includes('expired')) {
      return 'expired'
    } else {
      return 'failed'
    }
  }
  return exchange.kind
}