import { Box, TextField } from "@mui/material";
import { useRef } from "react";
import { Controller, useFormContext } from "react-hook-form";

interface CodeInputProps {
  name: string;
  codeLength?: number;
}

export const CodeInput: React.FC<CodeInputProps> = ({ 
  name,
  codeLength = 6,
}) => {
  const { control, setValue, getValues } = useFormContext();
  const inputsRef = useRef<Array<HTMLInputElement | null>>([]);

  const updateCode = (newDigits: string[]) => {
    setValue(name, newDigits.join(""), { shouldValidate: true });
  };

  const getDigits = (): string[] => {
    const code = getValues(name) ?? "";
    const digits = code.split("");
    while (digits.length < codeLength) digits.push("");
    return digits;
  };

  const handleChange = (value: string, index: number) => {
    if (!/^\d?$/.test(value)) return;
    const digits = getDigits();
    digits[index] = value;
    updateCode(digits);
    if (value && index < codeLength - 1) {
      inputsRef.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent, index: number) => {
    if (e.key === "Backspace" && !getDigits()[index] && index > 0) {
      inputsRef.current[index - 1]?.focus();
    }
  };

  const handlePaste = (e: React.ClipboardEvent) => {
    e.preventDefault();
    const pastedData = e.clipboardData
      .getData("text")
      .replace(/\D/g, "")
      .slice(0, codeLength);
    const newDigits = pastedData.split("");
    while (newDigits.length < codeLength) newDigits.push("");
    updateCode(newDigits);
    const focusIndex =
      pastedData.length >= codeLength ? codeLength - 1 : pastedData.length;
    inputsRef.current[focusIndex]?.focus();
  };

  return (
    <Controller
      name={name}
      control={control}
      rules={{
        validate: (value) =>
          value.length === codeLength ||
          `El código debe tener ${codeLength} dígitos`,
      }}
      render={({ field, fieldState }) => (
        <>
          <Box sx={{ display: "flex", gap: 2 }}>
            {getDigits().map((digit, index) => (
              <TextField
                key={index}
                value={digit}
                onChange={(e) => handleChange(e.target.value, index)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                onPaste={handlePaste}
                inputRef={(el) => {
                  inputsRef.current[index] = el;
                  if (index === 0) field.ref(el);
                }}
                error={!!fieldState.error}
                slotProps={{ htmlInput: { maxLength: 1 } }}
                sx={{ width: 56 }}
              />
            ))}
          </Box>
          {fieldState.error && (
            <Box sx={{ color: "error.main", fontSize: 12, mt: 1 }}>
              {fieldState.error.message}
            </Box>
          )}
        </>
      )}
    />
  );
};