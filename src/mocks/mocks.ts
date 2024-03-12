import { Close, Offering, Order, OrderStatus, Quote, Rfq } from '@tbdex/http-client'
import { VerifiableCredential } from '@web5/credentials'
import { BearerDid, DidDht } from '@web5/dids'
import issuer from './issuer.json' assert { type: 'json' }
import pfi_0 from './pfi_0.json' assert { type: 'json' }
import pfi_1 from './pfi_1.json' assert { type: 'json' }
import pfi_2 from './pfi_2.json' assert { type: 'json' }

export const mockProviderDids = {
  issuer: {
    get bearerDid() {
      return DidDht.import({ portableDid: JSON.parse(JSON.stringify(issuer)) })
    },
    get uri() {
      return issuer.uri
    }
  }, 
  pfi_0: {
    get bearerDid() {
      return DidDht.import({ portableDid: JSON.parse(JSON.stringify(pfi_0)) })
    },
    get uri() {
      return pfi_0.uri
    }
  }, 
  pfi_1: {
    get bearerDid() {
      return DidDht.import({ portableDid: JSON.parse(JSON.stringify(pfi_1)) })
    },
    get uri() {
      return pfi_1.uri
    }
  }, 
  pfi_2: {
    get bearerDid() {
      return DidDht.import({ portableDid: JSON.parse(JSON.stringify(pfi_2)) })
    },
    get uri() {
      return pfi_2.uri
    }
  }, 
}

export async function issueCredential(params: { subjectDid: string, data: Record<string, unknown> }) {
  const { subjectDid, data } = params
  const issuer = await mockProviderDids.issuer.bearerDid

  const vc = await VerifiableCredential.create({
    type: 'ABC Credential',
    issuer: issuer.uri,
    subject: subjectDid,
    data
  })

  const vcJwt = await vc.sign({ did: issuer })
  return vcJwt
}

export async function createOffering(params: { pfiDid: BearerDid, offeringData }) {
  const { pfiDid, offeringData } = params

  const offering = Offering.create({
    metadata: { 
      from: pfiDid.uri
    },
    data: offeringData
  })
  
  await offering.sign(pfiDid)
  return offering
}

export async function createQuote(params: { pfiDid: BearerDid, rfq: Rfq, payoutAmount: string }) {
  const { pfiDid, rfq, payoutAmount } = params
  const quote = Quote.create({
    metadata: { 
      from: pfiDid.uri,
      to: rfq.metadata.from,
      exchangeId: rfq.metadata.exchangeId
    },
    data: {
      expiresAt: new Date((Date.now() + 3_600_000)).toISOString(), // expires in 1 hour
      payin: {
        currencyCode: 'TBD',
        amount: rfq.data.payinAmount
      },
      payout: {
        currencyCode: 'BTC',
        amount: payoutAmount
      }
    }
  })
  
  await quote.sign(pfiDid)
  return quote
}

export async function createOrderStatus(params: { pfiDid: BearerDid, order: Order, status: string }) {
  const { pfiDid, order, status } = params
  const orderStatus = OrderStatus.create({
    metadata: { 
      from: pfiDid.uri,
      to: order.metadata.from,
      exchangeId: order.metadata.exchangeId
    },
    data: {
      orderStatus: status
    }
  })
  
  await orderStatus.sign(pfiDid)
  return orderStatus
}

export async function createClose(params: { pfiDid: BearerDid, orderStatus: OrderStatus, reason: string }) {
  const { pfiDid, orderStatus, reason } = params
  const close = Close.create({
    metadata: { 
      from: pfiDid.uri,
      to: orderStatus.metadata.from,
      exchangeId: orderStatus.metadata.exchangeId
    },
    data: {
      reason
    }
  })
  
  await close.sign(pfiDid)
  return close
}

