import { Box, Button } from "@mui/material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { VerifyCodeRequest } from "../../models/auth.model";
import { authUserMutations } from "../../hooks/auth.hook";
import { CodeInput } from "../../components/CodeInput";

export const VerificationCode = () => {
  const navigate = useNavigate();
  const methods = useForm<VerifyCodeRequest>({
    defaultValues: { code: "" },
  });

  const { verifyCode } = authUserMutations();

  const onSubmit = async (data: VerifyCodeRequest) => {
    const email = localStorage.getItem("signup_email") as string;


    const payload = {
      ...data,
      email,
    };

    verifyCode.mutate(payload, {
      onSuccess: (data: any) => {
        localStorage.setItem("verification_token", data.verification_token)
        navigate("/sign-up");
      },
      onError: (error) => {
        console.log("Ocurrio un error:" + error);
      },
    });
  };

  return (
    <FormProvider {...methods}>
      <Box
        noValidate
        component="form"
        onSubmit={methods.handleSubmit(onSubmit)}
        sx={{ display: "flex", flexDirection: "column", gap: 2 }}
      >
        <CodeInput name="code" codeLength={6} />
        <Button type="submit" variant="contained">
          Verificar
        </Button>
      </Box>
    </FormProvider>
  );
};
