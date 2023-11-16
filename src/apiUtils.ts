import offeringData from './offerings.json'
// import { TbdexHttpClient, MessageKindClass, Offering, Order, Rfq, Close, Quote, OrderStatus } from '@tbdex/http-client'

export async function fetchOfferings() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return offeringData
}

const exchanges = []

// export async function fetchOfferings() {
//   const response = await TbdexHttpClient.getOfferings({
//     pfiDid: pfiDids[0],
//   })

//   if (response.errors) {
//     throw new Error(`(${response.status}) - ${response.errors[0].detail}`)
//   }

//   return response.data
// }

export async function createExchange(offeringId: string, payinAmount: string, payoutAmount: string, btcAddress: string) {
  const exchange = {
    offeringId: offeringId,
    payinAmount: payinAmount,
    payoutAmount: payoutAmount,
    btcAddress: btcAddress,
    status: {
      name: 'EX_QUOTED',
      value: 110
    }
  }
  exchanges.push(exchange)
}

export async function fetchExchanges() {
  return exchanges
}
