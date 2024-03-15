import { mockProviderDids } from '../mocks/mocks'

export interface PfiAllowlistConfig {
  pfiUri: string,
  pfiName: string
}

export const pfiAllowlist: PfiAllowlistConfig[] = [
  {
    pfiUri: mockProviderDids.pfi_0.uri,
    pfiName: 'Bob\'s Bucks'
  },
  {
    pfiUri: mockProviderDids.pfi_1.uri,
    pfiName: 'Acme Bank'
  },
  {
    pfiUri: mockProviderDids.pfi_2.uri,
    pfiName: 'Finders Financial Services'
  }
]