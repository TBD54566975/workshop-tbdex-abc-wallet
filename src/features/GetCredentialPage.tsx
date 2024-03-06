import { didState, credentialsState } from '../state'
import { useRecoilState } from 'recoil'
import { FaAddressCard } from 'react-icons/fa'
import { createPfis, issueCredential } from '../mocks'
import { useRef } from 'react'


export function GetCredentialPage() {
  const [did] = useRecoilState(didState)
  const [credentials, setCredentials] = useRecoilState(credentialsState)

  const formRef = useRef<HTMLFormElement>(null)

  const getCredentials = async (e) => {
    e.preventDefault()
    const formData = new FormData(formRef.current)
    const credential = await issueCredential({
      subjectDid: did.uri,
      data: {
        name: formData.get('name')
      }
    })
    await createPfis()
    setCredentials([...credentials, credential])
  }

  return (
    <div className="flex items-center justify-center" style={{ height: '100dvh' }}>
      <form ref={formRef} onSubmit={(e) => getCredentials(e)} className="text-center">
        <label className="sr-only" htmlFor="name">Your name</label> 
        <input 
          className="block w-full p-3 text-2xl mb-4 border-2 text-white bg-neutral-800 rounded-md focus:text-white placeholder:text-gray-400 focus:ring-transparent sm:leading-6" 
          required 
          id="name" 
          name="name" 
          placeholder="Your name" 
          autoComplete='off' />
        <button
          type="submit"
          className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
        <FaAddressCard className="-ml-0.5 h-5 w-5" aria-hidden="true" />
        Get Credentials
      </button>
      </form>

    </div>
  )
}