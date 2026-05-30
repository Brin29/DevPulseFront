import { useNavigate, useSearchParams } from "react-router-dom";
import { authUserMutations } from "../../hooks/auth.hook";
import { useEffect } from "react";

export const MagicLogin = () => {
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();

  const token = searchParams.get("token");
  const { verfifyMagicLink } = authUserMutations();

  useEffect(() => {
    if (!token) {
      return;
    }

    const payload = {
      magic_token: token
    }

    verfifyMagicLink.mutate((payload), {
      onSuccess: (data: any) => {
        localStorage.setItem("authMe", JSON.stringify(data))
        navigate("/dashboard")
      },
      onError: (error) => {
        console.log("Ocurrio un error:" + error)
        navigate("/sign-in")
      }
    });
  }, [token]);

  console.log(token);

  return <div>MagicLink</div>;
};
