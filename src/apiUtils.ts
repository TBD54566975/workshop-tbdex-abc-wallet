import { PortableDid } from '@web5/dids'
import { fromCents } from './currency-utils'
import { TbdexHttpClient, Rfq, Message, SelectedPaymentMethod, Order } from '@tbdex/http-client'
import { JwtHeader, JwtPayload } from 'jwt-decode'
import { Convert } from '@web5/common'
import { Ed25519, Jose } from '@web5/crypto'
import { didState } from './state'

const samplePfiDid = 'did:dht:rriy6zgrhh9c53kbbifkamhmfi4y8ep8sibxsri9hj9q8wx6f1ao'


export async function checkTbdDollars(didState) {
  return await createTBDollarsRequest(didState, '/tbdollars?check=true')
}

export async function addTBDollars(didState) {
  return await createTBDollarsRequest(didState, '/tbdollars')
}

async function createTBDollarsRequest(didState, reqEndpoint) {
  try {
    const pfiEndpoint = await TbdexHttpClient.getPfiServiceEndpoint(samplePfiDid)
    const token = await createJwtToken(didState)
    const res = await fetch(pfiEndpoint + reqEndpoint, {
      headers: {
        'Authorization': 'Bearer ' + token
      }
    })
    return await res.json()
  } catch (e) {
    throw new Error(e)
  }
}

async function createJwtToken(did: PortableDid) {
  const privateKeyJwk = did.keySet.verificationMethodKeys[0].privateKeyJwk

  const header: JwtHeader = { typ: 'JWT', alg: privateKeyJwk.alg, kid: did.document.verificationMethod[0].id }
  const base64UrlEncodedHeader = Convert.object(header).toBase64Url()

  const payload: JwtPayload = { jti: new Date().toISOString() }
  const base64UrlEncodedPayload = Convert.object(payload).toBase64Url()

  const toSign = `${base64UrlEncodedHeader}.${base64UrlEncodedPayload}`
  const toSignBytes = Convert.string(toSign).toUint8Array()

  const { keyMaterial } = await Jose.jwkToKey({ key: privateKeyJwk })

  const signatureBytes = await Ed25519.sign({ key: keyMaterial, data: toSignBytes })
  const base64UrlEncodedSignature = Convert.uint8Array(signatureBytes).toBase64Url()

  return `${toSign}.${base64UrlEncodedSignature}`
}


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
  const message = Rfq.create({
    data: {
      offeringId,
      payinSubunits,
      payinMethod,
      payoutMethod,
      claims: credentials
    },
    metadata: {
      from: didState.did,
      to: samplePfiDid
    }
  })
  await message.sign(didState)
  const response = await TbdexHttpClient.sendMessage({ message })
  console.log(response)
}

export async function createOrder(opts: {
  exchangeId: string,
  didState: PortableDid
}) {
  const message = Order.create({
    metadata: {
      exchangeId: opts.exchangeId,
      from: opts.didState.did,
      to: samplePfiDid
    }
  })
  await message.sign(opts.didState)
  const response = await TbdexHttpClient.sendMessage({ message })
  console.log(response)
}

export async function fetchExchanges(didState) {
  const response = await TbdexHttpClient.getExchanges({
    pfiDid: samplePfiDid,
    did: didState,
  })
  console.log(response.data)
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


