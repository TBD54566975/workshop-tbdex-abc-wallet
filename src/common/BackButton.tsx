import { ArrowLeftIcon } from '@heroicons/react/24/outline'

/**
 * BackButton Component
 *
 * This component is a reusable button for navigating back to the previous page or view.
 *
 * @param {Object} props - The props for the BackButton component.
 * @param {Function} onBack - A callback function used to trigger a return to previous screen.
 * @returns {JSX.Element} - Returns a button with a left arrow icon for navigating back.
 */
export function BackButton({ onBack }) {
  return (
    <button className="absolute top-5 left-5 text-white hover:text-gray-300 focus:outline-none" onClick={onBack}>
      <ArrowLeftIcon className="h-5 w-5" aria-hidden="true" />
    </button>
  )
}