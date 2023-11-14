import { Panel } from '../common/Panel'
import { OfferingsHeader } from './OfferingsHeader'
import { Offerings } from './Offerings'

/**
 * This component represents the main page for exchange services. It displays the offerings header
 * and a list of exchange offerings for different countries.
 *
 * @returns {JSX.Element} - Returns the OfferingsPage component.
 */
export function OfferingsPage() {
  return (
    <>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <OfferingsHeader />
        <Offerings />
      </Panel>
    </>
  )
}