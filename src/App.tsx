import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootPage } from './features/RootPage'
import { ActivityPage } from './features/ActivityPage'
import { RemittancePage } from './features/RemittancePage'
import { useEffect } from 'react'
import { DidKeyMethod } from '@web5/dids'

const router = createBrowserRouter([
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
      {
        path: '/remittance',
        element: <RemittancePage />,
      },
    ],
  },
])

function ChooseRoute() {
  useEffect(() => {
    const init = async () => {
      if (localStorage.getItem('did') === null) {
        const didState = await DidKeyMethod.create()
        localStorage.setItem('did', didState.did)
      }
    }
    init()
  }, [])

  console.log(localStorage.getItem('did'))
  return (
    <RootPage />
  )
}

export default function App() {
  return <RouterProvider router={router} />
}
