import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { CustomButton } from "../../components/CustomButton";
import { useState ,useRef} from "react";
import { useNavigate } from "react-router-dom";
import {API_RESET_PASS  } from "../../api/auth.service";
import { Toast } from "primereact/toast";

function SetPass({showError,phoneNumber}) {
    const toast = useRef();
    const navigate = useNavigate();
    const [showPassword, setShowPassword] = useState(false);
    const [showCPassword, setShowCPassword] = useState(false);
   
    const defaultValues={
        password: "",
        confirmPassword: "",
      }
         
    const {
        control,
        formState: { errors },
        handleSubmit,
    } = useForm({ defaultValues });
    const getFormErrorMessage = (name) => {
        return (
          errors[name] && <small className="p-error">{errors[name].message}</small>
        );
      };

      const showTostMsg = (message) => {
        toast.current.show({
          severity: "success",
          detail: message,
          life: 3000,
        });
      };
     
    const Submit=async(data)=>{
        if(data.password===data.confirmPassword){ 
            const __data = {
                    phone:phoneNumber,
                    password:data.password
            }
            try {
                await API_RESET_PASS(__data).then((res)=>{
                  if (res) {   
                    showTostMsg('password changed successfully')
                    navigate('/');     
                  }
                })
               } catch (error) { 
               showError('something went wrong')
              // setsendOtpForm(false);
               } 
           
        }else{
            console.log("err",data)
            showError("Password Not Match");
        }

        
    }
    return (
        <><Toast ref={toast} />
        <form onSubmit={handleSubmit(Submit)} className="p-fluid pt-8">
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
            <div className="field">
            <label htmlFor="confirmPassword">Confirm Password</label>
            <Controller
                name="confirmPassword"
                control={control}
                rules={{ required: true && "Please Confirm Password." }}
                render={({ field, fieldState }) => (
                <span className="p-input-icon-right">
                    <i
                    className={`pi ${
                        showCPassword ? "pi-eye" : "pi-eye-slash"
                    }`}
                    onClick={() => setShowCPassword((prev) => !prev)}
                    />
                    <InputText
                    type={`${showCPassword ? "text" : "password"}`}
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
            {getFormErrorMessage("ConfirmPassword")}
            </div>
            <div className="w-7 m-auto mt-7">
                <CustomButton
                type="submit"
                label="Change Password"
                varient="filled"
                />
            </div>
        </form>
        </>
      );
}

export default SetPass;