import { Close, Offering, OrderStatus, Quote, Rfq } from '@tbdex/http-client'
import { VerifiableCredential } from '@web5/credentials'
import { BearerDid, DidDht, PortableDid } from '@web5/dids'


export const mockProviderDids = {
  get issuer() {
    return `
    {"uri":"did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o","document":{"id":"did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o","verificationMethod":[{"id":"did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o#0","type":"JsonWebKey","controller":"did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o","publicKeyJwk":{"crv":"Ed25519","kty":"OKP","x":"CDcnSD6bds2EA0OF-MssQZ54GUXzNU2CtXxDOnww5r8","kid":"zKI9zDFCiGaUmaPQ2OLMXNfbEc2qfNftyTecj2zL2F4","alg":"EdDSA"}}],"authentication":["did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o#0"],"assertionMethod":["did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o#0"],"capabilityDelegation":["did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o#0"],"capabilityInvocation":["did:dht:by51q1b6up5c5bydeqn9t13cegx8ogkf6c4w5yiixtbuw9boh49o#0"]},"metadata":{"published":true,"versionId":"1709703515"},"privateKeys":[{"crv":"Ed25519","d":"7u0S1N2FNiFvkaLDJyyU3tg8dWNjPMCn1F7aEw8nbpg","kty":"OKP","x":"CDcnSD6bds2EA0OF-MssQZ54GUXzNU2CtXxDOnww5r8","kid":"zKI9zDFCiGaUmaPQ2OLMXNfbEc2qfNftyTecj2zL2F4","alg":"EdDSA"}]}
    `
  }, 
  get pfi_0() {
    return `
    {"uri":"did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo","document":{"id":"did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo","verificationMethod":[{"id":"did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo#0","type":"JsonWebKey","controller":"did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo","publicKeyJwk":{"crv":"Ed25519","kty":"OKP","x":"3FnTg6CrH3oDQzFGqKeDrc4sywz8shr7XoyT9o_amQs","kid":"5AktqI58MrKOrfRAfOT6vzz-bp1Igj3C95vbWsKThbo","alg":"EdDSA"}}],"authentication":["did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo#0"],"assertionMethod":["did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo#0"],"capabilityDelegation":["did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo#0"],"capabilityInvocation":["did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo#0"],"service":[{"type":"PFI","id":"did:dht:5tc78y7yicxzwy4dgfdktjhdiz8n31ac913bi646t1j9pd64urfo#pfi","serviceEndpoint":"https://localhost:9001"}]},"metadata":{"published":true,"versionId":"1709703515"},"privateKeys":[{"crv":"Ed25519","d":"MQC12ov3pd6DRAbfvWRTamFgLVBix7TEJEmBZIhdno4","kty":"OKP","x":"3FnTg6CrH3oDQzFGqKeDrc4sywz8shr7XoyT9o_amQs","kid":"5AktqI58MrKOrfRAfOT6vzz-bp1Igj3C95vbWsKThbo","alg":"EdDSA"}]}
    `
  },
  get pfi_1() {
    return `
    {"uri":"did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno","document":{"id":"did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno","verificationMethod":[{"id":"did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno#0","type":"JsonWebKey","controller":"did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno","publicKeyJwk":{"crv":"Ed25519","kty":"OKP","x":"1DdlusvhGIyPzg76lOnNrZ5RwTSY4AlXHQ2Hy88VGMU","kid":"cZDXkMFH4T-Mh9e9mCKFoWf2QbrerSwbyuIIcVokCc4","alg":"EdDSA"}}],"authentication":["did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno#0"],"assertionMethod":["did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno#0"],"capabilityDelegation":["did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno#0"],"capabilityInvocation":["did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno#0"],"service":[{"type":"PFI","id":"did:dht:4o5smqsmhrce3d6qb57jj4qpisxfdojwudoy1ia7bsdhzuaiddno#pfi","serviceEndpoint":"https://localhost:90011"}]},"metadata":{"published":true,"versionId":"1709703515"},"privateKeys":[{"crv":"Ed25519","d":"9cJA1TAvxwi46hym-aZV4A4LZ6PsVcMZCEw-eHNJ51A","kty":"OKP","x":"1DdlusvhGIyPzg76lOnNrZ5RwTSY4AlXHQ2Hy88VGMU","kid":"cZDXkMFH4T-Mh9e9mCKFoWf2QbrerSwbyuIIcVokCc4","alg":"EdDSA"}]}
    `
  },
  get pfi_2() {
    return `
    {"uri":"did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny","document":{"id":"did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny","verificationMethod":[{"id":"did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny#0","type":"JsonWebKey","controller":"did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny","publicKeyJwk":{"crv":"Ed25519","kty":"OKP","x":"DPjB2vJ8SNBVt21gCV-pC4h3xgVHkk-c80y_oQGd2YQ","kid":"WEGPBcwDB5vP6a8oJs4Oed7jQj4n5oYF_IOaqHitbRg","alg":"EdDSA"}}],"authentication":["did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny#0"],"assertionMethod":["did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny#0"],"capabilityDelegation":["did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny#0"],"capabilityInvocation":["did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny#0"],"service":[{"type":"PFI","id":"did:dht:buhcdsz1xtrpyipzpioy1z7jbqr8xtofe6jr988uj194nyc75gny#pfi","serviceEndpoint":"https://localhost:90021"}]},"metadata":{"published":true,"versionId":"1709703515"},"privateKeys":[{"crv":"Ed25519","d":"mB6VhnLHEvTxhhGZQMJg6D35IoKq3bS-YG7mzL0eETg","kty":"OKP","x":"DPjB2vJ8SNBVt21gCV-pC4h3xgVHkk-c80y_oQGd2YQ","kid":"WEGPBcwDB5vP6a8oJs4Oed7jQj4n5oYF_IOaqHitbRg","alg":"EdDSA"}]}
    `
  }
}

export async function loadProviderBearerDid(key: `pfi_${string}` | 'issuer' ): Promise<BearerDid> {
  // Load did from `mockProviderDids` based on key
  const portableDid = mockProviderDids[key]
  if (portableDid) {
    const bearerDid: BearerDid = await DidDht.import({ portableDid: JSON.parse(portableDid) })
    return bearerDid
  } else {
    console.error('no portable did found for provider')
  }
}

export async function issueCredential(params: { subjectDid: string, data: Record<string, unknown> }) {
  const { subjectDid, data } = params
  const issuer = await loadProviderBearerDid('issuer')

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