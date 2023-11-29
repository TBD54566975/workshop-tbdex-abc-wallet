import { fromCents } from './currency-utils'
import { TbdexHttpClient, Rfq, Message, SelectedPaymentMethod } from '@tbdex/http-client'

const samplePfiDid = 'did:dht:qddijzptgwczufcj7ut6xcxmbunpg1bx43zu9xaorjpsb7xmmjxo'

export async function fetchOfferings() {
  const response = await TbdexHttpClient.getOfferings({
    pfiDid: samplePfiDid
  })
  if (response.errors) {
    throw new Error(`(${response.status}) - ${response.errors[0].detail}`)
  }
  return response.data
}

export async function createExchange(opts: {
  offeringId: string, 
  payinSubunits: string, 
  payinMethod: SelectedPaymentMethod,
  payoutMethod: SelectedPaymentMethod,
  credentials: string[],
  didState
}) {
  const { 
    offeringId, 
    payinSubunits, 
    payinMethod,
    payoutMethod,
    credentials,
    didState
  } = opts
  const messageId = Message.generateId('rfq')
  const metadata = {
    from: didState.did,
    to: samplePfiDid,
    kind: 'rfq' as const,
    id: messageId,
    exchangeId: messageId,
    createdAt: new Date().toISOString()
  }
  const data = {
    offeringId,
    payinSubunits,
    payinMethod,
    payoutMethod,
    claims: credentials
  }
  const message = new Rfq({ data, metadata })
  const { privateKeyJwk, kid } = getDidDetails(didState)
  await message.sign(privateKeyJwk, kid)
  const response = await TbdexHttpClient.sendMessage({ message })
  console.log(response)
}

export async function fetchExchanges(didState) {
  const response = await TbdexHttpClient.getExchanges({
    pfiDid: samplePfiDid,
    ...getDidDetails(didState)
  })
  const exchanges = response.data.map(exchange => {
    const latestMessage = exchange[exchange.length - 1]
    const status = generateExchangeStatusValues(latestMessage.metadata.kind)
    // todo: fix this
    return {
      id: latestMessage.exchangeId,
      payinAmount: fromCents(latestMessage.data['payin']?.['amountSubunits'] + latestMessage.data['payin']?.['feeSubunits'] || latestMessage.data['payinSubunits']),
      payoutAmount: fromCents(latestMessage.data['payout']?.['amountSubunits'] || 100),
      btcAddress: latestMessage.data['payoutMethod'].paymentDetails.address,
      status,
      createdTime: latestMessage.createdAt,
      expirationTime: latestMessage.data['expiresAt'] ?? null
    }
  })
  return exchanges
}

export type ClientExchange = {
  id: string;
  payinAmount: string;
  payoutAmount: string;
  btcAddress: string;
  status: { name: string; value: number },
  createdTime: string,
  expirationTime?: string
}

function getDidDetails(didState) {
  return {
    privateKeyJwk: didState.keySet.verificationMethodKeys.find(key => key.relationships.includes('authentication')).privateKeyJwk,
    kid: didState.document.verificationMethod.find(method => method.controller === didState.did).id
  }
}

function generateExchangeStatusValues(exchangeKind, isExpired?, isFailed?) {
  //todo: fix these
  switch (exchangeKind) {
    case 'rfq' :
      return { 
        name: 'EX_REQUESTED', 
        value: 110
      }
    case 'quote' :
      return {
        name: 'EX_QUOTED', 
        value: 100
      }
    case 'order' :
      return {
        name: 'EX_SUBMITTED', 
        value: 120
      }
    case 'orderstatus' :
      return {
        name: 'EX_PROCESSING', 
        value: 130
      }
    case 'close' :
      return {
        name: isExpired ? 'EX_EXPIRED' : isFailed ? 'EX_FAILED' : 'EX_COMPLETED', 
        value: isExpired ? 300 : isFailed ? 310 : 200
      }
    default :
      return {
        name: 'Unkown', 
        value: null
      }
  }
}


