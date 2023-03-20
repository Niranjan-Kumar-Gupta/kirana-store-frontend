import React, { useState, useEffect, useRef } from 'react'
import './index.css'
import { ProductForm } from '../../components/Forms/ProductForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'
import { Text } from '../../components/Text'
import { useNavigate } from 'react-router-dom'

const ProductList = () => {
  const navigate = useNavigate()

  const loading = false
  const toast = useRef(null)
  const [showProductForm, setShowProductForm] = useState(false)
  const onAddNewClick = () => {
    setShowProductForm(true)
  }

  const onHide = () => {
    setShowProductForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const productModal = () => {
    return (
      <ProductForm
        showProductForm={showProductForm}
        setShowProductForm={setShowProductForm}
        toast={toast}
      />
    )
  }

  const ids = [1, 2, 3, 4, 5, 6, 7, 8]

  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showProductForm ? productModal() : <></>}
      {loading ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div>
          <Text type='heading'>Products List</Text>
        </div>
        <CustomButton
          varient='filled'
          label={'Add New Product'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>

      <div className='flex flex-wrap gap-2 mt-2'>
        {ids.map((id) => (
          <div
            onClick={() => navigate(`productDetails/${id}`)}
            className={'products flex justify-content-center align-items-center'}
            key={id}
          >
            <Text type={'heading'}>Product {id}</Text>
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductList
