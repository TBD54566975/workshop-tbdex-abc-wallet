import React from 'react'
import { Outlet } from 'react-router-dom'

/**
 * This component represents the root page of the application with a sidebar navigation.
 *
 * @returns {JSX.Element} - Returns the RootPage component.
 */
export function RootPage() {
  return (
    <>
      <div>
        <main className="py-10">
          <div className="px-4 sm:px-6 lg:px-8">
            <Outlet />
          </div>
        </main>
      </div>
    </>
  )
}
