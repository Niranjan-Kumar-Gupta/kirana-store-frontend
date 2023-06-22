import { Text } from "../Text";
import { Dialog } from "primereact/dialog";
import { useForm, Controller } from "react-hook-form";
import { InputText } from "primereact/inputtext";
import { classNames } from "primereact/utils";
import { CustomButton } from "../../components/CustomButton";
import { useState } from "react";
import { underlineStyle } from "../../utils/commonStyles";
import Loader from "../Loader";
import { API_CHANGE_PASSWORD } from "../../api/user.service";


const ChangePassword = ({ toast, showChangePassword, hideChangePassword }) => {
  const [loading, setLoading] = useState(false);
  const [showCurrPassword, setShowCurrpassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfPassword, setShowConfPassword] = useState(false);
  const defaultValues = {
    currentPassword: "",
    newPassword: "",
    confirmPassword: "",
  };

  const onSubmit = (e) => {
    const configData = {
      oldPassword: e.currentPassword,
      newPassword: e.newPassword,
    };
    setLoading(true);

    API_CHANGE_PASSWORD(configData)
      .then(() => {
        setLoading(false);
        toast.current.show({
          severity: "success",
          detail: "Password changed successfully.",
        });
        hideChangePassword();
      })
      .catch((err) => {
        setLoading(false);
        toast.current.show({
          severity: "error",
          detail: err.response.data.message,
        });
      });
  };

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    watch,
  } = useForm({ defaultValues });

  //function form get error message
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  const closeDialog = () => {
    reset();
    hideChangePassword();
  };

  return (
    <Dialog
      header={
        <Text type={"heading"} style={underlineStyle}>
          Change Password
        </Text>
      }
      visible={showChangePassword}
      onHide={closeDialog}
      className={`w-4 min-w-max`}
    >
      <Loader visible={loading} />
      <form onSubmit={handleSubmit(onSubmit)} className="w-full p-fluid">
        <div className="field">
          <label htmlFor="currentPassword">Current Password</label>
          <Controller
            name="currentPassword"
            control={control}
            rules={{ required: true && "Please enter your current password." }}
            render={({ field, fieldState }) => (
              <span className="p-input-icon-right">
                <i
                  className={`pi ${
                    showCurrPassword ? "pi-eye" : "pi-eye-slash"
                  }`}
                  onClick={() => setShowCurrpassword((prev) => !prev)}
                />
                <InputText
                  type={`${showCurrPassword ? "text" : "password"}`}
                  id={field.name}
                  placeholder="Enter current password."
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.invalid,
                  })}
                />
              </span>
            )}
          />
          {getFormErrorMessage("currentPassword")}
        </div>
        <div className="field">
          <label htmlFor="newPassword">New Password</label>
          <Controller
            name="newPassword"
            control={control}
            rules={{ required: true && "Please enter new password." }}
            render={({ field, fieldState }) => (
              <span className="p-input-icon-right">
                <i
                  className={`pi ${
                    showNewPassword ? "pi-eye" : "pi-eye-slash"
                  }`}
                  onClick={() => setShowNewPassword((prev) => !prev)}
                />
                <InputText
                  type={`${showNewPassword ? "text" : "password"}`}
                  id={field.name}
                  placeholder="Enter new password"
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.invalid,
                  })}
                />
              </span>
            )}
          />
          {getFormErrorMessage("newPassword")}
        </div>
        <div className="field">
          <label htmlFor="confirmPassword">Confirm Password</label>
          <Controller
            name="confirmPassword"
            control={control}
            rules={{
              required: true && "Enter new password again to confirm.",
              validate: (val) => {
                if (watch("newPassword") !== val) {
                  return "Password does no match.";
                }
              },
            }}
            render={({ field, fieldState }) => (
              <span className="p-input-icon-right">
                <i
                  className={`pi ${
                    showConfPassword ? "pi-eye" : "pi-eye-slash"
                  }`}
                  onClick={() => setShowConfPassword((prev) => !prev)}
                />
                <InputText
                  type={`${showConfPassword ? "text" : "password"}`}
                  id={field.name}
                  placeholder="Confirm new password"
                  {...field}
                  className={classNames({
                    "p-invalid": fieldState.invalid,
                  })}
                />
              </span>
            )}
          />
          {getFormErrorMessage("confirmPassword")}
        </div>
        <div>
          <CustomButton type="submit" label="Save" varient="filled" />
        </div>
      </form>
    </Dialog>
  );
};

export default ChangePassword;
