import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { RootPage } from './features/RootPage'
import { ActivityPage } from './features/ActivityPage'
import { RemittancePage } from './features/RemittancePage'

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
  return (
    <RootPage />
  )
}

export default function App() {
  return <RouterProvider router={router} />
}
