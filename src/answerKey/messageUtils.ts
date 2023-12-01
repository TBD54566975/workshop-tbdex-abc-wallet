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
  // const message = Rfq.create({
  //   data: {
  //     offeringId,
  //     payinSubunits,
  //     payinMethod,
  //     payoutMethod,
  //     claims: credentials
  //   },
  //   metadata: {
  //     from: didState.did,
  //     to: pfiDid
  //   }
  // })
  // await message.sign(didState)
  return await TbdexHttpClient.sendMessage({ message })
}

export async function sendOrder(opts: SendOrderOptions) {
  const { 
    exchangeId,
    didState,
    pfiDid
  } = opts
  let message
  // const message = Order.create({
  //   metadata: {
  //     exchangeId: exchangeId,
  //     from: didState.did,
  //     to: pfiDid
  //   }
  // })
  // await message.sign(didState)
  return await TbdexHttpClient.sendMessage({ message })
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

export function renderOrderStatus (exchange) {
  const status = generateExchangeStatusValues(exchange)
  switch (status) {
    case 'rfq':
      return 'Requested'
    case 'quote':
      return 'Quoted'
    case 'order':
    case 'orderstatus':
      return 'Pending'
    case 'completed':
      return 'Completed'
    case 'expired':
      return 'Expired'
    case 'failed':
      return 'Failed'
    default:
      return 'Unknown status'
  }
}