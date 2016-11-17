export interface IQuestionOptions {
  value?: any;
  key?: string;
  type?: string;
  label?: string;
  required?: boolean;
  order?: number;
  controlType?: string;
}

export interface IDropdownOption {
  key: string;
  value: string;
}
