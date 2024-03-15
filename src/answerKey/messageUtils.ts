import { Close, Order, Rfq, TbdexHttpClient, CloseData, RfqData, OrderData } from '@tbdex/http-client'
import { BearerDid } from '@web5/dids'

export type SendRfqOptions = RfqData & {
  didState: BearerDid,
  pfiUri: string
}

export type SendOrderOptions = OrderData & {
  exchangeId: string,
  didState: BearerDid,
  pfiUri: string
}

export type SendCloseOptions = CloseData & {
  exchangeId: string,
  didState: BearerDid,
  pfiUri: string
}

export async function sendRFQ(opts: SendRfqOptions) {
  const { 
    offeringId, 
    payinAmount, 
    payinMethod,
    payoutMethod,
    claims,
    didState,
    pfiUri
  } = opts
  const message = Rfq.create({
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
  await message.sign(didState)
  return await TbdexHttpClient.sendMessage({ message })
}

export async function sendOrder(opts: SendOrderOptions) {
  const { 
    exchangeId,
    didState,
    pfiUri
  } = opts
  const message = Order.create({
    metadata: {
      exchangeId: exchangeId,
      from: didState.uri,
      to: pfiUri
    }
  })
  await message.sign(didState)
  return await TbdexHttpClient.sendMessage({ message })
}

export async function sendClose(opts: SendCloseOptions) {
  const { 
    exchangeId,
    didState,
    pfiUri,
    reason
  } = opts
  const message = Close.create({
    metadata: {
      exchangeId: exchangeId,
      from: didState.uri,
      to: pfiUri
    },
    data: {
      reason
    }
  })
  await message.sign(didState)
  return await TbdexHttpClient.sendMessage({ message })
}