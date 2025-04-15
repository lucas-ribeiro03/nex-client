import styles from "./style.module.scss";
import logo from "../../../public/logoNex.png";
import { useState } from "react";
import { useForm } from "react-hook-form";
import axios from "axios";
import { useDispatch } from "react-redux";
import { saveLogin } from "../../redux/isLoggedReducer/isLogged-slice";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { useGoogleLogin } from "@react-oauth/google";
import { toast, ToastContainer } from "react-toastify";

interface FormData {
  identifier: string;
  email: string;
  username: string;
  password: string;
}

export const Login: React.FC = () => {
  const navigate = useNavigate();
  const dispatch = useDispatch();
  const [passwordVisble, setPasswordVisible] = useState(false);
  const [step, setStep] = useState<
    "email" | "password" | "username" | "identifier" | ""
  >("identifier");
  const [mode, setMode] = useState<"signIn" | "signUp">("signIn");

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormData>();

  const checkEmail = async (email: string) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/signup", {
        email,
      });

      if (response.data.error) return toast.error(response.data.error);
      setStep("username");
    } catch (e) {
      console.log("ee", e);
    }
  };

  const checkUsername = async (username: string) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/signup", {
        username,
      });

      if (response.data.error) return toast.error(response.data.error);
      setStep("password");
    } catch (e) {
      console.log(e);
    }
  };

  const checkUser = async (identifier: string) => {
    try {
      const response = await axios.post("http://localhost:3001/auth/signin", {
        identifier,
      });
      if (response.data.error) return toast.error(response.data.error);
      setStep("password");
    } catch (e) {
      console.log(e);
    }
  };
  const onSubmit = async (data: FormData) => {
    if (mode === "signIn") {
      const response = await axios.post("http://localhost:3001/auth/signin", {
        identifier: data.identifier,
        password: data.password,
      });

      if (response.data.error) return toast.error(response.data.error);
      localStorage.setItem("token", response.data);
      dispatch(saveLogin(true));
      navigate("/");
    }

    if (mode === "signUp") {
      try {
        const response = await axios.post("http://localhost:3001/auth/signup", {
          email: data.email,
          username: data.username,
          nickname: data.username,
          password: data.password,
        });
        if (response.data.error) return toast.error(response.data.error);
        navigate(0);
      } catch (e) {
        console.log(e);
      }
    }
  };

  const googleLogin = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      const userInfo = await axios.get(
        "https://www.googleapis.com/oauth2/v3/userinfo",
        {
          headers: {
            Authorization: `Bearer ${tokenResponse.access_token}`,
          },
        }
      );
      const postGoogleUsers = async () => {
        const response = await axios.post("http://localhost:3001/auth/google", {
          username: userInfo.data.name,
          nickname: userInfo.data.name,
          email: userInfo.data.email,
          password: userInfo.data.sub,
        });

        localStorage.setItem("token", response.data);
        dispatch(saveLogin(true));
        navigate("/");
      };

      postGoogleUsers();
    },
  });

  return (
    <div className={styles.mdLoginBody}>
      <ToastContainer />
      <div className={styles.loginBody}>
        <img src={logo} height={130} width={130} alt="" />
        <h2>{mode === "signIn" ? "Sign in to NEX" : "Create a NEX account"}</h2>
        <div className={styles.googleBtn}>
          <button onClick={() => googleLogin()}>Sign in with Google</button>
        </div>
        <span>or</span>
        {mode === "signIn" ? (
          <form onSubmit={handleSubmit(onSubmit)}>
            {mode === "signIn" && step === "identifier" && (
              <>
                <input
                  type="text"
                  placeholder="Email or username"
                  {...register("identifier", {
                    required: "Campo obrigatório",
                  })}
                />
                {errors?.identifier?.message && (
                  <div className={styles.errorMessage}>
                    {errors?.identifier?.message}
                  </div>
                )}

                <button
                  onClick={handleSubmit((e) => {
                    checkUser(e.identifier);
                  })}
                >
                  Next
                </button>
              </>
            )}
            {mode === "signIn" && step === "password" && (
              <>
                {passwordVisble ? (
                  <div className={styles.inputBox}>
                    <input
                      type="text"
                      placeholder="Password"
                      {...register("password", {
                        required: "Campo obrigatório",
                        minLength: {
                          value: 6,
                          message: "Senha deve conter pelo menos 6 caractéres",
                        },
                      })}
                    />
                    <FaEyeSlash onClick={() => setPasswordVisible(false)} />
                  </div>
                ) : (
                  <div className={styles.inputBox}>
                    <input
                      type="password"
                      placeholder="Password"
                      {...register("password", {
                        required: "Campo obrigatório",
                        minLength: {
                          value: 6,
                          message: "Senha deve conter pelo menos 6 caractéres",
                        },
                      })}
                    />
                    <FaEye onClick={() => setPasswordVisible(true)} />
                  </div>
                )}

                {errors?.password?.message && (
                  <div className={styles.errorMessage}>
                    {errors?.password.message}
                  </div>
                )}
                <button>Login</button>
              </>
            )}
          </form>
        ) : (
          <form onSubmit={handleSubmit(onSubmit)}>
            {mode === "signUp" && step === "email" && (
              <>
                <input
                  type="email"
                  placeholder="Email"
                  {...register("email", { required: "Campo obrigatório" })}
                />
                {errors?.email?.message && (
                  <div className={styles.errorMessage}>
                    {errors?.email?.message}
                  </div>
                )}

                <button
                  type="button"
                  onClick={handleSubmit((e) => {
                    checkEmail(e.email);
                  })}
                >
                  Next
                </button>
              </>
            )}
            {mode === "signUp" && step === "username" && (
              <>
                <input
                  type="text"
                  placeholder="Username"
                  {...register("username", { required: "Campo obrigatorio" })}
                />
                {errors?.username?.message && (
                  <div className={styles.errorMessage}>
                    {errors?.username?.message}
                  </div>
                )}
                <button
                  type="button"
                  onClick={handleSubmit((e) => checkUsername(e.username))}
                >
                  Next
                </button>
              </>
            )}

            {mode === "signUp" && step === "password" && (
              <>
                {passwordVisble ? (
                  <div className={styles.inputBox}>
                    <input
                      type="text"
                      placeholder="Password"
                      {...register("password", {
                        required: "Campo obrigatório",
                        minLength: {
                          value: 6,
                          message: "Senha deve conter pelo menos 6 caractéres",
                        },
                      })}
                    />
                    <FaEyeSlash onClick={() => setPasswordVisible(false)} />
                  </div>
                ) : (
                  <div className={styles.inputBox}>
                    <input
                      type="password"
                      placeholder="Password"
                      {...register("password", {
                        required: "Campo obrigatório",
                        minLength: {
                          value: 6,
                          message: "Senha deve conter pelo menos 6 caractéres",
                        },
                      })}
                    />
                    <FaEye onClick={() => setPasswordVisible(true)} />
                  </div>
                )}
                <button>Sign Up</button>
              </>
            )}
          </form>
        )}
        {mode === "signIn" && step !== "password" && (
          <>
            <span>
              Don't have an account?{" "}
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signUp");
                  setStep("email");
                }}
              >
                Sign up
              </a>
            </span>
          </>
        )}{" "}
        {mode === "signUp" && step !== "password" && (
          <>
            <span>
              Already have an account?{" "}
              <a
                href=""
                onClick={(e) => {
                  e.preventDefault();
                  setMode("signIn");
                  setStep("identifier");
                }}
              >
                Sign in
              </a>
            </span>
          </>
        )}
      </div>
    </div>
  );
};
