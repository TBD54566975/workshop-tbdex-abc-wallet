import { useContext } from 'react'
import { RfqContext } from './features/RfqContext'
import hotkeys from 'hotkeys-js'

export function populateRfq() {
  const {
    setRecipientNameObject,
    setRecipientDob,
    setRecipientCountry,
    setRecipientMomoObject
  } = useContext(RfqContext)

  hotkeys('ctrl+p', function(event){
    event.preventDefault()
    setRecipientNameObject({
      'firstName': 'Joe',
      'lastName': 'Schmoe'
    })
    setRecipientDob('12/25/1999')
    setRecipientCountry('Kenya')
    setRecipientMomoObject({
      'accountNumber': '+25411111111',
      'reason': {
        'label': 'Gift',
        'value': 'gift'
      }
    })
    console.log('you pressed ctrl+p!')
  })
}