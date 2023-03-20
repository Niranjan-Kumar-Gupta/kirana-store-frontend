import { useState, useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { CustomButton } from "../CustomButton";
import { classNames } from "primereact/utils";
import "./formStyle.css";
import { useDispatch, useSelector } from "react-redux";
// import { addCustomer, updateCustomer } from "../../reducers/customerTableSlice";
import * as Messag from "../../config/ToastMessage";
import PhoneInputWithCountry from "react-phone-number-input/react-hook-form"
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css';
import { Text } from "../Text";

export const CustomerForm = ({ onHide, showCustomerForm, toast }) => {
  const mode = "Add"
  const selectedCustomer = {}
  // const { mode, selectedCustomer } = useSelector(
  //   (state) => state.customerTable
  // );

  const defaultValues = {
    name: "",
    phone: "",
    email: "",
  };

  const dispatch = useDispatch();

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues });

  //function form get error message
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className="p-error">{errors[name].message}</small>
    );
  };

  
  // handle sumbit formdata
  const onSubmit = (data) => {
    
    data = {...data, phone: data.phone.substring(1)}
 
    console.log(data);
    onHide();
  };

  useEffect(() => {
    if (mode === "update" && selectedCustomer) {
      setValue("name", selectedCustomer.name);
      setValue("phone", '+' + selectedCustomer.phone);
      setValue("email", selectedCustomer.email || "");
    }
  }, []);

  return (
    <Dialog
      header={ <Text type={'heading'}><span style={{textDecorationLine:"underline", textDecorationStyle:"dashed"}}>{`${mode === "update" ? "Update" : "Add"} Customer`}</span></Text>}
      visible={showCustomerForm}
      className="dialog-custom"
      onHide={() => onHide(reset)}
    >
      <div className={`card`}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <label htmlFor="name">Name *</label>
            <Controller
              name="name"
              control={control}
              rules={{ required: "Customer name is required." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  maxLength={24}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                  placeholder="Enter your name here"
                  {...field}
                />
              )}
            />
            {getFormErrorMessage("name")}
          </div>
          <div className="field">
            <label htmlFor="phone">Phone *</label>
            <Controller
              name="phone"
              control={control}
              rules={{ required: "phone number is required.",
              // validate:value=> value.toString().length == 10 || "Please enter a valid phone number. " 
              validate:value => isValidPhoneNumber(value.toString()) || "Please enter a valid phone number. " 
            }}
              render={({ field, fieldState }) => (
                <PhoneInputWithCountry
                  name="phone"
                  control={control}
                  defaultCountry="IN"
                  id={field.name}
                  placeholder="Enter phone number"
                  value={field.value}
                  onChange={(e)=>field.onChange(e.value)}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                  {...field}
                />
              )}
            />
            {getFormErrorMessage("phone")}
          </div>
          <div className="field">
            <label htmlFor="email">Email</label>
            <Controller
              name="email"
              control={control}
              rules={{
                required: false,
                pattern: {
                  value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                  message: "Enter a valid e-mail address",
                },
              }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  placeholder="Enter your email here"
                  className={classNames({ "p-invalid": fieldState.invalid })}
                  {...field}
                />
              )}
            />
            {getFormErrorMessage("email")}
          </div>

          {/* {mode !== "update" ? (
            <div className="field">
              <label htmlFor="groupId">Group (Optional)</label>
              <Dropdown
                id="groupId"
                optionLabel="groupName"
                optionValue="id"
                options={availableGroups}
                placeholder="Select a group"
                value={selectedGroupId}
                onChange={handleGroupSelect}
                showClear
              />
            </div>
          ) : (
            <></>
          )} */}

          <div>
            <CustomButton
              varient="filled"
              type="submit"
              label={mode === "update" ? "Update" : "Save"}
            />
          </div>
        </form>
      </div>
    </Dialog>
  );
};
