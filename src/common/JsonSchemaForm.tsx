import React from 'react'
import { ThemeProps, withTheme } from '@rjsf/core'
import validator from '@rjsf/validator-ajv8'
import { FieldProps, RegistryFieldsType } from '@rjsf/utils'
import 'react-international-phone/style.css'
import '../styles/phone.css'

// Custom React component for rendering the StringField in the form.
// This component is used as a template for rendering string input fields in the JSON Schema Form.
class StringFieldTemplate extends React.Component<FieldProps> {
  render() {    
    return (
      <>
        <div key={this.props.name} className='mt-4 mb-2'>
        <input
                type="text"
                id={'element.content.key'}
                className="block w-full rounded-md border-0 py-1.5 pr-12 text-white bg-transparent focus:ring-transparent placeholder:text-gray-400 text-sm sm:leading-6"
                placeholder={`${this.props.schema.title}`}
                value={this.props.formData}
                onChange={(event) => this.props.onChange(event.target.value)}
              />
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
