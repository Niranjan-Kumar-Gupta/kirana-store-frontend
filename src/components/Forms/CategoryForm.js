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
import { addCategory, resetSelectedCategory, updateCategory } from '../../reducers/categoryTableSlice'
import * as Messag from '../../config/ToastMessage'
import { Text } from '../Text'
import { TreeSelect } from 'primereact/treeselect'
import { sortAlphabeticalObjectArr } from '../../utils/tableUtils'
import { API_GET_CATEGORIES_Dropdown } from '../../api/category.services'

const statusOption = [
  { key: 'Available', value: 'Available' },
  { key: 'Unavailable', value: 'Unavailable' },
]
export const CategoryForm = ({ onHide, showCategoryForm, toast }) => {
  const defaultValues = {
    categoryName: '',
    parentId: '',
    status: '',
    desc: '',
  }

  const { mode, selectedCategory,page,limit,getCategories } = useSelector((state) => state.categoryTable)

  const defaultCategory = { key: null, label: 'Root Category' }

  const [categories, setCategories] = useState([])

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

  const dialogHeader = () => {
    return (
      <div>
        <Text type={'heading'}>
          <span
            style={{
              textDecorationLine: 'underline',
              textDecorationStyle: 'dashed',
            }}
          >{`${mode === 'update' ? 'Update' : 'Add New'} Category`}</span>
        </Text>
      </div>
    )
  }

  const onSubmit = (data) => {
    if (data.parentId === '') {
      data.parentId = null
    }
    if (mode === 'update') {
      const categoryId = selectedCategory.id
      dispatch(updateCategory({ categoryId, data ,page:page,limit:limit}))
        .unwrap()
        .then((res) => {
          onHide(reset)
          let Message_Success = Messag.Update_Cat_ToastSuccessMessage
          toast.current.show({ severity: 'success', detail: Message_Success })
        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
    } else {
      dispatch(addCategory({data, page, limit}))
        .unwrap()
        .then((res) => {
          onHide(reset)
          let Message_Success = Messag.Add_Cat_ToastSuccessMessage
          toast.current.show({ severity: 'success', detail: Message_Success })
        })
        .catch((err) => {
          toast.current.show({ severity: 'error', detail: err.message })
        })
    }
  }

  const getAllCategories = async () => {
    try {
      const allCategories = await API_GET_CATEGORIES_Dropdown(0, 100000)
      let sortedCategories = sortAlphabeticalObjectArr(
        allCategories.rows,
        'categoryName'
      )
      sortedCategories.unshift(defaultCategory)
      setCategories(sortedCategories)
    } catch (error) {
      console.log(error)
    }
  }

  useEffect(() => {
    if (mode === 'update' && selectedCategory) {

      setValue('categoryName', selectedCategory.categoryName)
      setValue('parentId', selectedCategory.parentId)
      setValue('status', selectedCategory.status)
      setValue('desc', selectedCategory.desc)
    }

    getAllCategories()
  }, [])

  return (
    <Dialog
      header={dialogHeader}
      visible={showCategoryForm}
      onHide={() => onHide(reset)}
      className='dialog-custom'
    >
      <div className={`card`}>
        <form onSubmit={handleSubmit(onSubmit)} className='p-fluid'>
          <div className='field'>
            <label
              htmlFor='categoryName'
              className={classNames({ 'p-error': errors.name })}
            >
              Name *
            </label>
            <Controller
              name='categoryName'
              control={control}
              rules={{ required: 'Please enter a category name.' }}
              render={({ field, fieldState }) => (
                <InputText
                  id={field.name}
                  maxLength={20}
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                  placeholder='Enter Category name'
                  {...field}
                />
              )}
            />
            {getFormErrorMessage('categoryName')}
          </div>
          <div className='field'>
            <label htmlFor='parentId'>Parent Category *</label>
            <Controller
              name='parentId'
              control={control}
              // rules={{ required: 'Please select a category.' }}
              render={({ field, fieldState }) => (
                <>
                  <TreeSelect
                    id={field.name}
                    value={field.value}
                    onChange={(e) => field.onChange(e.value)}
                    filter
                    inputRef={field.ref}
                    options={categories}
                    placeholder='Root Category'
                    className={classNames('w-full', {
                      'p-invalid': fieldState.error,
                    })}
                  />
                  {getFormErrorMessage(field.name)}
                </>
              )}
            />
            {getFormErrorMessage('parentId')}
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
                  value={field.value}
                  onChange={(e) => field.onChange(e.value)}
                  options={statusOption}
                  optionLabel='key'
                  optionValue='value'
                  placeholder='Choose'
                  className={classNames({ 'p-invalid': fieldState.invalid })}
                />
              )}
            />
            {getFormErrorMessage('status')}
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
                  placeholder='Category description .....'
                />
              )}
            />
            {getFormErrorMessage('desc')}
          </div>
          <div>
            <CustomButton
              varient='filled'
              type='submit'
              label={mode === 'update' ? 'Update' : 'Save'}
            />
          </div>
        </form>
      </div>
    </Dialog>
  )
}
