import { atom, DefaultValue } from 'recoil'
import { DidKeyMethod, PortableDid } from '@web5/dids'

// Define the shape of the credentials atom's state
type CredentialsState = string[]

// Atom to hold the DID
export const didState = atom<PortableDid | null>({
  key: 'didState',
  default: null, // Start with no DID
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      // Load the DID from localStorage when the atom is first used
      const storedDid = localStorage.getItem('DID')
      if (storedDid) {
        setSelf(JSON.parse(storedDid))
      } else {
        // If no DID is stored, create a new one and store it
        DidKeyMethod.create().then((did: PortableDid) => {
          setSelf(did)
          localStorage.setItem('DID', JSON.stringify(did))
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
