import React, { useState, useEffect, useRef } from 'react'
import './style.css'
import { CustomerForm } from '../../components/Forms/CustomerForm'
import Loader from '../../components/Loader'
import { Toast } from 'primereact/toast'
import { CustomButton } from '../../components/CustomButton'

const CustomerList = () => {
  const loading = false

  const toast = useRef(null)

  const [showCustomerForm, setShowCustomerForm] = useState(false)

  const onAddNewClick = () => {
    setShowCustomerForm(true)
  }

  const onHide = () => {
    setShowCustomerForm(false)
  }

  const loader = () => {
    return <Loader visible={loading} />
  }

  const customerModal = () => {
    return (
      <CustomerForm
        onHide={onHide}
        showCustomerForm={showCustomerForm}
        toast={toast}
      />
    )
  }

  return (
    <div className='w-11 pt-3 m-auto'>
      <Toast ref={toast} />
      {showCustomerForm ? customerModal() : <></>}
      {loading ? loader() : <></>}
      <div className={'flex justify-content-between align-items-center'}>
        <div></div>
        <CustomButton
          varient='filled'
          label={'Add New Customer'}
          icon={'pi pi-plus'}
          onClick={onAddNewClick}
        />
      </div>
      
    </div>
  )
}

export default CustomerList
