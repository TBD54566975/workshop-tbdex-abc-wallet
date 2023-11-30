export function NextButton({ onNext, disabled }) {
  return (
    <>
      <button
        disabled={disabled}
        type='submit'
        className="rounded-2xl bg-indigo-500 w-full px-3 py-2 text-sm font-semibold text-white shadow-sm enabled:hover:bg-indigo-400 disabled:opacity-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-500"
        onClick={onNext}
      >
        Next
      </button>
    </>
  )
}