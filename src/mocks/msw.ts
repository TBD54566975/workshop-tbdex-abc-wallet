import { HttpHandler, HttpResponse, http, passthrough } from 'msw'
import { setupWorker } from 'msw/browser'
import { 
  createClose, 
  createOffering, 
  createOrderStatus, 
  createQuote, 
  mockProviderDids, 
  offeringDataTBDollarsToBitcoin_0, 
  offeringDataTBDollarsToBitcoin_1, 
  offeringDataTBDollarsToBitcoin_2, 
  offeringDataTBDollarsToCandles, 
  offeringDataTBDollarsToPlants, 
  offeringDataTBDollarsToSocks } from './mocks'
import { Close, Exchange, Message, Offering, Order, OrderStatus, Quote, Rfq } from '@tbdex/http-client'

const request_0 = indexedDB.open('pfi_0')
const request_1 = indexedDB.open('pfi_1')
const request_2 = indexedDB.open('pfi_2')

request_0.onerror = () => {
  throw Error(`Indexed DB could not be opened`)
}

request_1.onerror = () => {
  throw Error(`Indexed DB could not be opened`)
}

request_2.onerror = () => {
  throw Error(`Indexed DB could not be opened`)
}

request_0.onupgradeneeded = async () => {
  request_0.result.createObjectStore('offerings')
  request_0.result.createObjectStore('exchanges')

  request_0.transaction.oncomplete = async() => {
    //instantiate db with offerings

    const offeringsStore = request_0.result
    .transaction('offerings', 'readwrite')
    .objectStore('offerings')
  
    const offering_0 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_0.bearerDid, 
      offeringData: offeringDataTBDollarsToBitcoin_0
    })
    const offering_1 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_0.bearerDid, 
      offeringData: offeringDataTBDollarsToSocks
    })

    offeringsStore.add(offering_0, offering_0.id)
    offeringsStore.add(offering_1, offering_1.id)
  }
}

request_1.onupgradeneeded = async () => {
  request_1.result.createObjectStore('offerings')
  request_1.result.createObjectStore('exchanges')

  request_1.transaction.oncomplete = async() => {
    //instantiate db with offerings

    const offeringsStore = request_1.result
    .transaction('offerings', 'readwrite')
    .objectStore('offerings')
  
    const offering_0 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_1.bearerDid, 
      offeringData: offeringDataTBDollarsToBitcoin_1
    })
    const offering_1 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_1.bearerDid, 
      offeringData: offeringDataTBDollarsToCandles
    })

    offeringsStore.add(offering_0, offering_0.id)
    offeringsStore.add(offering_1, offering_1.id)
  }
}

request_2.onupgradeneeded = async () => {
  request_2.result.createObjectStore('offerings')
  request_2.result.createObjectStore('exchanges')

  request_2.transaction.oncomplete = async() => {
    //instantiate db with offerings

    const offeringsStore = request_2.result
    .transaction('offerings', 'readwrite')
    .objectStore('offerings')
  
    const offering_0 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_2.bearerDid, 
      offeringData: offeringDataTBDollarsToBitcoin_2
    })
    const offering_1 = await createOffering({ 
      pfiDid: await mockProviderDids.pfi_2.bearerDid, 
      offeringData: offeringDataTBDollarsToPlants
    })

    offeringsStore.add(offering_0, offering_0.id)
    offeringsStore.add(offering_1, offering_1.id)
  }
}

function createHandlers(endpoint: string, request: IDBOpenDBRequest): HttpHandler[] {
  const handlers = [
    http.get(endpoint + '/offerings', async () => {   
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
    http.get(endpoint + '/exchanges', async () => {
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
                const isExpired = lastMessage && lastMessage.metadata.kind === 'quote' && new Date((lastMessage as Quote).data.expiresAt) < new Date()
                const isOrdered = lastMessage && lastMessage.metadata.kind === 'order'
                const isProcessing = lastMessage && lastMessage.metadata.kind === 'orderstatus'
                if (isExpired) {
                  const store = request.result
                  .transaction('exchanges', 'readwrite')
                  .objectStore('exchanges')
                  const close = await createClose( {
                    pfiDid: await mockProviderDids.pfi_0.bearerDid,
                    lastMessage,
                    reason: 'Expired'
                  })
                  store.get(close.metadata.exchangeId).onsuccess = (event) => {
                    const result = event.target['result']
                    result.push(close)
                    store.put(result, close.metadata.exchangeId)
                  }
                }
                if (isOrdered) {
                  const store = request.result
                  .transaction('exchanges', 'readwrite')
                  .objectStore('exchanges')
                  const orderstatus = await createOrderStatus( {
                    pfiDid: await mockProviderDids.pfi_0.bearerDid,
                    order: lastMessage as Order,
                    status: 'Processing'
                  })
                  store.get(orderstatus.metadata.exchangeId).onsuccess = (event) => {
                    const result = event.target['result']
                    result.push(orderstatus)
                    store.put(result, orderstatus.metadata.exchangeId)
                  }
                }
                if (isProcessing) {
                  const store = request.result
                  .transaction('exchanges', 'readwrite')
                  .objectStore('exchanges')
                  const close = await createClose( {
                    pfiDid: await mockProviderDids.pfi_0.bearerDid,
                    lastMessage,
                    reason: 'Complete'
                  })
                  store.get(close.metadata.exchangeId).onsuccess = (event) => {
                    const result = event.target['result']
                    result.push(close)
                    store.put(result, close.metadata.exchangeId)
                  }
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
    http.post(endpoint + '/exchanges/*/rfq', async ({request: req}) => {
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
            offering: offering as Offering
          })
    
          store.get(quote.metadata.exchangeId).onsuccess = (event) => {
            const result = event.target['result']
            result.push(quote)
            store.put(result, quote.metadata.exchangeId)
          }
  
        } 
      }  else {
        console.error('db not ready')
      }
      return HttpResponse.json({}, { status: 200 }) // return success 
    }),
    http.post(endpoint + '/exchanges/*/order', async ({request: req}) => {
      // add order, then return 200
      const order = await req.json() as  Order
      if(request.readyState === 'done') {
        const store = request.result
        .transaction('exchanges', 'readwrite')
        .objectStore('exchanges')
    
        store.get(order.metadata.exchangeId).onsuccess = (event) => {
          const result = event.target['result']
          result.push(order)
          store.put(result, order.metadata.exchangeId)
        }
      }  else {
        console.error('db not ready')
      }
      return HttpResponse.json({}, { status: 200 }) // return success 
    }),
    http.post(endpoint + '/exchanges/*/close', async ({request: req}) => {
      // add close, then return 200
      const close = await req.json() as  Close
      if(request.readyState === 'done') {
        const store = request.result
        .transaction('exchanges', 'readwrite')
        .objectStore('exchanges')
    
        store.get(close.metadata.exchangeId).onsuccess = (event) => {
          const result = event.target['result']
          result.push(close)
          store.put(result, close.metadata.exchangeId)
        }
      }  else {
        console.error('db not ready')
      }
      return HttpResponse.json({}, { status: 200 }) // return success 
    }),
  ]
  return handlers
}

export const worker_0 = setupWorker(
  ...createHandlers('https://localhost:5550', request_0),
  ...createHandlers('https://localhost:5551', request_1),
  ...createHandlers('https://localhost:5552', request_2),
  http.get('*', ({ request }) => {
    if (!request.url.startsWith('https://localhost:555')) {
      return passthrough()
    }
  })
)

export async function setupMockServer() {
  await worker_0.start()
}