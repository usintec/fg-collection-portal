export enum InputTypes {
  TEXT = 'text',
  DROPDOWN = 'select',
  DATE = 'date'
}

export interface InputElement {
  id: string
  type: InputTypes
  title: string
  placeholder: string
  defaultValue?: string
  options?: SelectOptions[]
}

export interface SelectOptions {
  id: string
  value: string
  text: string
}

export const InputSelect = [
  {
    id: InputTypes.TEXT,
    name: 'Text'
  },
  {
    id: InputTypes.DROPDOWN,
    name: 'Dropdown'
  },
  {
    id: InputTypes.DATE,
    name: 'Date'
  }
]
