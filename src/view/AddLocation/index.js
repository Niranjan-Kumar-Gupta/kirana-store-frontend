
import { useState, useEffect, useRef } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { InputNumber } from 'primereact/inputnumber'
import { useDispatch, useSelector } from 'react-redux'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import { Toast } from 'primereact/toast'
import style from './style.module.css'
import Loader from '../../components/Loader'
import { ReactComponent as Delete } from '../../svg/delete.svg'
import CustomBreadcrumb from '../../components/CustomBreadcrumb'
import { useNavigate, useParams } from 'react-router-dom'
import { DeleteAlert } from '../../components/Alert/DeleteAlert'
import { InputText } from 'primereact/inputtext'
import { addOutlet, getOutletbyid, updateOutlet } from '../../reducers/outletSlice';

const AddLocation = () => {

  const { id } = useParams()
  const toast = useRef(null)
  const {
   mode,
   selectedLocation
  } = useSelector((state) => state.outletTable);

  const navigate = useNavigate()
  const dispatch = useDispatch()

  const [displayAlertDelete, setDisplayAlertDelete] = useState(false)
  const [edit, setEdit] = useState(false)

  const deleteModule = () => {
    return (
      <DeleteAlert
        item='location'
        displayAlertDelete={displayAlertDelete}
        setDisplayAlertDelete={setDisplayAlertDelete}
        toast={toast}
      />
    )
  }


  const defaultValues = {
    locationName: '',
    pincode: undefined,
  }

  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
    watch,
  } = useForm({ defaultValues })


  useEffect(()=>{
    if (id) {
      dispatch(getOutletbyid({ id })).unwrap().then().catch()
    }
  },[])

  useEffect(() => {
    //console.log(mode,selectedLocation)
    if (mode === 'update' && selectedLocation) {
      setValue('locationName', selectedLocation.name)
      setValue('pincode', selectedLocation.pincode)    
    }
  }, [selectedLocation])

  const onSubmit = (data) => {
    const __data = {}
    __data['name'] = data.locationName
    __data['location'] = data.locationName
    __data['pincode'] = data.pincode
    console.log(data)
    if (mode=='update') {
      dispatch(updateOutlet({id:id,data:__data}))
      .unwrap()
      .then((res) => {
        navigate('/location')
      })
      .catch((err) => {
        toast.current.show({ severity: 'error', detail: err.message })
      })
    }else{
    dispatch(addOutlet(__data))
    .unwrap()
    .then((res) => {
      navigate('/location')
    })
    .catch((err) => {
      toast.current.show({ severity: 'error', detail: err.message })
    })
   }
  }

  
  const getFormErrorMessage = (name) => {
    return (
      errors[name] && <small className='p-error'>{errors[name].message}</small>
    )
  }

   let templabel = mode !== 'update' ? 'Create Location' : ``
   const itemslist = [{ label: 'Location', url: '/location' }, { label: templabel }]

  return (
    <>
    <div className='w-11 m-auto mb-6'>
      <Toast ref={toast} />
      {displayAlertDelete && deleteModule()}
      <div
        className={`block md:flex md:justify-content-center pt-3 ${style.stickySubNav}`}
      >
        <div className='flex lg:w-10 md:w-8 sm:justify-content-between align-items-center pb-3'>
          <div className='flex align-items-center'>
            <CustomBreadcrumb itemslist={itemslist} />
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
                          navigate('/location')
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
        <form
          onSubmit={handleSubmit(onSubmit)}
          className='p-fluid'
          encType='multipart/form-data'
        >
          <div className='lg:flex lg:flex-row lg:align-items-start lg:justify-content-center lg:gap-3 md:flex md:flex-column md:align-items-center'>
            <div className='lg:w-10 md:w-8 sm:w-full'>
              <div className='bg-white p-3 border-round border-50 mb-3 flex flex-wrap align-items-center'>
                <div className='field w-12 lg:w-5'>
                  <label htmlFor='locationName'>Location Name *</label>
                  <Controller
                    name='locationName'
                    control={control}
                    rules={{ required: 'Location is required.' }}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        disabled={!edit && mode === 'update'}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder='Enter Location Name'
                        {...field}
                      />
                    )}
                  />
                  {getFormErrorMessage('locationName')}
                </div>
                           
              </div> 
              <div className='bg-white p-3 border-round border-50 mb-3 flex flex-wrap align-items-center'>
               <div className='field w-12 lg:w-5'>
                  <label htmlFor='pincode'>Pincode *</label>
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
                      navigate('/location')
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
    </>
  )
}

export default AddLocation