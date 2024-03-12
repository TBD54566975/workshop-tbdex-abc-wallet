import { BearerDid } from '@web5/dids'
import { TbdexHttpClient } from '@tbdex/http-client'
import { SendOrderOptions, SendRfqOptions, generateExchangeStatusValues, sendOrder, sendRFQ } from './messageUtils'
import { Jwt, VcDataModel } from '@web5/credentials'

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

// 1a. Render the credential you obtained from the issuer.
export function renderCredential(credentialJwt: string) {
  const vc: Partial<VcDataModel> = Jwt.parse({ jwt: credentialJwt }).decoded.payload['vc']
  return {
    title: vc.type[vc.type.length - 1].replace(/(?<!^)(?<![A-Z])[A-Z](?=[a-z])/g, ' $&'), // get the last credential type in the array and format it with spaces
    subjectName: vc.credentialSubject['name'],
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}


// 1b. Fetch current exchanges in progress
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
        id: latestMessage.metadata.exchangeId,
        payinAmount: (quoteMessage?.data['payin']?.['amount'] + quoteMessage?.data['payin']?.['fee']) || rfqMessage.data['payinAmount'],
        payoutAmount: (quoteMessage?.data['payout']?.['amount'] || null),
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

// 1c. Fetch offerings to choose from
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
