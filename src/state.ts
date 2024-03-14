import { atom, DefaultValue } from 'recoil'
import { DidDht, BearerDid } from '@web5/dids'
import { issueCredential } from './mocks/mocks'

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
export const credentialsState = atom<string[]>({
  key: 'credentialsState',
  default: [], // Start with an empty array
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      // Load the credentials from localStorage when the atom is first used
      const storedCredentials = localStorage.getItem('CREDENTIALS')
      if (storedCredentials) {
        setSelf(JSON.parse(storedCredentials))
      } else {
        if (localStorage.getItem('DID')) {
          issueCredential({
            subjectDid: JSON.parse(localStorage.getItem('DID')).uri,
            data: {
              countryCode: 'Earth'
            }
          }).then((credential) => {
            setSelf([credential])
            localStorage.setItem('CREDENTIALS', JSON.stringify(credential))
          })
        }
        // If no credential is found, issue one with the name "Anonymous User"
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

export const balanceState = atom<number>({
  key: 'balanceState', 
  default: 100,
  effects_UNSTABLE: [
    ({ onSet, setSelf }) => {
      // Load the balance from localStorage when the atom is first used
      const storedBalance = localStorage.getItem('BALANCE')
      if (storedBalance) {
        setSelf(JSON.parse(storedBalance))
      } else {
        // If no balance is stored, reset to default value of 100
        setSelf(100)
      }

      // When the balance changes, store them in localStorage
      onSet((newBalance) => {
        if (newBalance !== 100) {
          localStorage.setItem('BALANCE', JSON.stringify(newBalance))
        }
      })
    },
  ],
})