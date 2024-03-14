import { mockProviderDids } from './mocks/mocks'

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

// tbdex is a permissionless protocol, but a given wallet 
// can choose to be strategic about which pfis it wants 
// to include in its marketplace. another wallet may choose to select a different
// set of pfis to include in its own marketplace. 
// a user may use multiple wallets they trust and enjoy access to a wide range of pfis.