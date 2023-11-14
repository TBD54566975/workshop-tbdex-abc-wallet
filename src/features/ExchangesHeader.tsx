import { ArrowsUpDownIcon, MagnifyingGlassIcon, AdjustmentsHorizontalIcon, ArrowDownTrayIcon } from '@heroicons/react/20/solid'

/**
 * This component represents the header section of the exchanges list.
 * It also renders search and filter components (these are not working).
 *
 * @returns {JSX.Element} - Returns the ExchangesHeader component.
 */
export function ExchangesHeader() {
  return (
    <div className='sticky top-0'>
      <div className="border-b border-transparent pb-2 sm:flex sm:items-center sm:justify-between">
        <div className="mt-3 flex-grow">
          <div className="flex rounded-xl shadow-sm">
            <div className="relative flex-grow focus-within:z-10">
              <div className="pointer-events-none absolute inset-y-0 left-3 flex items-center">
                <MagnifyingGlassIcon className="h-3 w-3 text-gray-400" aria-hidden="true" />
              </div>
              <input
                type="text"
                name="mobile-search-candidate"
                className="block w-full text-xs rounded-3xl border-0 font-light py-1.5 pl-9 text-neutral-200 bg-neutral-600 ring-1 ring-inset ring-neutral-800 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 focus:bg-neutral-900 xs:hidden"
              />
              <input
                type="text"
                name="desktop-search-candidate"
                className="hidden w-full text-xs rounded-3xl border-0 font-light py-1.5 pl-9 leading-6 text-neutral-200 bg-neutral-600 ring-1 ring-inset ring-neutral-800 placeholder:text-gray-400 focus:ring-1 focus:ring-inset focus:ring-indigo-600 focus:bg-neutral-900 xs:block"
              />
            </div>
          </div>
        </div>

        <div className="flex justify-between items-center mt-3 sm:ml-4">
          <div className="flex w-full sm:w-auto space-x-3">
            <button type="button" className="flex items-center justify-start rounded-full bg-transaparent p-1 text-indigo-600 shadow-sm hover:text-indigo-500 focus:outline-none">
              <AdjustmentsHorizontalIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs ml-1">Filter</span>
            </button>
            <button type="button" className="flex-grow rounded-full bg-transaparent p-1 text-indigo-600 shadow-sm hover:text-indigo-500 focus:outline-none flex items-center justify-center">
              <ArrowsUpDownIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs ml-1">Sort</span>
            </button>
            <button type="button" className="flex items-center justify-end rounded-full bg-transaparent p-1 text-indigo-600 shadow-sm hover:text-indigo-500 focus:outline-none">
              <ArrowDownTrayIcon className="h-5 w-5" aria-hidden="true" />
              <span className="text-xs ml-1">Download</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
