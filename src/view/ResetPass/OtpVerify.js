import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { CustomButton } from "../../components/CustomButton";
import { API_VERIFY_OTP,API_RESET_PASS  } from "../../api/auth.service";


function OtpVerify({phoneNumber,Success,showError}) { 
    const defaultValues = {
        phoneNumber,
        otp:"",
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
  
    const Submit = async (data) => {

      const __data = {
        phone:data.phoneNumber,
        otp:data.otp
      }
      try {
        await API_VERIFY_OTP(__data).then((res)=>{
          if (res) {   
            Success();     
          }
        })
       } catch (error) { 
        showError('please enter right otp')
       // setsendOtpForm(false);
       }  
      
     
    };
    
    
    return ( 
    <form onSubmit={handleSubmit(Submit)} className="p-fluid pt-8">
        <div className="field">
            <label htmlFor="phoneNumber">Phone Number</label>
                <Controller
            name="phoneNumber"
            control={control}
            rules={{
                required: true && "Please enter phone number.",
                validate: (value) =>
                value.trim().length > 0 || "phone number is required",
            }}
            render={({ field, fieldState }) => (
                <InputText
                id={field.name}
                placeholder="Enter phone number"
                {...field}
                className={classNames({
                    "p-invalid": fieldState.invalid,
                })}
                disabled 
                />
            )}
            
            />
            {getFormErrorMessage("phoneNumber")}
        </div>
        <div className="field">
            <label htmlFor="otp">OTP</label>
                <Controller
            name="otp"
            control={control}
            rules={{
                required: true && "Please enter otp.",
                validate: (value) =>
                value.trim().length > 0 || "OTP is required",
            }}
            render={({ field, fieldState }) => (
                <InputText
                id={field.name}
                placeholder="Enter OTP"
                {...field}
                className={classNames({
                    "p-invalid": fieldState.invalid,
                })}
                />
            )}
            />
            {getFormErrorMessage("otp")}
        </div>
    <div className="w-7 m-auto mt-7">
        <CustomButton
        type="submit"
        label="Verify OTP"
        varient="filled"
        />
    </div>
</form>  
);
}

export default OtpVerify;