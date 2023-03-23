import { useEffect, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { Dialog } from "primereact/dialog";
import { InputText } from "primereact/inputtext";
import { CustomButton } from "../CustomButton";
import { classNames } from "primereact/utils";
import { Dropdown } from "primereact/dropdown";
import { InputTextarea } from 'primereact/inputtextarea';
import "./formStyle.css";
import { useDispatch, useSelector } from "react-redux";
import { addCategory, updateCategory } from "../../reducers/categoryTableSlice";
import * as Messag from "../../config/ToastMessage";
import { Text } from "../Text";
import { TreeSelect } from 'primereact/treeselect'
import axiosInstance from "../../api/axios.instance";
import { formatText, sortAlphabeticalObjectArr } from "../../utils/tableUtils";


const statusOption = [
  { key: "Available", value: "Available" },
  { key: "Unavailable", value: "Unavailable" },
];
export const CategoryForm = ({ onHide, showCategoryForm, toast }) => {
  const defaultValues = {
    categoryName: "",
    parentId: "",
    warehouseId: "",
    status: "",
    desc: ""
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

  const { user } = useSelector(
    (state) => state.authenticate
  );

  const defaultCategory = {key: null, label: "Root Category"};


  const [categories, setCategories] = useState([]);
  const [warehouse, setWarehouse] = useState([])

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

  function modifyKeyNames(object) {
    for (let key in object) {
      // Check if the value of the key is an object
      if (typeof object[key] === 'object' && object[key] !== null) {
        // Recursively call the function to traverse the nested object
        modifyKeyNames(object[key]);
      }
      // Modify the key name if it matches the old key name
      if (key === 'id') {
        object.key = object.id;
      }
      if (key === 'categoryName') {
        object.label = object.categoryName
      }
    }
  }

  function modifyAll(arr) {
    for (let i = 0; i < arr.length; i++) {
      modifyKeyNames(arr[i]);
    }
  }

  const onSubmit = (data) => {
    if (data.parentId === "") {
      data.parentId = null
    }
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
      dispatch(addCategory(data))
        .unwrap()
        .then((res) => {
          //show toast here

          onHide(reset);
          let Message_Success = Messag.Add_Cat_ToastSuccessMessage;
          toast.current.show({ severity: "success", detail: Message_Success });
        })
        .catch((err) => {
          //show toast here
          toast.current.show({ severity: "error", detail: err.message });
        });
    // }
  };

  useEffect(() => {
    // if (mode === "update" && selectedCategory) {
    //   setValue("categoryName", selectedCategory.categoryName);
    //   setValue("status", selectedCategory.status);
    // }

    axiosInstance
    .get(`/category?page=0&limit=100000`)
    .then((resp) => {
      let sortedCateGories = sortAlphabeticalObjectArr(resp.data.children, 'categoryName')
      modifyAll(sortedCateGories)
      sortedCateGories.unshift(defaultCategory)
      setCategories(sortedCateGories);
    })
    .catch((err) => {
      console.error(err);
    });

    axiosInstance
    .get(`/company/warehouse?page=0&limit=100000&isActive=1`)
    .then((resp) => {
      let sortedWarehouse = sortAlphabeticalObjectArr(resp.data, 'name')
      setWarehouse(sortedWarehouse);
    })
    .catch((err) => {
      console.error(err);
    });

  }, []);
  console.log(categories)
  console.log(warehouse)


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
            <label htmlFor='parentId'>Parent Category *</label>
            <Controller
              name='parentId'
              control={control}
              // rules={{ required: 'Please select a category.' }}
              render={({ field, fieldState }) => (
                <>
                  <TreeSelect
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    filter
                    inputRef={field.ref}
                    options={categories}
                    placeholder='Root Category'
                    className={classNames('w-full', {
                      'p-invalid': fieldState.error,
                    })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
            {getFormErrorMessage('parentId')}
          </div>
          <div className="field">
            <label htmlFor="categoryId">Warehouse *</label>
            <Controller
              name="warehouseId"
              control={control}
              rules={{ required: "Please select a warehouse." }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  options={warehouse}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel="name"
                  optionValue="id"
                  placeholder="Choose warehouse"
                  className={classNames({ "p-invalid": fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage("warehouseId")}
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
          <div className="field">
            <label htmlFor="desc">Description (optional) </label><br />
            <small>* It must have upper and lower case characters</small>
            <Controller
              name="desc"
              control={control}
              rules={{
                required: false,
                pattern: {
                  value: /[a-z]/,
                  message: "Description must have upper and lower case characters",
                  
                },
              }}
              render={({ field, fieldState }) => (
                <InputTextarea
                className="mt-1"
                  id={field.name}
                  rows={3}
                  cols={30}
                  {...field}
                  autoResize
                  placeholder="Category description ....."
                />
              )}
            />
            {getFormErrorMessage("desc")}
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
