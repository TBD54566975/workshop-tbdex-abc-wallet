import offeringData from './offerings.json'
export async function fetchOfferings() {
  await new Promise(resolve => setTimeout(resolve, 1000))
  return offeringData
}
