import { atom, DefaultValue } from 'recoil'
import { DidDht, BearerDid } from '@web5/dids'

// Define the shape of the credentials atom's state
type CredentialsState = string[]

// Atom to hold the DID
export const didState = atom<BearerDid | null>({
  key: 'didState',
  default: null, // Start with no DID
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      // Load the DID from localStorage when the atom is first used
      const portableDid = localStorage.getItem('DID')
      if (portableDid) {
        DidDht.import({ portableDid: JSON.parse(portableDid) }).then((bearerDid: BearerDid) => {
          setSelf(bearerDid)
        })
      } else {
        // If no DID is stored, create a new one and store it
        DidDht.create().then(async (bearerDid: BearerDid) => {
          const portableDid = await bearerDid.export()
          setSelf(bearerDid)
          localStorage.setItem('DID', JSON.stringify(portableDid))
        })
      }

      // When the DID changes, store it in localStorage
      onSet((newDid) => {
        if (!(newDid instanceof DefaultValue)) {
          localStorage.setItem('DID', JSON.stringify(newDid))
        }
      })
    },
  ],
})

// Atom to hold the credentials
export const credentialsState = atom<CredentialsState>({
  key: 'credentialsState',
  default: [], // Start with an empty array
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      // Load the credentials from localStorage when the atom is first used
      const storedCredentials = localStorage.getItem('CREDENTIALS')
      if (storedCredentials) {
        setSelf(JSON.parse(storedCredentials))
      }

      // When the credentials change, store them in localStorage
      onSet((newCredentials) => {
        if (!(newCredentials instanceof DefaultValue)) {
          localStorage.setItem('CREDENTIALS', JSON.stringify(newCredentials))
        }
      })
    },
  ],
})

export const balanceState = atom({
  key: 'balanceState', 
  default: 0,
})