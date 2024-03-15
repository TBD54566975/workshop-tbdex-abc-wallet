/* Use `mockProviderDids` to access PFIs and their DID URIs */

import { mockProviderDids } from '../mocks/mocks'

export interface PfiAllowlistConfig {
  pfiUri: string,
  pfiName: string
}

export const pfiAllowlist: PfiAllowlistConfig[] = [
  {
    pfiUri: mockProviderDids.pfi_0.uri,
    pfiName: 'Bob\'s Bank'
  },
  {
    pfiUri: mockProviderDids.pfi_1.uri,
    pfiName: 'Alice\'s Bank'
  },
  {
    pfiUri: mockProviderDids.pfi_2.uri,
    pfiName: 'Charlie\'s Chop Shop'
  }
]