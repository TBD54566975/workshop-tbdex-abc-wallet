import { Panel } from '../common/Panel'
import { RemittanceHeader } from './RemittanceHeader'
import { RemittanceOfferings } from './RemittanceOfferings'

/**
 * This component represents the main page for remittance services. It displays the remittance header
 * and a list of remittance offerings for different countries.
 *
 * @returns {JSX.Element} - Returns the RemittancePage component.
 */
export function RemittancePage() {
  return (
    <>
      <Panel width={'w-11/12'} height={'h-auto'}>
        <RemittanceHeader />
        <RemittanceOfferings />
      </Panel>
    </>
  )
}