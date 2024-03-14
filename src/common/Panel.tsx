/**
 * Panel Component
 *
 * This component provides a customizable panel or card container with a specified width and height.
 *
 * @param {Object} props - The props for the Panel component.
 * @param {ReactNode} props.children - The content to be displayed within the panel.
 * @param {string} props.width - The width of the panel, e.g., 'w-1/2', 'w-full'.
 * @param {string} props.height - The height of the panel, e.g., 'h-64', 'h-auto'.
 * @returns {JSX.Element} - Returns a panel component with the specified width and height.
 */
export function Panel({ children, width, height }) {
  
  return (
    <div className="mx-auto max-w-7xl px-2">
      <div className="mx-auto max-w-6xl text-white">
        <div className="flex justify-center pb-7">
          <div className={width}>
            <div className={`overflow-hidden bg-neutral-800 sm:rounded-lg rounded-md relative ${height}`}>
              <div className="px-6 py-6 sm:px-6 overflow-hidden h-full">
                <div className="overflow-auto max-h-[calc(70vh-4rem)] no-scrollbar">
                  {children}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}