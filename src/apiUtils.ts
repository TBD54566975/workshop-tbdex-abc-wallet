import { PortableDid } from '@web5/dids'
import { fromCents, fromSats } from './currency-utils'
import { TbdexHttpClient, Rfq, SelectedPaymentMethod, Order } from '@tbdex/http-client'
import { JwtHeader, JwtPayload, jwtDecode } from 'jwt-decode'
import { Convert } from '@web5/common'
import { Ed25519, Jose } from '@web5/crypto'

const samplePfiDid = 'did:dht:5gpofcggqett54keipcbxtm8k887tgnx4c8n4sec65jcf18yb48y'


export async function getTBDollars(didState, topup?: boolean) {
  try {
    const pfiEndpoint = await TbdexHttpClient.getPfiServiceEndpoint(samplePfiDid)
    const token = await createJwtToken(didState)
    const res = await fetch(pfiEndpoint + '/tbdollars' + (topup ? '?topup=true' : ''), {
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
  return response
}

export async function fetchExchanges(didState, vc?) {
  const response = await TbdexHttpClient.getExchanges({
    pfiDid: samplePfiDid,
    did: didState
  })
  console.log(response.data)
  const exchanges = response.data.map(exchange => {
    const latestMessage = exchange[exchange.length - 1]
    const rfqMessage = exchange.find(message => message.kind === 'rfq')
    const quoteMessage = exchange.find(message => message.kind === 'quote')
    const status = generateExchangeStatusValues(latestMessage)
    return {
      id: latestMessage.exchangeId,
      payinAmount: fromCents(quoteMessage?.data['payin']?.['amountSubunits'] + quoteMessage?.data['payin']?.['feeSubunits'] || rfqMessage.data['payinSubunits']),
      payoutAmount: fromSats(quoteMessage?.data['payout']?.['amountSubunits'] || null),
      status,
      createdTime: rfqMessage.createdAt,
      ...latestMessage.kind === 'quote' && {expirationTime: quoteMessage.data['expiresAt'] ?? null},
      from: (vc ? '@' + vc.credentialSubject.username : 'You'),
      to: rfqMessage.data['payoutMethod']?.paymentDetails.address,
    }
  })
  return exchanges
}

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

function generateExchangeStatusValues(exchange) {
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

export function renderTBDeveloperCredential(credentialJwt: string) {
  const vc = jwtDecode(credentialJwt)['vc']
  return {
    title: 'TBDeveloper Credential',
    userName: '@' + vc.credentialSubject.username,
    issuanceDate: new Date(vc.issuanceDate).toLocaleDateString(undefined, {dateStyle: 'medium'}),
  }
}


