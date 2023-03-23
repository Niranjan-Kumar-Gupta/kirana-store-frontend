import styles from "./style.module.css";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { InputNumber } from 'primereact/inputnumber';
import { classNames } from "primereact/utils";
import { CustomButton } from "../../components/CustomButton";
import { useState, useRef } from "react";
import { ReactComponent as SkaleworkLogo } from "../../assets/svgIcons/Skalework.svg";
import { useNavigate } from "react-router-dom";
import { Toast } from "primereact/toast";
import { Text } from "../../components/Text";
import OtpVerify from "./OtpVerify";
import SetPass from "./Setpass";
import VersionTag from "../../config/VersionTag";
import { API_GET_OTP } from "../../api/auth.service";
import Loader from "../../components/Loader";

export const ResetPass = () => {
  const toast = useRef();
  const navigate = useNavigate();
  const [sendOtpForm,setsendOtpForm]=useState(false);
  const [PassForm,setPassForm]= useState(false);
  const [PhoneNumber,setPhoneNumber]= useState('');

  const modalLoad = (loading) => {
    return (
      <Loader visible={loading}/>
    );
  };

  const defaultValues = {
    phoneNumber:''
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
  const showTostMsg = (message) => {
    toast.current.show({
      severity: "success",
      detail: message,
      life: 3000,
    });
  };
  const handleLoginPage=()=>{
    navigate('/');
  }
 
  const submit=async(data)=>{
    setPhoneNumber(data.phoneNumber);  
   // console.log(data,PhoneNumber)
   try {
    await API_GET_OTP(data.phoneNumber).then((res)=>{
    
      if (res) {    
        showTostMsg(res.message)
        setsendOtpForm(true);
      }
    })
   } catch (error) { 
    showError('please enter registered mobile number')
    setsendOtpForm(false);
   }  
  }

  const Success=()=>{
    setsendOtpForm(false);
    setPassForm(true);
    showTostMsg('otp verified successfully')
  }
  const resetForm=()=>{
   if(!sendOtpForm)
    return (
        <form onSubmit={handleSubmit(submit)} className="p-fluid pt-8">
        <div className="field">
          <label htmlFor="phoneNumber">Phone Number</label>
            <Controller
          name="phoneNumber"
          control={control}
          rules={{
            required: true && "Please enter phone number.",
            validate: (value) => (value.trim().length === 10 && !isNaN(value.trim())) ||  'please enter valid phone number'  ,
          }}
          render={({ field, fieldState }) => (
            <InputText
              id={field.name}
              placeholder="Enter phone number"
              {...field}
              className={classNames({
                "p-invalid": fieldState.invalid,
              })}
            />
          )}
        />
        {getFormErrorMessage("phoneNumber")}
      </div>
     
      <div className="w-7 m-auto mt-7">
        <CustomButton
          type="submit"
          label="Send OTP"
          varient="filled"
        />
      </div>
    </form>
        )
    return <></>;
  }
 const OTP=()=>{
  if(sendOtpForm)return <OtpVerify showError={showError} Success={Success} phoneNumber={PhoneNumber}/>;
  if(PassForm)return <SetPass showError={showError}  phoneNumber={PhoneNumber}/>;
  return resetForm();
}
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
              {OTP()}
              <div className={` ${styles["page-swap"]}`} >
                <div style={{cursor:"pointer"}} onClick={handleLoginPage}>
                  <Text type={"sub-heading"} color="#1C738E" >Back to Login</Text>
                </div>
              </div>
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
