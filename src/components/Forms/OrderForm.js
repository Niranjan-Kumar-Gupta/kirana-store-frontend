import { useEffect } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { CustomButton } from "../CustomButton";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import "./formStyle.css";
import { useDispatch, useSelector } from "react-redux";
import * as Messag from "../../config/ToastMessage";
import { Text } from "../Text";

export const OrderForm = ({ onHide, showOrderForm, toast }) => {

  const statusOption = [
    { key: "Available", value: "Available" },
    { key: "Unavailable", value: "Unavailable" },
  ];

  const defaultValues = {
    // variantIds: [],
    quantity: "",
    status: "",
  };
  const mode = "Add";

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

  const dialogHeader = () => {
    return (
      <div>
        <Text type={"heading"}>
          <span
            style={{
              textDecorationLine: "underline",
              textDecorationStyle: "dashed",
            }}
          >{`${mode === "update" ? "Update" : "New"} Order`}</span>
        </Text>
      </div>
    );
  };

  const onSubmit = (data) => {
    console.log(data);
    onHide();
  };

  // useEffect(() => {
  //   if (mode === "update" && selectedCategory) {
  //     setValue("categoryName", selectedCategory.categoryName);
  //     setValue("status", selectedCategory.status);
  //   }
  // }, []);

  return (
    <Dialog
      header={dialogHeader}
      visible={showOrderForm}
      onHide={() => onHide(reset)}
      className="dialog-custom"
    >
      <div className={`card`}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <label
              htmlFor="quantity"
              className={classNames({ "p-error": errors.name })}
            >
              Quantity *
            </label>
            <Controller
              name="quantity"
              control={control}
              rules={{ required: "Please enter a category name." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  maxLength={20}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                  placeholder="Enter Quantity"
                  {...field}
                />
              )}
            />
            {getFormErrorMessage("quantity")}
          </div>
          <div className="field">
            <label htmlFor="status">Status *</label>
            <Controller
              name="status"
              control={control}
              rules={{ required: "Status is required." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={statusOption}
                  optionLabel="key"
                  optionValue="value"
                  placeholder="Choose"
                  className={classNames({ "p-invalid": fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage("status")}
          </div>
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
