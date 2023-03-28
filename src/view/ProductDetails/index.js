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
import './index.css';


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

const ProductDetails = () => {
  const { id } = useParams()
  const toast = useRef(null)
  const [categories, setCategories] = useState(categoryData)
  const [selectedImage, setSeletedImage] = useState(null)


  const { user, userSub } = useSelector((state) => state.authenticate)
  const dispatch = useDispatch()

  const { company } = useSelector((state) => state.company)

  const handleImg = (img) => {
    setSeletedImage(img)
  }
  const [varient,setVarient]=useState([
    {
      id:'1',
      option:'color',
      value:['black','white'],
    },
    {
      id:'2',
      option:'Dimenstion',
      value:['5x10','2x10'],
    },
  ])

  const defaultValues = {
    name: '',
    description: '',
    status: '',
    categories: '',
    varient,
  }
  const statusOption = [
    { key: 'Available', value: 'Available' },
    { key: 'Unavailable', value: 'Unavailable' },
  ]
  const [mode, setmode] = useState(false)
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })
 
  const handelmode = () => {
    setmode(!mode)
  }
  //function form get error message
  const getFormErrorMessage = (name) => {
    if (mode)
      return (
        errors[name] && (
          <small className='p-error'>{errors[name].message}</small>
        )
      )
    return <></>
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


  const onSubmit = async (data) => {
    
  }


  return (
    <div className='w-11 pt-3 m-auto '>
      <div>
        <Toast ref={toast} />
        <div className={`w-11 m-auto py-3  `}>
          <Text type={'heading'}>ProductDetails for id: {id}</Text>
          <div className='flex align-content-center panel-border py-2'>
            <div className='flex flex-column align-items-start justify-content-between ml-3 sm:flex-column md:flex-column xl:flex-row lg:flex-row  lg:flex-wrap xl:flex-wrap w-12 xl:py-2 lg:py-2 px-2'>
              <Text type={'heading'}>{company?.companyName}</Text>           
            </div>
          </div>
        </div>
        <form
              onSubmit={handleSubmit(onSubmit)}
              className='p-fluid w-12 '
            >
        <div className={`xl:flex lg:flex w-11 m-auto mb-4`}>
          
          <div className={`w-12 xl:w-8 lg:w-8`}>
            <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='Name'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Product Name*
                </label>
                <Controller
                  name='Name'
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
                  htmlFor='Description'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Description*
                </label>
                <Controller
                  name='Description'
                  control={control}
                  rules={{ required: 'Description' }}
                  render={({ field, fieldState }) => (
                    <InputTextarea
                      id={field.name}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Product Description ...'
                      {...field}
                      rows={5}
                      autoResize
                    />
                  )}
                />
                {getFormErrorMessage('Product Description')}
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
                  htmlFor='Varients'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Variants
                </label>
                <Controller
                  name='varients'
                  control={control}
                  rules={{ required: 'Product Name' }}
                  render={({ field, fieldState }) => (
                    <VariantField
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Product Name'
                      field={field}
                      varient={varient}
                      setVarient={setVarient}
                    />
                    )}
                />
                {getFormErrorMessage('Product Name')}
              </div> 
            </div>
          
          </div>
          
          

          
          <div className='xl:ml-4 lg:ml-4 xl:w-4 lg:w-4'>
             <div className='bg-white p-4 border-round border-50 mb-4'>
             <div className='field  '>
                <label
                  htmlFor='Status'
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
                  htmlFor='category'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Category
                </label>
                <Controller
                  name='category'
                  control={control}
                  rules={{ required: 'Product Category Name' }}
                  render={({ field, fieldState }) => (
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
                  )}
                />
                {getFormErrorMessage('Product Category Name')}
              </div> 
            </div>

            <div className='bg-white p-4 border-round border-50 mb-4'>
              <div className='field'>
                <label
                  htmlFor='quantity'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Quantity
                </label>
                <Controller
                  name='Quantity'
                  control={control}
                  rules={{ required: 'Product Quantity' }}
                  render={({ field, fieldState }) => (
                    <InputText
                    id={field.name}
                    className={classNames({
                      'p-invalid': fieldState.invalid,
                    })}
                    placeholder='Enter Product Quantity'
                    {...field}
                  />
                  )}
                />
                {getFormErrorMessage('Product Quantity')}
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
                  varient='filled xl:w-2  lg:w-2 m-2'
                  type={'Cancel'}
                  label={'Cancel' }
                />
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