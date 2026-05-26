import { TextField, type InputBaseProps } from "@mui/material";
import {
  Controller,
  type Control,
  type FieldValues,
  type Path,
  type RegisterOptions,
} from "react-hook-form";

interface InputProps<T extends FieldValues> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  type: InputType;
  rules?: RegisterOptions<T>;
  inputProps?: InputBaseProps["inputProps"];
  disabled?: boolean;
}

export enum InputType {
  NUMBER = "number",
  PASSWORD = "password",
  SEARCH = "search",
  TEXT = "text",
  HIDDEN = "hidden",
  CHECKBOX = "checkbox",
}

export const Input = <T extends FieldValues>({
  control,
  name,
  label = "",
  type,
  rules,
  inputProps,
  disabled = false,
}: InputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field, fieldState }) => (
        <TextField
          {...field}
          required
          disabled={disabled}
          type={type}
          error={!!fieldState.error}
          helperText={fieldState.error?.message}
          id={name}
          label={label}
          {...(inputProps && { inputProps: inputProps })}
          fullWidth
        />
      )}
    />
  );
};
