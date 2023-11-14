import { Fragment } from 'react'
import { Menu, Transition } from '@headlessui/react'
import { ChevronDownIcon } from '@heroicons/react/20/solid'
import { classNames } from '../tailwind-utils'

/**
 * Dropdown Component
 *
 * This component provides a customizable dropdown menu using the Headless UI library in React.
 * It allows users to select an item from a list of options and displays the selected item or a label.
 *
 * @param {Object} props - The props for the Dropdown component.
 * @param {Array} props.items - An array of items to populate the dropdown menu.
 * @param {any} props.selectedItem - The currently selected item from the dropdown.
 * @param {Function} props.setSelectedItem - A callback function to set the selected item.
 * @param {string} [props.selectedItemColor='text-gray-100'] - The color of the selected item text, defaulting to a light gray.
 * @param {string} [props.label] - A label to display when no item is selected.
 * @param {string} [props.labelKind=''] - If specified, this key is used to extract the label text from items.
 * @returns {JSX.Element} - Returns a dropdown menu component.
 */
export function Dropdown({ items, selectedItem, setSelectedItem, selectedItemColor = 'text-gray-100', label, labelKind = '' }) {

  const handleSelect = (item) => {
    setSelectedItem(item)
  }
  
  return (
    <Menu as="div" className="relative text-left mt-3">
      <div>
        <Menu.Button className="w-full inline-flex justify-between items-center bg-transparent px-3 py-2 font-semibold text-gray-900 hover:bg-neutral-850 focus:outline-none">
          <span className={classNames(selectedItem ? selectedItemColor : 'text-gray-400', 'text-left font-normal')}>
            {selectedItem ? (labelKind !== '' ? selectedItem[labelKind] : selectedItem) : label}
          </span>          
          <ChevronDownIcon className="-mr-1 h-5 w-5 text-gray-400" aria-hidden="true" />
        </Menu.Button>
      </div>

      <Transition
        as={Fragment}
        enter="transition ease-out duration-100"
        enterFrom="transform opacity-0 scale-95"
        enterTo="transform opacity-100 scale-100"
        leave="transition ease-in duration-75"
        leaveFrom="transform opacity-100 scale-100"
        leaveTo="transform opacity-0 scale-95"
      >
        <Menu.Items className="absolute right-0 z-10 mt-2 w-full max-h-60 no-scrollbar overflow-y-auto origin-top-right rounded-md bg-neutral-900 shadow-lg focus:outline-none">
          <div className="py-1">
            {items.map((item, index) => (
              <Menu.Item key={index}>
                {({ active }) => (
                  <a
                    onClick={() => handleSelect(item)}
                    className={classNames(
                      active ? 'bg-neutral-850 text-gray-100' : 'text-gray-300',
                      'block px-4 py-2 text-sm'
                    )}
                  >
                    {labelKind !== '' ? item[labelKind] : item}
                  </a>
                )}
              </Menu.Item>
            ))}
          </div>
        </Menu.Items>
      </Transition>
    </Menu>
  )
}
