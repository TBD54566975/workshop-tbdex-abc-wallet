import { Close, Order, Rfq, RfqData, TbdexHttpClient } from '@tbdex/http-client'
import { BearerDid } from '@web5/dids'

export type SendRfqOptions = RfqData & {
  didState: BearerDid,
  pfiDid: string
}

export type SendOrderOptions = {
  exchangeId: string,
  didState: BearerDid,
  pfiDid: string
}

export async function sendRFQ(opts: SendRfqOptions) {
  const { 
    offeringId, 
    payinAmount, 
    payinMethod,
    payoutMethod,
    claims,
    didState,
    pfiDid
  } = opts
  const rfq = Rfq.create({
    data: {
      offeringId,
      payinAmount,
      payinMethod,
      payoutMethod,
      claims
    },
    metadata: {
      from: didState.uri,
      to: pfiDid
    }
  })
  await rfq.sign(didState)
  return await TbdexHttpClient.sendMessage({ message: rfq })
}

export async function sendOrder(opts: SendOrderOptions) {
  const { 
    exchangeId,
    didState,
    pfiDid
  } = opts
  const order = Order.create({
    metadata: {
      exchangeId: exchangeId,
      from: didState.uri,
      to: pfiDid
    }
  })
  await order.sign(didState)
  return await TbdexHttpClient.sendMessage({ message: order })
}

export function generateExchangeStatusValues(exchangeMessage) {
  if (exchangeMessage instanceof Close) {
    if (exchangeMessage.data.reason.toLowerCase().includes('complete')) {
      return 'completed'
    } else if (exchangeMessage.data.reason.toLowerCase().includes('expired')) {
      return 'expired'
    } else {
      return 'failed'
    }
  }
  return exchangeMessage.kind
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