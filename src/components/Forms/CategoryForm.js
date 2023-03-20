import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { CustomButton } from "../CustomButton";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import "./formStyle.css";
import { useDispatch, useSelector } from "react-redux";
// import { addCategory, updateCategory } from "../../reducers/categoryTableSlice";
import * as Messag from "../../config/ToastMessage";
import { Text } from "../Text";
import { TreeSelect } from 'primereact/treeselect'

const statusOption = [
  { key: "Available", value: "Available" },
  { key: "Unavailable", value: "Unavailable" },
];
export const CategoryForm = ({ onHide, showCategoryForm, toast }) => {
  const defaultValues = {
    categoryName: "",
    parentCategory: "",
    status: "",
  };
  const mode = "Add"
  const selectedCategory = {}
  const categoryData = [
    {
      key: '0',
      label: 'Documents',
      data: 'Documents Folder',
      icon: 'pi pi-fw pi-inbox',
      children: [
        {
          key: '0-0',
          label: 'Work',
          data: 'Work Folder',
          icon: 'pi pi-fw pi-cog',
          children: [
            {
              key: '0-0-0',
              label: 'Expenses.doc',
              icon: 'pi pi-fw pi-file',
              data: 'Expenses Document',
            },
            {
              key: '0-0-1',
              label: 'Resume.doc',
              icon: 'pi pi-fw pi-file',
              data: 'Resume Document',
            },
          ],
        },
        {
          key: '0-1',
          label: 'Home',
          data: 'Home Folder',
          icon: 'pi pi-fw pi-home',
          children: [
            {
              key: '0-1-0',
              label: 'Invoices.txt',
              icon: 'pi pi-fw pi-file',
              data: 'Invoices for this month',
            },
          ],
        },
      ],
    },
    {
      key: '1',
      label: 'Events',
      data: 'Events Folder',
      icon: 'pi pi-fw pi-calendar',
      children: [
        {
          key: '1-0',
          label: 'Meeting',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Meeting',
        },
        {
          key: '1-1',
          label: 'Product Launch',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Product Launch',
        },
        {
          key: '1-2',
          label: 'Report Review',
          icon: 'pi pi-fw pi-calendar-plus',
          data: 'Report Review',
        },
      ],
    },
    {
      key: '2',
      label: 'Movies',
      data: 'Movies Folder',
      icon: 'pi pi-fw pi-star-fill',
      children: [
        {
          key: '2-0',
          icon: 'pi pi-fw pi-star-fill',
          label: 'Al Pacino',
          data: 'Pacino Movies',
          children: [
            {
              key: '2-0-0',
              label: 'Scarface',
              icon: 'pi pi-fw pi-video',
              data: 'Scarface Movie',
            },
            {
              key: '2-0-1',
              label: 'Serpico',
              icon: 'pi pi-fw pi-video',
              data: 'Serpico Movie',
            },
          ],
        },
        {
          key: '2-1',
          label: 'Robert De Niro',
          icon: 'pi pi-fw pi-star-fill',
          data: 'De Niro Movies',
          children: [
            {
              key: '2-1-0',
              label: 'Goodfellas',
              icon: 'pi pi-fw pi-video',
              data: 'Goodfellas Movie',
            },
            {
              key: '2-1-1',
              label: 'Untouchables',
              icon: 'pi pi-fw pi-video',
              data: 'Untouchables Movie',
            },
          ],
        },
      ],
    },
  ]
  // const { mode, selectedCategory } = useSelector(
  //   (state) => state.categoryTable
  // );

  // const [parentCategory, setParentCategory] = useState(categoryData);

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
          >{`${mode === "update" ? "Update" : "Add New"} Category`}</span>
        </Text>
        {/* <Text type={'small-text'} style={{marginTop:"0.3rem"}} >Note: Max 30 products allowed in one category.</Text> */}
      </div>
    );
  };

  const onSubmit = (data) => {
    console.log(data)
    onHide()
    // if (mode === "update") {
    //   const categoryId = selectedCategory.id;
    //   dispatch(updateCategory({ categoryId, data }))
    //     .unwrap()
    //     .then((res) => {
    //       //show toast here

    //       onHide(reset);
    //       let Message_Success = Messag.Update_Cat_ToastSuccessMessage;
    //       toast.current.show({ severity: "success", detail: Message_Success });
    //     })
    //     .catch((err) => {
    //       //show toast here
    //       toast.current.show({ severity: "error", detail: err.response.data });
    //     });
    // } else {
    //   dispatch(addCategory(data))
    //     .unwrap()
    //     .then((res) => {
    //       //show toast here

    //       onHide(reset);
    //       let Message_Success = Messag.Add_Cat_ToastSuccessMessage;
    //       toast.current.show({ severity: "success", detail: Message_Success });
    //     })
    //     .catch((err) => {
    //       //show toast here
    //       toast.current.show({ severity: "error", detail: err.message });
    //     });
    // }
  };

  useEffect(() => {
    if (mode === "update" && selectedCategory) {
      setValue("categoryName", selectedCategory.categoryName);
      setValue("status", selectedCategory.status);
    }
  }, []);

  return (
    <Dialog
      header={dialogHeader}
      visible={showCategoryForm}
      onHide={() => onHide(reset)}
      className="dialog-custom"
    >
      <div className={`card`}>
        <form onSubmit={handleSubmit(onSubmit)} className="p-fluid">
          <div className="field">
            <label
              htmlFor="categoryName"
              className={classNames({ "p-error": errors.name })}
            >
              Name *
            </label>
            <Controller
              name="categoryName"
              control={control}
              rules={{ required: "Please enter a category name." }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  maxLength={20}
                  className={classNames({ "p-invalid": fieldState.invalid })}
                  placeholder="Enter Category name"
                  {...field}
                />
              )}
            />
            {getFormErrorMessage("categoryName")}
          </div>
          <div className='field'>
            <label htmlFor='parentCategory'>Parent Category *</label>
            <Controller
              name='parentCategory'
              control={control}
              rules={{ required: 'Please select a category.' }}
              render={({ field, fieldState }) => (
                <>
                  <TreeSelect
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    filter
                    inputRef={field.ref}
                    options={categoryData}
                    placeholder='Select Item'
                    className={classNames('w-full', {
                      'p-invalid': fieldState.error,
                    })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
            {getFormErrorMessage('parentCategory')}
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
