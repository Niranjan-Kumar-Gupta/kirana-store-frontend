import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { Dropdown } from 'primereact/dropdown'
import { CustomButton } from '../CustomButton'
import { classNames } from 'primereact/utils'
import { InputNumber } from 'primereact/inputnumber'
import './formStyle.css'
import { CustomImageInput } from '../CustomImageInput'
// import { ReactComponent as ImagePlaceholder } from "../../svg/ImgPlaceholder.svg";
import { InputTextarea } from 'primereact/inputtextarea'
import * as Messag from '../../config/ToastMessage'
import { useDispatch, useSelector } from 'react-redux'
// import axiosInstance from "../../api/axios.instance";
// import { changeShowNotice } from "../../reducers/appSlice";
import { Text } from '../Text'
import { ReactComponent as Cross } from '../../assets/svgIcons/cross.svg'
import { TreeSelect } from 'primereact/treeselect'

// import {
//   addProduct,
//   resetMode,
//   resetSelectedProduct,
//   updateProduct,
// } from "../../reducers/productTableSlice";

const statusOption = [
  { key: 'Available', value: 'Available' },
  { key: 'Unavailable', value: 'Unavailable' },
]

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

export const ProductForm = ({ showProductForm, setShowProductForm, toast }) => {
  const [categories, setCategories] = useState(categoryData)
  const [selectedImage, setSeletedImage] = useState(null)

  const dispatch = useDispatch()
  // const { mode, selectedProduct } = useSelector((state) => state.productTable);
  const mode = 'add'
  const selectedProduct = {}

  const handleImg = (img) => {
    setSeletedImage(img)
  }

  const onHide = (reset) => {
    setSeletedImage(null)
    setShowProductForm(false)
    reset()
  }

  const defaultValues = {
    productName: '',
    categories: [],
    quantity: undefined,
    price: undefined,
    status: '',
    SKUCode: '',
    desc: '',
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })

  //function form get error message
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }

  const typechecker = (selectedImage) => {
    if (
      selectedImage.type === 'image/png' ||
      selectedImage.type === 'image/jpeg'
    ) {
      return true
    }
    return false
  }

  const onSubmit = (data) => {
    if (selectedImage === null) {
      toast.current.show({
        severity: 'error',
        detail: 'Please select an image.',
      })
      return
    }
    if (typechecker(selectedImage) || typeof selectedImage === 'string') {
      if (selectedImage.size > 8000000) {
        toast.current.show({
          severity: 'error',
          detail: 'Image size should be less than 8 MB.',
        })
        return
      }
    } else {
      toast.current.show({
        severity: 'error',
        detail: 'Please select .jpg or .png format image.',
      })
      return
    }

    if (mode === 'update') {
      // const productId = selectedProduct.id;
      // dispatch(updateProduct({ productId, data ,selectedImage}))
      //   .unwrap()
      //   .then(res => {
      //     //show toast here
      //     dispatch(changeShowNotice(true));
      //     let Message_Success = Messag.Update_Product_ToastSuccessMessage;
      //     toast.current.show({ severity: 'success', detail: Message_Success })
      //     setDisplayAddProductModule(false);
      //   })
      //   .catch(err => {
      //     //show toast here
      //    // console.log(err.response);
      //     toast.current.show({ severity: 'error', detail: err.response.data });
      //   })
    } else {
      data = { ...data, isActive: 1 }
      // dispatch(addProduct({data,selectedImage}))
      //   .unwrap()
      //   .then(() => {
      //     setDisplayAddProductModule(false);
      //     dispatch(changeShowNotice(true));
      //     let Message_Success = Messag.Add_Product_ToastSuccessMessage;
      //     toast.current.show({ severity: 'success', detail: Message_Success });
      //   })
      //   .catch(err => {
      //     toast.current.show({ severity: 'error', detail: err.message});
      //   })
    }
    console.log(data)
    setShowProductForm(false)
  }
  const imageBodyTemplate = () => {
    const d = new Date()
    if (mode == 'update' && selectedImage && selectedImage.length > 2) {
      return (
        <img
          src={`${selectedImage}?v=${d.getTime()}`}
          onError={(e) => (e.target.src = './images/ImgPlaceholder.svg')}
          style={{ width: '100px' }}
        />
      )
    } else
      return selectedImage ? (
        <img
          src={`${selectedImage.objectURL}`}
          onError={(e) => (e.target.src = './images/ImgPlaceholder.svg')}
          style={{ width: '100px' }}
        />
      ) : (
        // <ImagePlaceholder />
        ''
      )
  }
  useEffect(() => {
    if (mode == 'update' && selectedProduct) {
      setValue('productName', selectedProduct.productName)
      setValue('categoryId', selectedProduct.categoryId)
      setValue('quantity', selectedProduct.quantity)
      setValue('price', selectedProduct.price)
      setValue('status', selectedProduct.status)
      setValue('SKUCode', selectedProduct.SKUCode)
      setValue('desc', selectedProduct.desc)
      handleImg(selectedProduct.url)
    }
    //fetch all category list for dropdown
    // axiosInstance
    // .get(`/category?page=0&limit=100000&isActive=1`)
    // .then((resp) => {
    //   setCategories(resp.data.rows);
    // })
    // .catch((err) => {
    //   console.error(err);
    // });
  }, [])

  return (
    <Dialog
      header={
        <Text type={'heading'}>
          <span
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'dashed',
            }}
          >
            {mode === 'update' ? 'Update Product' : 'Add New Product'}
          </span>
        </Text>
      }
      visible={showProductForm}
      onHide={() => onHide(reset)}
      className='dialog-custom'
    >
      <div className={`card`}>
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='p-fluid'
          encType='multipart/form-data'
        >
          <div className='field'>
            <label htmlFor='productName'>Name *</label>
            <Controller
              name='productName'
              control={control}
              rules={{ required: 'Product name is required.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  maxLength={24}
                  {...field}
                  placeholder='Name of the product'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('productName')}
          </div>
          <div className='field'>
            <label htmlFor='SKUCode'>SKU Code *</label>
            <Controller
              name='SKUCode'
              control={control}
              rules={{ required: 'SKU Code is required.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  maxLength={24}
                  {...field}
                  placeholder='Enter SKUCode'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                  disabled={mode === 'update' ? true : false}
                />
              )}
            />
            {getFormErrorMessage('SKUCode')}
          </div>
          <div className='field'>
            <label htmlFor='categories'>Category *</label>
            <Controller
              name='categories'
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
                    options={categories}
                    placeholder='Select Item'
                    className={classNames('w-full', {
                      'p-invalid': fieldState.error,
                    })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
            {/* <Controller
              name='categoryId'
              control={control}
              rules={{ required: 'Please select a category.' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  options={[
                    {
                      id: 69,
                      categoryName: 'sample test 1',
                      status: 'Available',
                      isActive: 1,
                      companyId: 19,
                      desc: null,
                    },
                    {
                      id: 68,
                      categoryName: 'sample test',
                      status: 'Available',
                      isActive: 1,
                      companyId: 19,
                      desc: null,
                    },
                  ]}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  optionLabel='categoryName'
                  optionValue='id'
                  placeholder='Choose'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            /> */}
            {getFormErrorMessage('categoryId') || (
              <small>*Max 30 products allowed in one category.</small>
            )}
          </div>
          <div className='field'>
            <label htmlFor='status'>Status *</label>
            <Controller
              name='status'
              control={control}
              rules={{ required: 'Status is required.' }}
              render={({ field, fieldState }) => (
                <Dropdown
                  id={field.name}
                  options={statusOption}
                  optionLabel='key'
                  optionValue='value'
                  placeholder='Choose'
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('status')}
          </div>
          <div className='field'>
            <label htmlFor='quantity'>Quantity *</label>
            <Controller
              name='quantity'
              control={control}
              rules={{ required: 'Quantity is required.' }}
              render={({ field, fieldState }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  useGrouping={false}
                  placeholder='Enter Quantity'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('quantity')}
          </div>
          <div className='field'>
            <label htmlFor='price'>Price per unit (optional)</label>
            <Controller
              name='price'
              control={control}
              render={({ field, fieldState }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  useGrouping={false}
                  mode='currency'
                  currency='INR'
                  currencyDisplay='code'
                  locale='en-IN'
                  placeholder='Enter Price'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('price')}
          </div>
          <div className='field'>
            <label htmlFor='desc'>Description (optional) </label>
            <br />
            <small>* It must have upper and lower case characters</small>
            <Controller
              name='desc'
              control={control}
              rules={{
                required: false,
                // validate:()=>{},
                pattern: {
                  value: /[a-z]/,
                  message:
                    'Description must have upper and lower case characters',
                },
              }}
              render={({ field, fieldState }) => (
                <InputTextarea
                  className='mt-1'
                  id={field.name}
                  rows={3}
                  cols={30}
                  {...field}
                  autoResize
                  placeholder='Product description .....'
                />
              )}
            />
            {getFormErrorMessage('desc')}
          </div>
          <div className='field'>
            <div className='flex justify-content-between  align-items-center'>
              <div className='flex justify-content-between  align-items-center gap-3'>
                {imageBodyTemplate()}
                <div className='flex justify-content-center align-items-center gap-2'>
                  <span>
                    {selectedImage ? (
                      <>
                        {selectedImage.name}
                        <span
                          className='ml-4 cursor-pointer text-3xl'
                          onClick={() => handleImg(null)}
                        >
                          {' '}
                          <Cross />
                        </span>
                      </>
                    ) : (
                      'No File Choosen*'
                    )}
                  </span>
                </div>
              </div>
              <CustomImageInput
                setSelectedImage={handleImg}
                label='Choose File'
              />
            </div>
            {selectedImage && selectedImage.size > 8000000 ? (
              <small className='p-error'>
                Image size is more than 8 MB. Please select below than 8 MB.
              </small>
            ) : (
              <small>* Image size should be less than 8MB. </small>
            )}
          </div>

          <div className='flex gap-2'>
            <CustomButton
              varient='filled'
              type='submit'
              label={mode !== 'Update' ? 'Save' : 'Update'}
            />
          </div>
        </form>
      </div>
    </Dialog>
  )
}
