import type { JwtHeader, JwtPayload } from 'jwt-decode'

import { didState, credentialsState } from '../state'
import { MouseEventHandler } from 'react'
import { useRecoilState } from 'recoil'
import { Ed25519, Jose } from '@web5/crypto'
import { PortableDid } from '@web5/dids'
import { FaGithub } from 'react-icons/fa'
import { Convert } from '@web5/common'


export function GetCredentialPage() {
  const [did] = useRecoilState(didState)
  const [credentials, setCredentials] = useRecoilState(credentialsState)

  
  const showGithubLogin: MouseEventHandler<HTMLButtonElement> = (e) => {
    e.preventDefault()
    
    const height = 700
    const width = 600
    const top = Math.round(window.innerHeight / 2 - height / 2)
    const left = Math.round(window.innerWidth / 2 - width / 2)

    const popup = window.open(
      'https://github.com/login/oauth/authorize?client_id=fb6f285dbdf1bacb71d1',
      '_blank',
      `width=${width},height=${height},popup=true,top=${top},left=${left}`
    )

    let vcRequestToken: string
    const issuerHost = import.meta.env['VITE_ISSUER_HOST']
    console.log(issuerHost)

    const intervalRef = setInterval(async () => {
      try {
        const host = new URL(popup.location.href)
        vcRequestToken = host.searchParams.get('code')
        if (!vcRequestToken) {
          return
        }
        
        clearInterval(intervalRef)
        const vcRequestJwt = await createVcRequestJwt(did, vcRequestToken)
        const credentialResponse = await fetch(`${issuerHost}/credential`, {
          headers: {
            'Authorization': `Bearer ${vcRequestJwt}`
          }
        })

        if (credentialResponse.ok) {
          const { credential } = await credentialResponse.json()
          setCredentials([...credentials, credential])
        } else {
          console.error(`Failed to get VC. Error: (${credentialResponse.status}) ${await credentialResponse.text()}`)
        }
        
        popup.close()
      } catch(e) {
        console.log('waiting for token....')
      }
    }, 500)
  }


  return (
    <div style={{ 
      display: 'flex', 
      alignItems: 'center', 
      justifyContent: 'center', 
      height: '100vh' // This assumes you want full viewport height
    }}>
      <button
        type="button"
        className="inline-flex items-center gap-x-2 rounded-md bg-indigo-600 px-3.5 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-indigo-500 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        onClick={showGithubLogin}
      >
        Get TBDeveloper Credential
        <FaGithub className="-mr-0.5 h-5 w-5" aria-hidden="true" />
      </button>
    </div>
  )
}

async function createVcRequestJwt(did: PortableDid, requestToken: string) {
  const privateKeyJwk = did.keySet.verificationMethodKeys[0].privateKeyJwk
  
  const header: JwtHeader = { typ: 'JWT', alg: privateKeyJwk.alg, kid: did.document.verificationMethod[0].id }
  const base64UrlEncodedHeader = Convert.object(header).toBase64Url()

  const payload: JwtPayload = { jti: requestToken }
  const base64UrlEncodedPayload = Convert.object(payload).toBase64Url()

  const toSign = `${base64UrlEncodedHeader}.${base64UrlEncodedPayload}`
  const toSignBytes = Convert.string(toSign).toUint8Array()

  const { keyMaterial } = await Jose.jwkToKey({ key: privateKeyJwk })

  const signatureBytes = await Ed25519.sign({ key: keyMaterial, data: toSignBytes })
  const base64UrlEncodedSignature = Convert.uint8Array(signatureBytes).toBase64Url()

  return `${toSign}.${base64UrlEncodedSignature}`
}