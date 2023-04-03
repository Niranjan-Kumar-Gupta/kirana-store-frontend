import styles from "./style.module.css";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { CustomButton } from "../../components/CustomButton";
import { useState, useRef, useEffect } from "react";
import { ReactComponent as SkaleworkLogo } from "../../assets/svgIcons/Skalework.svg";
import { login } from "../../reducers/authSlice";
import { useDispatch } from "react-redux";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Text } from "../../components/Text";
import VersionTag from "../../config/VersionTag";
import { useSelector } from "react-redux";



export const Login = () => {
  
  const {isLogedIn} = useSelector(state => state.authenticate);
  
    
  const toast = useRef();
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);

  const defaultValues = {
    userName: "",
    password: "",
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm({ defaultValues });

  //function form get error message
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const showError = (message) => {
    toast.current.show({
      severity: "error",
      detail: message,
      life: 3000,
    });
  };
  const resetPage=()=>{
    navigate("/resetPass");
  }

  useEffect(() => {
    if (isLogedIn) {
      navigate("/products");
    }
  }, []);

  const onSubmit = (data) => {
    dispatch(login(data))
      .unwrap()
      .then((res) => {
        navigate("/products");
      })
      .catch((err) => {
        showError(err.message);
      });
  };
  return (
    <div className={` flex flex-column w-full ${styles["login-component"]}`}>
      <Toast ref={toast} />
      <div
        className={`flex-grow-1 w-full justify-content-center ${styles["wrapper-login"]}`}
      >
        <div
          className={`w-full h-full flex flex-column justify-content-center`}
        >
          <div className={` ${styles["login-module"]}`}>
          <div className="w-5 py-2">
            <SkaleworkLogo />
          </div>
          <div className={`${styles["login-form"]}`}>
            <form onSubmit={handleSubmit(onSubmit)} className="p-fluid pt-8">
              <div className="field">
                <label htmlFor="userName">Username</label>
                <Controller
                  name="userName"
                  control={control}
                  rules={{
                    required: true && "Please enter username.",
                    validate: (value) =>
                      value.trim().length > 0 || "username is required",
                  }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      placeholder="Enter username"
                      {...field}
                      className={classNames({
                        "p-invalid": fieldState.invalid,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage("userName")}
              </div>
              <div className="field">
                <label htmlFor="password">Password</label>
                <Controller
                  name="password"
                  control={control}
                  rules={{ required: true && "Please enter password." }}
                  render={({ field, fieldState }) => (
                    <span className="p-input-icon-right">
                      <i
                        className={`pi ${
                          showPassword ? "pi-eye" : "pi-eye-slash"
                        }`}
                        onClick={() => setShowPassword((prev) => !prev)}
                      />
                      <InputText
                        type={`${showPassword ? "text" : "password"}`}
                        id={field.name}
                        placeholder="Enter password"
                        {...field}
                        className={classNames({
                          "p-invalid": fieldState.invalid,
                        })}
                      />
                    </span>
                  )}
                />
                {getFormErrorMessage("password")}
              </div>
              <div className="flex" >
                <div style={{cursor:"pointer"}} onClick={resetPage}>
                <Text type={"sub-heading"} color="#1C738E" >Forgot Password</Text>
                </div>
              </div>
              <div className="w-7 m-auto mt-7">
                <CustomButton
                  type="submit"
                  label="Signin"
                  varient="filled"
                />
              </div>
            </form>
              <div className="pt-6 text-center">
                <VersionTag/>
              </div>
          </div>
          </div>

        </div>
      </div>
    </div>
  );
};
