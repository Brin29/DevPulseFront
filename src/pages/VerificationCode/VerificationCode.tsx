import { Box, Button, Typography, Avatar } from "@mui/material";
import { PinOutlined } from "@mui/icons-material";
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
    <Box className="form-container">
      <Avatar className="form-avatar">
        <PinOutlined />
      </Avatar>
      <Typography component="h2">Verificar código</Typography>
      <Typography className="form-subtitle">
        Ingresa el código de 6 dígitos que enviamos a tu correo
      </Typography>
      <FormProvider {...methods}>
        <Box
          className="form-body"
          noValidate
          component="form"
          onSubmit={methods.handleSubmit(onSubmit)}
          sx={{ gap: 3 }}
        >
          <CodeInput name="code" codeLength={6} />
          <Button className="w-full" type="submit" size="large">
            Verificar
          </Button>
        </Box>
      </FormProvider>
    </Box>
  );
};
