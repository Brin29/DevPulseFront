import { Box, Button, Typography, Avatar } from "@mui/material";
import { PinOutlined } from "@mui/icons-material";
import { useForm, FormProvider } from "react-hook-form";
import { useNavigate } from "react-router-dom";
import type { VerifyCodeRequest } from "../../models/auth.model";
import { authUserMutations } from "../../hooks/auth.hook";
import { CodeInput } from "../../components/CodeInput";
import { useState } from "react";
import type { ApiResponseError } from "../../models/api.model";
import { Modal } from "../../components/Modals/Modal";

export const VerificationCode = () => {
  const navigate = useNavigate();
  const [errorModal, setErrorModal] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
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
        localStorage.setItem("verification_token", data.verification_token);
        navigate("/sign-up");
      },
      onError: (error: ApiResponseError) => {
        setErrorModal(true);
        setErrorMessage(error?.response?.data?.error);
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
      {errorModal && (
        <Modal
          title="Ocurrio un error"
          open={errorModal}
          onClose={() => setErrorModal(false)}
        >
          <Typography>{errorMessage}</Typography>
        </Modal>
      )}
    </Box>
  );
};