export const offeringDataTBDollarsToBitcoin_0 = {
  description: 'Exchange your TBDollars for Bitcoin',
  payoutUnitsPerPayinUnit: '0.000027',
  payinCurrency: { currencyCode: 'TBD' },
  payoutCurrency: { currencyCode: 'BTC' },
  payinMethods: [{
    kind: 'TBDOLLARS_BALANCE',
    requiredPaymentDetails:{}
  }],
  payoutMethods: [
    {
      kind: 'BTC_WALLET_ADDRESS',
      requiredPaymentDetails: {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        'title': 'BTC Required Payment Details',
        'type': 'object',
        'required': [
          'address',
        ],
        'additionalProperties': false,
        'properties': {
          'address': {
            'title': 'BTC Wallet Address',
            'description': 'Wallet address to pay out BTC to',
            'type': 'string'
          },
        }
      }
    }
  ],
  requiredClaims: {
    id: '7ce4004c-3c38-4853-968b-e411bafcd945',
    input_descriptors: [{
      id: 'bbdb9b7c-5754-4f46-b63b-590bada959e0',
      constraints: {
        fields: [
          {
            path: [
              '$.vc.type[*]',
              '$.type[*]'
            ],
            filter: {
              type: 'string',
              const: 'ABCCredential'
            }
          },
          {
            path: ['$.credentialSubject.name'],
          },
          {
            path: ['$.issuer'],
            filter: {
              type: 'string',
              const:  mockProviderDids.issuer.uri
            }
          }
        ]
      }
    }]
  }
}

export const offeringDataTBDollarsToBitcoin_1 = {
  ...offeringDataTBDollarsToBitcoin_0,
  payoutUnitsPerPayinUnit: '0.000022',
}

export const offeringDataTBDollarsToBitcoin_2 = {
  ...offeringDataTBDollarsToBitcoin_0,
  payoutUnitsPerPayinUnit: '0.000019',
}

export const offeringDataTBDollarsToSocks = {
  description: 'Exchange your TBDollars for Socks',
  payoutUnitsPerPayinUnit: '0.2',
  payinCurrency: { currencyCode: 'TBD' },
  payoutCurrency: { currencyCode: 'SOC' },
  payinMethods: [{
    kind: 'TBDOLLARS_BALANCE',
    requiredPaymentDetails:{}
  }],
  payoutMethods: [
    {
      kind: 'SOCKS_DELIVERY',
      requiredPaymentDetails: {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        'title': 'Socks Required Payment Details',
        'type': 'object',
        'required': [
          'deliveryAddress',
        ],
        'additionalProperties': false,
        'properties': {
          'deliveryAddress': {
            'title': 'Delivery Address',
            'description': 'Address to deliver the socks to',
            'type': 'string'
          },
        }
      }
    }
  ],
  requiredClaims: offeringDataTBDollarsToBitcoin_0.requiredClaims
}

export const offeringDataTBDollarsForCandles = {
  description: 'Exchange your TBDollars for Candles',
  payoutUnitsPerPayinUnit: '0.5',
  payinCurrency: { currencyCode: 'TBD' },
  payoutCurrency: { currencyCode: 'CND' },
  payinMethods: [{
    kind: 'TBDOLLARS_BALANCE',
    requiredPaymentDetails:{}
  }],
  payoutMethods: [
    {
      kind: 'CANDLE_DELIVERY',
      requiredPaymentDetails: {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        'title': 'Candle Required Payment Details',
        'type': 'object',
        'required': [
          'deliveryAddress',
        ],
        'additionalProperties': false,
        'properties': {
          'deliveryAddress': {
            'title': 'Delivery Address',
            'description': 'Address to deliver the candles to',
            'type': 'string'
          },
        }
      }
    }
  ],
  requiredClaims: offeringDataTBDollarsToBitcoin_0.requiredClaims
}

export const offeringDataTBDollarsForPlants = {
  description: 'Exchange your TBDollars for Plants',
  payoutUnitsPerPayinUnit: '0.4',
  payinCurrency: { currencyCode: 'PLN' },
  payoutCurrency: { currencyCode: 'BTC' },
  payinMethods: [{
    kind: 'TBDOLLARS_BALANCE',
    requiredPaymentDetails:{}
  }],
  payoutMethods: [
    {
      kind: 'PLANTS_DELIVERY',
      requiredPaymentDetails: {
        '$schema': 'http://json-schema.org/draft-07/schema#',
        'title': 'Plant Required Payment Details',
        'type': 'object',
        'required': [
          'deliveryAddress',
        ],
        'additionalProperties': false,
        'properties': {
          'deliveryAddress': {
            'title': 'Delivery Address',
            'description': 'Address to deliver the plants to',
            'type': 'string'
          },
        }
      }
    }
  ],
  requiredClaims: offeringDataTBDollarsToBitcoin_0.requiredClaims
}



