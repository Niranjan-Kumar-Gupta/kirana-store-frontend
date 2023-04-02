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
import axiosInstance from "../../api/axios.instance";
import { formatText, sortAlphabeticalObjectArr } from "../../utils/tableUtils";

import {
  addProduct,
  // resetMode,
  // resetSelectedProduct,
  // updateProduct,
  getCategory
} from "../../reducers/productTableSlice";

const statusOption = [
  { key: 'Available', value: 'Available' },
  { key: 'Unavailable', value: 'Unavailable' },
]

export const ProductForm = ({ showProductForm, setShowProductForm, toast }) => {
  const { catagories} = useSelector((state) => state.productTable);
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
    categoryId:[],
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
  useEffect(()=>{
    dispatch(getCategory()).unwrap().then().catch()
  },[]);

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
    console.log(data)

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
      dispatch(addProduct({data,selectedImage}))
        .unwrap()
        .then(() => {
          // setDisplayAddProductModule(false);
          setShowProductForm(false)

          // dispatch(changeShowNotice(true));
          toast.current.show({ severity: 'success', detail: "Successfully Added Product" });
        })
        .catch(err => {
          toast.current.show({ severity: 'error', detail: err.message});
        })
    }
    // console.log(data)
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
            <label htmlFor='categoryId'>Category *</label>
            <Controller
              name='categoryId'
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
                    options={catagories}
                    placeholder='Select Category'
                    className={classNames('w-full', {
                      'p-invalid': fieldState.error,
                    })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
            {getFormErrorMessage('categoryId')}
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
