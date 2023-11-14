/**
 * NextButton Component
 *
 * This component is a reusable button for navigating back to the next page or view.
 *
 * @param {Object} props - The props for the NextButton component.
 * @param {Function} onBack - A callback function used to trigger a return to next screen.
 * @returns {JSX.Element} - Returns a button for navigating forward.
 */
export function NextButton({ onNext }) {
  return (
    <>
      <button
        type="submit"
        className="rounded-2xl bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm hover:bg-indigo-400 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={onNext}
      >
        Next
      </button>
    </>
  )
}