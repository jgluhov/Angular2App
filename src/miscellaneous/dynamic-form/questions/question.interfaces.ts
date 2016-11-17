export interface IQuestionOptions {
  value?: T;
  key?: string;
  label?: string;
  required?: boolean;
  order?: number;
  controlType?: string;
}

export interface IDropdownOption {
  key: string;
  value: string;
}
