import offeringData from './offerings.json'
import { TbdexHttpClient, MessageKindClass, Offering, Order, Rfq, Close, Quote, OrderStatus } from '@tbdex/http-client'

export async function fetchOfferings() {

  // you can run a PFI such as https://github.com/TBD54566975/example-pfi-aud-usd-tbdex to serve up offerings.
  const pfiDid = "did:ion:EiD8EXZjOnSnq9oN-bamvRDVovwsz5dQQncDXdE9YrI6iw:eyJkZWx0YSI6eyJwYXRjaGVzIjpbeyJhY3Rpb24iOiJyZXBsYWNlIiwiZG9jdW1lbnQiOnsicHVibGljS2V5cyI6W3siaWQiOiJkd24tc2lnIiwicHVibGljS2V5SndrIjp7ImNydiI6IkVkMjU1MTkiLCJrdHkiOiJPS1AiLCJ4IjoieW05SDM2Nnh3RHMxZ25xQ2EzWnlBRkRlRVFLbmljWmNpNmJmUk9lajl2byJ9LCJwdXJwb3NlcyI6WyJhdXRoZW50aWNhdGlvbiIsImFzc2VydGlvbk1ldGhvZCJdLCJ0eXBlIjoiSnNvbldlYktleTIwMjAifV0sInNlcnZpY2VzIjpbeyJpZCI6InBmaSIsInNlcnZpY2VFbmRwb2ludCI6Imh0dHA6Ly9sb2NhbGhvc3Q6OTAwMCIsInR5cGUiOiJQRkkifV19fV0sInVwZGF0ZUNvbW1pdG1lbnQiOiJFaUR4aWk3U1c1VldHT1VBbGpZUjhnLTJXQ0NvUFhWLWhkeFMwQWRyeTY5NWtBIn0sInN1ZmZpeERhdGEiOnsiZGVsdGFIYXNoIjoiRWlDWkdnZjlIZlJPTXM4SnhPQXE2OEVQRUtpa29URGJ4cEJ3SHBxc2FZdG5aZyIsInJlY292ZXJ5Q29tbWl0bWVudCI6IkVpRFNBTl9xMXhvckJxdjdwQWUtR2JLVUJMRVRoOVZpUmNMZDZ1M3JlVlA3TmcifX0"
  const { data } = await TbdexHttpClient.getOfferings({ pfiDid: pfiDid })
  return data
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
