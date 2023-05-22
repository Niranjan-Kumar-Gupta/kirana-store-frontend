import { useState, useEffect } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { CustomButton } from '../CustomButton'
import { classNames } from 'primereact/utils'
import './formStyle.css'
import { useDispatch, useSelector } from 'react-redux'
import { addCustomer, changeMode, getCustomerById, updateCustomer } from '../../reducers/customerTableSlice'
import * as Messag from '../../config/ToastMessage'
import PhoneInputWithCountry from 'react-phone-number-input/react-hook-form'
import { isValidPhoneNumber } from 'react-phone-number-input'
import 'react-phone-number-input/style.css'
import { Text } from '../Text'
import axiosInstance from '../../api/axios.instance'
import { sortAlphabeticalObjectArr } from '../../utils/tableUtils'
import { Dropdown } from 'primereact/dropdown'
import { useNavigate, useParams } from 'react-router-dom'
import style from './style.module.css'
import CustomBreadcrumb from '../CustomBreadcrumb'
import { DeleteAlert } from '../../components/Alert/DeleteAlert'
import { InputNumber } from 'primereact/inputnumber'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'

export const CustomerForm = ({ onHide, showCustomerForm, toast }) => {
  const { mode, selectedCustomer, loading } = useSelector((state) => state.customerTable)
  const [edit, setEdit] = useState(false)
  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)

  const navigate = useNavigate()
  const { id } = useParams();
  const goBack = () => {
      navigate('/customers')
    }
  const defaultValues = {
    name: '',
    phone: '',
    email: '',
    warehouseId: '',
    gstNumber: '',
    panNumber: '',
    location:'',
    pincode: undefined,
    phoneNumber: '',
  }

  const dispatch = useDispatch()

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

  const deleteModule = () => {
    return (
      <DeleteAlert
        item='customer'
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    )
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  // handle sumbit formdata
  const onSubmit =  (data) => {
    data = { ...data, phone: parseInt(data.phone.substring(1)), pincode: parseInt(data.pincode) }

    if (mode === 'update') {
      const customerId = selectedCustomer.id
       dispatch(updateCustomer({ customerId, data }))
        .unwrap()
        .then((res) => {
          onHide(reset)
          goBack()
          let Message_Success = Messag.Update_Cust_ToastSuccessMessage
          toast.current.show({ severity: 'success', detail: Message_Success })
        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
        
    } else {
       dispatch(addCustomer(data))
        .unwrap()
        .then((res) => {
          onHide(reset)
          goBack()
          //show toast here
          let Message_Success = Messag.Add_Cust_ToastSuccessMessage
          toast.current.show({ severity: 'success', detail: Message_Success })
        })
        .catch((err) => {
          //show toast here
          toast.current.show({ severity: 'error', detail: err.message })
        })
     
    }
  }

  useEffect(() => {
    if (id) {
      dispatch(changeMode('update'));
      dispatch(getCustomerById(id))
        .unwrap()
        .then(() => {

        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
    } else {
      dispatch(changeMode('add'));
    }
  },[id])

  useEffect(() => {
    if (mode === 'update' && selectedCustomer) {
      setValue('name', selectedCustomer.name)
      setValue('phone', '+' + selectedCustomer.phone)
      setValue('email', selectedCustomer.email || '')
      setValue('gstNumber', selectedCustomer.gstNumber || '')
      setValue('panNumber', selectedCustomer.panNumber || '')
      setValue('location', selectedCustomer.location || '')
      setValue('pincode', selectedCustomer.pincode || '')
      setValue('phoneNumber', selectedCustomer.phoneNumber || '')    
    }
  }, [selectedCustomer])

  let templabel = mode === 'update' ? selectedCustomer?.name : 'Add Customer'
  const itemslist=[{ label: 'Customers',url: '/customers' },{ label:  templabel }];
  return (

     <>
     <Toast ref={toast} />
     {loader()}
     {displayAlertDelete && deleteModule()}
     <div className={`md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}>
          <div className='flex flex-column md:flex-row lg:flex-row lg:w-10 md:w-8 md:justify-content-between align-items-center justify-content-center mb-3'>
            <div className='lg:w-7 md:w-6 flex align-items-center'>
              <CustomBreadcrumb className='pl-0' itemslist={itemslist} />
            </div>
            <div className='w-12 sm:w-5 lg:w-4 hidden sm:block'>
              <div className='flex justify-content-end gap-2'>
                <CustomButton
                  varient={'cancel w-6rem'}
                  type='button'
                  label={
                    mode !== 'update' ? 'Cancel' : edit ? 'Cancel' : 'Delete'
                  }
                  onClick={
                    mode !== 'update'
                      ? () => {
                          navigate('/customers')
                        }
                      : edit
                      ? () => {
                          setEdit(false)
                        }
                      : () => {
                          setDisplayAlertDelete(true)
                        }
                  }
                />
                <CustomButton
                  varient='filled w-6rem'
                  type='submit'
                  label={mode === 'add' ? 'Save' : edit ? 'Update' : 'Edit'}
                  onClick={
                    mode === 'add'
                      ? handleSubmit(onSubmit)
                      : edit
                      ? handleSubmit(onSubmit)
                      : () => setEdit(true)
                  }
                />
              </div>
            </div>
          </div>
        </div>
      <div className={`card`}>
        <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
      
        <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-3 md:flex md:flex-column md:align-items-center'>
           <div className='lg:w-7 md:w-8 sm:w-full'>
              <div className='bg-white p-3 border-round border-50 mb-3'>
            
                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <label htmlFor='name'>Customer Name *</label>
                  <Controller
                    name='name'
                    control={control}
                    rules={{ required: 'Customer name is required.' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={!edit && mode === 'update'}
                        maxLength={24}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        placeholder='Enter Customer Name'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('name')}
                </div>
                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <label htmlFor='phone'>Phone </label>
                  <Controller
                    name='phone'
                    control={control}
                    // rules={{
                    //   validate: (value) =>
                    //     isValidPhoneNumber(value.toString()) ||
                    //     'Please enter a valid phone number. ',
                    // }}
                    render={({ field, fieldState }) => (
                      <PhoneInputWithCountry
                        name='phone'
                        control={control}
                        disabled={!edit && mode === 'update'}
                        defaultCountry='IN'
                        id={field.name}
                        placeholder='Enter Phone Number'
                        value={field.value}
                        onChange={(e) => field.onChange(e.value)}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('phone')}
                </div>
                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <label htmlFor='email'>Email</label>
                  <Controller
                    name='email'
                    control={control}
                    rules={{
                      required: false,
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,4}$/i,
                        message: 'Enter a valid e-mail address',
                      },
                    }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        value={field.value}
                        disabled={!edit && mode === 'update'}
                        onChange={(e) => field.onChange(e.value)}
                        placeholder='Enter Email'
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('email')}
                </div>
          
                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <label htmlFor='gstNumber'>GST Number </label>
                  <Controller
                    name='gstNumber'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        maxLength={24}
                        disabled={!edit && mode === 'update'}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        placeholder='Enter GST Number'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('gstNumber')}
                </div>

                <div className='field bg-white p-2 border-round border-50 mb-2'>
                  <label htmlFor='panNumber'>PAN Number </label>
                  <Controller
                    name='panNumber'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        maxLength={24}
                        disabled={!edit && mode === 'update'}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        placeholder='Enter PAN Number'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('panNumber')}
                </div>
                    </div>
           </div>
           <div className='lg:w-3 md:w-8 sm:w-full bg-white p-3 border-round border-50 mb-3'>
              
            <div className='bg-white p-2 border-round border-50 mb-2'>
                   
              <div className='field'>
                <label htmlFor='address'>Address *</label>
                <Controller
                  name='location'
                  control={control}
                  rules={{ required: 'address is required.' }}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.location}
                      disabled={!edit && mode === 'update'}
                      className={classNames({ 'p-invalid': fieldState.invalid })}
                      placeholder='Enter Customer Address'
                      {...field}
                    />
                  )}
                />
                {getFormErrorMessage('location')}
              </div>

                <div className='field'>
                  <label htmlFor='pincode'>Pincode</label>
                  <Controller
                    name='pincode'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputNumber
                        id={field.name}
                        value={field.value}
                        useGrouping={false}
                        onChange={(e) => field.onChange(e.value)}
                        disabled={!edit && mode === 'update'}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        placeholder='Enter Pincode'
                     
                      />
                    )}
                  />
                  {getFormErrorMessage('pincode')}
                </div>

                <div className='field'>
                  <label htmlFor='phoneNumber'>Phone Number</label>
                  <Controller
                    name='phoneNumber'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.phoneNumber}
                        disabled={!edit && mode === 'update'}
                        className={classNames({ 'p-invalid': fieldState.invalid })}
                        placeholder='Enter Phone Number'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('phoneNumber')}
                </div>
            </div>
           </div>
        </div>
        
         
        </form>
      </div>
      <div className='sm:w-12 md:w-5 lg:w-4 sm:hidden'>
          <div className='flex justify-content-end gap-2'>
            <CustomButton
              varient={'cancel w-6rem'}
              type='button'
              label={mode !== 'update' ? 'Cancel' : edit ? 'Cancel' : 'Delete'}
              onClick={
                mode !== 'update'
                  ? () => {
                      navigate('/customers')
                    }
                  : edit
                  ? () => {
                      setEdit(false)
                    }
                  : () => {
                      setDisplayAlertDelete(true)
                    }
              }
            />
            <CustomButton
              varient='filled w-6rem'
              type='submit'
              label={mode === 'add' ? 'Save' : edit ? 'Update' : 'Edit'}
              onClick={
                mode === 'add'
                  ? handleSubmit(onSubmit)
                  : edit
                  ? handleSubmit(onSubmit)
                  : () => setEdit(true)
              }
            />
          </div>
        </div>

      </>
    
  )
}
