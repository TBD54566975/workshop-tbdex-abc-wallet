import { FlagEmoji } from 'react-international-phone'

/**
 * Flag Component
 *
 * This component displays a flag emoji based on the provided country name.
 *
 * @param {Object} props - The props for the Flag component.
 * @param {string} props.country - The name of the country for which the flag emoji should be displayed.
 * @returns {JSX.Element|null} - Returns the flag emoji corresponding to the provided country.
 */
export function Flag({ country }) {
  return (
    <>
      {country === 'Kenya' && (
        <FlagEmoji iso2="ke" size="24px" />
      )}
      {country === 'Nigeria' && (
        <FlagEmoji iso2="ng" size="24px" />
      )}
    </>
  )
}
