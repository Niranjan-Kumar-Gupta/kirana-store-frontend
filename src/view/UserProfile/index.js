import CustomBreadcrumb from "../../components/CustomBreadcrumb";
import { useDispatch, useSelector } from "react-redux";
import { Text } from '../../components/Text'
import { useEffect, useState, useRef } from 'react'
import { API_GET_USER_PROFILE } from "../../api/user.service";

import { ReactComponent as UserIcon } from '../../svg/Usericon.svg'
import { useForm, Controller } from 'react-hook-form'
import { InputText } from 'primereact/inputtext'
import { InputTextarea } from 'primereact/inputtextarea'
import { CustomButton } from '../../components/CustomButton'
import { classNames } from 'primereact/utils'
import * as Messag from '../../config/ToastMessage'
import { Toast } from 'primereact/toast'
import { ReactComponent as Delete } from '../../svg/delete.svg'
import './style.css'
import { getUserProfile } from "../../reducers/userSlice";
import ChangePassword from "../../components/ChangePassword";

const itemslist=[{ label: 'User Profile', url: '/userprofile'  }, ];
const UserProfile = () => {

  const toast = useRef(null)
  const {user} = useSelector(state => state.authenticate);
  const {
    selectedUserLocation,
    userProfile
  } = useSelector((state) => state.user);
  const [showChangePassword, setChangeShowPassword] = useState(false);

  
  const dispatch = useDispatch();
  

  useEffect(()=>{ 
    dispatch(getUserProfile(user.id))
    .unwrap()
      .then((res) => {
       
      })
      .catch((err) => {
        
      });
  },[])

  const defaultValues = {
    userName: '',
    email: '',
    phone: '',
    companyId: '',
  }

  const [mode, setmode] = useState(false)
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
    setValue,
  } = useForm({ defaultValues })

  useEffect(() => {
    console.log(userProfile)
    if (userProfile) {
      setValue('userName', userProfile.userName || '')
      setValue('email', userProfile.email || '')
      setValue('phone', userProfile.phone || '')
      setValue('companyId', userProfile.companyId || '')
    }
  }, [userProfile])

  const getFormErrorMessage = (name) => {
    if (mode)
      return (
        errors[name] && (
          <small className='p-error'>{errors[name].message}</small>
        )
      )
    return <></>
  }

  const handelmode = () => {
    setmode(!mode)
  }
  const onSubmit = async (data) => {
   
  }
  const handelChangePassword = ()=>{
    setChangeShowPassword(true)
  }

  console.log(user)
  return (
     
      <div className="w-11 pt-3 m-auto">
        <Toast ref={toast} />
        {showChangePassword && (
          <ChangePassword
            showChangePassword={showChangePassword}
            hideChangePassword={() => setChangeShowPassword(false)}
            toast={toast}
          />
        )}
        <div
        className={`block md:flex md:justify-content-center pt-3`}
        >
        <div className='flex lg:w-10 md:w-8 sm:justify-content-between align-items-center pb-3'>
          <div className='flex align-items-center'>
            <CustomBreadcrumb itemslist={itemslist} />
          </div>
          <div className='w-12 sm:w-5 lg:w-4 hidden sm:block'>
            <div className='flex justify-content-end gap-2'>
              {
                userProfile?.role == 'admin'
                ?
                <CustomButton
                varient='filled w-4'
                type={mode ? 'submit' : ''}
                onClick={handelmode}
                label={mode ? 'Save' : 'Edit'}
                />
                :
                <></>
              }
              <CustomButton
                varient='filled'
                type={mode ? 'submit' : ''}
                onClick={handelChangePassword}
                label={'Change Password'}
              />
            </div>
          </div>
        </div>
      </div>
  
        <div className={`xl:flex lg:flex lg:w-10 md:w-8 sm:justify-content-between align-items-center pb-3 m-auto pb-8`}>
          <div className={`w-12 xl:w-6 lg:w-6 `}>
            <form
              onSubmit={handleSubmit(onSubmit)}
              className='p-fluid w-12 xl:w-8 lg:w-8 xl:w-10 lg:w-10'
            >
              <div className='field '>
                  <label
                    htmlFor='userName'
                    className={classNames({ 'p-error': errors.name })}
                  >
                    User Name
                  </label>
                  <Controller
                    name='userName'
                    control={control}
                    render={({ field, fieldState }) => (
                      <InputText
                        id={field.name}
                        className={classNames({
                          'p-invalid': fieldState.invalid,
                        })}
                        placeholder='Enter User Name'
                        {...field}
                        disabled={!mode}
                      />
                    )}
                  />
                  {getFormErrorMessage('Enter User Name')}
              </div>
                        
              <div className='field'>
                <label
                  htmlFor='phone'
                  className={classNames({ 'p-error': errors.name })}
                >
                  Phone
                </label>
                <Controller
                  name='phone'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Phone Number'
                      {...field}
                      disabled={!mode}
                    />
                  )}
                />
                {getFormErrorMessage('Personal Mobile Number')}
              </div>
              <div className='field'>
                <label
                  htmlFor='email'
                  className={classNames({ 'p-error': errors.name })}
                >
                 Email
                </label>
                <Controller
                  name='email'
                  control={control}
                  render={({ field, fieldState }) => (
                    <InputText
                      id={field.name}
                      className={classNames({
                        'p-invalid': fieldState.invalid,
                      })}
                      placeholder='Enter Email'
                      {...field}
                      disabled={!mode}
                    />
                  )}
                />
                {getFormErrorMessage('Email')}
              </div>
             
            </form>    
          </div>
        </div>

      </div>
    
  )
}

export default UserProfile