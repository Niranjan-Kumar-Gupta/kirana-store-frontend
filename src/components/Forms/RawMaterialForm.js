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

const RawMaterialForm = ({ onHide, showRawMaterialForm}) => {
 

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

    const dialogHeader = () => {
        return (
          <div>
            <Text type={'heading'}>
              <span
                style={{
                  textDecorationLine: 'underline',
                  textDecorationStyle: 'dashed',
                }}
              >{`Add New Raw Material`}</span>
            </Text>
          </div>
        )
    }

    const onSubmit = (data) => {

    }

    const handleImg = (img) => {
        setSeletedImage(img)
    }

    const imageBodyTemplate = () => {
        const d = new Date()
        if ( selectedImage ) {
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
            Raw Material Name *
          </label>
          <Controller
            name='rawMaterialName'
            control={control}
            rules={{ required: 'Please enter Raw Material Name.' }}
            render={({ field, fieldState }) => (
              <InputText
                id={field.name}
                maxLength={20}
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
              rules={{ required: 'Unit is required.' }}
              render={({ field, fieldState }) => (
                <InputNumber
                  id={field.name}
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  useGrouping={false}
                  placeholder='Enter Unit'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('unit')}
        </div>
        <div className='field'>
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
          </div>      
        <div className='flex gap-2 mt-5'>
         <Button
            label={'Cancel'}
            onClick={onHide}
            className={`skalebot-button ${style.colored} w-6rem`}
          />
          <CustomButton
            varient='filled'
            type='submit'
            label={'Save'}
          />
        </div>
      </form>
    </div>
    </Dialog>
  )
}

export default RawMaterialForm