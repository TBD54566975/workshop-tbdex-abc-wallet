import React from 'react'
import { ThemeProps, withTheme } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { FieldProps, RegistryFieldsType } from '@rjsf/utils'
import { Dropdown } from './Dropdown'
import { paymentReasons } from '../payment-reasons'
import { PhoneInput } from 'react-international-phone'
import 'react-international-phone/style.css'
import '../styles/phone.css'

// Custom React component for rendering the StringField in the form.
// This component is used as a template for rendering string input fields in the JSON Schema Form.
class StringFieldTemplate extends React.Component<FieldProps> {
  render() {    
    const isReason = this.props.name === 'reason'
    const isAccountHolderName = this.props.name === 'accountHolderName'
    const isPhoneNumber = this.props.schema.title === 'Phone Number'

    const customStyles = {
      input: {
        background: 'transparent', 
        color: 'white',
        border: 'none',
      },
      dropdown: {
        dropdownStyleProps: {
          style: {
            width: '250px'
          }
        }
      }
    }

    if (isAccountHolderName) return null
    return (
      <>
        <div key={this.props.name} className='mt-4 mb-2'>
          {isReason ? (
            <div className='text-sm'>
              <Dropdown items={paymentReasons} selectedItem={this.props.formData} setSelectedItem={(event) => this.props.onChange(event)} label={'Select a reason'} labelKind='label'/>
            </div>
          ) : (
            isPhoneNumber ? (
              <div>
                <PhoneInput 
                  hideDropdown={true}
                  forceDialCode={true}
                  defaultCountry='ke'
                  style={{ marginLeft: '8px' }}
                  countrySelectorStyleProps={customStyles.dropdown}
                  inputStyle={customStyles.input}
                  value={this.props.formData} 
                  onChange={(value) => this.props.onChange(value)} 
                />
              </div>
            ) : (
              <input
                type="text"
                id={'element.content.key'}
                className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
                placeholder={`${this.props.schema.title}`}
                value={this.props.formData}
                onChange={(event) => this.props.onChange(event.target.value)}
              />
            )
          )}
        </div>
      </>
    )
  }
}

// This component is purposely empty, indicating that it won't render any description field.
function DescriptionFieldTemplate() {
  return (
    <></>
  )
}

// This component is purposely empty, indicating that it won't render any title field.
function TitleFieldTemplate() {
  return (
    <></>
  )
}

const fieldTemplates: RegistryFieldsType = {
  StringField: StringFieldTemplate,
}

const themeObject: ThemeProps = { fields: fieldTemplates }
export const JsonSchemaForm = withTheme(themeObject)

JsonSchemaForm.defaultProps = {
  validator: validator,
  uiSchema: {
    'ui:submitButtonOptions': {
      norender: true,
    },
    'ui:globalOptions': {
      label: false,
    }
  },
  templates: { DescriptionFieldTemplate, TitleFieldTemplate }
}
