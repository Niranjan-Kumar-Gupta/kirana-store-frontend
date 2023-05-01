import { useEffect, useState } from 'react'
import { useForm, Controller } from 'react-hook-form'
import { Dialog } from 'primereact/dialog'
import { InputText } from 'primereact/inputtext'
import { CustomButton } from '../CustomButton'
import { classNames } from 'primereact/utils'
import { Dropdown } from 'primereact/dropdown'
import { InputTextarea } from 'primereact/inputtextarea'
import './formStyle.css'
import { useDispatch, useSelector } from 'react-redux'
import * as Messag from '../../config/ToastMessage'
import { Text } from '../Text'
import { InputNumber } from 'primereact/inputnumber'
import style from './style.module.css'
import { Button } from 'primereact/button';
import { CustomImageInput } from '../CustomImageInput'
import { ReactComponent as Cross } from '../../assets/svgIcons/cross.svg'

import {
  addRawMaterial,
  updateRawMaterial
} from "../../reducers/rawMaterialSlice";


const RawMaterialForm = ({ onHide, showRawMaterialForm,toast}) => {

  const {
    selectedRawMaterial,
    mode
  } = useSelector((state) => state.rawMaterialTable);
 
    const dispatch = useDispatch();


    const [selectedImage, setSeletedImage] = useState(null)
    const defaultValues = {
        rawMaterialName: '',
        unit: '',
    }

    const {
        control,
        formState: { errors },
        handleSubmit,
        reset,
        setValue,
    } = useForm({ defaultValues })

    const getFormErrorMessage = (name) => {
        return (
          errors[name] && <small className='p-error'>{errors[name].message}</small>
        )
    }

    useEffect(()=>{
       if (mode=='update' && selectedRawMaterial) {
        console.log(selectedRawMaterial)
        setValue('rawMaterialName',selectedRawMaterial.materialName)
        setValue('unit',selectedRawMaterial.materialType)
        handleImg(selectedRawMaterial.url)
      }   
    },[])

    const dialogHeader = () => {
        return (
          <div>
            <Text type={'heading'}>
              <span
                style={{
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'dashed',
                }}
              >{mode=='update'?'Update Raw Material':`Add Raw Material`}</span>
            </Text>
          </div>
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

        const __data = {
          materialName:data.rawMaterialName,
          materialType:data.unit
        }
  
        if (mode=='update') {
          dispatch(updateRawMaterial({id:selectedRawMaterial.id,data:__data}))
          .unwrap()
          .then(() => {
                onHide()
                let Message_Success = 'Raw Material Successfully Updated'
                toast.current.show({ severity: 'success', detail: Message_Success })
              })
          .catch(err => {
               toast.current.show({ severity: 'error', detail: err.message })
            })
        }else{
        dispatch(addRawMaterial({data:__data,selectedImage}))
        .unwrap()
        .then(() => {
              onHide()
              let Message_Success = 'Raw Material Successfully Added'
              toast.current.show({ severity: 'success', detail: Message_Success })
            })
        .catch(err => {
          toast.current.show({ severity: 'error', detail: err.message })
          })
        }
      
    }

    const handleImg = (img) => {
        setSeletedImage(img)
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

    
  return (
    <Dialog
    header={dialogHeader}
    visible={showRawMaterialForm}
    onHide={onHide}
    className='dialog-custom '
  >
    <div className={`card `}>
      <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
        <div className='field'>
          <label
            htmlFor='rawMaterialName'
            className={classNames({ 'p-error': errors.rawMaterialName })}
          >
            Name *
          </label>
          <Controller
            name='rawMaterialName'
            control={control}
            rules={{ required: 'Please enter Raw Material Name.' }}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
               
                className={classNames({ 'p-invalid': fieldState.invalid })}
                placeholder='Name of Raw Material'
                {...field}
              />
            )}
          />
          {getFormErrorMessage('rawMaterialName')}
        </div>
        <div className='field'>
            <label htmlFor='unit'>Unit *</label>
            <Controller
              name='unit'
              control={control}
              rules={{ required: 'Please enter Unit.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}            
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                  placeholder='Enter Unit'
                  {...field}
                />
                )}
              />
            {getFormErrorMessage('unit')}
        </div>
        {/* <div className='field'>
            <div className='flex justify-content-between  align-items-center'>
              <div className='flex justify-content-between  align-items-center gap-3'>
                {imageBodyTemplate()}
                <div className='flex justify-content-center align-items-center gap-2'>
                  <span>
                    { selectedImage ? (
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
          </div>       */}
        <div className='flex justify-content-end gap-2 mt-5'>
         <CustomButton
            label={'Cancel'}
            type='button'
            onClick={onHide}
            varient={'cancel w-6rem'}
          />
          <CustomButton
            varient='filled w-6rem'
            type='submit'
            label={mode=='update'?'Update':'Save'}
          />
        </div>
      </form>
    </div>
    </Dialog>
  )
}

export default RawMaterialForm