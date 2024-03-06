import { Close, Offering, OrderStatus, Quote, Rfq } from '@tbdex/http-client'
import { VerifiableCredential } from '@web5/credentials'
import { BearerDid, DidDht, PortableDid } from '@web5/dids'

export async function createOrLoadBearerDid(params: { key: `pfi_${string}` | 'issuer', serviceEndpoint?: string }): Promise<BearerDid> {
  const { key, serviceEndpoint } = params
  // Load did from localStorage based on key
  const portableDid = localStorage.getItem(key)
  if (portableDid) {
    const bearerDid: BearerDid = await DidDht.import({ portableDid: JSON.parse(portableDid) })
    return bearerDid
  } else {
    // If no DID is stored, create a new one and store it. 
    const bearerDid: BearerDid = await DidDht.create(key.startsWith('pfi_') ? {
      // Add service endpoints if did is for a PFI.
      options: {
        services: [{
          type            : 'PFI',
          id              : 'pfi',
          serviceEndpoint
        }]
      }
    } : {})
    const portableDid = await bearerDid.export()
    localStorage.setItem(key, JSON.stringify(portableDid))
    return bearerDid
  }
}

export async function issueCredential(params: { subjectDid: string, data: Record<string, unknown> }) {
  const { subjectDid, data } = params
  const issuer = await createOrLoadBearerDid({ key: 'issuer' })

  const vc = await VerifiableCredential.create({
    type: 'ABC Credential',
    issuer: issuer.uri,
    subject: subjectDid,
    data
  })

  const vcJwt = await vc.sign({ did: issuer })
  return vcJwt
}

export async function createPfis(): Promise<BearerDid[]> {
  const dids = []
  for (const index in Array.from({ length: 3 })) {
    const did = await createOrLoadBearerDid({ key: `pfi_${index}`, serviceEndpoint: `https://localhost:555${index}` })
    dids.push(did)
  }
  return dids
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
}

export async function createQuote(params: { pfiDid: BearerDid, rfq: Rfq, payoutAmount: string }) {
  const { pfiDid, rfq, payoutAmount } = params
  const quote = Quote.create({
    metadata: { 
      from: pfiDid.uri,
      to: rfq.from,
      exchangeId: rfq.exchangeId
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
}

export async function createOrderStatus(params: { pfiDid: BearerDid, order: Rfq, status: string }) {
  const { pfiDid, order, status } = params
  const orderStatus = OrderStatus.create({
    metadata: { 
      from: pfiDid.uri,
      to: order.from,
      exchangeId: order.exchangeId
    },
    data: {
      orderStatus: status
    }
  })
  
  await orderStatus.sign(pfiDid)
}

export async function createClose(params: { pfiDid: BearerDid, orderStatus: Rfq, reason: string }) {
  const { pfiDid, orderStatus, reason } = params
  const close = Close.create({
    metadata: { 
      from: pfiDid.uri,
      to: orderStatus.from,
      exchangeId: orderStatus.exchangeId
    },
    data: {
      reason
    }
  })
  
  await close.sign(pfiDid)
}

export const offeringDataTbdDollarsToBitcoin = {
  description: 'Bitcoin for TBDollars',
  payoutUnitsPerPayinUnit: '0.000027', // BTC per TBD
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
              const:  (JSON.parse(localStorage.getItem('issuer')) as PortableDid).uri
            }
          }
        ]
      }
    }]
  }
}

export const offeringDataSocksToCandles = {
  description: 'Trade your Socks for Candles',
  payoutUnitsPerPayinUnit: '0.2', // Candles per Sock
  payinCurrency: { currencyCode: 'SOC' },
  payoutCurrency: { currencyCode: 'CND' },
  payinMethods: [{
    kind: 'SOCKS_BALANCE',
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
              const:  (JSON.parse(localStorage.getItem('issuer')) as PortableDid).uri
            }
          }
        ]
      }
    }]
  }
}

export const offeringDataSocksToBitcoin = {
  description: 'Exchange your Socks for Bitcoin',
  payoutUnitsPerPayinUnit: '0.00001', // BTC per Sock
  payinCurrency: { currencyCode: 'SOC' },
  payoutCurrency: { currencyCode: 'BTC' },
  payinMethods: [{
    kind: 'SOCKS_BALANCE',
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
            'description': 'Wallet address to receive BTC',
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
              const:  (JSON.parse(localStorage.getItem('issuer')) as PortableDid).uri
            }
          }
        ]
      }
    }]
  }
}

export const offeringDataCandlesToBitcoin = {
  description: 'Trade your Candles for Bitcoin',
  payoutUnitsPerPayinUnit: '0.00005', // BTC per Candle
  payinCurrency: { currencyCode: 'CND' },
  payoutCurrency: { currencyCode: 'BTC' },
  payinMethods: [{
    kind: 'CANDLES_BALANCE',
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
            'description': 'Wallet address to receive BTC',
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
              const:  (JSON.parse(localStorage.getItem('issuer')) as PortableDid).uri
            }
          }
        ]
      }
    }]
  }
}

export const offeringDataTbdDollarsToSocks = {
  description: 'Exchange your TBDollars for Socks',
  payoutUnitsPerPayinUnit: '2', // Socks per TBDollar
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
              const:  (JSON.parse(localStorage.getItem('issuer')) as PortableDid).uri
            }
          }
        ]
      }
    }]
  }
}