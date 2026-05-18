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

export const Input: React.FC<InputProps> = ({register, name, errors, label = '', type, inputProps, disabled = false, trigger}) => {
  return (
    <>
      <TextField 
        required
        disabled={disabled}
        type={type}
        error={errors && !!errors[name]}
        id={name}
        label={label}
        variant="standard"
        {...register(name)}
        {...(inputProps && { inputProps: inputProps })}
        onChange={() => trigger && trigger()}
        fullWidth
      />
    </>
  );
};
