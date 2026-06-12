import {
  TextField,
  type BoxProps,
  type InputBaseProps,
} from "@mui/material";
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
  sx?: BoxProps["sx"];
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void;
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
  sx,
  onBlur,
}: InputProps<T>) => {
  return (
    <Controller
      name={name}
      control={control}
      rules={rules}
      render={({ field: { onBlur: fieldOnBlur, ...fieldRest }, fieldState }) => (
        <TextField
          sx={{ ...sx }}
          {...fieldRest}
          onBlur={(e: React.FocusEvent<HTMLInputElement>) => {
            fieldOnBlur();
            onBlur?.(e);
          }}
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
