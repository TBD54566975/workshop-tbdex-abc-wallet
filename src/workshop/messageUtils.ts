/* Use `TbdexHttpClient` to access convenience methods for creating and sending messages */

// import { Close, Order, Rfq, RfqData, TbdexHttpClient, CloseData, RfqData, OrderData } from '@tbdex/http-client'
import { BearerDid } from '@web5/dids'

export type SendRfqOptions = {
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
  pfiUri: string
}

export async function sendRFQ(opts: SendRfqOptions) {
  /* Replace code here */
  return opts
}

export async function sendOrder(opts: SendOrderOptions) {
  /* Replace code here */
  return opts
}

export async function sendClose(opts: SendCloseOptions) {
  /* Replace code here */
  return opts
}