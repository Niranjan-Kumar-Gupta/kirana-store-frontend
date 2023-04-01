"use Strict"
import React from 'react'
import { useNavigate, useParams } from "react-router-dom";
import { Text } from '../../components/Text'
import { ReactComponent as Cross } from '../../svg/cross.svg'
import { useForm, Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { CustomButton } from '../../components/CustomButton'
import { classNames } from 'primereact/utils'
import { useDispatch, useSelector } from 'react-redux'
import { useEffect, useState, useRef } from 'react'
import { Toast } from 'primereact/toast';
import {TreeSelect} from 'primereact/treeselect'
import { Dropdown } from 'primereact/dropdown';
import { CustomImageInput } from '../../components/CustomImageInput';
import VariantField from '../../components/VarientField' 
import { getProductbyid,getCategory,addProduct,updateProduct } from '../../reducers/productTableSlice';
import './index.css';



const ProductDetails = () => {
  const { id } = useParams()
  const toast = useRef(null)
  // const [categories, setCategories] = useState(categoryData)
  const [selectedImage, setSeletedImage] = useState(null)

 const navigate = useNavigate()
  const { user, userSub } = useSelector((state) => state.authenticate)
  const dispatch = useDispatch()

  const { company } = useSelector((state) => state.company)
  const { selectedProduct,varient:varients,catagories,vartable} = useSelector((state) => state.productTable)
 
  const [mode,setmode]=useState('add')
  useEffect(()=>{
     dispatch(getProductbyid({id})).unwrap()
    .then().catch()
    dispatch(getCategory()).unwrap().then().catch()
  },[])
  const handleImg = (img) => {
    setSeletedImage(img)
  }

  
  const [varient,setVarient]=useState([])
  const [varienttable,setVarienttable]=useState([
    {
      "key":"0-1/1-1",
      "id": 146,"productId": 38,"categoryId": 8,"price": 100,
      "option1": "S",
      "option2": "RED","option3": "","isActive": true,
      "SKUCode": "SILVERNECK2DEFAULT","companyId": 6,"status": "Available","createdAt": "2023-03-30T12:42:46.000Z","updatedAt": "2023-03-30T12:42:46.000Z",
      "outletId": null,"productVariantId": null
  },
  {
      "key":"0-1/1-2","id": 147,"productId": 38,
      "categoryId": 8,"price": 100,
      "option1": "M","option2": "RED",
      "option3": "","isActive": false,
      "SKUCode": "SILVERNECK2DEFAULT2",
      "companyId": 6,"status": "Available",
      "createdAt": "2023-03-30T12:42:46.000Z",
      "updatedAt": "2023-03-30T12:42:46.000Z",
      "outletId": null,"productVariantId": null
  }
])

    useEffect(()=>{
      let x=varients.map(x=>{
        return {
          id:x.id,
          name:x.name,
          values:[...x.values],
        }
      })
      setVarient([...x])
      setVarienttable([...vartable])

    },[varients])


  // console.log(mode,selectedProduct)
  const defaultValues = {
    productName: '',
    categoryId:undefined,
    quantity: undefined,
    price: undefined,
    status: '',
    SKUCode: '',
    desc: '',
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
        errors[name] && (
          <small className='p-error'>{errors[name].message}</small>
        )
      )
  }

  useEffect(() => {
    if (mode == 'update'&& selectedProduct) {
      setValue('productName', selectedProduct.productName)
      setValue('categoryId', selectedProduct.categoryId)
      setValue('quantity', selectedProduct.quantity)
      setValue('price', selectedProduct.price)
      setValue('status', selectedProduct.status)
      setValue('SKUCode', selectedProduct.SKUCode)
      setValue('desc', selectedProduct.desc)
      handleImg(selectedProduct.url)
    }
    if(selectedProduct===[]){
      setmode("add");
    }else{
      setmode("update");
    }
  }, [selectedProduct])


  const imageBodyTemplate = () => {
    if (mode == 'update'  && selectedImage && selectedImage.length > 2) {
      return (
        <img
          src={`${selectedImage}?v=${selectedImage.updatedAt}`}
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

  const typechecker = (selectedImage) => {
    if (
      selectedImage.type === 'image/png' ||
      selectedImage.type === 'image/jpeg'
    ) {
      return true
    }
    return false
  }


  const onSubmit = async (data) => {
    console.log("sss",data,varient)
    console.log(data,varient)

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

    if (mode === 'update'&&id!=='add') {
      const productId = selectedProduct.id;
      data={...data,src:selectedProduct.src,options:[...varient],
        productvariants:[...varienttable]
      }
      dispatch(updateProduct({ productId, data ,selectedImage}))
        .unwrap()
        .then(res => {
          //show toast here
          
          toast.current.show({ severity: 'success', detail: 'Succesfully Product is updated' })

        })
        .catch(err => {
          //show toast here
         // console.log(err.response);
          toast.current.show({ severity: 'error', detail: err.response.data });
        })
    } else {
      data = { product:{...data},options:[...varient],
        productvariants:[...varienttable]
      }
      dispatch(addProduct({data,selectedImage}))
        .unwrap()
        .then(() => {
          // setDisplayAddProductModule(false);
          // setShowProductForm(false)

          // dispatch(changeShowNotice(true));
          toast.current.show({ severity: 'success', detail: "Successfully Added Product" });
        })
        .catch(err => {
          toast.current.show({ severity: 'error', detail: err.message});
        })
    }
    console.log(data)
  }

  const goBack = () => {
    // dispatch(resetMode())
    navigate('/products')
  }


  return (
    <div className='w-11 pt-3 m-auto '>
      <div>
        <Toast ref={toast} />
        <div className={`w-12 xl:w-8 lg:w-10 m-auto py-3 align-items-center `}>
          <div className='flex'> 
          <button className={`customButton-pd`} onClick={goBack}>
                <span
                  className={`pi pi-arrow-circle-left mr-3 font-pd`}
                ></span>
              </button>
              <div className='mr-3 mt-1 align-items-center'>
                <Text type={'heading'}>
                  {mode === 'add'||id==='add'
                    ? 'Add Product'
                    : `ProductDetails for id: #${id}`}
                </Text>
              </div>
          </div>
          <Text type={'heading'}></Text>
          <div className='flex align-content-center panel-border py-2'>
          </div>
        </div>
        <form
              onSubmit={handleSubmit(onSubmit)}
              className='p-fluid w-12 '
            >
        <div className={`xl:flex lg:flex w-11 m-auto mb-4 justify-content-center`}>
          <div className={`w-12 xl:w-5 lg:w-6`}>
          
            <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='productName'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Product Name*
                </label>
                <Controller
                  name='productName'
                  control={control}
                  rules={{ required: 'Product Name' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Product Name'
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('Product Name')}
              </div> 
              <div className='field'>
                <label
                  htmlFor='desc'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Description*
                </label>
                <Controller
                  name='desc'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputTextarea
                      id={field.name}
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
                {getFormErrorMessage('Product Description')}
              </div> 
            </div>
            
            <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='SKUCode'
                  className={classNames({ 'p-error': errors.name })}
                >
                  SKUCode*
                </label>
                <Controller
                  name='SKUCode'
                  control={control}
                  rules={{ required: 'Product SKUCode' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Product SKUCode'
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('Product SKUCode')}
              </div> 
            </div>

            <div className='bg-white p-4 border-round border-50 mb-4'>
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
            </div>


            <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='varient'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Variants
                </label>
                <Controller
                  name='varient'
                  control={control}
                  render={({ field, fieldState }) => (
                    <VariantField
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Product Name'
                      field={field}
                      pid={id}
                      varient={varient}
                      setVarient={setVarient}
                      varienttable={varienttable}
                      setVarienttable={setVarienttable}
                    />
                    )}
                />
                {getFormErrorMessage('Product Name')}
              </div> 
            </div>
          
          </div>
 
          <div className='xl:ml-4 lg:ml-4 xl:w-3 lg:w-4'>
             <div className='bg-white p-4 border-round border-50 mb-4'>
             <div className='field'>
                <label
                  htmlFor='status'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Product Status*
                </label>
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
                {getFormErrorMessage('Product Name')}
              </div>
              </div>

              <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='categoryid'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Category
                </label>
                <Controller
                  name='categoryId'
                  control={control}
                  rules={{ required: 'Product Category Name' }}
                  render={({ field, fieldState }) => (
                      <TreeSelect
                      id={field.name}
                      value={field.value}
                      onChange={(e) => field.onChange(e.value)}
                      filter
                      inputRef={field.ref}
                      options={catagories}
                      placeholder='Select Item'
                      className={classNames('w-full', {
                        'p-invalid': fieldState.error,
                      })}
                    />
                  )}
                />
                {getFormErrorMessage('Product Category Name')}
              </div> 
            </div>

           

            <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='price'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Price*
                </label>
                <Controller
                  name='price'
                  control={control}
                  rules={{ required: 'Product Price' }}
                  render={({ field, fieldState }) => (
                    <InputText
                    id={field.name}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                    placeholder='Enter Product Price'
                    {...field}
                  />
                  )}
                />
                {getFormErrorMessage('Product Price')}
              </div> 
            </div>
          </div>
          
        </div>

        <div className='xl:flex lg:flex w-11 m-auto justify-content-end'>
        <CustomButton
                  varient='filled xl:w-2 lg:w-2  m-2'
                  type={'submit'}
                  label={'Save' }
                />

        </div>
        </form>
      </div>
   
    
    </div>
  )
}

export default ProductDetails