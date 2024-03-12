import { HttpResponse, http, passthrough } from 'msw'
import { setupWorker } from 'msw/browser'
import { createClose, createOffering, createOrderStatus, createQuote, mockProviderDids, offeringDataTBDollarsForPlants, offeringDataTBDollarsToBitcoin_0 } from './mocks'
import { Close, Exchange, Message, Offering, Order, OrderStatus, Quote, Rfq } from '@tbdex/http-client'
import { convertToBaseUnits } from '../currency-utils'

const request = indexedDB.open('pfi_0')

request.onerror = () => {
  throw Error(`Indexed DB could not be opened`)
}

request.onupgradeneeded = async () => {
  request.result.createObjectStore('offerings')
  request.result.createObjectStore('exchanges')

  request.transaction.oncomplete = async() => {
    //instantiate db with offerings

    const offeringsStore = request.result
    .transaction('offerings', 'readwrite')
    .objectStore('offerings')
  
    const offering_0 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_0.bearerDid, 
      offeringData: offeringDataTBDollarsToBitcoin_0
    })
    const offering_1 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_0.bearerDid, 
      offeringData: offeringDataTBDollarsForPlants
    })

    offeringsStore.add(offering_0, offering_0.id)
    offeringsStore.add(offering_1, offering_1.id)
  }
}

const handlers = [
  http.get('https://localhost:5550/offerings', async () => {   
    let offerings = []
    if(request.readyState === 'done') {  
      const offeringsStore = request.result
        .transaction('offerings', 'readwrite')
        .objectStore('offerings')
  
        await new Promise(resolve => {
          offeringsStore.getAll().onsuccess = async (event) => {
            const result = event.target['result']
            offerings = result
            resolve(true)
          }
        })

    } else {
      console.error('db not ready')
    } 
    offerings.map(offering => Object.setPrototypeOf(offering, Offering.prototype))
    return HttpResponse.json({data: offerings}) 
  }),
  http.get('https://localhost:5550/exchanges', async () => {
    // if instance of orderstatus, sleep, then add close,
    let exchanges = []
    if(request.readyState === 'done') {
      const store = request.result
      .transaction('exchanges', 'readwrite')
      .objectStore('exchanges')

      await new Promise(resolve => {
        store.getAll().onsuccess = async (event) => {
          const result = event.target['result'] as Message[][]
          if (result.length) {
            for (const exchange of result) {
                const lastMessage = exchange[exchange.length - 1]
                if (lastMessage && lastMessage.metadata.kind === 'orderstatus') {
                  await sleep(10000)
                  const close = await createClose( {
                    pfiDid: await mockProviderDids.pfi_0.bearerDid,
                    orderStatus: lastMessage as OrderStatus,
                    reason: 'Complete'
                  })
                  const data = store
                  .get(lastMessage.metadata.exchangeId)
                  .result.push(close)
            
                  store.put(data)
                }
            }
            exchanges = result
          }
          resolve(true)
        }
      })
      
    } else {
      console.error('db not ready')
    }
    exchanges.map(exchange => {
      for (let message of exchange) {
        if (message) {
          switch (message.metadata.kind) {
            case 'rfq' : 
              message = Object.setPrototypeOf(message, Rfq.prototype)
              break
            case 'quote' :
              message = Object.setPrototypeOf(message, Quote.prototype)
              break
            case 'order' :
              message = Object.setPrototypeOf(message, Order.prototype)
              break
            case 'orderstatus' : 
              message = Object.setPrototypeOf(message, OrderStatus.prototype)
              break
            case 'close' :
              message = Object.setPrototypeOf(message, Close.prototype)
              break
            default :
              break
          }
        }
      }
      return Object.setPrototypeOf(exchange, Exchange.prototype)
    })
    return HttpResponse.json({data: exchanges})
  }),
  http.post('https://localhost:5550/exchanges/*/rfq', async ({request: req}) => {
    // add rfq, then add quote, then return 200
    const { rfq } = await req.json() as  { rfq: Rfq }
    if(request.readyState === 'done') {
      const store = request.result
      .transaction('exchanges', 'readwrite')
      .objectStore('exchanges')

      store.add([rfq], rfq.metadata.exchangeId)

      const offeringsStore = request.result
      .transaction('offerings', 'readwrite')
      .objectStore('offerings')

      offeringsStore.getAll().onsuccess = async (event) => {
        const result = event.target['result']
        const store = request.result
        .transaction('exchanges', 'readwrite')
        .objectStore('exchanges')
        const offering: Offering = result.find((offeringResult: Offering) => { 
          return offeringResult.metadata.id === rfq.data.offeringId
        } )
        const quote = await createQuote( {
          pfiDid: await mockProviderDids.pfi_0.bearerDid,
          rfq: rfq as Rfq,
          payoutAmount: convertToBaseUnits((rfq as Rfq).data.payinAmount, offering.data.payoutUnitsPerPayinUnit )
        })
  
        store.get(rfq.metadata.exchangeId).onsuccess = (event) => {
          const result = event.target['result']
          result.push(quote)
          store.put(result, rfq.metadata.exchangeId)
        }

      } 
    }  else {
      console.error('db not ready')
    }
    return HttpResponse.json({}, { status: 200 }) // return success 
  }),
  http.post('https://localhost:5550/exchanges/*/order', async ({request: req}) => {
    // add order, then add orderstatus, then return 200
    const { order } = await req.json() as  { order: Message }
    if(request.readyState === 'done') {
      const store = request.result
      .transaction('exchanges', 'readwrite')
      .objectStore('exchanges')
      
      const data = store
      .get(order.metadata.exchangeId)
      .result.push(order)

      store.put(data)

      const orderstatus = await createOrderStatus( {
        pfiDid: await mockProviderDids.pfi_0.bearerDid,
        order: order as Order,
        status: 'Processing'
      })
      const orderstatusData = store
      .get(order.metadata.exchangeId)
      .result.push(orderstatus)

      store.put(orderstatusData)
    }  else {
      console.error('db not ready')
    }
    return HttpResponse.json({}, { status: 200 }) // return success 
  }),
  http.get('*', ({ request }) => {
    if (!request.url.startsWith('https://localhost:555')) {
      return passthrough()
    }
  })
]

export const worker = setupWorker(
  ...handlers,
)

export { handlers }

export function setupMockServer() {
  worker.start()
}

function sleep(ms) {
  // add ms millisecond timeout before promise resolution
  return new Promise(resolve => setTimeout(resolve, ms))
}