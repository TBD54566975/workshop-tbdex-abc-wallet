import { BearerDid } from '@web5/dids'
import { Close, Offering, TbdexHttpClient } from '@tbdex/http-client'
import { SendOrderOptions, SendRfqOptions, sendOrder, sendRFQ } from './messageUtils'
import { Jwt, VcDataModel } from '@web5/credentials'

export type ClientExchange = {
  id: string;
  payinAmount: string;
  payinCurrency: string;
  payoutAmount: string;
  payoutCurrency: string;
  status: 'rfq' | 'quote' | 'order' | 'orderstatus' | 'failed' | 'expired' | 'completed',
  createdTime: string,
  expirationTime?: string,
  from: string,
  to: string,
  pfiUri: string
}

// 1a. Render the credential you obtained from the issuer.
export function renderCredential(credentialJwt: string) {
  const vc: Partial<VcDataModel> = Jwt.parse({ jwt: credentialJwt }).decoded.payload['vc']
  return {
    title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'), // get the last credential type in the array and format it with spaces
    countryCode: vc.credentialSubject['countryCode'],
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}

export function isMatchingOffering(offering: Offering, credentials: string[]) {
  const vc: Partial<VcDataModel> = Jwt.parse({ jwt: credentials[0] }).decoded.payload['vc']
  let matches = 0
  for (const field of offering.data.requiredClaims.input_descriptors[0].constraints.fields) {
    for (const key in vc.credentialSubject) {
      if (field.path.includes(`$.credentialSubject.${key}`)) {
          matches++
      }
    }
    if (field.path.includes(`$.issuer`) && vc.issuer && field.filter.const == vc.issuer) {
      matches++
    }
    if (field.path.includes(`$.type[*]`) && vc.type && vc.type.includes(field.filter.const.toString())) {
      matches++
    }
  }
  return matches == Object.keys(offering.data.requiredClaims.input_descriptors[0].constraints.fields).length
}


// 1b. Fetch current exchanges in progress
export async function fetchExchanges(params: {didState: BearerDid, pfiUri: string }) {
  const { didState, pfiUri } = params
  try {
    const exchanges = await TbdexHttpClient.getExchanges({
      pfiDid: pfiUri,
      did: didState
    })
    const mappedExchanges = exchanges.map(exchange => {
      const latestMessage = exchange[exchange.length - 1]
      const rfqMessage = exchange.find(message => message.kind === 'rfq')
      const quoteMessage = exchange.find(message => message.kind === 'quote')
      const status = generateExchangeStatusValues(latestMessage)
      const fee = quoteMessage?.data['payin']?.['fee']
      const payinAmount = quoteMessage?.data['payin']?.['amount']
      return {
        id: latestMessage.metadata.exchangeId,
        payinAmount: (fee ? Number(payinAmount) + Number(fee) : Number(payinAmount)).toString() || rfqMessage.data['payinAmount'],
        payinCurrency: quoteMessage.data['payin']?.['currencyCode'] ?? null,
        payoutAmount: quoteMessage?.data['payout']?.['amount'] ?? null,
        payoutCurrency: quoteMessage.data['payout']?.['currencyCode'],
        status,
        createdTime: rfqMessage.createdAt,
        ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
        from: 'You',
        to: rfqMessage.data['payoutMethod']?.paymentDetails.address,
        pfiDid: rfqMessage.metadata.to
      }
    })
    return mappedExchanges
  } catch (e) {
    throw new Error(`Error fetching exchanges: ${e}`)
  }
}

// 1c. Fetch offerings to choose from
export async function fetchOfferings(pfiUri: string) {
  try {
    const offerings = await TbdexHttpClient.getOfferings({
      pfiDid: pfiUri
    })
    return offerings
  } catch (e) {
    throw new Error(`Error fetching offerings: ${e}`)
  }
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

// 2. Once you choose an offering, create an exchange but submitting an rfq
export async function createExchange(opts: SendRfqOptions) {
  return await sendRFQ({ ...opts })
}

// 3. At this point, the pfi has sent back a quote in response to your rfq
export async function createOrder(opts: SendOrderOptions) {
  return await sendOrder({ ...opts })
}

// 4. At this point, the pfi is responsible for all the rest of the bits of the exchange 
// this will be order status
// then close
