'use Strict'
import React from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { Text } from '../../components/Text'
import { ReactComponent as Cross } from '../../svg/cross.svg'
import { useForm, Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { CustomButton } from '../../components/CustomButton'
import { classNames } from 'primereact/utils'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast'
import { TreeSelect } from 'primereact/treeselect'
import { Dropdown } from 'primereact/dropdown'
import { CustomImageInput } from '../../components/CustomImageInput'
import VariantField from '../../components/VarientField'
import {
  getProductbyid,
  getCategory,
  addProduct,
  updateProduct,
  resetSelectedProduct,
  changeMode,
} from '../../reducers/productTableSlice'
import './index.css'
import './../../index.css'
import { InputNumber } from 'primereact/inputnumber'
import Loader from '../../components/Loader'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { Button } from 'primereact/button'
import { DeleteAlert } from '../../components/Alert/DeleteAlert'

const ProductDetails = () => {
  const { id } = useParams()
  const toast = useRef(null)
  // const [categories, setCategories] = useState(categoryData)
  const [selectedImage, setSeletedImage] = useState(null)

  const navigate = useNavigate()
  const { user, userSub } = useSelector((state) => state.authenticate)
  const dispatch = useDispatch()

  const { company } = useSelector((state) => state.company)
  const {
    selectedProduct,
    loading,
    mode,
    varient: varients,
    catagories,
    vartable,
  } = useSelector((state) => state.productTable)

  // const [mode, setmode] = useState('add')
  const [edit, setEdit] = useState(false)
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)

  useEffect(() => {
    if (id) {
      dispatch(getProductbyid({ id })).unwrap().then().catch()
    }
    dispatch(getCategory()).unwrap().then().catch()
    if (id) {
      dispatch(changeMode('update'))
    } else {
      dispatch(changeMode('add'))
    }
  }, [])
  const handleImg = (img) => {
    setSeletedImage(img)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }
  const [varient, setVarient] = useState([])
  const [varienttable, setVarienttable] = useState([])
  useEffect(() => {
    if (varients && varients.length > 0) {
      let x = varients.map((x, y) => {
        return {
          id: x.id,
          name: x.name,
          optionPosition: y,
          values: [...x.values],
        }
      })
      setVarient([...x])
    }
    if (vartable && vartable.length > 0) {
      const result = vartable.filter(check)

      function check(x) {
        return !(x.label === ' ' || x.label === '')
      }
      setVarienttable([...result])
    }
  }, [varients])
  const [varientErr, setvarientErr] = useState(false)

  // console.log(mode,selectedProduct)
  const defaultValues = {
    productName: '',
    categoryId: undefined,
    quantity: undefined,
    price: undefined,
    status: '',
    SKUCode: '',
    desc: '',
    brandName: ''
  }

  const statusOption = [
    { key: 'Available', value: 'Available' },
    { key: 'Unavailable', value: 'Unavailable' },
  ]

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

  useEffect(() => {
    if (mode === 'update' && selectedProduct) {
      setValue('productName', selectedProduct.productName)
      setValue('categoryId', selectedProduct.categoryId)
      setValue('quantity', selectedProduct.quantity)
      setValue('price', selectedProduct.price)
      setValue('status', selectedProduct.status)
      setValue('SKUCode', selectedProduct.SKUCode)
      setValue('desc', selectedProduct.desc)
      setValue('brandName', selectedProduct.brandName)
      handleImg(selectedProduct.url)
    }
  }, [selectedProduct])

  const imageBodyTemplate = () => {
    if (mode === 'update' && selectedImage && selectedImage.length > 2) {
      return (
        <img
          src={`${selectedImage}?v=${selectedImage.updatedAt}`}
          onError={(e) => (e.target.src = './../../images/ImgPlaceholder.svg')}
          style={{ width: '100px' }}
        />
      )
    } else
      return selectedImage ? (
        <img
          src={`${selectedImage.objectURL}`}
          onError={(e) => (e.target.src = './../../images/ImgPlaceholder.svg')}
          style={{ width: '100px' }}
        />
      ) : (
        // <ImagePlaceholder />
        ''
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
  useEffect(() => {
    return () => {
      dispatch(resetSelectedProduct())
    }
  }, [])
  const verifyVar = () => {
    let ck = false
    varient.forEach((x) => {
      if (x.name === '' || x.name == '') {
        toast.current.show({
          severity: 'error',
          detail: 'option value is empty',
        })
        ck = true
      }
      x.values &&
        x.values.forEach((item) => {
          if (item === '' || item == '') {
            toast.current.show({
              severity: 'error',
              detail: 'option value is empty',
            })
            ck = true
          }
        })
    })

    return ck
  }

  const deleteModule = () => {
    return (
      <DeleteAlert
        item='product'
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    )
  }

  const onSubmit = async (data) => {
    // console.log("sss",data,varient)
    // console.log(data,varient)
    if (verifyVar()) {
      return
    }
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

    if (mode === 'update' && id !== 'add') {
      const productId = selectedProduct.id
      data = {
        product: { ...data, src: selectedProduct.src },
        options: [...varient],
        productvariants: [...varienttable],
      }
      // console.log('sss', data)
      dispatch(updateProduct({ productId, data, selectedImage }))
        .unwrap()
        .then((res) => {
          navigate('/products')
        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
    } else {
      data = {
        product: { ...data },
        options: [...varient],
        productvariants: [...varienttable],
      }
      dispatch(addProduct({ data, selectedImage }))
        .unwrap()
        .then(() => {
          navigate('/products')
        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
    }
  }

  let templabel =
    mode !== 'update' || id === 'add' ? 'Add Product' : `${selectedProduct?.productName}`
  const itemslist = [
    { label: 'Products', url: '/products' },
    { label: templabel },
  ]

  return (
    <div className='w-11 m-auto mb-6'>
      <Toast ref={toast} />
      {loader()}
      {displayAlertDelete && deleteModule()}
      <div className='block md:flex md:justify-content-center pt-3 stickySubNav'>
        <div className='flex lg:w-10 md:w-8 sm:justify-content-between align-items-center pb-3'>
          <CustomBreadcrumb itemslist={itemslist} />
          <div className='w-12 sm:w-5 lg:w-4 hidden sm:block'>
            <div className='flex justify-content-end gap-2'>
              <Button
                className={`skalebot-button colored w-6rem`}
                onClick={
                  mode !== 'update'
                    ? () => {
                        navigate('/products')
                      }
                    : edit
                    ? () => {
                        setEdit(false)
                      }
                    : () => {
                        setDisplayAlertDelete(true)
                      }
                }
              >
                {mode !== 'update' ? 'Cancel' : edit ? 'Cancel' : 'Delete'}
              </Button>
              <CustomButton
                varient='filled w-6rem pl-3'
                type='submit'
                onClick={
                  mode !== 'update'
                    ? handleSubmit(onSubmit)
                    : edit
                    ? handleSubmit(onSubmit)
                    : () => setEdit(true)
                }
                label={mode !== 'update' ? 'Save' : edit ? 'Update' : 'Edit'}
              />
            </div>
          </div>
        </div>
      </div>
      <div className='card'>
        <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
          <div
            className={`lg:flex lg:flex-row lg:align-items-start lg:justify-content-center md:flex md:flex-column md:align-items-center gap-3`}
          >
            <div className={`lg:w-7 md:w-8 sm:w-full`}>
              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field w-12 lg:w-5'>
                  <label
                    htmlFor='productName'
                    className={classNames({ 'p-error': errors.name })}
                  >
                    Product Name *
                  </label>
                  <Controller
                    name='productName'
                    control={control}
                    rules={{ required: 'Product Name is required' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={!edit && mode === 'update'}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder='Enter Product Name'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('productName')}
                </div>
                <div className='field'>
                  <label
                    htmlFor='desc'
                    className={classNames({ 'p-error': errors.name })}
                  >
                    Description
                  </label>
                  <Controller
                    name='desc'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputTextarea
                        id={field.name}
                        disabled={!edit && mode === 'update'}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder='Enter Product Description ...'
                        {...field}
                        rows={3}
                        autoResize
                      />
                    )}
                  />
                  {getFormErrorMessage('desc')}
                </div>
              </div>

              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <label
                    htmlFor='SKUCode'
                    className={classNames({ 'p-error': errors.name })}
                  >
                    SKUCode *
                  </label>
                  <Controller
                    name='SKUCode'
                    control={control}
                    rules={{
                      required: 'Product SKUCode is required',
                      pattern: {
                        value: /^[a-zA-Z0-9]*$/,
                        message:
                          'Only alphanumeric characters without white spaces are allowed.',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={mode === 'update'}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder='Enter Product SKUCode'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('SKUCode')}
                </div>
              </div>

              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <div className='flex justify-content-between  align-items-center'>
                    <div className='flex justify-content-between  align-items-center gap-3'>
                      {imageBodyTemplate()}
                      <div className='flex justify-content-center align-items-center gap-2'>
                        <span>
                          {selectedImage ? (
                            <>
                              {selectedImage.name}
                              <Button
                                className='noBgButton'
                                onClick={() => handleImg(null)}
                                disabled={!edit && mode === 'update'}
                              >
                                {' '}
                                <Cross />
                              </Button>
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
                      disabled={!edit && mode === 'update'}
                    />
                  </div>
                  {selectedImage && selectedImage.size > 8000000 ? (
                    <small className='p-error'>
                      Image size is more than 8 MB. Please select below than 8
                      MB.
                    </small>
                  ) : (
                    <small>* Image size should be less than 8MB. </small>
                  )}
                </div>
              </div>
            </div>
            <div className='lg:w-3 md:w-8'>
              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <label
                    htmlFor='status'
                    className={classNames({ 'p-error': errors.name })}
                  >
                    Product Status *
                  </label>
                  <Controller
                    name='status'
                    control={control}
                    rules={{ required: 'Product Status is required.' }}
                    render={({ field, fieldState }) => (
                      <Dropdown
                        id={field.name}
                        options={statusOption}
                        disabled={!edit && mode === 'update'}
                        optionLabel='key'
                        optionValue='value'
                        placeholder='Choose'
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('status')}
                </div>
              </div>

              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <label htmlFor='categoryid'>Category *</label>
                  <Controller
                    name='categoryId'
                    control={control}
                    rules={{ required: 'Category is required' }}
                    render={({ field, fieldState }) => (
                      <TreeSelect
                        id={field.name}
                        value={field.value}
                        disabled={!edit && mode === 'update'}
                        onChange={(e) => field.onChange(e.value)}
                        filter
                        inputRef={field.ref}
                        options={catagories}
                        placeholder='Select category'
                        className={classNames('w-full', {
                          'p-invalid': fieldState.error,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('categoryId')}
                </div>
              </div>

              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <label htmlFor='price'>Price *</label>
                  <Controller
                    name='price'
                    control={control}
                    rules={{ required: 'Price is required' }}
                    render={({ field, fieldState }) => (
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        useGrouping={false}
                        disabled={!edit && mode === 'update'}
                        mode='currency'
                        currency='INR'
                        currencyDisplay='code'
                        locale='en-IN'
                        placeholder='Enter Price'
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                      />
                    )}
                  />
                  {getFormErrorMessage('price')}
                </div>
              </div>

              <div className='bg-white p-3 border-round border-50 mb-3'>
                <div className='field'>
                  <label
                    htmlFor='brandName'
                    className={classNames({ 'p-error': errors.name })}
                  >
                    Brand Name *
                  </label>
                  <Controller
                    name='brandName'
                    control={control}
                    rules={{ required: 'Brand Name is required' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={!edit && mode === 'update'}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder='Enter Brand Name'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('brandName')}
                </div>
              </div>
            </div>
          </div>

          <div className='flex justify-content-center'>
            <div className='w-12 md:w-8 lg:w-11'>
              <div className='field'>
                <label
                  htmlFor='varient'
                  className={classNames({ 'p-error': errors.name })}
                >
                  {/* Variants */}
                </label>
                <Controller
                  name='varient'
                  control={control}
                  render={({ field, fieldState }) => (
                    <VariantField
                      placeholder='Enter Product Name'
                      field={field}
                      fieldState={fieldState}
                      pid={id}
                      varient={varient}
                      setVarient={setVarient}
                      varientErr={varientErr}
                      setvarientErr={setvarientErr}
                      varienttable={varienttable}
                      setVarienttable={setVarienttable}
                      edit={edit}
                      mode={mode}
                    />
                  )}
                />
              </div>
            </div>
          </div>

          <div className='sm:w-12 md:w-5 lg:w-4 sm:hidden'>
            <div className='flex justify-content-end gap-3'>
              <Button
                className={`skalebot-button colored w-6rem`}
                onClick={
                  mode !== 'update'
                    ? () => {
                        navigate('/products')
                      }
                    : edit
                    ? () => {
                        setEdit(false)
                      }
                    : () => {
                        setDisplayAlertDelete(true)
                      }
                }
              >
                {mode !== 'update' ? 'Cancel' : edit ? 'Cancel' : 'Delete'}
              </Button>
              <CustomButton
                varient='filled w-6rem pl-3'
                type='button'
                onClick={
                  mode !== 'update'
                    ? handleSubmit(onSubmit)
                    : edit
                    ? handleSubmit(onSubmit)
                    : () => setEdit(true)
                }
                label={mode !== 'update' ? 'Save' : edit ? 'Update' : 'Edit'}
              />
            </div>
          </div>
        </form>
      </div>
    </div>
  )
}

export default ProductDetails
