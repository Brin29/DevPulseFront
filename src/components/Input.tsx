import { TextField, type InputBaseProps } from "@mui/material";
import { type FieldErrors, type UseFormRegister, type UseFormTrigger } from 'react-hook-form';


interface InputProps {
  register: UseFormRegister<any>;
  name: string;
  errors?: FieldErrors;
  label?: string;
  type: InputType;
  inputProps?: InputBaseProps["inputProps"];
  disabled?: boolean;
  trigger?: UseFormTrigger<any>;
}

export enum InputType {
  NUMBER = 'number',
  PASSWORD = 'password',
  SEARCH = 'search',
  TEXT = 'text',
  HIDDEN = 'hidden',
  CHECKBOX = 'checkbox'
}

export const Input: React.FC<InputProps> = ({}) => {
  return (
    <>
      <TextField />
      {}
    </>
  );
};
