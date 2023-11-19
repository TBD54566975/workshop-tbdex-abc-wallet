import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { GetCredentialPage } from './features/GetCredentialPage'
import { ActivityPage } from './features/ActivityPage'
import { RecoilRoot, useRecoilState } from 'recoil'
import { RootPage } from './features/RootPage'
import { credentialsState } from './state'
import { Spinner } from './common/Spinner'

const router = createBrowserRouter([
  {
    path: '/credential-request-token',
    element: <Spinner />
  },
  {
    path: '/',
    element: (
      <ChooseRoute />
    ),
    children: [
      {
        index: true,
        element: <ActivityPage />,
      },
    ],
  },
])

function ChooseRoute() {
  const [credentials] = useRecoilState(credentialsState)

  if (credentials.length === 0) {
    return <GetCredentialPage />
  } else {
    return <RootPage />
  }
}

export default function App() {
  return (
    <RecoilRoot>
      <RouterProvider router={router} />
    </RecoilRoot>
  )
}
