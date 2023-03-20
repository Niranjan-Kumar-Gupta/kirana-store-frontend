import React, { useState, useEffect, useRef } from 'react'
import { CategoryForm } from "../../components/Forms/CategoryForm"
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'

const Categories = () => {
  const loading = false;
  const [showCategoryForm, setShowCategoryForm] = useState(false)

  const onAddNewClick = () => {
    setShowCategoryForm(true)
  }

  const onHide = () => {
    setShowCategoryForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const toast = useRef(null)

  const categoryModal = () => {
    return (
      <CategoryForm
        onHide = {onHide}
        showCategoryForm={showCategoryForm}
        toast={toast}
      />
    )
  }

  return(
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showCategoryForm ? categoryModal() : <></>}
      {loader ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div>
          <Text type='heading'>Categories</Text>
        </div>
        <CustomButton
          varient='filled'
          label={'Add New Category'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>
    </div>
  )
}

export default Categories