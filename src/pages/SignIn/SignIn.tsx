import { Button, Box } from "@mui/material";
import { signIn } from "../../services/auth.service";
import { signInAdapter } from "../../adapters";
import { useForm } from "react-hook-form";
import type { SignInRequest } from "../../models/auth.model";
import { Input, InputType } from "../../components/Input";


export const SignIn = () => {

  const {
    register,
    handleSubmit,
    formState: { errors },
    trigger,
  } = useForm<SignInRequest>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const onSubmit = async (data: SignInRequest) => {
    const payload = {
      ...data,
    };

    const response = await signIn(payload);
    signInAdapter(response);
    console.log(payload);
  };

  return (
    <>
      <Box noValidate component="form" onSubmit={handleSubmit(onSubmit)}>
        <Input
          register={register}
          type={InputType.TEXT}
          label="Correo"
          name="email"
          trigger={trigger}
          disabled={false}
          errors={errors}
        />

        <Input
          register={register}
          type={InputType.PASSWORD}
          label="Contraseña"
          name="password"
          trigger={trigger}
          disabled={false}
          errors={errors}
        />
        <Button type="submit">Enviar</Button>
      </Box>
    </>
  );
};
