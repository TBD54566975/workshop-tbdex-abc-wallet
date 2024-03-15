import { Close, Order, Rfq, RfqData, TbdexHttpClient } from '@tbdex/http-client'
import { BearerDid } from '@web5/dids'

export type SendRfqOptions = RfqData & {
  didState: BearerDid,
  pfiUri: string
}

export type SendOrderOptions = {
  exchangeId: string,
  didState: BearerDid,
  pfiUri: string
}

export type SendCloseOptions = {
  exchangeId: string,
  didState: BearerDid,
  pfiUri: string,
  reason: string
}

export async function sendRFQ(opts: SendRfqOptions) {
  return
  const { 
    offeringId, 
    payinAmount, 
    payinMethod,
    payoutMethod,
    claims,
    didState,
    pfiUri
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
      to: pfiUri
    }
  })
  await rfq.sign(didState)
  return await TbdexHttpClient.sendMessage({ message: rfq })
}

export async function sendOrder(opts: SendOrderOptions) {
  return
  const { 
    exchangeId,
    didState,
    pfiUri
  } = opts
  const order = Order.create({
    metadata: {
      exchangeId: exchangeId,
      from: didState.uri,
      to: pfiUri
    }
  })
  await order.sign(didState)
  return await TbdexHttpClient.sendMessage({ message: order })
}

export async function sendClose(opts: SendCloseOptions) {
  return
  const { 
    exchangeId,
    didState,
    pfiUri, 
    reason 
  } = opts
  const close = Close.create({
    metadata: { 
      exchangeId: exchangeId,
      from: didState.uri,
      to: pfiUri,
    },
    data: {
      reason
    }
  })
  
  await close.sign(didState)
  return close
}