import { BearerDid } from '@web5/dids'
import { fromCents, fromSats } from './currency-utils'
import { TbdexHttpClient } from '@tbdex/http-client'
import { JwtPayload } from '@web5/crypto'
import { SendOrderOptions, SendRfqOptions, generateExchangeStatusValues, sendOrder, sendRFQ } from './messageUtils'
import { Jwt, VcDataModel } from '@web5/credentials'
import { typeid } from 'typeid-js'

export const whitelist = [
  JSON.parse(localStorage.getItem('pfi_0')).uri,
  JSON.parse(localStorage.getItem('pfi_1')).uri,
  JSON.parse(localStorage.getItem('pfi_2')).uri
]

export type ClientExchange = {
  id: string;
  payinAmount: string;
  payoutAmount: string;
  status: 'rfq' | 'quote' | 'order' | 'orderstatus' | 'failed' | 'expired' | 'completed',
  createdTime: string,
  expirationTime?: string,
  from: string,
  to: string
}

export async function createExchange(opts: SendRfqOptions) {
  return await sendRFQ({ ...opts })
}

export async function createOrder(opts: SendOrderOptions) {
  return await sendOrder({ ...opts })
}

export async function fetchOfferings(pfiDid: string) {
  try {
    const offerings = await TbdexHttpClient.getOfferings({
      pfiDid
    })
    return offerings
  } catch (e) {
    throw new Error(`Error fetching offerings: ${e}`)
  }
}

export async function fetchExchanges(params: {didState: BearerDid, pfiDid: string }) {
  const { didState, pfiDid } = params
  try {
    const exchanges = await TbdexHttpClient.getExchanges({
      pfiDid: pfiDid,
      did: didState
    })
    const mappedExchanges = exchanges.map(exchange => {
      const latestMessage = exchange[exchange.length - 1]
      const rfqMessage = exchange.find(message => message.kind === 'rfq')
      const quoteMessage = exchange.find(message => message.kind === 'quote')
      const status = generateExchangeStatusValues(latestMessage)
      return {
        id: latestMessage.exchangeId,
        payinAmount: fromCents((quoteMessage?.data['payin']?.['amount'] + quoteMessage?.data['payin']?.['fee']) || rfqMessage.data['payinAmount']),
        payoutAmount: fromSats(quoteMessage?.data['payout']?.['amount'] || null),
        status,
        createdTime: rfqMessage.createdAt,
        ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
        from: 'You',
        to: rfqMessage.data['payoutMethod']?.paymentDetails.address,
      }
    })
    return mappedExchanges
  } catch (e) {
    throw new Error(`Error fetching exchanges: ${e}`)
  }
}

export async function getTBDollars(params: {didState: BearerDid, topup?: boolean}) {
  const { didState, topup } = params
  try {
    const pfiEndpoint = await TbdexHttpClient.getPfiServiceEndpoint(whitelist[0])
    const token = await createJwtToken({ requesterDid: didState, pfiDid: whitelist[0] })
    const res = await fetch(pfiEndpoint + '/tbdollars' + (topup ? '?topup=true' : ''), {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    return (await res.json()).balance / 100
  } catch (e) {
    throw new Error(e)
  }
}

async function createJwtToken(params: { requesterDid: BearerDid, pfiDid: string }) {
  const { pfiDid, requesterDid } = params
  const now = Date.now()
  const exp = now + 60000

  const jwtPayload: JwtPayload = {
    aud : pfiDid,
    iss : requesterDid.uri,
    exp : Math.floor(exp / 1000),
    iat : Math.floor(now / 1000),
    jti : typeid().getSuffix()
  }

  try {
    return await Jwt.sign({ signerDid: requesterDid, payload: jwtPayload })
  } catch (e) {
    throw Error(e)
  }
}

export function renderCredential(credentialJwt: string) {
  const vc: Partial<VcDataModel> = Jwt.parse({ jwt: credentialJwt }).decoded.payload['vc']
  return {
    title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'), // get the last credential type in the array and format it with spaces
    subjectName: vc.credentialSubject['name'],
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}


