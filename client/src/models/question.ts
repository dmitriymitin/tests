export enum AnswerType {
  Text = 'text',
  Checkbox = 'checkbox',
  Radio = 'radio'
}

export type TAnswerType = AnswerType.Text | AnswerType.Checkbox | AnswerType.Radio;