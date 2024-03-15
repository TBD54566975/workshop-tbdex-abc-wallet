import { useRecoilState } from 'recoil'
import { renderCredential } from '../api-utils'
import { credentialsState } from '../state'

export function Credentials() {
  const [credentials] = useRecoilState(credentialsState)

  return (
    <>
      {credentials && credentials.map((credential, ind) => {
        const renderedCredential = renderCredential(credential)
        return (
          <div key={ind} className="max-w-[25%] min-w-fit rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-gray-900 shadow-sm">
            <div className="mt-2 text-lg font-semibold text-gray-200">{renderedCredential.title}</div>
            <div className="mt-2 mb-3 text-sm font-semibold text-gray-200">Issued: {renderedCredential.issuanceDate}</div>
            <div className="mt-2 mb-3 text-sm font-semibold text-gray-200">Country: {renderedCredential.countryCode}</div>
          </div>
        )
      }
      )}
    </>
  )
}