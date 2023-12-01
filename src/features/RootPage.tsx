import { Outlet } from 'react-router-dom'

export function RootPage() {
  return (
    <main className="py-10">
        <Outlet />
    </main>
  )
}
